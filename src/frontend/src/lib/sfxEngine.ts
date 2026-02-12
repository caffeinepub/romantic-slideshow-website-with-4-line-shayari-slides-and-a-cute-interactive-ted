/**
 * Lightweight SFX engine using Web Audio API for interactive sound effects.
 * Lazily initializes on first playback to comply with browser autoplay policies.
 */

class SFXEngine {
  private audioContext: AudioContext | null = null;
  private initialized = false;
  private lastTapNoteIndex = -1;
  private tapNotes = [523.25, 587.33, 659.25, 698.46, 783.99]; // C5, D5, E5, F5, G5

  private ensureInitialized() {
    if (!this.initialized) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    }
  }

  private playTone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Envelope for smooth attack and release
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, now + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  /**
   * Play navigation sound (slide change)
   */
  playNavigation(enabled: boolean, volume: number) {
    if (!enabled || volume === 0) return;
    
    this.ensureInitialized();
    if (!this.audioContext) return;

    // Soft ascending tone
    this.playTone(440, 0.1, volume, 'sine');
    setTimeout(() => {
      this.playTone(554.37, 0.1, volume, 'sine');
    }, 50);
  }

  /**
   * Play tap sound with subtle variation (for heart collection)
   */
  playTap(enabled: boolean, volume: number) {
    if (!enabled || volume === 0) return;
    
    this.ensureInitialized();
    if (!this.audioContext) return;

    // Pick a note different from the last one
    let noteIndex;
    do {
      noteIndex = Math.floor(Math.random() * this.tapNotes.length);
    } while (noteIndex === this.lastTapNoteIndex && this.tapNotes.length > 1);
    
    this.lastTapNoteIndex = noteIndex;
    const frequency = this.tapNotes[noteIndex];

    // Bright, short pluck sound
    this.playTone(frequency, 0.15, volume, 'triangle');
  }

  /**
   * Play completion sound (game finished)
   */
  playCompletion(enabled: boolean, volume: number) {
    if (!enabled || volume === 0) return;
    
    this.ensureInitialized();
    if (!this.audioContext) return;

    // Triumphant ascending arpeggio
    const completionNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    completionNotes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, volume, 'triangle');
      }, i * 100);
    });
  }
}

// Singleton instance
export const sfxEngine = new SFXEngine();
