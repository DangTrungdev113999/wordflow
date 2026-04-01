import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGrammarStore } from '../../../stores/grammarStore';
import { QuizRenderer } from '../components/QuizRenderer';
import { QuizSummary } from '../components/QuizSummary';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { calculateQuizXP } from '../../../services/xpEngine';
import { eventBus } from '../../../services/eventBus';
import type { GrammarExercise } from '../../../lib/types';

function getExerciseQuestion(ex: GrammarExercise): string {
  switch (ex.type) {
    case 'multiple_choice':
      return ex.question;
    case 'fill_blank':
      return ex.question;
    case 'error_correction':
      return ex.sentence;
    case 'sentence_order':
      return `Order: ${ex.words.join(', ')}`;
    case 'role_identify':
      return ex.sentence;
    case 'transform':
      return `${ex.instruction}: ${ex.original}`;
  }
}

function getExerciseCorrectAnswer(ex: GrammarExercise): string {
  switch (ex.type) {
    case 'multiple_choice':
      return ex.options[ex.answer];
    case 'fill_blank':
      return ex.acceptedAnswers[0];
    case 'error_correction':
      return ex.correctSentence;
    case 'sentence_order':
      return ex.answer;
    case 'role_identify':
      return ex.targetIndices.map((i) => `${ex.parts[i].text}=${ex.parts[i].role}`).join(', ');
    case 'transform':
      return ex.acceptedAnswers[0];
  }
}

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
  const [showNext, setShowNext] = useState(false);
  const xpAwardedRef = useRef(false);
  const [quizXP, setQuizXP] = useState<ReturnType<typeof calculateQuizXP> | null>(null);

  useEffect(() => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      resetQuiz();
    }
    xpAwardedRef.current = false;
    setQuizXP(null);
    return () => {
      setCurrentLesson(null);
      resetQuiz();
    };
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Award XP when quiz completes — in useEffect to avoid render side effects
  useEffect(() => {
    if (!quiz.isComplete || xpAwardedRef.current || !currentLesson) return;
    xpAwardedRef.current = true;

    const correctCount = quiz.answers.filter((a) => a.correct).length;
    const score = Math.round((correctCount / currentLesson.exercises.length) * 100);
    const xp = calculateQuizXP(correctCount, currentLesson.exercises.length);

    updateLessonProgress(currentLesson.id, score);
    setQuizXP(xp);

    // Emit event instead of direct addXP + logQuizCompleted
    eventBus.emit('quiz:complete', {
      lessonId: currentLesson.id,
      correct: correctCount,
      total: currentLesson.exercises.length,
    });

    // Emit mistakes for incorrect answers
    const incorrectMistakes = quiz.answers
      .map((a, i) => ({ ...a, exercise: currentLesson.exercises[i] }))
      .filter(a => !a.correct)
      .map(a => ({
        type: 'grammar' as const,
        question: getExerciseQuestion(a.exercise),
        userAnswer: a.userAnswer,
        correctAnswer: getExerciseCorrectAnswer(a.exercise),
      }));

    if (incorrectMistakes.length > 0) {
      eventBus.emit('mistakes:collected', {
        source: 'grammar-quiz',
        mistakes: incorrectMistakes,
      });
    }
  }, [quiz.isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentLesson) {
    return <div className="p-6 text-center text-gray-700 dark:text-gray-300">Loading...</div>;
  }

  const currentExercise = currentLesson.exercises[quiz.currentExerciseIndex];
  const progress = ((quiz.currentExerciseIndex) / currentLesson.exercises.length) * 100;
  const correctCount = quiz.answers.filter((a) => a.correct).length;

  if (quiz.isComplete) {
    const score = Math.round((correctCount / currentLesson.exercises.length) * 100);
    const xp = quizXP ?? calculateQuizXP(correctCount, currentLesson.exercises.length);

    const incorrectQuestions = quiz.answers
      .map((a, i) => ({ ...a, exercise: currentLesson.exercises[i] }))
      .filter((a) => !a.correct)
      .map((a) => ({
        question: getExerciseQuestion(a.exercise),
        userAnswer: a.userAnswer,
        correctAnswer: getExerciseCorrectAnswer(a.exercise),
      }));

    return (
      <>
        <QuizSummary
          lessonTitle={currentLesson.title}
          correctCount={correctCount}
          totalQuestions={currentLesson.exercises.length}
          score={score}
          xp={xp}
          incorrectQuestions={incorrectQuestions}
          onRetry={() => {
            resetQuiz();
            xpAwardedRef.current = false;
            setQuizXP(null);
            setShowNext(false);
          }}
          onBack={() => navigate(`/grammar/${lessonId}`)}
        />
        <div className="text-center mt-2">
          <Link to="/grammar" className="text-sm text-indigo-500 hover:underline">
            ← Back to all lessons
          </Link>
        </div>
      </>
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
          <p className="text-sm text-gray-700 dark:text-gray-300">
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
