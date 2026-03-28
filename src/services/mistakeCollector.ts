import { eventBus } from './eventBus';
import { useMistakeStore } from '../stores/mistakeStore';
import type { MistakeCollectedEvent } from '../models/Mistake';

let initialized = false;

export function initMistakeCollector() {
  if (initialized) return;
  initialized = true;

  eventBus.on('mistakes:collected', (event: MistakeCollectedEvent) => {
    const { addMistake } = useMistakeStore.getState();

    for (const m of event.mistakes) {
      addMistake({
        type: m.type,
        source: event.source,
        question: m.question,
        userAnswer: m.userAnswer,
        correctAnswer: m.correctAnswer,
        explanation: m.explanation,
      });
    }
  });
}
