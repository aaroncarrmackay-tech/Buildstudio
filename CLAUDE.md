# CLAUDE.md — BuildStudio

## Project Overview

**BuildStudio** is a client-side, browser-based CAD/design tool for planning construction projects (patios, decks, garages). It includes a canvas drawing interface powered by Fabric.js and a built-in AI chat assistant ("BuildBuddy AI") with hard-coded 2026 Niagara-region cost estimates.

The entire application is a **single HTML file** (`index.html`, ~266 lines). There is no build system, no backend, no package manager, and no database.

---

## Repository Structure

```
Buildstudio/
├── index.html     # The entire application (HTML + CSS + JS)
├── README.md      # Two-line project description
└── CLAUDE.md      # This file
```

---

## Tech Stack

| Layer | Technology | Version | Source |
|-------|-----------|---------|--------|
| Canvas library | Fabric.js | 5.3.1 | CDN |
| CSS framework | Tailwind CSS | latest | CDN |
| Icons | Font Awesome | 6.6.0 | CDN |
| Font | Inter (Google Fonts) | — | CDN |
| Language | Vanilla JavaScript | ES6+ | inline |

All dependencies are loaded via CDN. There is nothing to install.

---

## Running the Application

Open `index.html` directly in a browser — no server required:

```bash
# Option A: open directly
open index.html

# Option B: serve locally (avoids any browser security restrictions)
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## Application Architecture

### Layout (index.html)

Three sections rendered as a flex layout:

```
┌─────────────────────────────────────┬──────────────┐
│ HEADER (Undo / Redo / Export PNG)               │
├──────┬──────────────────────────────┤              │
│ Tool │                              │  AI Chat     │
│ bar  │   Fabric.js Canvas (920×640) │  Panel       │
│      │                              │  (w-96)      │
├──────┴──────────────────────────────┤              │
│ Status bar (tool / grid / snap)     │              │
└─────────────────────────────────────┴──────────────┘
```

### JavaScript Structure (all inline in `<script>`)

**State variables** (top of script):
- `canvas` — Fabric.Canvas instance
- `currentTool` — active drawing tool (`select`, `pencil`, `line`, `rect`, `circle`, `text`)
- `gridSize` — 20px per cell = 1 foot
- `showGrid` — boolean toggle
- `history[]` / `historyStep` — undo/redo stack (max 30 states)
- `drawingObject` — shape being drawn (null when idle)
- `strokeColor`, `fillColor`, `strokeWidth` — default style values
- `suppressHistory` / `isLoadingHistory` — guards to prevent recursive history saves

**Key functions**:

| Function | Purpose |
|----------|---------|
| `launch()` | Entry point — called via `setTimeout(launch, 300)` on page load |
| `initCanvas()` | Creates Fabric.Canvas, attaches mouse event handlers, draws demo objects |
| `setTool(tool)` | Switches active tool, toggles Fabric drawing mode |
| `attachToolListeners()` | Binds toolbar button clicks to `setTool()` |
| `snap(v)` | Rounds a pixel value to nearest grid cell (v / 20 * 20) |
| `updateGrid()` | Redraws grid lines as a Fabric.Group sent to back |
| `toggleGrid()` | Flips `showGrid`, calls `updateGrid()` |
| `handleMouseDown/Move/Up()` | Shape creation logic for line/rect/circle/text tools |
| `saveHistory()` | Serialises canvas to JSON, pushes to history stack |
| `undo()` / `redo()` | Steps through history stack, loads JSON back onto canvas |
| `deleteSelected()` | Removes active Fabric object |
| `clearCanvas()` | Clears canvas after confirm dialog |
| `exportPNG()` | Downloads `buildstudio-YYYY-MM-DD.png` at 2× resolution |
| `addMessage(text, isUser)` | Appends a chat bubble to `#chat` |
| `showTyping()` | Shows animated typing indicator in chat |
| `parseAndDraw(text)` | Regex parses `draw NxM` commands, draws a labelled Rect on canvas |
| `getResponse(input)` | Returns hard-coded cost estimates from `knowledge` object |
| `sendMessage()` | Reads input, triggers `parseAndDraw` or `getResponse` after 550ms delay |
| `quickAction(cmd)` | Populates input and calls `sendMessage()` |
| `clearChat()` | Clears chat div after confirm dialog |

### Canvas Tools

| Tool | data-tool | Behaviour |
|------|-----------|-----------|
| Select | `select` | Default — move/resize objects |
| Pencil | `pencil` | Fabric free-drawing mode |
| Line | `line` | Click-drag to draw a line |
| Rectangle | `rect` | Click-drag to draw a rectangle |
| Circle | `circle` | Click-drag, radius = distance from origin |
| Text | `text` | Click to place editable IText label |
| Delete | — | Removes selected object |
| Clear | — | Clears entire canvas (with confirm) |

### Grid / Snap System

- Grid cell = `gridSize` px = 20 px = 1 foot (Niagara 2026 scale)
- Grid is a `fabric.Group` of `fabric.Line` objects, always sent to back
- Grid lines are excluded from history snapshots via `suppressHistory`
- All drawn shapes are snapped on `mouse:up` via `snap()`

### AI Chat ("BuildBuddy AI")

The AI panel is entirely client-side — there is **no API call**. It uses:
1. **`parseAndDraw()`** — regex `/draw\s+(\d+)[x×by](\d+)/i` draws a rectangle on canvas
2. **`knowledge` object** — key/value pairs matching keywords to cost-estimate HTML strings
3. **Default response** — prompts user to try a draw command

Hard-coded cost data (2026 Niagara region):
- Concrete patio: $12–$28/sq ft
- Paver patio: $22–$38/sq ft (12×16 ≈ $4,200–$9,700)
- Deck: $48–$95/sq ft (10×20 ≈ $9,600–$19,000)

---

## Coding Conventions

### Style

- **No framework** — plain JS, no classes, no modules, no TypeScript
- All code in a single inline `<script>` block
- Tailwind utility classes for all layout and styling
- Custom CSS limited to the `<style>` block in `<head>` (canvas shadow, tool-btn transitions, active state)
- Emerald (`#10b981` / `emerald-500/600`) is the brand accent colour
- Dark zinc palette (`zinc-900`, `zinc-950`, `zinc-800`) for all UI surfaces

### HTML Conventions

- `data-tool` attribute on toolbar buttons drives tool selection
- IDs used sparingly: `#c` (canvas), `#chat`, `#toolbar`, `#userInput`, `#current-tool`, `#grid-btn`, `#typing`
- Event handlers attached inline (`onclick=`) for header/toolbar buttons and programmatically for canvas events

### JavaScript Conventions

- Arrow functions and `const`/`let` throughout
- No semicolons on continuation lines — but semicolons end statements
- `suppressHistory` flag pattern to prevent recursive canvas event → save loops
- History stored as `canvas.toJSON()` snapshots (plain objects); grid is removed before snapshot and restored after

---

## Making Changes

### Adding a new drawing tool

1. Add a toolbar button in `#toolbar` with `data-tool="yourtool"`
2. Handle it in `handleMouseDown` (create the Fabric object)
3. Handle it in `handleMouseMove` (update dimensions)
4. Handle it in `handleMouseUp` (snap + cleanup)
5. The `attachToolListeners()` call will pick it up automatically

### Adding AI knowledge / cost data

Extend the `knowledge` object:
```javascript
const knowledge = {
    "fence cost|how much fence": "2026 fencing $35–$70/linear ft",
    // existing entries...
};
```
Keys are pipe-separated keyword patterns matched via `lower.includes(k)`.

### Changing canvas dimensions

Update both the HTML attribute and the JS constants:
```html
<canvas id="c" width="1200" height="800" ...>
```
```javascript
const CANVAS_WIDTH = 1200, CANVAS_HEIGHT = 800;
```

### Changing grid scale

`gridSize` (default `20`) controls pixels-per-foot. Changing it affects snapping, `parseAndDraw()` sizing, and grid density.

---

## No Build / No Tests

- There is no build step. Edit `index.html` and refresh the browser.
- There are no automated tests. All verification is manual in-browser.
- There is no linter or formatter configured.
- There is no `.gitignore` (no generated files to ignore).

---

## Git Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production / primary branch |
| `master` | Legacy name (maps to same history) |
| `claude/*` | AI-assisted development branches |

---

## Deployment

Drop `index.html` on any static file host (GitHub Pages, Netlify, S3, nginx, etc.). No environment variables, no server configuration, no database setup required.
