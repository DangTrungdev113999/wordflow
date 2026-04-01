import { useMemo } from 'react';
import { useMistakeStore } from '../../../stores/mistakeStore';
import type { Mistake, MistakeType } from '../../../models/Mistake';

interface PatternGroup {
  pattern: string;
  count: number;
  examples: Mistake[];
  type: MistakeType;
}

// Simple keyword-based pattern detection
function detectPattern(mistake: Mistake): string {
  const q = mistake.question.toLowerCase();
  const correct = mistake.correctAnswer.toLowerCase();
  const user = mistake.userAnswer.toLowerCase();

  if (mistake.type === 'grammar') {
    // Tense patterns
    if (q.includes('tense') || /\b(was|were|had|has|have|will)\b/.test(correct)) return 'Tense errors';
    if (/\b(a|an|the)\b/.test(correct) && !/\b(a|an|the)\b/.test(user)) return 'Article usage';
    if (q.includes('preposition') || /\b(in|on|at|to|for|with)\b/.test(correct)) return 'Preposition errors';
    if (q.includes('agreement') || q.includes('subject')) return 'Subject-verb agreement';
    return 'Grammar (other)';
  }

  if (mistake.type === 'vocabulary') {
    if (correct.length > 8 && user.length > 8) return 'Advanced vocabulary';
    return 'Vocabulary recall';
  }

  if (mistake.type === 'spelling') {
    // Check for common spelling patterns
    if (correct.includes('ie') || correct.includes('ei')) return 'ie/ei confusion';
    if (correct.endsWith('tion') || correct.endsWith('sion')) return 'Suffix spelling';
    return 'Spelling errors';
  }

  if (mistake.type === 'sentence_order') return 'Word order';
  if (mistake.type === 'listening') return 'Listening comprehension';
  if (mistake.type === 'reading') return 'Reading comprehension';
  if (mistake.type === 'writing') return 'Writing issues';

  return 'Other';
}

export function PatternAnalysis() {
  const { mistakes } = useMistakeStore();

  const patterns = useMemo<PatternGroup[]>(() => {
    const groups = new Map<string, { count: number; examples: Mistake[]; type: MistakeType }>();

    for (const m of mistakes) {
      const pattern = detectPattern(m);
      const existing = groups.get(pattern);
      if (existing) {
        existing.count++;
        if (existing.examples.length < 3) existing.examples.push(m);
      } else {
        groups.set(pattern, { count: 1, examples: [m], type: m.type });
      }
    }

    return Array.from(groups.entries())
      .map(([pattern, data]) => ({ pattern, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [mistakes]);

  if (patterns.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🔍</p>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">No patterns yet</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">More mistakes = better pattern detection. Keep practicing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Mistakes grouped by detected patterns</p>
      {patterns.map(group => (
        <div key={group.pattern} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{group.pattern}</h4>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
              {group.count}
            </span>
          </div>

          {/* Progress bar showing relative frequency */}
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (group.count / mistakes.length) * 100)}%` }}
            />
          </div>

          {/* Example mistakes */}
          <div className="space-y-2">
            {group.examples.map(ex => (
              <div key={ex.id} className="flex items-start gap-2 text-xs">
                <span className="text-red-400 shrink-0">✕</span>
                <div>
                  <span className="text-gray-700 dark:text-gray-300">{ex.question}</span>
                  <span className="text-gray-600 dark:text-gray-400 mx-1">→</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{ex.correctAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
