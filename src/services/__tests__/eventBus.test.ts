import { describe, it, expect, vi } from 'vitest';
import { eventBus } from '../eventBus';

describe('eventBus', () => {
  it('emits and receives typed events', () => {
    const handler = vi.fn();
    eventBus.on('flashcard:correct', handler);
    eventBus.emit('flashcard:correct', { wordId: 'test:word', rating: 5 });
    expect(handler).toHaveBeenCalledWith({ wordId: 'test:word', rating: 5 });
    eventBus.off('flashcard:correct', handler);
  });

  it('wildcard listener fires on any event', () => {
    const handler = vi.fn();
    eventBus.on('*', handler);
    eventBus.emit('word:learned', { wordId: 'test:hello' });
    expect(handler).toHaveBeenCalledWith('word:learned', { wordId: 'test:hello' });
    eventBus.off('*', handler);
  });

  it('unsubscribe stops receiving events', () => {
    const handler = vi.fn();
    eventBus.on('daily_goal:met', handler);
    eventBus.off('daily_goal:met', handler);
    eventBus.emit('daily_goal:met', {});
    expect(handler).not.toHaveBeenCalled();
  });
});
