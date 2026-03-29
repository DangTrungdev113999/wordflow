import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { MixedReviewPicker } from '../components/MixedReviewPicker';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { QuizSession } from '../components/QuizSession';
import { ContextFillSession } from '../components/ContextFillSession';
import { SessionSummary } from '../components/SessionSummary';
import { StreakIndicator } from '../components/StreakIndicator';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

import { useMixedReview, type MixedReviewConfig, type MixedWord, type MixedSourceFilter } from '../hooks/useMixedReview';
import { useMnemonicForWord } from '../hooks/useMnemonicForWord';
import { useEnrichedAudio } from '../../../hooks/useEnrichedAudio';
import { useSessionStreak } from '../hooks/useSessionStreak';
import { db } from '../../../db/database';
import { calculateSM2, createInitialProgress } from '../../../services/spacedRepetition';
import { eventBus } from '../../../services/eventBus';
import { getWeakWords, getSessionWeakWords, type WeakWord } from '../../../services/weakWordsService';
import { shuffle } from '../../../lib/utils';
import { XP_VALUES } from '../../../lib/constants';
import type { FlashcardRating } from '../../../lib/types';
import type { WordProgress } from '../../../db/models';

type PageState = 'picker' | 'review' | 'complete';

interface ReviewStats {
  correct: number;
  incorrect: number;
  total: number;
  xpEarned: number;
}

function getFlashcardXP(rating: FlashcardRating, multiplier: number): number {
  if (rating < 3) return 0;
  const action = rating === 5 ? 'flashcard_easy' : rating === 2 ? 'flashcard_hard' : 'flashcard_correct';
  return Math.round(XP_VALUES[action] * multiplier);
}

function getBaseXP(rating: FlashcardRating): number {
  if (rating < 3) return 0;
  if (rating === 5) return XP_VALUES.flashcard_easy;
  if (rating === 2) return XP_VALUES.flashcard_hard;
  return XP_VALUES.flashcard_correct;
}

function generateMixedDistractors(
  correct: MixedWord,
  pool: MixedWord[],
  direction: 'en-to-vi' | 'vi-to-en',
): string[] {
  const correctText = direction === 'en-to-vi' ? correct.meaning : correct.word;
  const candidates = pool
    .filter((w) => w.word !== correct.word)
    .map((w) => (direction === 'en-to-vi' ? w.meaning : w.word))
    .filter((c) => c !== correctText);
  return shuffle([...new Set(candidates)]).slice(0, 3);
}

// ─── Flashcard Mode ────────────────────────────────────────────────

function FlashcardReview({
  words,
  progressMap,
  onComplete,
  onAnswer,
}: {
  words: MixedWord[];
  progressMap: Record<string, WordProgress>;
  onComplete: (stats: ReviewStats, results: { wordId: string; correct: boolean }[]) => void;
  onAnswer: (correct: boolean, baseXP: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [localProgress, setLocalProgress] = useState(progressMap);
  const statsRef = useRef({ correct: 0, incorrect: 0, total: 0, xpEarned: 0 });
  const resultsRef = useRef<{ wordId: string; correct: boolean }[]>([]);
  const learnedInSession = useRef(new Set<string>());

  const currentWord = words[index] ?? null;
  const { mnemonic, mnemonicType } = useMnemonicForWord(currentWord);
  const { getAudioUrl } = useEnrichedAudio(words, index);

  const handleRate = useCallback(
    async (rating: FlashcardRating) => {
      if (!currentWord) return;

      const wordId = `${currentWord.topicId}:${currentWord.word}`;
      const existing = localProgress[wordId];
      const current = existing ?? createInitialProgress(wordId);
      const result = calculateSM2(rating, current);
      const newProgress = { ...current, ...result, lastReview: Date.now() };

      await db.wordProgress.put(newProgress);
      setLocalProgress((prev) => ({ ...prev, [wordId]: newProgress }));

      const isCorrect = rating >= 3;
      const xp = getFlashcardXP(rating, 1.5);
      onAnswer(isCorrect, getBaseXP(rating));
      statsRef.current = {
        correct: statsRef.current.correct + (isCorrect ? 1 : 0),
        incorrect: statsRef.current.incorrect + (isCorrect ? 0 : 1),
        total: statsRef.current.total + 1,
        xpEarned: statsRef.current.xpEarned + xp,
      };
      resultsRef.current = [...resultsRef.current, { wordId, correct: isCorrect }];

      if (isCorrect) {
        eventBus.emit('flashcard:correct', { wordId, rating, multiplier: 1.5 });
      } else {
        eventBus.emit('flashcard:incorrect', { wordId });
      }

      if ((!existing || existing.status === 'new') && !learnedInSession.current.has(wordId)) {
        learnedInSession.current.add(wordId);
        eventBus.emit('word:learned', { wordId });
      }

      setIsFlipped(false);
      const nextIdx = index + 1;
      if (nextIdx >= words.length) {
        onComplete(statsRef.current, resultsRef.current);
      } else {
        setIndex(nextIdx);
      }
    },
    [currentWord, index, words.length, localProgress, onComplete, onAnswer],
  );

  if (!currentWord) return null;

  return (
    <FlashcardDeck
      word={{ ...currentWord, audioUrl: getAudioUrl(currentWord) }}
      isFlipped={isFlipped}
      onFlip={() => setIsFlipped((f) => !f)}
      onRate={handleRate}
      cardIndex={index}
      total={words.length}
      wordId={`${currentWord.topicId}:${currentWord.word}`}
      topicId={currentWord.topicId}
      mnemonic={mnemonic}
      mnemonicType={mnemonicType}
    />
  );
}

// ─── Quiz Mode ─────────────────────────────────────────────────────

function QuizReview({
  words,
  progressMap,
  onComplete,
  onAnswer,
}: {
  words: MixedWord[];
  progressMap: Record<string, WordProgress>;
  onComplete: (stats: ReviewStats, results: { wordId: string; correct: boolean }[]) => void;
  onAnswer: (correct: boolean, baseXP: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'en-to-vi' | 'vi-to-en'>('en-to-vi');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [localProgress, setLocalProgress] = useState(progressMap);
  const statsRef = useRef({ correct: 0, incorrect: 0, total: 0, xpEarned: 0 });
  const resultsRef = useRef<{ wordId: string; correct: boolean }[]>([]);
  const learnedInSession = useRef(new Set<string>());

  const currentWord = words[index] ?? null;

  // Generate question for current word
  useEffect(() => {
    if (!currentWord || words.length === 0) return;
    const dir = Math.random() > 0.5 ? 'en-to-vi' : 'vi-to-en';
    setDirection(dir);
    const correct = dir === 'en-to-vi' ? currentWord.meaning : currentWord.word;
    const distractors = generateMixedDistractors(currentWord, words, dir);
    setOptions(shuffle([correct, ...distractors]));
    setSelectedOption(null);
    setShowFeedback(false);
  }, [index, words]); // eslint-disable-line react-hooks/exhaustive-deps

  const correctAnswer = currentWord
    ? direction === 'en-to-vi' ? currentWord.meaning : currentWord.word
    : '';

  const handleSelect = useCallback(
    async (option: string) => {
      if (showFeedback || !currentWord) return;
      setSelectedOption(option);
      setShowFeedback(true);

      const isCorrect = option === correctAnswer;
      const wordId = `${currentWord.topicId}:${currentWord.word}`;
      const rating: FlashcardRating = isCorrect ? 4 : 0;

      const existing = localProgress[wordId];
      const current = existing ?? createInitialProgress(wordId);
      const sm2 = calculateSM2(rating, current);
      const newProgress = { ...current, ...sm2, lastReview: Date.now() };

      await db.wordProgress.put(newProgress);
      setLocalProgress((prev) => ({ ...prev, [wordId]: newProgress }));

      const xp = getFlashcardXP(rating, 1.5);
      onAnswer(isCorrect, XP_VALUES.quiz_correct);
      statsRef.current = {
        correct: statsRef.current.correct + (isCorrect ? 1 : 0),
        incorrect: statsRef.current.incorrect + (isCorrect ? 0 : 1),
        total: statsRef.current.total + 1,
        xpEarned: statsRef.current.xpEarned + xp,
      };
      resultsRef.current = [...resultsRef.current, { wordId, correct: isCorrect }];

      if (isCorrect) {
        eventBus.emit('flashcard:correct', { wordId, rating, multiplier: 1.5 });
      } else {
        eventBus.emit('flashcard:incorrect', { wordId });
      }
      if ((!existing || existing.status === 'new') && !learnedInSession.current.has(wordId)) {
        learnedInSession.current.add(wordId);
        eventBus.emit('word:learned', { wordId });
      }

      setTimeout(() => {
        const nextIdx = index + 1;
        if (nextIdx >= words.length) {
          onComplete(statsRef.current, resultsRef.current);
        } else {
          setIndex(nextIdx);
        }
      }, 800);
    },
    [showFeedback, currentWord, correctAnswer, index, words.length, localProgress, onComplete, onAnswer],
  );

  if (!currentWord) return null;

  return (
    <QuizSession
      currentWord={currentWord}
      currentIndex={index}
      total={words.length}
      direction={direction}
      options={options}
      selectedOption={selectedOption}
      showFeedback={showFeedback}
      correctAnswer={correctAnswer}
      onSelect={handleSelect}
    />
  );
}

// ─── Context Fill-in-Blank Mode ──────────────────────────────────────

interface ContextQuestion {
  word: MixedWord;
  sentence: string;         // with _____ blank
  context: 'daily' | 'work' | 'social' | 'formal' | 'dialogue';
  translation?: string;
  correctAnswer: string;    // the blanked word
}

/**
 * Build fill-in-blank questions from richExamples.
 * Falls back to word.example if no richExamples available.
 */
async function buildContextQuestions(words: MixedWord[]): Promise<ContextQuestion[]> {
  const questions: ContextQuestion[] = [];

  for (const w of words) {
    const key = w.word.toLowerCase().trim();
    const cached = await db.enrichedWords.get(key);
    const rich = cached?.data?.richExamples;

    if (rich && rich.length > 0) {
      // Pick a random richExample for this word
      const ex = rich[Math.floor(Math.random() * rich.length)];
      const blanked = blankWord(ex.sentence, w.word);
      if (blanked) {
        questions.push({
          word: w,
          sentence: blanked,
          context: ex.context,
          translation: ex.translation,
          correctAnswer: w.word,
        });
        continue;
      }
    }

    // Fallback: use word.example
    if (w.example) {
      const blanked = blankWord(w.example, w.word);
      if (blanked) {
        questions.push({
          word: w,
          sentence: blanked,
          context: 'daily',
          correctAnswer: w.word,
        });
      }
    }
  }

  return questions;
}

/** Replace the target word in a sentence with _____ (case-insensitive). */
function blankWord(sentence: string, word: string): string | null {
  const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  if (!regex.test(sentence)) return null;
  return sentence.replace(regex, '_____');
}

function ContextReview({
  words,
  progressMap,
  onComplete,
  onAnswer,
}: {
  words: MixedWord[];
  progressMap: Record<string, WordProgress>;
  onComplete: (stats: ReviewStats, results: { wordId: string; correct: boolean }[]) => void;
  onAnswer: (correct: boolean, baseXP: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<ContextQuestion[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [ready, setReady] = useState(false);
  const [localProgress, setLocalProgress] = useState(progressMap);
  const statsRef = useRef({ correct: 0, incorrect: 0, total: 0, xpEarned: 0 });
  const resultsRef = useRef<{ wordId: string; correct: boolean }[]>([]);
  const learnedInSession = useRef(new Set<string>());

  // Build questions on mount
  useEffect(() => {
    buildContextQuestions(words).then((qs) => {
      setQuestions(qs);
      setReady(true);
    });
  }, [words]);

  const currentQ = questions[index] ?? null;

  // Generate options for current question
  useEffect(() => {
    if (!currentQ || questions.length === 0) return;
    const correct = currentQ.correctAnswer;
    const distractors = questions
      .map((q) => q.correctAnswer)
      .filter((w) => w.toLowerCase() !== correct.toLowerCase());
    const unique = [...new Set(distractors)];
    const picked = shuffle(unique).slice(0, 3);
    setOptions(shuffle([correct, ...picked]));
    setSelectedOption(null);
    setShowFeedback(false);
  }, [index, questions]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback(
    async (option: string) => {
      if (showFeedback || !currentQ) return;
      setSelectedOption(option);
      setShowFeedback(true);

      const w = currentQ.word;
      const isCorrect = option.toLowerCase() === currentQ.correctAnswer.toLowerCase();
      const wordId = `${w.topicId}:${w.word}`;
      const rating: FlashcardRating = isCorrect ? 4 : 0;

      // SM-2
      const existing = localProgress[wordId];
      const current = existing ?? createInitialProgress(wordId);
      const sm2 = calculateSM2(rating, current);
      const newProgress = { ...current, ...sm2, lastReview: Date.now() };
      await db.wordProgress.put(newProgress);
      setLocalProgress((prev) => ({ ...prev, [wordId]: newProgress }));

      // Context mastery tracking
      if (isCorrect) {
        const ctxEntry = await db.contextProgress.get(wordId);
        const currentCtx = ctxEntry?.contextsCorrect ?? [];
        if (!currentCtx.includes(currentQ.context)) {
          const updated = [...currentCtx, currentQ.context];
          await db.contextProgress.put({
            wordId,
            contextsCorrect: updated,
            contextMastered: updated.length >= 3,
            lastUpdated: Date.now(),
          });
        }
      }

      // XP + stats
      const xp = getFlashcardXP(rating, 1.5);
      onAnswer(isCorrect, XP_VALUES.quiz_correct);
      statsRef.current = {
        correct: statsRef.current.correct + (isCorrect ? 1 : 0),
        incorrect: statsRef.current.incorrect + (isCorrect ? 0 : 1),
        total: statsRef.current.total + 1,
        xpEarned: statsRef.current.xpEarned + xp,
      };
      resultsRef.current = [...resultsRef.current, { wordId, correct: isCorrect }];

      if (isCorrect) {
        eventBus.emit('flashcard:correct', { wordId, rating, multiplier: 1.5 });
      } else {
        eventBus.emit('flashcard:incorrect', { wordId });
      }
      if ((!existing || existing.status === 'new') && !learnedInSession.current.has(wordId)) {
        learnedInSession.current.add(wordId);
        eventBus.emit('word:learned', { wordId });
      }

      setTimeout(() => {
        const nextIdx = index + 1;
        if (nextIdx >= questions.length) {
          onComplete(statsRef.current, resultsRef.current);
        } else {
          setIndex(nextIdx);
        }
      }, 800);
    },
    [showFeedback, currentQ, index, questions.length, localProgress, onComplete, onAnswer],
  );

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Chưa có dữ liệu ngữ cảnh cho các từ này.</p>
        <p className="text-xs mt-1">Hãy mở từng từ trong Word Detail để AI tạo examples.</p>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <ContextFillSession
      sentence={currentQ.sentence}
      context={currentQ.context}
      translation={currentQ.translation}
      currentIndex={index}
      total={questions.length}
      options={options}
      selectedOption={selectedOption}
      showFeedback={showFeedback}
      correctAnswer={currentQ.correctAnswer}
      onSelect={handleSelect}
    />
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export function MixedReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('source') as MixedSourceFilter) || undefined;
  const { stats, loading, selectWords, progressMap } = useMixedReview();
  const [pageState, setPageState] = useState<PageState>('picker');
  const [config, setConfig] = useState<MixedReviewConfig | null>(null);
  const [words, setWords] = useState<MixedWord[]>([]);
  const [sessionStats, setSessionStats] = useState<ReviewStats>({ correct: 0, incorrect: 0, total: 0, xpEarned: 0 });
  const [sessionResults, setSessionResults] = useState<{ wordId: string; correct: boolean }[]>([]);
  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const { streak, multiplier, bestStreak, totalStreakBonus, recordAnswer, reset: resetStreak } = useSessionStreak();

  const handleAnswer = useCallback(
    (correct: boolean, baseXP: number) => {
      recordAnswer(correct, baseXP);
    },
    [recordAnswer],
  );

  const handleStart = useCallback(
    (cfg: MixedReviewConfig) => {
      const selected = selectWords(cfg);
      if (selected.length === 0) return;

      setConfig(cfg);
      setWords(selected);
      resetStreak();
      setPageState('review');
    },
    [selectWords, resetStreak],
  );

  const handleComplete = useCallback(
    (s: ReviewStats, results: typeof sessionResults) => {
      setSessionStats(s);
      setSessionResults(results);
      setPageState('complete');

      // Emit mistakes
      const incorrect = results.filter((r) => !r.correct);
      if (incorrect.length > 0) {
        eventBus.emit('mistakes:collected', {
          source: 'quiz',
          mistakes: incorrect.map((r) => {
            const w = words.find((word) => `${word.topicId}:${word.word}` === r.wordId);
            return {
              type: 'vocabulary' as const,
              question: w ? `What does "${w.word}" mean?` : r.wordId,
              userAnswer: 'Incorrect',
              correctAnswer: w?.meaning ?? r.wordId,
            };
          }),
        });
      }
    },
    [words],
  );

  // Load weak words on session complete
  useEffect(() => {
    if (pageState !== 'complete') return;
    getWeakWords().then((allWeak) => {
      setWeakWords(getSessionWeakWords(sessionResults, allWeak));
    });
  }, [pageState]); // eslint-disable-line react-hooks/exhaustive-deps

  const accuracy = sessionStats.total > 0
    ? Math.round((sessionStats.correct / sessionStats.total) * 100)
    : 0;

  const effectiveMode = config?.mode;

  // Compute mixed bonus: the difference between 1.5x XP and base XP
  const mixedBonusXP =
    sessionStats.xpEarned > 0 ? Math.round(sessionStats.xpEarned - sessionStats.xpEarned / 1.5) : 0;
  const baseXP = sessionStats.xpEarned - mixedBonusXP;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {pageState === 'picker' ? (
          <Link
            to="/vocabulary"
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
        ) : (
          <button
            onClick={() => {
              if (pageState === 'review') {
                setShowLeaveConfirm(true);
                return;
              }
              setPageState('picker');
            }}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        )}
        <h1 className="flex-1 font-semibold text-gray-900 dark:text-white">
          Ôn tập tổng hợp
          {pageState === 'review' && config && (
            <span className="text-sm font-normal text-gray-400 ml-2 capitalize">{effectiveMode}</span>
          )}
        </h1>
        {pageState === 'review' && <StreakIndicator streak={streak} multiplier={multiplier} />}
      </div>

      <AnimatePresence mode="wait">
        {pageState === 'picker' && (
          <motion.div key="picker" exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <MixedReviewPicker
              stats={stats}
              loading={loading}
              initialFilter={initialFilter}
              onStart={handleStart}
            />
          </motion.div>
        )}

        {pageState === 'review' && config && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {effectiveMode === 'flashcard' ? (
              <FlashcardReview
                words={words}
                progressMap={progressMap}
                onComplete={handleComplete}
                onAnswer={handleAnswer}
              />
            ) : effectiveMode === 'context' ? (
              <ContextReview
                words={words}
                progressMap={progressMap}
                onComplete={handleComplete}
                onAnswer={handleAnswer}
              />
            ) : (
              <QuizReview
                words={words}
                progressMap={progressMap}
                onComplete={handleComplete}
                onAnswer={handleAnswer}
              />
            )}
          </motion.div>
        )}

        {pageState === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <SessionSummary
              correct={sessionStats.correct}
              total={sessionStats.total}
              accuracy={accuracy}
              xpEarned={sessionStats.xpEarned + totalStreakBonus}
              weakWords={weakWords}
              bestStreak={bestStreak}
              xpBreakdown={{
                base: baseXP,
                streakBonus: totalStreakBonus,
                mixedBonus: mixedBonusXP,
              }}
              onBack={() => navigate('/vocabulary')}
              onRetry={() => {
                setPageState('picker');
                setSessionStats({ correct: 0, incorrect: 0, total: 0, xpEarned: 0 });
                setSessionResults([]);
                resetStreak();
              }}
              backLabel="Từ vựng"
              title="Hoàn thành ôn tập!"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        onConfirm={() => setPageState('picker')}
        title="Rời khỏi phiên ôn tập?"
        description="Tiến trình hiện tại sẽ không được lưu."
        confirmLabel="Rời đi"
        cancelLabel="Tiếp tục"
        variant="warning"
      />
    </div>
  );
}
