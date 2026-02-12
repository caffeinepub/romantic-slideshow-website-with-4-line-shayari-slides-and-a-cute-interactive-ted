# Specification

## Summary
**Goal:** Replace the final heart-collecting ending slide with an offline, interactive 3D model experience driven by a user-entered name plus an optional drawing area.

**Planned changes:**
- Remove/disable the current heart-collecting EndingGameSlide on the final slide and render a new dedicated ending component instead.
- Add a final-slide UI that includes (1) a freehand drawing canvas for writing/drawing the name and (2) a text input + submit action that controls model selection (English UI text).
- Add an interactive 3D viewer on the final slide that supports user interaction (at minimum rotate/orbit; ideally zoom) and stays within the slide layout on mobile/desktop.
- Implement a fixed, offline, case-insensitive mapping from a small curated set of supported names (including aliases) to bundled local 3D model assets; show a friendly English message with suggestions for unsupported names.
- Integrate with the existing Sound Effects setting so key interactions (submit/model swap) optionally play SFX while preserving current background music behavior (optional, off-by-default).

**User-visible outcome:** On the final slide, the user can draw/write a name on a canvas, type the name into an input, submit it, and immediately see and interact with the corresponding 3D model; unsupported names show a helpful English prompt with suggested options, and SFX respect the existing setting.
