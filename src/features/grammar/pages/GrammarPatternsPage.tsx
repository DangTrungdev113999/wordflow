import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft, Braces } from 'lucide-react';
import { GrammarPatterns } from '../components/GrammarPatterns';

export function GrammarPatternsPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mb-6"
      >
        <Link
          to="/grammar/reference"
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/30 flex items-center justify-center">
            <Braces size={20} className="text-fuchsia-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Grammar Patterns</h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Mẫu câu: suggest + V-ing, used to + V, too...to...
            </p>
          </div>
        </div>
      </motion.div>

      {/* Legend strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-wrap gap-2 mb-5 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800"
      >
        <LegendDot color="bg-blue-500" label="A2 — Elementary" />
        <LegendDot color="bg-amber-500" label="B1 — Intermediate" />
        <LegendDot color="bg-rose-500" label="B2 — Upper-Intermediate" />
      </motion.div>

      {/* Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <GrammarPatterns />
      </motion.div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );
}
