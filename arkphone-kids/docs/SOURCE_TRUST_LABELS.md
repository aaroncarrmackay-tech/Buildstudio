# Source Trust Labels

These are the only trust labels permitted on Arkphone cards.
They are defined in `src/data.js` under `TRUST` and rendered as colour-coded chips.

---

| Label | Chip colour | When to use |
|---|---|---|
| `OFFICIAL_GOVERNMENT` | Blue | Federal, provincial, or municipal government emergency guidance documents. |
| `RED_CROSS_OR_MEDICAL_AUTHORITY` | Red | Red Cross, St. John Ambulance, or an accredited medical body. |
| `FIELD_MANUAL` | Green | Published field manuals from search-and-rescue, military, or emergency services organisations. |
| `OPEN_SOURCE_PROJECT` | Purple | Peer-reviewed open-source survival or safety projects (cite the repo and version). |
| `MAP_SOURCE` | Cyan | Official map or geographic data sources (OpenStreetMap, government GIS, etc.). |
| `PREPPER_OR_COMMUNITY_IDEA` | Amber | Community or prepper-forum ideas. Treat as low-confidence; pair with a higher-trust label or omit. |
| `AARON_PERSONAL_NOTE` | Orange | Personal observation or family-specific note by the app owner. Always pair with a higher-trust label. |
| `UNVERIFIED` | Yellow | Source not yet confirmed. All new cards must carry this until reviewed. |

---

## Rules

- A card **must** have at least one trust label.
- A card **should** have `UNVERIFIED` removed only after the source is confirmed and cited by URL or document title.
- `PREPPER_OR_COMMUNITY_IDEA` and `AARON_PERSONAL_NOTE` must never appear alone — they require a co-label from a higher-trust category.
- Do not invent new label names; add them here first and update `TRUST` in `src/data.js`.
