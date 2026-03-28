import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSpeechRecognition } from '../useSpeechRecognition';

describe('useSpeechRecognition', () => {
  const originalSR = (window as any).SpeechRecognition;
  const originalWebkitSR = (window as any).webkitSpeechRecognition;

  afterEach(() => {
    // Restore
    if (originalSR) (window as any).SpeechRecognition = originalSR;
    else delete (window as any).SpeechRecognition;
    if (originalWebkitSR) (window as any).webkitSpeechRecognition = originalWebkitSR;
    else delete (window as any).webkitSpeechRecognition;
  });

  it('isSupported = false when neither API exists', () => {
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isSupported).toBe(false);
  });

  it('isSupported = true when SpeechRecognition exists', () => {
    (window as any).SpeechRecognition = class {};
    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isSupported).toBe(true);
  });

  it('isSupported = true when webkitSpeechRecognition exists (Safari)', () => {
    delete (window as any).SpeechRecognition;
    (window as any).webkitSpeechRecognition = class {};
    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isSupported).toBe(true);
  });

  it('starts not listening with no error', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isListening).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
