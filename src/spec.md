# Specification

## Summary
**Goal:** Add optional, user-gesture-triggered interactive sound effects that respond to navigation and ending mini-game interactions, without changing existing background music behavior.

**Planned changes:**
- Add a client-side sound effects (SFX) system that plays short sounds on user interactions (Next/Previous navigation and ending mini-game taps) and never auto-plays without a user gesture.
- Extend the existing Music controls to include a separate English-labeled toggle for “Sound Effects” that is off by default and persists via localStorage.
- Make EndingGameSlide SFX responsive and progressive: subtle variation on each valid tap and a distinct one-time completion sound when the goal is reached, with no further SFX after completion until “Play Again”.

**User-visible outcome:** Users can enable “Sound Effects” to hear responsive interaction sounds during navigation and the ending mini-game, while background music, its toggle, and volume control continue to work as before.
