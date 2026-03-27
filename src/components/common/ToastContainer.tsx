import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '../../stores/toastStore';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const typeStyles: Record<string, string> = {
  xp: 'bg-indigo-500',
  badge: 'bg-amber-500',
  goal: 'bg-green-500',
  levelUp: 'bg-purple-500',
  info: 'bg-gray-700',
};

const typeIcons: Record<string, string> = {
  xp: '⚡',
  badge: '🏅',
  goal: '🎯',
  levelUp: '🚀',
  info: 'ℹ️',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-lg',
              typeStyles[toast.type] ?? typeStyles.info
            )}
          >
            <span className="text-xl">{toast.icon ?? typeIcons[toast.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{toast.title}</p>
              {toast.description && (
                <p className="text-xs opacity-90">{toast.description}</p>
              )}
            </div>
            <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
