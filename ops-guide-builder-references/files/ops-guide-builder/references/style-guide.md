# Guide Style Standard

Edit this file once for your team's branding; every guide built with this
skill should then look the same automatically.

## Page setup

- Page size: US Letter (`{ width: 12240, height: 15840 }` DXA) — change to A4
  (default in docx-js) if your team uses A4 instead.
- Margins: 1.25in top (extra room below the header rule so the first line
  of content isn't flush against it), 1in bottom/left/right. Header
  distance 850 DXA, footer distance 720 DXA.

## Heading styles (required for the Table of Contents to work)

| Element | Word style to use |
|---|---|
| Document title (cover page) | `HeadingLevel.TITLE` |
| Major sections (Overview, Notes, Revision History) | `HeadingLevel.HEADING_1` |
| Each step | `HeadingLevel.HEADING_2`, text: `Step N: <imperative title>` |
| Sub-points within a step (rare) | `HeadingLevel.HEADING_3` |

Do not use bold/enlarged normal paragraphs as a substitute for heading
styles — the ToC field only picks up built-in heading levels.

## Fonts

- Headings AND body: **Calibri** (Word default). Geologica is the official
  Rous typeface per the brand guide, but the team decided to keep Calibri
  for now to avoid font-embedding/installation issues across machines.
  Revisit if that changes — see `assets/build_template.js`'s `run: { font:
  ... }` and `paragraphStyles` entries.

## Color usage rule

**Orange is a fill color, never a text color.** The solid brand orange
(`#f95623`) is used only for the numbered-step badge background, always
with white text on top for contrast. Headings, body text, and links are
navy or near-black. This was a deliberate correction: an earlier draft
used orange for step-title text and it read as too hard to see against
white — orange reads fine as a small block of color, not as running text.
(Callout boxes use their own softer palette — see below — not solid
brand orange.)

## Brand colors (official — Rous Brand Guidelines 2025)

Only four colors exist in the Rous palette. Nothing outside this list —
no green, no red, no traffic-light severity scheme.

| Token | Hex | Use |
|---|---|---|
| Rous Dark Blue (navy) | `#032942` | Headings, structure, table headers, the navy callout tone |
| Rous Vibrant Orange | `#f95623` | Accent, emphasis, the "one rule" callout tone, numbered-step badges |
| Rous Light Grey | `#ebe8e1` | Sunken/neutral surfaces, screenshot placeholder fill |
| Rous Slate Blue | `#3d6b96` | Secondary accent only — not required, use sparingly if at all |

## Screenshots

- Max width: 6.5in (fits inside 1in margins on Letter).
- Center each image.
- Placeholder/background fill: `#ebe8e1` (Rous Light Grey), not a generic
  gray — border `#032942` at 1pt, thin.
- No caption required by default. If the team wants captions, use
  "Figure N — <short description>" in italic, centered, directly under the
  image.
- One screenshot per step is the default — and a step is one screen, not
  one click (see "Deciding how many steps a screen needs" in SKILL.md). If
  several actions happen on the same screen, they belong in one step with
  one screenshot, annotated with multiple boxes/arrows if needed — not
  split into several near-duplicate steps. If a step genuinely needs more
  than one image (e.g. it spans a scroll, or a confirmation dialog pops
  up), stack them vertically with a small paragraph of space between,
  still under the same Step heading.

## Numbered step badge

Rous's real `NumberedStep` component pairs a small solid-orange circular
badge (white number) with the step title — not plain "Step 1:" text. The
`.docx` approximates this with a small shaded cell next to the heading
(true circles aren't practical in docx-js table cells, but the color/weight
language should still read as the same device): orange fill `#f95623`,
white bold number, next to the step title in `HeadingLevel.HEADING_2`
(navy text — see Color usage rule above; the badge itself is the only
orange in this device).

## Callout / note boxes — five tones, brand purity waived on purpose

Unlike headings/body/links (navy only, see Color usage rule), callout
boxes are explicitly allowed to use non-brand colors — green and red read
faster for their meaning than trying to force everything into navy/orange,
and that's a deliberate call, not an oversight. All five use the same
pattern: a **solid, opaque pastel fill with dark text** — not a bright/
saturated fill with white text. An earlier draft used bright colors with
white text and it was hard to read; solid-but-soft plus dark text reads
clearly and still looks intentional, not washed out or translucent.

| Tone | Label | Fill | Text | When to use |
|---|---|---|---|---|
| `tip` | **Tip:** | `#D4EDDA` (soft green) | `#155724` (dark green) | Optional shortcut or nice-to-know |
| `note` | **Note:** | White, `#032942` border | Navy | Neutral extra context |
| `caution` | **Caution:** | `#FCE4CE` (soft orange) | `#7A3B00` (dark orange) | Could cause a minor mistake if missed |
| `warning` | **Warning:** | `#F5C6CB` (soft red) | `#5C1A1F` (dark red) | Could cause real harm — data loss, wrong customer charged, irreversible action. Use sparingly |
| `help` | **Need help?** | `#D6E4ED` (soft navy tint) | `#032942` (navy) | Who to contact if stuck |

Don't overuse these — a step with three callout boxes stops reading as a
guide and starts reading as a wall of warnings. Reserve **Warning** for
things that are genuinely costly to get wrong.

## Revision history table (last page of every Guide)

4 columns, header row shaded `#032942` (Rous Dark Blue), white bold header text:

| Version | Date | Author | Change summary |
|---|---|---|---|

Column widths (DXA, must sum to table width): 1200 / 1600 / 1800 / remaining.

## Header and footer (every page)

- **Header**: small running logo (`assets/logo/rous-logo.png`, ~85×40),
  right-aligned, thin 1pt navy rule underneath.
- **Footer**: "Page X of Y" on the left (Word's live `PAGE`/`NUMPAGES`
  fields, not typed numbers, so it stays correct as content changes),
  "Version X.X" on the right — the one place version lives now; update it
  once here and it's correct on every page, rather than only on a cover
  page people might skip past.

## Cover page — merged with the Table of Contents, one page

Rous doesn't get a dedicated full-page cover with a giant logo — the logo
now lives in the header (see above), so the cover content and the Table of
Contents share a single page instead of each taking one:

1. Title (the overall guide title, e.g. "Asset Vision Administration
   Guide" — the document covers multiple processes, so this is not a
   single process name) — `HeadingLevel.TITLE`, navy `#032942`.
2. "Owning team: <team>" / "<date>" — small, centered, stacked. No version
   line here (it's in the header) and no purpose statement (that's the
   Overview section's job).
3. Table of Contents — an actual TOC field, directly below on the same
   page, no page break in between.
4. Page break after the ToC, before Overview starts.

## Screenshot annotation (boxes / arrows)

When a step says "click X" or "check the box next to Y", annotate the
screenshot so the reader doesn't have to hunt for it — draw a box around
the element, or an arrow pointing at it, using
`scripts/annotate_screenshot.py`.

- Default annotation color: `#f95623` (Rous Vibrant Orange) — matches the
  brand accent used everywhere else, so annotations read as intentional.
- Estimate the element's pixel coordinates by looking at the screenshot,
  run the script, then look at the *output* image before using it — this is
  inherently approximate, and a box on the wrong element is worse than no
  box. Adjust coordinates and rerun if it's off.
- Skip annotation when the step doesn't point at one specific element
  ("you'll land on a confirmation screen") — don't add a box just to have
  one.

## ✅ Branding — fully resolved

Colors, fonts, callout tones and logo all come from the official Rous
Brand Guidelines 2025 and the real brandmark file — nothing left as a
placeholder or a guess. Font is intentionally Calibri, not Geologica (team
decision, to avoid embedding/installation issues), not an oversight.

## QRG-specific differences

- No cover page, no ToC. Single `HeadingLevel.TITLE` at the very top instead.
- Steps are condensed: one short instruction line (not a full paragraph) per
  step, screenshot directly below, no callout boxes unless critical.
- Target 1–2 pages — if the draft runs longer, it's probably not a QRG-sized
  process; flag this back to the user rather than silently shrinking fonts.
