import { useState, useEffect } from 'react';

const STORAGE_KEY_ENABLED = 'romantic-music-enabled';
const STORAGE_KEY_VOLUME = 'romantic-music-volume';

export function useLocalAudioSettings() {
  const [isEnabled, setIsEnabledState] = useState(false);
  const [volume, setVolumeState] = useState(0.5);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
    const savedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);

    if (savedEnabled !== null) {
      setIsEnabledState(savedEnabled === 'true');
    }

    if (savedVolume !== null) {
      setVolumeState(parseFloat(savedVolume));
    }
  }, []);

  const setIsEnabled = (enabled: boolean) => {
    setIsEnabledState(enabled);
    localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
  };

  const setVolume = (vol: number) => {
    const clampedVolume = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVolume);
    localStorage.setItem(STORAGE_KEY_VOLUME, String(clampedVolume));
  };

  return {
    isEnabled,
    volume,
    setIsEnabled,
    setVolume,
  };
}
