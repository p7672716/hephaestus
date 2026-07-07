# Hephaestus UI Consistency Guide

Use this before adding or changing UI.

## Source Of Truth

- Local style: `references/Hephaestus UI Design System & Coding Ins.txt`.
- Visual reference only: `references/hephaestus_ai_studio.tsx`.
- Google reference: Material 3 guidelines for motion, contrast, adaptive layout, and design tokens.
  - https://m3.material.io/styles/motion/overview/how-it-works
  - https://m3.material.io/foundations/designing/color-contrast
  - https://m3.material.io/develop/web
- Do not add `@material/web` as a dependency for now. It is useful as a reference, but the official repo states Material Web is in maintenance mode.
  - https://github.com/material-components/material-web
  - https://github.com/material-components/material-web/discussions/5642

## Layout Rules

- New list/detail UI should first match an existing surface:
  - Chat sidebar rows: `.session-item`, `.session-select`, `.session-delete`.
  - Coding project rows should visually match Chat rows before adding project-specific behavior.
  - Chat-like detail panes should use the same header/list/composer rhythm as `.conversation-panel`.
  - Notebook surfaces should keep the three-zone rhythm: note-folder accordion with chat sessions, source-grounded chat, note-scoped source list.
- Floating UI such as link pickers and modal flows must be appended outside animated/overflow containers. Use body-level fixed overlays so accordion/sidebar animation cannot clip them.
- Mobile must be checked at 390px. Passing desktop screenshots is not enough.

## Motion Rules

- Use existing motion tokens in `styles.css`: `--motion-fast`, `--motion-standard`, `--motion-panel`, `--motion-ease-standard`.
- State changes should be class-driven CSS transitions, like sidebar collapse.
- Keep motion quiet: opacity/transform for page/session/flow transitions; width/max-height only for structural panels such as sidebar and accordion.
- Always keep the `prefers-reduced-motion` block working.

## Interaction Rules

- Icon-only buttons need `aria-label`.
- Dynamic inputs/textareas need `aria-label`; placeholders are not labels.
- Focus must be visible but quiet: use subtle background and `box-shadow: inset 0 0 0 1px var(--accent-border)`, not thick outlines.
- Destructive actions should use the existing delete icon placement and sizing before adding new affordances.

## Verification

Run the smallest useful checks after UI edits:

```powershell
node --check app.js
```

For visual checks, run a local server and inspect:

- Desktop: Dashboard, Chat, Coding in light mode.
- Dark mode: at least the changed view.
- Mobile: 390px width, no horizontal overflow.
- Interaction: open/close accordion, modal/flow, composer `+` menu, tab/session transitions.

## Google/Material Notes

- Material 3 is most useful here as a reference for principled motion, accessible contrast, adaptive layout, and design tokens.
- Hephaestus should not copy Material shapes or Roboto typography; keep the existing editorial serif/sans pairing and low-border surfaces.
- Material Web repo can inform accessible component behavior, but do not depend on it unless the project later accepts a component library.
