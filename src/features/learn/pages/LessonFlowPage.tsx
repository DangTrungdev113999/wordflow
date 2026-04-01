import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, RotateCcw, Trophy, Zap, BookOpen, Star } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn, shuffle } from '../../../lib/utils';
import { UNITS } from '../../../data/learning-path/units';
import { ALL_TOPICS } from '../../../data/vocabulary/_index';
import { ALL_GRAMMAR_LESSONS } from '../../../data/grammar/_index';
import { useLessonStore } from '../../../stores/lessonStore';
import { useProgressStore } from '../../../stores/progressStore';
import type { LessonPhase } from '../../../data/learning-path/types';
import type { VocabWord } from '../../../lib/types';

// ── Helpers ──

function findLesson(lessonId: string) {
  for (const unit of UNITS) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, unit };
  }
  return null;
}

function getNextLessonId(currentId: string): string | null {
  const all = UNITS.flatMap((u) => u.lessons);
  const idx = all.findIndex((l) => l.id === currentId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1].id : null;
}

function generateQuizQuestions(words: VocabWord[], count: number) {
  const pool = shuffle(words).slice(0, Math.min(count, words.length));
  return pool.map((w) => {
    const distractors = shuffle(words.filter((x) => x.word !== w.word))
      .slice(0, 3)
      .map((x) => x.meaning);
    const options = shuffle([w.meaning, ...distractors]);
    return {
      word: w.word,
      correctMeaning: w.meaning,
      options,
      correctIndex: options.indexOf(w.meaning),
    };
  });
}

// ── Sub-components ──

function VocabPhase({
  words,
  onComplete,
}: {
  words: VocabWord[];
  onComplete: () => void;
}) {
  const selected = useMemo(() => shuffle(words).slice(0, 10), [words]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = selected[current];
  const isLast = current === selected.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setFlipped(false);
      setCurrent((c) => c + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
          Vocabulary
        </span>
        <p className="text-xs text-gray-400 mt-0.5">
          {current + 1} / {selected.length}
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
        style={{ perspective: '1200px' }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full"
        >
          {/* Front */}
          <div
            className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-8 min-h-[220px] flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {word?.word}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{word?.ipa}</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-6">
              Nhấn để lật thẻ
            </p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-gray-900 shadow-lg p-8 min-h-[220px] flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
              {word?.meaning}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed italic">
              "{word?.example}"
            </p>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <Button
          onClick={handleNext}
          className="w-full"
          size="lg"
        >
          {isLast ? 'Hoàn thành' : 'Tiếp tục'}
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

function GrammarPhase({
  grammarId,
  onComplete,
}: {
  grammarId: string;
  onComplete: () => void;
}) {
  const grammar = ALL_GRAMMAR_LESSONS.find((g) => g.id === grammarId);
  if (!grammar) return null;

  const cheat = grammar.cheatSheet;
  const firstSection = grammar.theory.sections[0];

  return (
    <div className="flex-1 flex flex-col px-4 py-6 overflow-y-auto">
      <div className="text-center mb-4">
        <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
          Grammar
        </span>
      </div>

      <div className="max-w-lg mx-auto w-full space-y-4">
        {/* Title card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/50 p-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {grammar.title}
          </h2>
          {cheat && (
            <p className="text-sm font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/30 rounded-lg px-3 py-2 mt-2">
              {cheat.formula}
            </p>
          )}
        </div>

        {/* Key Points */}
        {cheat && cheat.keyPoints.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Star size={14} className="text-amber-500" />
              Điểm chính
            </h3>
            <ul className="space-y-2">
              {cheat.keyPoints.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples from first theory section */}
        {firstSection?.examples && firstSection.examples.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-indigo-500" />
              Ví dụ
            </h3>
            <div className="space-y-3">
              {firstSection.examples.slice(0, 4).map((ex, i) => (
                <div key={i} className="text-sm">
                  <p className="text-gray-900 dark:text-white font-medium">{ex.en}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{ex.vi}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signal Words */}
        {cheat && cheat.signalWords.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Từ tín hiệu
            </h3>
            <div className="flex flex-wrap gap-2">
              {cheat.signalWords.map((w, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 font-medium"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {cheat && cheat.commonMistakes.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Lỗi thường gặp
            </h3>
            <div className="space-y-2">
              {cheat.commonMistakes.map((m, i) => (
                <p
                  key={i}
                  className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2"
                >
                  {m}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 px-4 max-w-lg mx-auto w-full pb-4">
        <Button onClick={onComplete} className="w-full" size="lg">
          Tiếp tục
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

function QuizPhase({
  words,
  onComplete,
}: {
  words: VocabWord[];
  onComplete: (score: number, total: number) => void;
}) {
  const questions = useMemo(() => generateQuizQuestions(words, 5), [words]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const q = questions[current];
  const isCorrect = selected === q?.correctIndex;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (current === questions.length - 1) {
      const finalScore = isCorrect ? correctCount : correctCount;
      onComplete(finalScore, questions.length);
    } else {
      setSelected(null);
      setShowResult(false);
      setCurrent((c) => c + 1);
    }
  };

  if (!q) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
      <div className="text-center mb-2">
        <span className="text-xs font-semibold text-violet-500 uppercase tracking-wider">
          Quiz
        </span>
        <p className="text-xs text-gray-400 mt-0.5">
          {current + 1} / {questions.length}
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-lg p-6 mb-4">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
            Chọn nghĩa đúng của từ
          </p>
          <p className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            {q.word}
          </p>
        </div>

        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            const isThis = selected === idx;
            const isAnswer = idx === q.correctIndex;

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
                  showResult && isAnswer &&
                    'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
                  showResult && isThis && !isAnswer &&
                    'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
                  showResult && !isThis && !isAnswer &&
                    'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 opacity-50',
                )}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button onClick={handleNext} className="w-full" size="lg">
                {current === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                <ArrowRight size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CompletionScreen({
  score,
  total,
  xp,
  lessonTitle,
  nextLessonId,
  onNextLesson,
  onGoBack,
}: {
  score: number;
  total: number;
  xp: number;
  lessonTitle: string;
  nextLessonId: string | null;
  onNextLesson: () => void;
  onGoBack: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const isPerfect = pct === 100;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center max-w-sm w-full"
      >
        <div
          className={cn(
            'w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center',
            isPerfect
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200 dark:shadow-amber-900/40'
              : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40',
          )}
        >
          <Trophy size={36} className="text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {isPerfect ? 'Xuất sắc!' : 'Hoàn thành!'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{lessonTitle}</p>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <Zap size={18} className="text-indigo-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                +{xp}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">XP</p>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {score}/{total}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Điểm quiz</p>
          </div>
        </div>

        <div className="space-y-3">
          {nextLessonId && (
            <Button onClick={onNextLesson} className="w-full" size="lg">
              Bài tiếp theo
              <ArrowRight size={18} />
            </Button>
          )}
          <Button onClick={onGoBack} variant="secondary" className="w-full" size="lg">
            <RotateCcw size={16} />
            Về trang học
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ──

const PHASE_LABELS: Record<LessonPhase, string> = {
  vocab: 'Từ vựng',
  grammar: 'Ngữ pháp',
  quiz: 'Kiểm tra',
};

export function LessonFlowPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { startLesson, completePhase, completeLesson } = useLessonStore();
  const addXP = useProgressStore((s) => s.addXP);

  const result = findLesson(lessonId ?? '');
  const lesson = result?.lesson;

  const [phase, setPhase] = useState<LessonPhase>('vocab');
  const [completed, setCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [started, setStarted] = useState(false);

  const vocabTopic = useMemo(
    () => ALL_TOPICS.find((t) => t.topic === lesson?.vocabTopic),
    [lesson?.vocabTopic],
  );

  const nextLessonId = useMemo(
    () => (lessonId ? getNextLessonId(lessonId) : null),
    [lessonId],
  );

  const startIfNeeded = useCallback(() => {
    if (!started && lessonId) {
      startLesson(lessonId);
      setStarted(true);
    }
  }, [started, lessonId, startLesson]);

  if (!lesson || !vocabTopic) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Không tìm thấy bài học</p>
      </div>
    );
  }

  // Phase index for progress bar
  const phases: LessonPhase[] = ['vocab', 'grammar', 'quiz'];
  const phaseIdx = completed ? phases.length : phases.indexOf(phase);
  const progressPct = completed
    ? 100
    : ((phaseIdx + 0.5) / phases.length) * 100;

  const handlePhaseComplete = (currentPhase: LessonPhase) => {
    startIfNeeded();
    if (lessonId) completePhase(lessonId, currentPhase);
    const nextIdx = phases.indexOf(currentPhase) + 1;
    if (nextIdx < phases.length) {
      setPhase(phases[nextIdx]);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    startIfNeeded();
    setQuizScore(score);
    setQuizTotal(total);
    const xpBase = 30;
    const xpBonus = score === total ? 20 : 0;
    const xpQuiz = score * 10;
    const totalXP = xpBase + xpQuiz + xpBonus;
    if (lessonId) {
      completePhase(lessonId, 'quiz');
      completeLesson(lessonId, score, totalXP);
    }
    addXP(totalXP);
    setCompleted(true);
  };

  const handleNextLesson = () => {
    if (nextLessonId) {
      navigate(`/learn/lesson/${nextLessonId}`, { replace: true });
      setPhase('vocab');
      setCompleted(false);
      setStarted(false);
      setQuizScore(0);
      setQuizTotal(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <button
          onClick={() => navigate('/learn')}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
        <div className="flex-1">
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        {!completed && (
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 shrink-0">
            {PHASE_LABELS[phase]}
          </span>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex"
          >
            <CompletionScreen
              score={quizScore}
              total={quizTotal}
              xp={30 + quizScore * 10 + (quizScore === quizTotal ? 20 : 0)}
              lessonTitle={lesson.title}
              nextLessonId={nextLessonId}
              onNextLesson={handleNextLesson}
              onGoBack={() => navigate('/learn')}
            />
          </motion.div>
        ) : phase === 'vocab' ? (
          <motion.div
            key="vocab"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            <VocabPhase
              words={vocabTopic.words}
              onComplete={() => {
                startIfNeeded();
                handlePhaseComplete('vocab');
              }}
            />
          </motion.div>
        ) : phase === 'grammar' ? (
          <motion.div
            key="grammar"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            <GrammarPhase
              grammarId={lesson.grammarId}
              onComplete={() => handlePhaseComplete('grammar')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            <QuizPhase
              words={vocabTopic.words}
              onComplete={handleQuizComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
