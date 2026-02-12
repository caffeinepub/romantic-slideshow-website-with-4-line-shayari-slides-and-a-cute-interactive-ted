import { useState, useEffect } from 'react';

const STORAGE_KEY_ENABLED = 'romantic-music-enabled';
const STORAGE_KEY_VOLUME = 'romantic-music-volume';
const STORAGE_KEY_SFX_ENABLED = 'romantic-sfx-enabled';

export function useLocalAudioSettings() {
  const [isEnabled, setIsEnabledState] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [sfxEnabled, setSfxEnabledState] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
    const savedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);
    const savedSfxEnabled = localStorage.getItem(STORAGE_KEY_SFX_ENABLED);

    if (savedEnabled !== null) {
      setIsEnabledState(savedEnabled === 'true');
    }

    if (savedVolume !== null) {
      setVolumeState(parseFloat(savedVolume));
    }

    if (savedSfxEnabled !== null) {
      setSfxEnabledState(savedSfxEnabled === 'true');
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

  const setSfxEnabled = (enabled: boolean) => {
    setSfxEnabledState(enabled);
    localStorage.setItem(STORAGE_KEY_SFX_ENABLED, String(enabled));
  };

  return {
    isEnabled,
    volume,
    sfxEnabled,
    setIsEnabled,
    setVolume,
    setSfxEnabled,
  };
}
