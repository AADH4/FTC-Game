# FTC Bot Lab

A browser-based, fan-made **FTC robotics game simulator**. Build a robot in Bot Studio, inspect your design, and play solo or two-player matches in DECODE (2025–26) or the fictional BIOBUZZ (2026–27) game scenario.

> Fan simulation only. Not affiliated with FIRST; robot inspections and game rules are simplified and are not authoritative for FTC competition.

## Run

Open `index.html` in a modern browser, or start a static server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Project layout

- `index.html` — application screens and markup
- `src/styles.css` — visual design and responsive layouts
- `src/app.js` — parts catalog, robot building, simulation, controls and persistence
- `tests/smoke.test.js` — simple source-level checks

## Controls

The app includes on-screen instructions and touch controls. Scores and robot designs are stored locally in the browser.

## Development

```bash
npm test
```

No runtime npm dependencies are required.
