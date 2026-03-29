import { motion } from 'framer-motion';

interface FormulaPart {
  label: string;
  description?: string;
  color?: 'blue' | 'orange' | 'green' | 'purple' | 'pink' | 'teal';
}

export interface FormulaCardProps {
  title: string;
  parts: FormulaPart[];
  example?: string;
}

const PART_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/30',   text: 'text-blue-700 dark:text-blue-300',   border: 'border-blue-200 dark:border-blue-800' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  green:  { bg: 'bg-green-50 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-300',  border: 'border-green-200 dark:border-green-800' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-900/30',   text: 'text-pink-700 dark:text-pink-300',   border: 'border-pink-200 dark:border-pink-800' },
  teal:   { bg: 'bg-teal-50 dark:bg-teal-900/30',   text: 'text-teal-700 dark:text-teal-300',   border: 'border-teal-200 dark:border-teal-800' },
};

const DEFAULT_PART_COLORS = ['blue', 'orange', 'green', 'purple', 'pink', 'teal'];

export function FormulaCard({ title, parts, example }: FormulaCardProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {title}
      </div>

      <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/20 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        {/* Formula parts */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {parts.map((part, i) => {
            const colorKey = part.color || DEFAULT_PART_COLORS[i % DEFAULT_PART_COLORS.length];
            const colors = PART_COLORS[colorKey] || PART_COLORS.blue;

            return (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.3, type: 'spring', stiffness: 300 }}
              >
                {/* Plus sign between parts */}
                {i > 0 && (
                  <motion.span
                    className="text-gray-400 dark:text-gray-500 font-bold text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.12 - 0.06 }}
                  >
                    +
                  </motion.span>
                )}

                <div className={`group relative px-3.5 py-2 rounded-xl border ${colors.bg} ${colors.border} cursor-default`}>
                  <span className={`font-mono font-bold text-sm ${colors.text}`}>{part.label}</span>

                  {/* Tooltip on hover */}
                  {part.description && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-lg">
                      {part.description}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Example */}
        {example && (
          <motion.p
            className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: parts.length * 0.12 + 0.2 }}
          >
            &ldquo;{example}&rdquo;
          </motion.p>
        )}
      </div>
    </div>
  );
}
