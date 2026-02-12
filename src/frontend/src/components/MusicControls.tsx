import { Volume2, VolumeX } from 'lucide-react';
import { useLocalAudioSettings } from '../hooks/useLocalAudioSettings';

export function MusicControls() {
  const { isEnabled, volume, setIsEnabled, setVolume } = useLocalAudioSettings();

  return (
    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 min-w-[200px]">
      <div className="space-y-4">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Music</span>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEnabled ? 'bg-romantic-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            role="switch"
            aria-checked={isEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Volume</span>
            <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              disabled={!isEnabled}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider-thumb"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
