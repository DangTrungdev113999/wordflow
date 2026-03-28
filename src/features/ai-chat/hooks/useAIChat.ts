import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { db } from '../../../db/database';
import type { ChatConversation, ChatMessage, Correction } from '../../../db/models';
import { aiService } from '../../../services/ai/aiService';
import { chatSystemPrompt } from '../../../services/ai/promptTemplates';
import { eventBus } from '../../../services/eventBus';
import { useProgressStore } from '../../../stores/progressStore';
import { XP_VALUES } from '../../../lib/constants';
import type { CEFRLevel } from '../../../lib/types';

const MAX_CONTEXT_MESSAGES = 20;

function parseCorrections(text: string): Correction[] {
  const corrections: Correction[] = [];
  const regex = /❌\s*(.+?)\s*→\s*✅\s*(.+?)\s*—\s*(.+?)(?=\n❌|\n\n|$)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    corrections.push({
      wrong: match[1].trim(),
      correct: match[2].trim(),
      explanation: match[3].trim(),
    });
  }
  return corrections;
}

function generateTitle(content: string): string {
  const cleaned = content.replace(/\n/g, ' ').trim();
  if (cleaned.length <= 40) return cleaned;
  return cleaned.slice(0, 40).replace(/\s+\S*$/, '') + '...';
}

export function useAIChat(conversationId?: string) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const addXP = useProgressStore((s) => s.addXP);
  const levelRef = useRef<CEFRLevel>('A1');
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSendingRef = useRef(false);

  // Load user's CEFR level
  useEffect(() => {
    db.userProfile.get('default').then((p) => {
      if (p?.placementLevel) levelRef.current = p.placementLevel;
    });
  }, []);

  // Abort in-flight request on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    const convos = await db.chatConversations.orderBy('updatedAt').reverse().toArray();
    setConversations(convos);
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load specific conversation
  useEffect(() => {
    if (!conversationId) {
      setCurrentConversation(null);
      setMessages([]);
      return;
    }
    (async () => {
      const convo = await db.chatConversations.get(conversationId);
      if (convo) {
        setCurrentConversation(convo);
        const msgs = await db.chatMessages
          .where('conversationId')
          .equals(conversationId)
          .sortBy('timestamp');
        setMessages(msgs);
      }
    })();
  }, [conversationId]);

  const createConversation = useCallback(async (): Promise<string> => {
    const id = crypto.randomUUID();
    const now = Date.now();
    const convo: ChatConversation = {
      id,
      title: 'Cuộc hội thoại mới',
      createdAt: now,
      updatedAt: now,
    };
    await db.chatConversations.add(convo);
    setCurrentConversation(convo);
    setMessages([]);
    await loadConversations();
    return id;
  }, [loadConversations]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isSendingRef.current) return;
      isSendingRef.current = true;

      // Abort any in-flight request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setError(null);
      let activeConvoId = conversationId;

      // Create conversation if none exists
      if (!activeConvoId) {
        activeConvoId = await createConversation();
        navigate(`/ai-chat/${activeConvoId}`, { replace: true });
      }

      const now = Date.now();

      // Save user message
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        conversationId: activeConvoId,
        role: 'user',
        content: content.trim(),
        timestamp: now,
      };
      await db.chatMessages.add(userMsg);
      setMessages((prev) => [...prev, userMsg]);

      // Update conversation title from first message
      const existingMsgs = await db.chatMessages
        .where('conversationId')
        .equals(activeConvoId)
        .count();
      if (existingMsgs === 1) {
        const title = generateTitle(content);
        await db.chatConversations.update(activeConvoId, { title, updatedAt: now });
        setCurrentConversation((prev) => (prev ? { ...prev, title, updatedAt: now } : prev));
        await loadConversations();
      }

      // Build AI messages with context window limit
      setIsLoading(true);
      try {
        const allMessages = await db.chatMessages
          .where('conversationId')
          .equals(activeConvoId)
          .sortBy('timestamp');

        const contextMessages = allMessages.slice(-MAX_CONTEXT_MESSAGES);
        const aiMessages = [
          { role: 'system' as const, content: chatSystemPrompt(levelRef.current) },
          ...contextMessages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ];

        const response = await aiService.chat(aiMessages, { feature: 'chat', signal: controller.signal });
        const corrections = parseCorrections(response.text);

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          conversationId: activeConvoId,
          role: 'assistant',
          content: response.text,
          corrections: corrections.length > 0 ? corrections : undefined,
          timestamp: Date.now(),
        };
        await db.chatMessages.add(assistantMsg);
        setMessages((prev) => [...prev, assistantMsg]);

        await db.chatConversations.update(activeConvoId, { updatedAt: Date.now() });
        await loadConversations();

        // XP
        const xp = XP_VALUES.chat_message_sent + (corrections.length === 0 ? XP_VALUES.chat_no_correction_bonus : 0);
        addXP(xp);

        // EventBus
        eventBus.emit('chat:message-sent', { corrections: corrections.length });
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        const msg = e instanceof Error ? e.message : 'Đã xảy ra lỗi. Vui lòng thử lại.';
        setError(msg);
      } finally {
        isSendingRef.current = false;
        setIsLoading(false);
      }
    },
    [conversationId, createConversation, navigate, loadConversations, addXP],
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      await db.chatMessages.where('conversationId').equals(id).delete();
      await db.chatConversations.delete(id);
      await loadConversations();
      if (conversationId === id) {
        navigate('/ai-chat', { replace: true });
      }
    },
    [conversationId, navigate, loadConversations],
  );

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    sendMessage,
    createConversation,
    deleteConversation,
  };
}
