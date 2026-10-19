# Matter Playground — Phase 02

A full-screen, landscape-first browser material sandbox with touch-friendly controls and reactive materials.

## Play

- Live site: https://matter-playground.vercel.app
- Source: https://github.com/Drexocoder/Cricketwalatest/blob/main/index.html

## Phase 02

- Full-screen simulation canvas; no permanent sidebars or dashboard layout
- Landscape-first layout with compact floating controls and a horizontal material dock
- Touch + mouse painting, continuous strokes, pointer capture and right-click erase
- Corrected cell processing so particles do not get updated repeatedly after a swap
- 15 material slots: sand, water, stone, glass, wood, fire, powder, plant, oil, acid, lava, ice, steam, smoke and eraser
- Phase 2 interactions: acid dissolves selected solids; lava heats materials and cools into rock; fire spreads through wood/plants/oil; powder detonates in a chain blast; glass remains solid; ice melts; steam rises and can condense
- Quick experiments for rainfall, ignition and plant growth
- Pause/resume, world reset, brush size and 1×–4× simulation speed
- Compact telemetry for particle count, FPS and reactions
- Crisp opaque controls (no canvas blur), tactile 3D-style buttons, selection feedback, entrance animations, blast flash/shake and smooth UI transitions
- Respects `prefers-reduced-motion`; portrait mode offers a rotate hint but can be continued

## Controls

- Drag on the world to paint
- Tap a material in the bottom dock to select it
- Right-click to erase (desktop)
- Space: pause/resume
- Keys 1–9: quick material selection; Escape: eraser
- Brush slider: change stroke size
- Speed button: cycle 1× to 4×

## Technical notes

Single-file HTML/CSS/JavaScript; no build step, external assets, or animation library required. The renderer uses a compact cellular grid with per-cell shading and a textured ambient background. The simulation is a lightweight cellular sandbox rather than a scientific fluid-dynamics engine. Phase 2 prioritizes reliable input, more materials, a smaller interface and mobile performance.
