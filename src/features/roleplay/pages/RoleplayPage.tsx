import { Theater } from 'lucide-react';
import { useRoleplay } from '../hooks/useRoleplay';
import { ScenarioGrid } from '../components/ScenarioGrid';
import { RoleplayHeader } from '../components/RoleplayHeader';
import { RoleplayChat } from '../components/RoleplayChat';
import { HintButton } from '../components/HintButton';
import { RoleplaySummary } from '../components/RoleplaySummary';
import { AIKeyRequired } from '../../../components/common/AIKeyRequired';
import { aiService } from '../../../services/ai/aiService';
import scenariosData from '../../../data/scenarios.json';
import type { Scenario } from '../hooks/useRoleplay';

const scenarios = scenariosData as Scenario[];

export function RoleplayPage() {
  const {
    phase,
    scenario,
    session,
    messages,
    isSending,
    error,
    turnCount,
    hintIndex,
    startScenario,
    sendMessage,
    endConversation,
    revealHint,
    goToPick,
  } = useRoleplay();

  if (!aiService.hasAnyProvider()) {
    return <AIKeyRequired />;
  }

  if (phase === 'summary' && session?.summary && scenario) {
    return (
      <RoleplaySummary
        summary={session.summary}
        scenarioTitle={scenario.titleVi}
        onNewScenario={goToPick}
      />
    );
  }

  if ((phase === 'active' || phase === 'generating-summary') && scenario) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
        <RoleplayHeader
          scenario={scenario}
          turnCount={turnCount}
          onEnd={endConversation}
        />
        <HintButton
          onReveal={revealHint}
          totalHints={scenario.suggestedPhrases.length}
          usedHints={hintIndex}
        />
        <RoleplayChat
          messages={messages}
          isSending={isSending || phase === 'generating-summary'}
          error={error}
          disabled={phase === 'generating-summary'}
          onSend={sendMessage}
        />
        {phase === 'generating-summary' && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-950/60 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Đang tạo tổng kết...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Pick phase
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
          <Theater size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Đóng vai hội thoại</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chọn kịch bản và bắt đầu luyện nói</p>
        </div>
      </div>
      <ScenarioGrid scenarios={scenarios} onSelect={startScenario} />
    </div>
  );
}
