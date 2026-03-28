import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import type { GrammarExercise } from '../../../lib/types';

interface Props {
  exercise: GrammarExercise;
  done: boolean;
  onComplete: () => void;
}

export function ChallengeGrammarTask({ exercise, done, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [fillAnswer, setFillAnswer] = useState('');

  if (done) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
        <p className="text-green-600 dark:text-green-400 font-medium text-sm">✅ Grammar quiz completed</p>
      </Card>
    );
  }

  if (exercise.type === 'multiple_choice') {
    const isCorrect = selected === exercise.answer;
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">📝 Grammar Quiz</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{exercise.question}</p>
          <div className="space-y-2 mb-3">
            {exercise.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm border transition-colors ${
                  submitted && i === exercise.answer
                    ? 'border-green-400 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                    : submitted && i === selected && !isCorrect
                    ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                    : selected === i
                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {submitted ? (
            <div className="space-y-2">
              <p className={`text-sm font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isCorrect ? '🎉 Correct!' : `❌ Incorrect. The answer is: ${exercise.options[exercise.answer]}`}
              </p>
              <button onClick={onComplete} className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors">
                Continue
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              disabled={selected === null}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Check Answer
            </button>
          )}
        </Card>
      </motion.div>
    );
  }

  if (exercise.type === 'fill_blank') {
    const isCorrect = submitted && exercise.acceptedAnswers.some(
      (a) => a.toLowerCase().trim() === fillAnswer.toLowerCase().trim()
    );
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">📝 Grammar Quiz</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{exercise.question}</p>
          <input
            type="text"
            value={fillAnswer}
            onChange={(e) => !submitted && setFillAnswer(e.target.value)}
            disabled={submitted}
            placeholder="Type your answer..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {submitted ? (
            <div className="space-y-2">
              <p className={`text-sm font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isCorrect ? '🎉 Correct!' : `❌ Incorrect. Accepted: ${exercise.acceptedAnswers.join(' / ')}`}
              </p>
              <button onClick={onComplete} className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors">
                Continue
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              disabled={!fillAnswer.trim()}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Check Answer
            </button>
          )}
        </Card>
      </motion.div>
    );
  }

  // error_correction / sentence_order — show as read-only info + auto-complete
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">📝 Grammar Quiz</h3>
        {exercise.type === 'error_correction' && (
          <div className="space-y-2 mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">Find the error in this sentence:</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white italic">"{exercise.sentence}"</p>
            {submitted && (
              <p className="text-sm text-green-600 dark:text-green-400">Correct: "{exercise.correctSentence}"</p>
            )}
          </div>
        )}
        {exercise.type === 'sentence_order' && (
          <div className="space-y-2 mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">Arrange these words into a sentence:</p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.words.map((w, i) => (
                <span key={i} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-medium">{w}</span>
              ))}
            </div>
            {submitted && (
              <p className="text-sm text-green-600 dark:text-green-400">Answer: "{exercise.answer}"</p>
            )}
          </div>
        )}
        {submitted ? (
          <button onClick={onComplete} className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors">
            Continue
          </button>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors"
          >
            Show Answer
          </button>
        )}
      </Card>
    </motion.div>
  );
}
