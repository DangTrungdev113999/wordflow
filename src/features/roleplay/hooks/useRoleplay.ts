import { useState, useCallback, useEffect, useRef } from 'react';
import { db } from '../../../db/database';
import type { RoleplaySession, RoleplayMessage, RoleplaySummary } from '../../../db/models';
import { aiService } from '../../../services/ai/aiService';
import { roleplaySystemPrompt, roleplaySummaryPrompt } from '../../../services/ai/promptTemplates';
import { eventBus } from '../../../services/eventBus';
import { useProgressStore } from '../../../stores/progressStore';
import type { CEFRLevel } from '../../../lib/types';

interface Scenario {
  id: string;
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  level: CEFRLevel;
  category: 'daily' | 'travel' | 'work' | 'social';
  icon: string;
  aiRole: string;
  userRole: string;
  userRoleVi: string;
  goal: string;
  goalVi: string;
  suggestedPhrases: string[];
  maxTurns: number;
  openingLine: string;
}

type Phase = 'pick' | 'active' | 'generating-summary' | 'summary';

export function useRoleplay() {
  const [phase, setPhase] = useState<Phase>('pick');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [session, setSession] = useState<RoleplaySession | null>(null);
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const addXP = useProgressStore((s) => s.addXP);
  const levelRef = useRef<CEFRLevel>('A1');
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    db.userProfile.get('default').then((p) => {
      if (p?.placementLevel) levelRef.current = p.placementLevel;
    });
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const startScenario = useCallback(async (s: Scenario) => {
    setScenario(s);
    setHintIndex(0);
    setError(null);

    const openingMsg: RoleplayMessage = {
      role: 'assistant',
      content: s.openingLine,
      timestamp: Date.now(),
    };

    const newSession: RoleplaySession = {
      id: crypto.randomUUID(),
      scenarioId: s.id,
      messages: [openingMsg],
      status: 'in-progress',
      startedAt: Date.now(),
    };

    await db.roleplaySessions.add(newSession);
    setSession(newSession);
    setMessages([openingMsg]);
    setTurnCount(0);
    setPhase('active');
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !scenario || !session || isSendingRef.current) return;
      isSendingRef.current = true;
      setIsSending(true);
      setError(null);

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMsg: RoleplayMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      const newTurnCount = turnCount + 1;
      setTurnCount(newTurnCount);

      try {
        const aiMessages = [
          { role: 'system' as const, content: roleplaySystemPrompt(scenario.aiRole, levelRef.current, scenario.maxTurns) },
          ...updatedMessages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ];

        const response = await aiService.chat(aiMessages, {
          feature: 'roleplay',
          signal: controller.signal,
          temperature: 0.7,
        });

        const assistantMsg: RoleplayMessage = {
          role: 'assistant',
          content: response.text,
          timestamp: Date.now(),
        };

        const allMessages = [...updatedMessages, assistantMsg];
        setMessages(allMessages);

        // Update session in DB
        await db.roleplaySessions.update(session.id, {
          messages: allMessages,
        });

        // Auto-end if max turns reached
        if (newTurnCount >= scenario.maxTurns) {
          await generateSummary(allMessages);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        const msg = e instanceof Error ? e.message : 'Đã xảy ra lỗi. Vui lòng thử lại.';
        setError(msg);
      } finally {
        isSendingRef.current = false;
        setIsSending(false);
      }
    },
    [scenario, session, messages, turnCount],
  );

  const generateSummary = useCallback(
    async (conversationMessages?: RoleplayMessage[]) => {
      if (!scenario || !session) return;
      setPhase('generating-summary');

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const msgs = conversationMessages || messages;
      const formattedMsgs = msgs
        .map((m) => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`)
        .join('\n');

      const tryParseSummary = async (attempt: number): Promise<RoleplaySummary> => {
        const prompt = roleplaySummaryPrompt(
          levelRef.current,
          scenario.title,
          scenario.goal,
          formattedMsgs,
        );

        const response = await aiService.chat(
          [{ role: 'user', content: prompt }],
          { feature: 'roleplay', signal: controller.signal, temperature: 0.3 },
        );

        let jsonStr = response.text.trim();
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1].trim();

        try {
          return JSON.parse(jsonStr) as RoleplaySummary;
        } catch {
          if (attempt < 1) return tryParseSummary(attempt + 1);
          throw new Error('Không thể phân tích kết quả. Vui lòng thử lại.');
        }
      };

      try {
        const summary = await tryParseSummary(0);

        await db.roleplaySessions.update(session.id, {
          status: 'completed',
          summary,
          messages: msgs,
          completedAt: Date.now(),
        });

        setSession((prev) => prev ? { ...prev, status: 'completed', summary, completedAt: Date.now() } : prev);
        setPhase('summary');

        // XP: +50 base, +20 if goalCompleted, +10 if fluency >= 7
        let xp = 50;
        if (summary.goalCompleted) xp += 20;
        if (summary.fluency >= 7) xp += 10;
        addXP(xp);

        eventBus.emit('roleplay:completed', {
          scenarioId: scenario.id,
          goalCompleted: summary.goalCompleted,
          fluency: summary.fluency,
        });
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        const msg = e instanceof Error ? e.message : 'Đã xảy ra lỗi khi tạo tổng kết.';
        setError(msg);
        setPhase('active');
      }
    },
    [scenario, session, messages, addXP],
  );

  const endConversation = useCallback(() => {
    generateSummary();
  }, [generateSummary]);

  const revealHint = useCallback(() => {
    if (!scenario) return null;
    const phrases = scenario.suggestedPhrases;
    if (hintIndex >= phrases.length) return null;
    const hint = phrases[hintIndex];
    setHintIndex((i) => i + 1);
    return hint;
  }, [scenario, hintIndex]);

  const goToPick = useCallback(() => {
    setScenario(null);
    setSession(null);
    setMessages([]);
    setTurnCount(0);
    setHintIndex(0);
    setError(null);
    setPhase('pick');
  }, []);

  return {
    phase,
    scenario,
    session,
    messages,
    isSending,
    error,
    turnCount,
    hintIndex,
    startScenario,
    sendMessage,
    endConversation,
    revealHint,
    goToPick,
  };
}

export type { Scenario, Phase as RoleplayPhase };
