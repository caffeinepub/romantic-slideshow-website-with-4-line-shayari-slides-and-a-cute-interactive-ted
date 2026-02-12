/**
 * Client-side text-to-speech helper using Web Speech API
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, options?: { pitch?: number; rate?: number; volume?: number }) {
  // Feature detection
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Apply options
  utterance.pitch = options?.pitch ?? 1.2; // Slightly higher pitch for cute teddy voice
  utterance.rate = options?.rate ?? 1.0;
  utterance.volume = options?.volume ?? 0.8;

  // Store reference
  currentUtterance = utterance;

  // Speak
  try {
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Speech synthesis error:', error);
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}
