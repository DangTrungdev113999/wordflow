import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useListeningQuiz } from '../useListeningQuiz';
import { eventBus } from '../../../../services/eventBus';

describe('useListeningQuiz', () => {
  beforeEach(() => {
    eventBus.all.clear();
  });

  describe('distractor generation', () => {
    it('should generate 10 questions for a valid topic', () => {
      const { result } = renderHook(() => useListeningQuiz('daily-life'));
      expect(result.current.total).toBe(10);
      expect(result.current.currentQuestion).not.toBeNull();
    });

    it('should have 4 options per question (1 correct + 3 distractors)', () => {
      const { result } = renderHook(() => useListeningQuiz('daily-life'));
      const q = result.current.currentQuestion!;
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.word.word);
    });

    it('should not include the correct word as a distractor', () => {
      const { result } = renderHook(() => useListeningQuiz('daily-life'));
      const q = result.current.currentQuestion!;
      const distractors = q.options.filter((_, i) => i !== q.correctIndex);
      expect(distractors).not.toContain(q.word.word);
    });

    it('should return empty for invalid topic', () => {
      const { result } = renderHook(() => useListeningQuiz('nonexistent-topic'));
      expect(result.current.total).toBe(0);
      expect(result.current.currentQuestion).toBeNull();
    });
  });

  describe('quiz flow', () => {
    it('should start at index 0 with no answers', () => {
      const { result } = renderHook(() => useListeningQuiz('daily-life'));
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.answers).toHaveLength(0);
      expect(result.current.isComplete).toBe(false);
    });

    it('should record correct answer and emit event', () => {
      const handler = vi.fn();
      eventBus.on('dictation:correct', handler);

      const { result } = renderHook(() => useListeningQuiz('daily-life'));
      const correctIdx = result.current.currentQuestion!.correctIndex;

      act(() => {
        result.current.submitAnswer(correctIdx);
      });

      expect(result.current.lastResult!.correct).toBe(true);
      expect(result.current.answers).toHaveLength(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'quiz' }),
      );
    });

    it('should record incorrect answer and emit event', () => {
      const handler = vi.fn();
      eventBus.on('dictation:incorrect', handler);

      const { result } = renderHook(() => useListeningQuiz('daily-life'));
      const correctIdx = result.current.currentQuestion!.correctIndex;
      const wrongIdx = (correctIdx + 1) % 4;

      act(() => {
        result.current.submitAnswer(wrongIdx);
      });

      expect(result.current.lastResult!.correct).toBe(false);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'quiz' }),
      );
    });

    it('should advance to next question on next()', () => {
      const { result } = renderHook(() => useListeningQuiz('daily-life'));

      act(() => {
        result.current.submitAnswer(0);
      });
      act(() => {
        result.current.next();
      });

      expect(result.current.currentIndex).toBe(1);
      expect(result.current.lastResult).toBeNull();
    });

    it('should complete quiz after 10 questions and emit session_complete', () => {
      const handler = vi.fn();
      eventBus.on('dictation:session_complete', handler);

      const { result } = renderHook(() => useListeningQuiz('daily-life'));
      const total = result.current.total;

      for (let i = 0; i < total; i++) {
        act(() => {
          result.current.submitAnswer(result.current.currentQuestion!.correctIndex);
        });
        act(() => {
          result.current.next();
        });
      }

      expect(result.current.isComplete).toBe(true);
      expect(result.current.correctCount).toBe(total);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ correct: total, total, mode: 'quiz' }),
      );
    });

    it('should track correctCount and xpEarned', () => {
      const { result } = renderHook(() => useListeningQuiz('daily-life'));

      // Answer first correctly
      act(() => {
        result.current.submitAnswer(result.current.currentQuestion!.correctIndex);
      });

      expect(result.current.correctCount).toBe(1);
      expect(result.current.xpEarned).toBeGreaterThan(0);
    });
  });
});
