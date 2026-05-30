# Arkphone Kids v0.2

Local-first offline PWA for family emergency preparedness. Works without internet once installed.

**AI is the librarian, not the source of truth.** All cards are DRAFT until reviewed against cited sources. Follow local emergency officials and trained responders first.

---

## Quick start

**Requirements:** Node.js 18+ (only needed for the dev server — the app itself has zero runtime dependencies)

```bash
cd arkphone-kids
npm start
# Opens at http://localhost:3000
```

The first load caches everything via service worker. After that the app works offline.

---

## Running locally

```bash
npm start          # serves on port 3000
```

The app is a static site. Any static file server works — `npx serve`, `python3 -m http.server 3000`, or Apache/nginx.

> **Important:** The server must serve from the project root (not from `/public/`). The service worker (`sw.js`) lives at the root for scope reasons — see `docs/OFFLINE_TEST_PLAN.md`.

---

## Testing offline

Full instructions are in `docs/OFFLINE_TEST_PLAN.md`. Quick version:

1. Open the app in Chrome.
2. DevTools → Application → Service Workers — confirm it's active.
3. DevTools → Network → check **Offline**.
4. Reload — the app should load normally with a yellow "Network offline" badge.

---

## Installing on Android home screen

1. Open `http://localhost:3000` (or your network IP) in Chrome on Android.
2. Tap the browser menu → **Add to Home Screen** or wait for the install prompt banner.
3. Tap **Install app** in the banner.
4. The app appears on your home screen and works in offline standalone mode.

**iOS Safari (16.4+):**
1. Open the URL in Safari.
2. Tap Share → **Add to Home Screen**.
3. Service worker caching is supported on iOS 16.4+.

---

## Adding a new scenario card

1. Open `src/data.js`.
2. Copy an existing card object and append it to the `cards` array.
3. Set the required fields:

```js
{
  id: "unique-kebab-id",          // used in URLs and localStorage
  icon: "🔥",                    // single emoji
  short: "Fire",                 // ≤10 chars, shown on quick-access button
  title: "House Fire",
  keywords: "fire smoke alarm escape plan exit",
  readiness: "red",              // "red" | "amber" | "green"
  readinessText: "Unreviewed",
  trustLabels: ["UNVERIFIED"],   // see docs/SOURCE_TRUST_LABELS.md
  situation: "...",
  danger: "...",
  first5: ["...", "...", "...", "...", "..."],
  family: "...",                 // simplified wording for Family Mode
  notDo: "...",
  supplies: "...",
  callEmergency: "...",
  sources: ["Document name — URL or publisher"],
  confidence: "New draft — not reviewed",
  reviewed: "YYYY-MM-DD"
}
```

4. Follow the full checklist in `docs/CONTENT_REVIEW_RULES.md` before marking it anything other than `"red"`.
5. Update `CACHE_VERSION` in `sw.js` so cached clients receive the new data (e.g. `arkphone-v0.2.1`).

---

## Reviewing source labels

Trust labels control the coloured chips shown on each card. Labels are defined in `src/data.js` (`TRUST` object) and documented in `docs/SOURCE_TRUST_LABELS.md`.

Available labels:

| Label | Meaning |
|---|---|
| `OFFICIAL_GOVERNMENT` | Federal/provincial/municipal emergency guidance |
| `RED_CROSS_OR_MEDICAL_AUTHORITY` | Red Cross, St. John, accredited medical body |
| `FIELD_MANUAL` | Published SAR, military, or emergency services manual |
| `OPEN_SOURCE_PROJECT` | Peer-reviewed open-source project (cite repo + version) |
| `MAP_SOURCE` | Official map or GIS data source |
| `PREPPER_OR_COMMUNITY_IDEA` | Community idea — low confidence, must be co-labelled |
| `AARON_PERSONAL_NOTE` | Personal family note — must be co-labelled |
| `UNVERIFIED` | Source not yet confirmed |

---

## Project structure

```
arkphone-kids/
├── index.html                  Main app entry point
├── sw.js                       Service worker (must stay at root)
├── package.json                Dev server script
├── README.md
├── src/
│   ├── app.js                  App logic (ES module)
│   ├── styles.css              All styles
│   └── data.js                 Emergency card data and trust labels
├── public/
│   ├── manifest.webmanifest    PWA manifest
│   └── icons/
│       ├── icon-192.svg        App icon (192×192)
│       └── icon-512.svg        App icon (512×512)
└── docs/
    ├── CONTENT_REVIEW_RULES.md
    ├── SOURCE_TRUST_LABELS.md
    ├── OFFLINE_TEST_PLAN.md
    └── KIDS_SAFETY_NOTES.md
```

---

## Next steps toward PDF, ZIM, and map support

### PDF offline documents
- Add a `/pdfs/` folder and cache PDFs in the service worker `PRECACHE_FILES` list.
- Link to them from card `sources` using `<a href="/pdfs/redcross-first-aid.pdf">` so they open without network.
- Warn: PDFs can be large — test storage limits on target devices (~50 MB is safe for most phones).

### ZIM / Kiwix offline wikis
- Download a ZIM file (e.g. a first-aid or survival subset from Kiwix.org) and serve it with the [Kiwix JavaScript library](https://github.com/kiwix/kiwix-js).
- This is a significant scope increase — consider a separate sibling app or iframe integration.

### Offline maps
- Use [Leaflet.js](https://leafletjs.com/) with a tile pre-cacher, or embed a pre-rendered static map as an image.
- For full offline vector maps, evaluate [MapLibre GL JS](https://maplibre.org/) with a locally hosted PMTiles file.
- Emergency-relevant layers: hospitals, evacuation routes, emergency shelters.

### PNG icons for production
- Generate `icon-192.png` and `icon-512.png` from the SVG files using `sharp` or Squoosh.
- Add them to the manifest alongside the SVG entries for maximum device compatibility.

---

## Safety and disclaimer

This app is a family tool, not a substitute for:
- 911 or local emergency services
- Trained first responders
- Official emergency management guidance
- First-aid or CPR training

All cards are drafts. Human review against listed source documents is required before field use.
