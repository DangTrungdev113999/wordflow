import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft, Clock } from 'lucide-react';
import { TenseOverview } from '../components/TenseOverview';

export function TenseOverviewPage() {
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
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center">
            <Clock size={20} className="text-cyan-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tense Overview</h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tổng quan 9 thì — Past, Present, Future
            </p>
          </div>
        </div>
      </motion.div>

      {/* Instruction */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-gray-700 dark:text-gray-300 mb-4"
      >
        Nhấn vào mỗi thì để xem cấu trúc, cách dùng và ví dụ.
      </motion.p>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <TenseOverview />
      </motion.div>
    </div>
  );
}
