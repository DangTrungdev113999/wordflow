import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import type { RoleIdentifyExercise } from '../../../lib/types';
import { ROLE_COLORS, ROLE_LABELS, ALL_ROLES, type SentenceRole } from '../constants/colors';
import correctAnim from '../../../assets/lottie/correct-check.json';
import wrongAnim from '../../../assets/lottie/wrong-shake.json';

interface Props {
  exercise: RoleIdentifyExercise;
  onAnswer: (correct: boolean, userAnswer: string) => void;
}

interface PartAnswer {
  role: SentenceRole | null;
  correct: boolean | null;
}

export function RoleIdentify({ exercise, onAnswer }: Props) {
  const { parts, targetIndices } = exercise;
  const [answers, setAnswers] = useState<Record<number, PartAnswer>>(
    () => Object.fromEntries(targetIndices.map((idx) => [idx, { role: null, correct: null }]))
  );
  const [activePicker, setActivePicker] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.values(answers).filter((a) => a.role !== null).length;
  const allAnswered = answeredCount === targetIndices.length;

  const handlePick = useCallback((partIndex: number, role: SentenceRole) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [partIndex]: { role, correct: null },
    }));
    setActivePicker(null);
  }, [submitted]);

  const handleSubmit = () => {
    if (!allAnswered || submitted) return;
    setSubmitted(true);

    const results: Record<number, PartAnswer> = {};
    let correctCount = 0;
    for (const idx of targetIndices) {
      const picked = answers[idx].role;
      const actual = parts[idx].role as SentenceRole;
      const correct = picked === actual;
      if (correct) correctCount++;
      results[idx] = { role: picked, correct };
    }
    setAnswers(results);

    const userAnswerStr = targetIndices
      .map((idx) => `${parts[idx].text}=${answers[idx].role}`)
      .join(', ');
    // Partial credit: pass if >= 70% correct
    const score = correctCount / targetIndices.length;
    onAnswer(score >= 0.7, userAnswerStr);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900 dark:text-white">
        Xác định vai trò của các từ được đánh dấu <span className="text-indigo-500">?</span>
      </p>

      {submitted && (
        <div className="flex justify-center">
          <Lottie
            animationData={Object.values(answers).every((a) => a.correct) ? correctAnim : wrongAnim}
            loop={false}
            className="w-20 h-20"
          />
        </div>
      )}

      {/* Click-outside backdrop */}
      {activePicker !== null && !submitted && (
        <div className="fixed inset-0 z-10" onClick={() => setActivePicker(null)} />
      )}

      {/* Sentence with chips */}
      <div className="flex flex-wrap items-center gap-1.5 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
        {parts.map((part, i) => {
          const isTarget = targetIndices.includes(i);
          const answer = answers[i];
          const isPicking = activePicker === i;
          const colors = ROLE_COLORS[part.role];

          // Non-target parts: always show colored
          if (!isTarget) {
            return (
              <span
                key={i}
                className={`text-sm px-2.5 py-1 rounded-lg font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {part.text}
              </span>
            );
          }

          // Target parts
          const hasAnswer = answer?.role !== null;
          const pickedColors = hasAnswer ? ROLE_COLORS[answer.role!] : null;

          // After submit, show result styling
          const showResult = submitted && answer;
          const resultBorder = showResult
            ? answer.correct
              ? 'ring-2 ring-green-400 dark:ring-green-500'
              : 'ring-2 ring-red-400 dark:ring-red-500'
            : '';

          return (
            <div key={i} className="relative">
              <motion.button
                type="button"
                onClick={() => {
                  if (submitted) return;
                  setActivePicker(isPicking ? null : i);
                }}
                className={`
                  text-sm px-2.5 py-1 rounded-lg font-medium border transition-all
                  ${hasAnswer && pickedColors
                    ? `${pickedColors.bg} ${pickedColors.text} ${pickedColors.border}`
                    : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 border-dashed'
                  }
                  ${!submitted ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
                  ${isPicking ? 'ring-2 ring-indigo-400 dark:ring-indigo-500' : ''}
                  ${resultBorder}
                `}
                animate={showResult && !answer.correct ? { x: [0, -3, 3, -3, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {part.text}
                {!hasAnswer && (
                  <span className="ml-1 text-indigo-400 dark:text-indigo-500 font-bold">?</span>
                )}
              </motion.button>

              {/* Role picker */}
              <AnimatePresence>
                {isPicking && !submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 top-full mt-1 left-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl p-1.5 min-w-[170px]"
                  >
                    {ALL_ROLES.map((role) => {
                      const rc = ROLE_COLORS[role];
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handlePick(i, role)}
                          className={`
                            w-full text-left text-xs px-3 py-1.5 rounded-lg
                            ${rc.bg} ${rc.text} mb-0.5 last:mb-0
                            hover:opacity-80 transition-opacity font-medium
                          `}
                        >
                          {ROLE_LABELS[role]}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Answer summary after submit */}
      {submitted && (
        <div className="space-y-1.5">
          {targetIndices.map((idx) => {
            const a = answers[idx];
            const actualRole = parts[idx].role as SentenceRole;
            return (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  &ldquo;{parts[idx].text}&rdquo;
                </span>
                {a.correct ? (
                  <span className="text-green-600 dark:text-green-400">
                    = {ROLE_LABELS[actualRole]}
                  </span>
                ) : (
                  <>
                    <span className="text-red-500 line-through">{ROLE_LABELS[a.role!]}</span>
                    <span className="text-green-600 dark:text-green-400">
                      &rarr; {ROLE_LABELS[actualRole]}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Progress + Submit */}
      {!submitted && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{answeredCount}/{targetIndices.length} identified</span>
            <div className="flex gap-0.5">
              {targetIndices.map((idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    answers[idx]?.role
                      ? 'bg-indigo-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}
