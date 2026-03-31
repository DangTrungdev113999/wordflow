import { useState, useEffect, useCallback, useRef } from 'react';
import { generateStory } from '../../../services/listeningContentService';
import { playAudio, stopAudio } from '../../../services/audioService';
import { aiService } from '../../../services/ai/aiService';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { eventBus } from '../../../services/eventBus';
import { XP_VALUES } from '../../../lib/constants';
import type { StoryContent } from '../../../db/models';

interface KeyPointResult {
  point: string;
  matched: boolean;
}

export function useNoteTaking(topic: string) {
  const [content, setContent] = useState<StoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Playback
  const [phase, setPhase] = useState<'listening' | 'scoring' | 'results'>('listening');
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Notes
  const [userNotes, setUserNotes] = useState('');
  const [keyPointResults, setKeyPointResults] = useState<KeyPointResult[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);

  const abortRef = useRef<AbortController | null>(null);

  // Load content (shorter story: limit to 2-3 paragraphs)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const topicData = ALL_TOPICS.find(t => t.topic === topic);
    if (!topicData) {
      setError('Topic not found');
      setLoading(false);
      return;
    }

    generateStory(topic, topicData.words, topicData.cefrLevel)
      .then(result => {
        if (!cancelled) {
          // Limit to 2-3 paragraphs for note-taking (shorter version)
          const shortened: StoryContent = {
            ...result,
            paragraphs: result.paragraphs.slice(0, 3),
            translation: result.translation.slice(0, 3),
          };
          setContent(shortened);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to generate content. Please check your AI API key in Settings.');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [topic]);

  // Cleanup
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopAudio();
    };
  }, []);

  const playParagraph = useCallback(async (index: number) => {
    if (!content || index < 0 || index >= content.paragraphs.length) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setCurrentParagraphIndex(index);
    setIsPlaying(true);

    await playAudio(content.paragraphs[index], {
      rate: playbackSpeed,
      voice: 'female',
      signal: ac.signal,
      onEnd: () => setIsPlaying(false),
    });
  }, [content, playbackSpeed]);

  const playAll = useCallback(async () => {
    if (!content) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsPlaying(true);

    for (let i = 0; i < content.paragraphs.length; i++) {
      if (ac.signal.aborted) break;

      setCurrentParagraphIndex(i);

      await playAudio(content.paragraphs[i], {
        rate: playbackSpeed,
        voice: 'female',
        signal: ac.signal,
      });

      if (ac.signal.aborted) break;
      // Pause between paragraphs
      await new Promise<void>(resolve => {
        const timer = setTimeout(resolve, 1200);
        ac.signal.addEventListener('abort', () => { clearTimeout(timer); resolve(); }, { once: true });
      });
    }

    if (!ac.signal.aborted) {
      setIsPlaying(false);
    }
  }, [content, playbackSpeed]);

  const pause = useCallback(() => {
    abortRef.current?.abort();
    setIsPlaying(false);
    stopAudio();
  }, []);

  const prevParagraph = useCallback(() => {
    if (!content) return;
    const idx = Math.max(0, currentParagraphIndex - 1);
    playParagraph(idx);
  }, [content, currentParagraphIndex, playParagraph]);

  const nextParagraph = useCallback(() => {
    if (!content) return;
    const idx = Math.min(content.paragraphs.length - 1, currentParagraphIndex + 1);
    playParagraph(idx);
  }, [content, currentParagraphIndex, playParagraph]);

  // Submit notes for AI scoring
  const submitNotes = useCallback(async () => {
    if (!content || !userNotes.trim()) return;

    pause();
    setPhase('scoring');

    try {
      const fullText = content.paragraphs.join('\n\n');

      const response = await aiService.chat(
        [
          {
            role: 'system',
            content: 'You are an ESL listening comprehension evaluator. Generate ONLY valid JSON, no markdown or extra text.',
          },
          {
            role: 'user',
            content: `A student listened to this English text and took notes. Evaluate how well they captured the key points.

TEXT:
${fullText}

STUDENT NOTES:
${userNotes}

Extract 5 key points from the text, then check if the student's notes capture each point.
Use fuzzy matching — the student doesn't need exact words, just the right idea.
Notes can be in English or Vietnamese.

JSON format:
{
  "keyPoints": [
    { "point": "string (short description of key point)", "matched": true/false }
  ]
}`,
          },
        ],
        { feature: 'listening-note-taking', maxTokens: 1024, temperature: 0.3 },
      );

      const cleaned = response.text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      let parsed: { keyPoints: KeyPointResult[] };
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        console.error('[useNoteTaking] Failed to parse AI response:', response.text);
        // Fallback: generate basic key points
        parsed = {
          keyPoints: content.keyVocab.slice(0, 5).map(word => ({
            point: `Mentions "${word}"`,
            matched: userNotes.toLowerCase().includes(word.toLowerCase()),
          })),
        };
      }

      const results = (parsed.keyPoints ?? []).slice(0, 5);
      const matched = results.filter(r => r.matched).length;

      setKeyPointResults(results);
      setMatchedCount(matched);
      setPhase('results');

      eventBus.emit('listening:notes_scored', {
        topic,
        matchedPoints: matched,
        totalPoints: results.length,
      });
    } catch {
      setError('Failed to evaluate notes. Please try again.');
      setPhase('listening');
    }
  }, [content, userNotes, topic, pause]);

  const totalPoints = keyPointResults.length;
  const xpEarned = matchedCount * XP_VALUES.note_taking_per_point;

  return {
    content,
    loading,
    error,
    phase,
    currentParagraphIndex,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    playAll,
    pause,
    playParagraph,
    prevParagraph,
    nextParagraph,
    userNotes,
    setUserNotes,
    submitNotes,
    keyPointResults,
    matchedCount,
    totalPoints,
    xpEarned,
  };
}
