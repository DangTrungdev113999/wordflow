import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft, Zap } from 'lucide-react';
import { PhrasalVerbLookup } from '../components/PhrasalVerbLookup';

export function PhrasalVerbsPage() {
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
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <Zap size={20} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Phrasal Verbs</h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Cụm động từ phổ biến: get up, look for, turn on...
            </p>
          </div>
        </div>
      </motion.div>

      {/* Legend strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-wrap gap-4 mb-5 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm">✂️</span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Separable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🔗</span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Inseparable</span>
        </div>
      </motion.div>

      {/* Lookup */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <PhrasalVerbLookup />
      </motion.div>
    </div>
  );
}
