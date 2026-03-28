import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReadingSession } from '../useReadingSession';
import { READING_PASSAGES } from '../../data/passages';
import { eventBus } from '../../../../services/eventBus';

vi.mock('../../../../services/eventBus', () => ({
  eventBus: { emit: vi.fn() },
}));

const TEST_PASSAGE = READING_PASSAGES[0];

describe('useReadingSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null passage for unknown id', () => {
    const { result } = renderHook(() => useReadingSession('nonexistent'));
    expect(result.current.passage).toBeNull();
  });

  it('finds the correct passage by id', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    expect(result.current.passage).not.toBeNull();
    expect(result.current.passage!.id).toBe(TEST_PASSAGE.id);
  });

  it('starts in reading phase', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    expect(result.current.phase).toBe('reading');
  });

  it('transitions to quiz phase on startQuiz', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    act(() => result.current.startQuiz());
    expect(result.current.phase).toBe('quiz');
    expect(result.current.currentQuestionIndex).toBe(0);
  });

  it('tracks correct answers and emits events', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    act(() => result.current.startQuiz());

    act(() => result.current.submitAnswer(true, 'answer'));
    expect(result.current.correctCount).toBe(1);
    expect(eventBus.emit).toHaveBeenCalledWith('reading:correct', { passageId: TEST_PASSAGE.id });
  });

  it('tracks incorrect answers and emits events', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    act(() => result.current.startQuiz());

    act(() => result.current.submitAnswer(false, 'wrong'));
    expect(result.current.correctCount).toBe(0);
    expect(eventBus.emit).toHaveBeenCalledWith('reading:incorrect', { passageId: TEST_PASSAGE.id });
  });

  it('advances to next question on nextQuestion', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    act(() => result.current.startQuiz());

    act(() => result.current.submitAnswer(true, 'a'));
    act(() => result.current.nextQuestion());
    expect(result.current.currentQuestionIndex).toBe(1);
  });

  it('transitions to summary after last question', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    act(() => result.current.startQuiz());

    const total = TEST_PASSAGE.questions.length;
    for (let i = 0; i < total; i++) {
      act(() => result.current.submitAnswer(true, 'a'));
      act(() => result.current.nextQuestion());
    }

    expect(result.current.phase).toBe('summary');
    expect(eventBus.emit).toHaveBeenCalledWith('reading:session_complete', {
      correct: total,
      total,
      passageId: TEST_PASSAGE.id,
    });
  });

  it('calculates XP correctly with perfect bonus', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    act(() => result.current.startQuiz());

    const total = TEST_PASSAGE.questions.length;
    for (let i = 0; i < total; i++) {
      act(() => result.current.submitAnswer(true, 'a'));
    }

    // 10 XP per correct + 20 bonus for perfect
    expect(result.current.xpEarned).toBe(total * 10 + 20);
  });

  it('calculates XP without perfect bonus when not all correct', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    act(() => result.current.startQuiz());

    act(() => result.current.submitAnswer(true, 'a'));
    act(() => result.current.submitAnswer(false, 'b'));

    expect(result.current.xpEarned).toBe(10);
  });

  it('resets state on startQuiz (retry)', () => {
    const { result } = renderHook(() => useReadingSession(TEST_PASSAGE.id));
    act(() => result.current.startQuiz());
    act(() => result.current.submitAnswer(true, 'a'));

    // Retry
    act(() => result.current.startQuiz());
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.results).toEqual([]);
    expect(result.current.correctCount).toBe(0);
  });
});
