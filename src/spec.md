# Specification

## Summary
**Goal:** Replace the final Teddy mini-game with a new, beautiful romantic-themed interactive ending mini-game as the last slide.

**Planned changes:**
- Remove the Teddy mini-game experience from the final slide so teddy artwork/interactions are no longer shown.
- Create a new dedicated React component for the ending mini-game with English on-screen instructions, interactive visual feedback, simple progression, and a clear end state with replay/reset.
- Update `frontend/src/components/Slideshow.tsx` to render the new ending-game component as the last slide in place of `TeddyGameSlide`, keeping slide navigation, indicator, swipe behavior, and music controls unchanged.

**User-visible outcome:** The last slide now presents a new polished, romantic interactive mini-game (desktop and mobile friendly) with English instructions, visible interaction feedback, progression, and a completion moment with a replay/reset option.
