import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGrammarStore } from '../../../stores/grammarStore';
import { useProgressStore } from '../../../stores/progressStore';
import { QuizRenderer } from '../components/QuizRenderer';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { calculateQuizXP } from '../../../services/xpEngine';

export function QuizPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const {
    lessons,
    currentLesson,
    setCurrentLesson,
    quiz,
    submitAnswer,
    nextExercise,
    resetQuiz,
    updateLessonProgress,
  } = useGrammarStore();
  const { addXP } = useProgressStore();
  const [showNext, setShowNext] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      resetQuiz();
    }
    return () => {
      setCurrentLesson(null);
      resetQuiz();
    };
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentLesson) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  const currentExercise = currentLesson.exercises[quiz.currentExerciseIndex];
  const progress = ((quiz.currentExerciseIndex) / currentLesson.exercises.length) * 100;
  const correctCount = quiz.answers.filter((a) => a.correct).length;

  // Quiz complete
  if (quiz.isComplete && !xpAwarded) {
    const score = Math.round((correctCount / currentLesson.exercises.length) * 100);
    const xp = calculateQuizXP(correctCount, currentLesson.exercises.length);
    addXP(xp.totalXP);
    updateLessonProgress(currentLesson.id, score);
    setXpAwarded(true);
  }

  if (quiz.isComplete) {
    const score = Math.round((correctCount / currentLesson.exercises.length) * 100);
    const xp = calculateQuizXP(correctCount, currentLesson.exercises.length);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 py-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{currentLesson.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
            <p className="text-2xl font-bold text-green-600">{score}%</p>
            <p className="text-sm text-green-700 dark:text-green-400">Score</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">
            <p className="text-2xl font-bold text-indigo-600">+{xp.totalXP}xp</p>
            <p className="text-sm text-indigo-700 dark:text-indigo-400">XP Earned</p>
          </div>
        </div>
        <div className="w-full text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>✅ Correct: {correctCount}/{currentLesson.exercises.length}</p>
          {xp.perfectBonus > 0 && <p>🎯 Perfect Score Bonus: +{xp.perfectBonus}xp</p>}
          <p>📖 Lesson Complete: +{xp.lessonBonus}xp</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(`/grammar/${lessonId}`)}
          >
            <ArrowLeft size={18} className="mr-1" /> Review
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              resetQuiz();
              setXpAwarded(false);
              setShowNext(false);
            }}
          >
            <RotateCcw size={18} className="mr-1" /> Retry
          </Button>
        </div>
        <Link to="/grammar" className="text-sm text-indigo-500 hover:underline">
          ← Back to all lessons
        </Link>
      </motion.div>
    );
  }

  if (!currentExercise) return null;

  const handleAnswer = (correct: boolean, userAnswer: string) => {
    submitAnswer(correct, userAnswer);
    setShowNext(true);
  };

  const handleNext = () => {
    nextExercise();
    setShowNext(false);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link
          to={`/grammar/${lessonId}`}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Question {quiz.currentExerciseIndex + 1} of {currentLesson.exercises.length}
          </p>
        </div>
        <span className="text-sm font-medium text-green-600">{correctCount} ✓</span>
      </div>

      <ProgressBar value={progress} className="mb-6" />

      <AnimatePresence mode="wait">
        <motion.div
          key={quiz.currentExerciseIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800"
        >
          <QuizRenderer exercise={currentExercise} onAnswer={handleAnswer} />
        </motion.div>
      </AnimatePresence>

      {showNext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Button className="w-full" onClick={handleNext}>
            Next →
          </Button>
        </motion.div>
      )}
    </div>
  );
}
