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
  success: 'bg-green-500',
};

const typeIcons: Record<string, string> = {
  xp: '⚡',
  badge: '🏅',
  goal: '🎯',
  levelUp: '🚀',
  info: 'ℹ️',
  success: '✅',
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
            animate={
              toast.type === 'badge'
                ? { opacity: 1, x: 0, scale: [0.9, 1.08, 1] }
                : { opacity: 1, x: 0, scale: 1 }
            }
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={toast.type === 'badge' ? { duration: 0.5, ease: 'easeOut' } : undefined}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-lg',
              toast.type === 'badge' && 'ring-2 ring-amber-300/50 shadow-amber-500/25',
              typeStyles[toast.type] ?? typeStyles.info
            )}
          >
            <motion.span
              className="text-xl"
              animate={toast.type === 'badge' ? { rotate: [0, -10, 10, -5, 5, 0] } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {toast.icon ?? typeIcons[toast.type]}
            </motion.span>
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
