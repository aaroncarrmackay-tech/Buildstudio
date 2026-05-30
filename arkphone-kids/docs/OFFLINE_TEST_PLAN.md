# Offline Test Plan

Verify that Arkphone Kids works with no network connection before relying on it in an emergency.

---

## Chrome / Android (recommended for PWA testing)

1. Open `http://localhost:3000` after running `npm start`.
2. Open DevTools → Application → Service Workers.
   - Confirm the service worker is registered and shows `Status: activated and is running`.
3. Open DevTools → Application → Cache Storage → `arkphone-v0.2.0`.
   - Confirm all files are listed: `index.html`, `src/styles.css`, `src/data.js`, `src/app.js`,
     `public/manifest.webmanifest`, `public/icons/icon-192.svg`, `public/icons/icon-512.svg`.
4. In DevTools → Network, check **Offline**.
5. Reload the page (`Cmd+Shift+R` / `Ctrl+Shift+R`).
   - The app should load normally. The network badge should show **Network offline**.
6. Verify all cards are visible and expandable.
7. Verify the supply checklist works and state persists.
8. Verify Family Mode toggle works.
9. Verify search works.
10. Uncheck **Offline** — the network badge should switch to **Network online**.

---

## On a real Android phone

1. Connect phone to the same network as the dev machine.
2. Run `npm start` and note the local IP address printed (e.g. `192.168.1.10:3000`).
3. Open `http://192.168.1.10:3000` in Chrome on the phone.
4. Wait for the install prompt to appear, or use Chrome menu → **Add to Home Screen**.
5. Enable airplane mode.
6. Open the installed app from the home screen.
7. Confirm it loads and all features work with no network.

---

## Testing the service worker update flow

1. Make a change to `CACHE_VERSION` in `sw.js` (e.g. `arkphone-v0.2.1`).
2. Also update the `PRECACHE_FILES` array if files were added or renamed.
3. Reload the page. The new SW installs in the background.
4. Close all tabs of the app and reopen — the new SW activates and the old cache is deleted.

---

## Known limitations (v0.2)

- **Icons**: SVG icons are used. Android Chrome supports SVG in manifests; Safari and some
  older browsers may not show the icon on the home screen. Generate PNG versions with
  a tool like `sharp` or `Squoosh` for production deployment.
- **iOS Safari**: Service workers and PWA install are supported on iOS 16.4+.
  On older iOS, the app works but is not installable. Users can still use
  Safari's **Add to Home Screen** to create a shortcut (no offline caching).
- **sw.js location**: The service worker is at the project root (`/sw.js`), not in
  `/public/`, because a service worker's scope cannot exceed its own path. This is
  intentional and documented behaviour — do not move it.
