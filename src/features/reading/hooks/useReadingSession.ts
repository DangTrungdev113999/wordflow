import { useState, useCallback, useMemo, useRef } from 'react';
import { READING_PASSAGES } from '../data/passages';
import { eventBus } from '../../../services/eventBus';
import type { ReadingPassage } from '../data/passages';

export type SessionPhase = 'reading' | 'quiz' | 'summary';

export interface QuizResult {
  correct: boolean;
  userAnswer: string;
}

const XP_PER_CORRECT = 10;
const XP_PERFECT_BONUS = 20;

export function useReadingSession(passageId: string) {
  const passage = useMemo<ReadingPassage | null>(
    () => READING_PASSAGES.find(p => p.id === passageId) ?? null,
    [passageId],
  );

  const [phase, setPhase] = useState<SessionPhase>('reading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const resultsRef = useRef<QuizResult[]>([]);

  const totalQuestions = passage?.questions.length ?? 0;

  const startQuiz = useCallback(() => {
    setPhase('quiz');
    setCurrentQuestionIndex(0);
    setResults([]);
    resultsRef.current = [];
  }, []);

  const submitAnswer = useCallback(
    (correct: boolean, userAnswer: string) => {
      if (!passage) return;

      const result: QuizResult = { correct, userAnswer };
      resultsRef.current = [...resultsRef.current, result];
      setResults(prev => [...prev, result]);

      if (correct) {
        eventBus.emit('reading:correct', { passageId: passage.id });
      } else {
        eventBus.emit('reading:incorrect', { passageId: passage.id });
      }
    },
    [passage],
  );

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      setPhase('summary');
      const finalCorrect = resultsRef.current.filter(r => r.correct).length;
      if (passage) {
        eventBus.emit('reading:session_complete', {
          correct: finalCorrect,
          total: totalQuestions,
          passageId: passage.id,
        });

        // Emit mistakes for incorrect answers
        const incorrect = resultsRef.current
          .map((r, i) => ({ ...r, question: passage.questions[i] }))
          .filter(r => !r.correct);
        if (incorrect.length > 0) {
          eventBus.emit('mistakes:collected', {
            source: 'reading',
            mistakes: incorrect.map(item => {
              const q = item.question;
              let correctAnswer: string;
              if (q.type === 'multiple_choice' && q.options && typeof q.answer === 'number') {
                correctAnswer = q.options[q.answer];
              } else if (q.type === 'true_false') {
                correctAnswer = String(q.answer);
              } else {
                correctAnswer = String(q.answer);
              }
              return {
                type: 'reading' as const,
                question: q.question,
                userAnswer: item.userAnswer,
                correctAnswer,
                explanation: q.explanation,
              };
            }),
          });
        }
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions, passage]);

  const correctCount = results.filter(r => r.correct).length;
  const xpEarned =
    correctCount * XP_PER_CORRECT +
    (results.length === totalQuestions && correctCount === totalQuestions ? XP_PERFECT_BONUS : 0);

  return {
    phase,
    passage,
    currentQuestionIndex,
    results,
    correctCount,
    xpEarned,
    startQuiz,
    submitAnswer,
    nextQuestion,
  };
}
