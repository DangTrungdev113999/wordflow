import { Link } from 'react-router';
import { KeyRound } from 'lucide-react';

export function AIKeyRequired() {
  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-4">
          <KeyRound size={28} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Cần cài đặt API Key
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Để sử dụng tính năng AI, bạn cần cài đặt API key miễn phí.
        </p>
        <Link
          to="/settings#ai"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
        >
          Cài đặt ngay
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
