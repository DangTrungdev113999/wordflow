import { useState } from 'react';
import { LogOut, MessageCircle } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import type { Scenario } from '../hooks/useRoleplay';

interface RoleplayHeaderProps {
  scenario: Scenario;
  turnCount: number;
  onEnd: () => void;
}

export function RoleplayHeader({ scenario, turnCount, onEnd }: RoleplayHeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-xl shrink-0">{scenario.icon}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {scenario.titleVi}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {scenario.userRoleVi}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MessageCircle size={14} />
            <span className="font-medium">{turnCount}/{scenario.maxTurns}</span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut size={14} />
            Kết thúc
          </button>
        </div>
      </div>

      {/* Goal reminder */}
      <div className="mt-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
        <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
          <span className="font-semibold">Mục tiêu:</span> {scenario.goalVi}
        </p>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={onEnd}
        title="End conversation?"
        description="Your progress in this roleplay session will be saved, but you won't be able to continue from where you left off."
        confirmLabel="End"
        variant="warning"
      />
    </div>
  );
}
