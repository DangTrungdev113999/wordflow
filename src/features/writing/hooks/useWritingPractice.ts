import { useState, useCallback, useEffect, useRef } from 'react';
import { db } from '../../../db/database';
import type { WritingSubmission, WritingFeedback } from '../../../db/models';
import { aiService } from '../../../services/ai/aiService';
import { writingFeedbackPrompt } from '../../../services/ai/promptTemplates';
import { eventBus } from '../../../services/eventBus';
import { useProgressStore } from '../../../stores/progressStore';
import type { CEFRLevel } from '../../../lib/types';

interface WritingPrompt {
  id: string;
  level: CEFRLevel;
  type: 'essay' | 'email' | 'story' | 'description';
  title: string;
  titleVi: string;
  prompt: string;
  promptVi: string;
  minWords: number;
  maxWords: number;
  hints: string[];
}

type Phase = 'pick' | 'write' | 'loading' | 'feedback' | 'history';

export function useWritingPractice(submissionId?: string) {
  const [phase, setPhase] = useState<Phase>(submissionId ? 'loading' : 'pick');
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<WritingSubmission | null>(null);
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addXP = useProgressStore((s) => s.addXP);
  const levelRef = useRef<CEFRLevel>('A1');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load user's CEFR level
  useEffect(() => {
    db.userProfile.get('default').then((p) => {
      if (p?.placementLevel) levelRef.current = p.placementLevel;
    });
  }, []);

  // Abort on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Load history
  const loadHistory = useCallback(async () => {
    const subs = await db.writingSubmissions.orderBy('submittedAt').reverse().toArray();
    setSubmissions(subs);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Load specific submission for review
  useEffect(() => {
    if (!submissionId) return;
    (async () => {
      const sub = await db.writingSubmissions.get(submissionId);
      if (sub) {
        setCurrentSubmission(sub);
        setPhase('feedback');
      }
    })();
  }, [submissionId]);

  const selectPrompt = useCallback((prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setCurrentSubmission(null);
    setError(null);
    setPhase('write');
  }, []);

  const submitWriting = useCallback(
    async (text: string) => {
      if (!selectedPrompt || isSubmitting) return;
      setIsSubmitting(true);
      setError(null);
      setPhase('loading');

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

      const tryParseFeedback = async (attempt: number): Promise<WritingFeedback> => {
        const prompt = writingFeedbackPrompt(
          levelRef.current,
          selectedPrompt.title,
          selectedPrompt.prompt,
          text,
        );
        const messages = [{ role: 'user' as const, content: prompt }];

        const response = await aiService.chat(messages, {
          feature: 'writing',
          signal: controller.signal,
          temperature: 0.3,
        });

        // Extract JSON from response (may be wrapped in ```json ... ```)
        let jsonStr = response.text.trim();
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1].trim();

        try {
          return JSON.parse(jsonStr) as WritingFeedback;
        } catch {
          if (attempt < 1) {
            // Retry once
            return tryParseFeedback(attempt + 1);
          }
          throw new Error('Không thể phân tích phản hồi AI. Vui lòng thử lại.');
        }
      };

      try {
        const feedback = await tryParseFeedback(0);

        const submission: WritingSubmission = {
          id: crypto.randomUUID(),
          promptId: selectedPrompt.id,
          content: text,
          wordCount,
          feedback,
          overallScore: feedback.overallScore,
          submittedAt: Date.now(),
        };

        await db.writingSubmissions.add(submission);
        setCurrentSubmission(submission);
        await loadHistory();
        setPhase('feedback');

        // XP: score × 10 (max 100) + bonus 20 if score >= 8
        const xp = Math.min(feedback.overallScore * 10, 100) + (feedback.overallScore >= 8 ? 20 : 0);
        addXP(xp);

        eventBus.emit('writing:submitted', { score: feedback.overallScore, wordCount });
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        const msg = e instanceof Error ? e.message : 'Đã xảy ra lỗi. Vui lòng thử lại.';
        setError(msg);
        setPhase('write');
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedPrompt, isSubmitting, addXP, loadHistory],
  );

  const goToHistory = useCallback(() => {
    setPhase('history');
  }, []);

  const goToPick = useCallback(() => {
    setSelectedPrompt(null);
    setCurrentSubmission(null);
    setError(null);
    setPhase('pick');
  }, []);

  const reviewSubmission = useCallback((sub: WritingSubmission) => {
    setCurrentSubmission(sub);
    setPhase('feedback');
  }, []);

  return {
    phase,
    selectedPrompt,
    currentSubmission,
    submissions,
    isSubmitting,
    error,
    selectPrompt,
    submitWriting,
    goToHistory,
    goToPick,
    reviewSubmission,
  };
}

export type { WritingPrompt, Phase as WritingPhase };
