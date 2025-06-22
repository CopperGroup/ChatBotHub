// hooks/useSound.ts
"use client"

import { useCallback, useRef } from 'react';

/**
 * A custom hook for playing sounds.
 * @param soundPath The path to the sound file (e.g., '/sounds/notification.mp3').
 * @returns A function `playSound` that can be called to play the sound.
 */
export function useSound(soundPath: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Memoize the playSound function to prevent unnecessary re-renders
  const playSound = useCallback(() => {
    // Ensure we are in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(soundPath);
      // Optional: Set volume, preload, etc.
      // audioRef.current.volume = 0.5;
      audioRef.current.preload = 'auto'; 
    }

    // Play the sound. handle potential errors if playback is not allowed (e.g., autoplay policies)
    audioRef.current.play().catch(error => {
      console.warn("Failed to play sound:", error);
      // This often happens due to browser autoplay policies.
      // Users might need to interact with the page first.
    });
  }, [soundPath]); // Recreate playSound if soundPath changes

  // Return the function to play the sound
  return playSound;
}