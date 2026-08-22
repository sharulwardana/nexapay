'use client';

import { useCallback, useRef } from 'react';
import { triggerHaptic } from '@/lib/utils';

// Define the sound types we support
export type SoundType = 'hover' | 'click' | 'success';

export function useSoundEffect() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on first use (to bypass browser auto-play policies)
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    // Resume context if suspended
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, []);

  const playHoverSound = useCallback(() => {
    triggerHaptic('light');
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // High pitched, very short tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio interruption error
    }
  }, [initAudio]);

  const playClickSound = useCallback(() => {
    triggerHaptic('medium');
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Futuristic mechanical blip
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Ignore audio interruption error
    }
  }, [initAudio]);

  const playSuccessSound = useCallback(() => {
    triggerHaptic('success');
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      // A pleasant major chord arpeggio for success (e.g. checkout, level up)
      const playNote = (freq: number, startTime: number, duration: number) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playNote(523.25, now, 0.3);       // C5
      playNote(659.25, now + 0.1, 0.3); // E5
      playNote(783.99, now + 0.2, 0.5); // G5
    } catch {
      // Ignore audio interruption error
    }
  }, [initAudio]);

  return {
    playHover: playHoverSound,
    playClick: playClickSound,
    playSuccess: playSuccessSound,
    triggerHaptic,
  };
}

