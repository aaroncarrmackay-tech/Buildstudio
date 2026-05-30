# Content Review Rules

All emergency scenario cards in `src/data.js` are **DRAFT** until a human reviewer
has verified every claim against the listed source documents and updated the card's
`confidence` and `reviewed` fields.

---

## Review checklist for each card

- [ ] Every statement in `danger`, `first5`, `notDo`, and `callEmergency` is traceable
      to at least one entry in `sources`.
- [ ] No medical treatment instructions (diagnosis, dosage, procedure) are present.
- [ ] No electrical repair or utility instructions are present.
- [ ] No water purification chemistry is present beyond "follow official guidance."
- [ ] `trustLabels` reflect only labels from `SOURCE_TRUST_LABELS.md`.
- [ ] `readiness` is set correctly:
  - `"red"` — unreviewed or high-stakes, handle with extreme caution.
  - `"amber"` — source-matched draft, not yet independently verified.
  - `"green"` — independently reviewed by a qualified person and linked to sources.
- [ ] The `reviewed` date is updated to reflect the actual review date.
- [ ] `confidence` text accurately describes the review status.

---

## What reviewers must NOT do

- Do not mark a card `"green"` without citing a specific, retrievable source document.
- Do not remove the "Human review required" chip.
- Do not add prescriptive medical treatment steps.
- Do not add electrical or chemical instructions.
- Do not remove or weaken the `VERIFY AGAINST TRUSTED SOURCE BEFORE FIELD USE` warning
  on any card where it appears.

---

## Adding a new card

1. Copy an existing card object in `src/data.js`.
2. Set `readiness: "red"` and `readinessText: "Unreviewed"`.
3. Set `confidence: "New draft — not reviewed"`.
4. Set `reviewed: "YYYY-MM-DD"` to today's date.
5. Add `"UNVERIFIED"` to `trustLabels` until sources are confirmed.
6. Fill `sources` with real document titles and URLs before publishing.
7. Submit for human review before field deployment.

---

## Removing a card

Cards must not be removed silently. If a card is deprecated:
- Add a `deprecated: true` field and a `deprecationReason` note.
- Notify any household that has the app installed.
