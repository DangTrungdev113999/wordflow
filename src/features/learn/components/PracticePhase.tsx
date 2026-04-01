import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X as XIcon, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn, shuffle } from '../../../lib/utils';
import { ALL_SENTENCE_TOPICS } from '../../../data/sentences/_index';
import type { VocabWord } from '../../../lib/types';

// ── Types ──

interface SentenceOrderExercise {
  type: 'sentence-order';
  id: string;
  sentence: string;
  translation: string;
  scrambledWords: string[];
}

interface FillBlankExercise {
  type: 'fill-blank';
  id: string;
  sentence: string;
  correctWord: string;
  options: string[];
  hint: string;
}

type PracticeExercise = SentenceOrderExercise | FillBlankExercise;

// ── Helpers ──

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generateExercises(vocabTopic: string, words: VocabWord[]): PracticeExercise[] {
  const sentenceTopic = ALL_SENTENCE_TOPICS.find((t) => t.topic === vocabTopic);

  if (sentenceTopic && sentenceTopic.sentences.length >= 3) {
    const picked = shuffle(sentenceTopic.sentences).slice(0, 3);
    return picked.map((s) => ({
      type: 'sentence-order',
      id: s.id,
      sentence: s.sentence,
      translation: s.translation,
      scrambledWords: shuffle([...s.words]),
    }));
  }

  // Fill-in-blank from vocab examples
  const wordsWithExamples = words.filter((w) => w.example && w.example.length > 0);
  const picked = shuffle(wordsWithExamples).slice(0, Math.min(3, wordsWithExamples.length));

  return picked.map((w) => {
    const regex = new RegExp(`\\b${escapeRegex(w.word)}\\b`, 'gi');
    const blanked = w.example.replace(regex, '___');
    const hasBlanked = blanked !== w.example;

    const distractors = shuffle(words.filter((x) => x.word !== w.word))
      .slice(0, 3)
      .map((x) => x.word);
    const options = shuffle([w.word, ...distractors]);

    return {
      type: 'fill-blank' as const,
      id: w.word,
      sentence: hasBlanked ? blanked : `___ = ${w.meaning}`,
      correctWord: w.word,
      options,
      hint: w.meaning,
    };
  });
}

// ── Sentence Order Sub-component ──

function SentenceOrderView({
  exercise,
  onResult,
}: {
  exercise: SentenceOrderExercise;
  onResult: (correct: boolean) => void;
}) {
  const [bank, setBank] = useState<string[]>(exercise.scrambledWords);
  const [placed, setPlaced] = useState<string[]>([]);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleTapBank = (word: string, idx: number) => {
    if (result) return;
    setBank((b) => b.filter((_, i) => i !== idx));
    setPlaced((p) => [...p, word]);
  };

  const handleTapPlaced = (word: string, idx: number) => {
    if (result) return;
    setPlaced((p) => p.filter((_, i) => i !== idx));
    setBank((b) => [...b, word]);
  };

  const handleCheck = () => {
    const correctWords = exercise.sentence
      .replace(/[.!?,;:'"]+/g, '')
      .split(/\s+/);
    const isCorrect =
      placed.length === correctWords.length &&
      placed.every((w, i) => w.toLowerCase() === correctWords[i].toLowerCase());

    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setTimeout(() => onResult(true), 800);
    }
  };

  const handleRetry = () => {
    setBank(shuffle([...exercise.scrambledWords]));
    setPlaced([]);
    setResult(null);
  };

  const handleSkip = () => {
    onResult(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
      <div className="text-center mb-4">
        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
          Sắp xếp câu
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
          {exercise.translation}
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {/* Placed words zone */}
        <div
          className={cn(
            'min-h-[72px] rounded-2xl border-2 border-dashed p-3 flex flex-wrap gap-2 transition-colors',
            result === 'correct' && 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20',
            result === 'wrong' && 'border-red-400 bg-red-50/50 dark:bg-red-950/20',
            !result && 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
          )}
        >
          {placed.length === 0 && (
            <p className="text-xs text-gray-300 dark:text-gray-600 m-auto">
              Nhấn vào từ bên dưới để xếp câu
            </p>
          )}
          <AnimatePresence>
            {placed.map((word, idx) => (
              <motion.button
                key={`${word}-${idx}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleTapPlaced(word, idx)}
                disabled={result !== null}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  result === 'correct'
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                    : result === 'wrong'
                      ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                      : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/40',
                )}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Word bank */}
        <div className="flex flex-wrap gap-2 justify-center min-h-[40px]">
          <AnimatePresence>
            {bank.map((word, idx) => (
              <motion.button
                key={`bank-${word}-${idx}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleTapBank(word, idx)}
                disabled={result !== null}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Result feedback */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {result === 'correct' ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check size={18} />
                  <span className="text-sm font-semibold">Chính xác!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-red-500">
                    <XIcon size={18} />
                    <span className="text-sm font-semibold">Chưa đúng</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Đáp án: {exercise.sentence}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="pt-2">
          {result === null ? (
            <Button
              onClick={handleCheck}
              className="w-full"
              size="lg"
              disabled={placed.length === 0}
            >
              Kiểm tra
            </Button>
          ) : result === 'wrong' ? (
            <div className="flex gap-2">
              <Button onClick={handleRetry} variant="secondary" className="flex-1" size="lg">
                <RotateCcw size={16} />
                Thử lại
              </Button>
              <Button onClick={handleSkip} className="flex-1" size="lg">
                Tiếp tục
                <ArrowRight size={16} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Fill Blank Sub-component ──

function FillBlankView({
  exercise,
  onResult,
}: {
  exercise: FillBlankExercise;
  onResult: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const isCorrect = selected !== null && exercise.options[selected] === exercise.correctWord;
  const correctIdx = exercise.options.indexOf(exercise.correctWord);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onResult(exercise.options[idx] === exercise.correctWord), 1000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
          Điền từ
        </span>
      </div>

      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg p-6 mb-4">
          <p className="text-center text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
            {exercise.sentence}
          </p>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
            {exercise.hint}
          </p>
        </div>

        <div className="space-y-2.5">
          {exercise.options.map((opt, idx) => {
            const isThis = selected === idx;
            const isAnswer = idx === correctIdx;

            return (
              <motion.button
                key={idx}
                whileTap={selected === null ? { scale: 0.97 } : undefined}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={cn(
                  'w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium',
                  selected === null &&
                    'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-200 dark:hover:border-indigo-800 active:bg-indigo-50 dark:active:bg-indigo-950/30',
                  selected !== null &&
                    isAnswer &&
                    'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
                  selected !== null &&
                    isThis &&
                    !isAnswer &&
                    'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
                  selected !== null &&
                    !isThis &&
                    !isAnswer &&
                    'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 opacity-50',
                )}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check size={18} />
                  <span className="text-sm font-semibold">Chính xác!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-500">
                  <XIcon size={18} />
                  <span className="text-sm font-semibold">
                    Đáp án: {exercise.correctWord}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Main PracticePhase ──

export function PracticePhase({
  vocabTopic,
  words,
  onComplete,
}: {
  vocabTopic: string;
  words: VocabWord[];
  onComplete: (correct: number, total: number) => void;
}) {
  const exercises = useMemo(() => generateExercises(vocabTopic, words), [vocabTopic, words]);
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const total = exercises.length;

  const handleResult = useCallback(
    (correct: boolean) => {
      const newCorrect = correct ? correctCount + 1 : correctCount;
      if (correct) setCorrectCount(newCorrect);

      if (current === total - 1) {
        setShowSummary(true);
        setTimeout(() => {
          onComplete(correct ? newCorrect : correctCount, total);
        }, 1500);
      } else {
        setTimeout(() => setCurrent((c) => c + 1), 300);
      }
    },
    [current, total, correctCount, onComplete],
  );

  if (exercises.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Không có bài thực hành cho chủ đề này
        </p>
        <Button onClick={() => onComplete(0, 0)} size="lg">
          Tiếp tục
          <ArrowRight size={18} />
        </Button>
      </div>
    );
  }

  if (showSummary) {
    const finalCorrect = correctCount;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center px-4 py-6"
      >
        <div className="text-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center',
              finalCorrect === total
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                : 'bg-gradient-to-br from-orange-400 to-amber-500',
            )}
          >
            <Check size={28} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Thực hành hoàn tất
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {finalCorrect}/{total}
          </p>
          <p className="text-xs text-gray-400 mt-1">câu đúng</p>
        </div>
      </motion.div>
    );
  }

  const exercise = exercises[current];

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress indicator */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-1.5 max-w-sm mx-auto">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                i < current
                  ? 'bg-emerald-400'
                  : i === current
                    ? 'bg-orange-400'
                    : 'bg-gray-200 dark:bg-gray-700',
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          {exercise.type === 'sentence-order' ? (
            <SentenceOrderView exercise={exercise} onResult={handleResult} />
          ) : (
            <FillBlankView exercise={exercise} onResult={handleResult} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
