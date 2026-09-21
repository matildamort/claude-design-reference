---
name: ops-guide-builder
description: "Builds standardized, professional Word (.docx) process guides and QRGs from raw screenshots plus typed or dictated step-by-step instructions. This is the team's replacement for Scribe. Always use this skill — instead of writing an ad-hoc Word doc — whenever someone asks to create a new step-by-step guide, SOP, process doc, or QRG; convert or reformat an existing Scribe export into Word; or dictates a process as 'step one, do this; step two, do this' alongside screenshots. Trigger on words like 'guide', 'SOP', 'QRG', 'process doc', 'how-to', 'instructions', 'walkthrough', or 'convert this Scribe', even if the user doesn't explicitly say 'use the guide skill'. Following this skill keeps every guide the team produces in the same format."
---

# Ops Guide Builder

Turns screenshots + step narration (typed or dictated) into a standardized Word
document, replacing Scribe. Produces two document types — pick one per request
(ask if unclear):

| Type | For | Key traits |
|---|---|---|
| **Guide** | Bigger/complex, ops-focused processes (e.g. "how to submit leave", finance workflows, anything cross-team or multi-system) | Cover page, Table of Contents, full step detail, notes/exceptions section, revision history |
| **QRG** (Quick Reference Guide) | End-user, single-task lookups | No cover page, no ToC, condensed steps, larger screenshots, fits on 1–2 pages |

This skill always produces the **Guide** structure unless the user says "QRG" /
"quick reference" / "end user" or the process is clearly a single simple task.

This skill depends on the **docx** skill for the actual file mechanics
(docx-js gotchas, TOC requirements, image embedding, PDF verification). Read
that skill's SKILL.md before writing the generation script — do not duplicate
its gotchas here, just follow them.

## 1. Gather inputs

You need, in any order/combination:

- **Guide title** — the overall document title (the system/area it covers,
  e.g. "Asset Vision Administration Guide"), and which team owns it.
- **One or more processes** within that guide, each with its own name
  (e.g. "Creating a New Asset Record", "Deactivating an Asset"). A guide
  covering only one process today can still grow more processes later
  without restructuring — that's why processes are their own heading level
  rather than folded into the title.
- **Steps** per process: either typed text, a Scribe export's step text, or
  dictated narration ("step one, click X; step two, ..."). Split dictated
  narration into discrete steps at each "step N" marker — clean up filler
  words (um, uh, repeated words) the way you would for any dictated content.
  If the user dictates multiple processes back to back ("...that's process
  one. Second process is...") split them at that boundary rather than
  treating it as one long step list.
- **Screenshots**: one or more image files per process.

**Matching images to steps** — the team drops all screenshots for a guide
into one folder/repository as-is; they are generally **not** pre-renamed
"step1.png", "step2.png", etc. Don't assume filename order tells you
anything. Instead:

1. If the user explicitly maps them ("this one's step 1, this one's step
   2..." or points at specific files), use that mapping.
2. If a Scribe export is provided, its own step/image pairing is already
   correct — preserve it rather than re-inferring.
3. Otherwise, look at each screenshot's actual content (what screen, what
   field, what state) and match it to the step whose instruction text
   describes that same screen/action.
4. **If you're unsure which screenshot goes with which step, ask** rather
   than guessing — a silently wrong image-step pairing is worse than a
   clarifying question, and with unordered filenames you have no fallback
   signal to fall back on if content-matching doesn't give you a confident
   answer.

**Deciding how many steps a screen needs** — a step is one *screen/view*
the user sees, not one click. If several actions happen on the same
screen with no navigation in between (e.g., fill in a field, tick a box,
then click Next — all visible at once), that's **one step**, not three:
- Write the actions as a short numbered or bulleted list inside that
  step's instruction text.
- Use a single screenshot of that screen — don't take a screenshot per
  micro-action.
- If the screenshot needs to point at more than one of those elements,
  `scripts/annotate_screenshot.py` takes a list of boxes/arrows in one
  call, so mark all of them on the one image rather than generating
  several near-identical screenshots of the same screen.

Only start a new step when the user navigates to a genuinely different
screen or state. If you're given screenshots that already show this kind
of over-splitting (a separate image for every click on one screen), merge
them back into a single step rather than preserving the 1:1 mapping.

## 2. Document structure (Guide)

A Guide is now a **multi-process document** — one guide per system/area
(e.g. "Asset Vision Administration Guide"), containing several processes
inside it, not one guide per process. Build in this exact order. Use
built-in Word heading styles throughout (see `references/style-guide.md`
for the exact style/level mapping) so the Table of Contents field works.

1. **Cover + Table of Contents, one page** — title (the guide's overall
   title, e.g. "Asset Vision Administration Guide" — NOT a single process
   name), owning team, date, then the ToC directly below with no page
   break in between. No purpose statement here — that lives in the
   Overview section instead. The logo and version number are NOT on this
   page — they're in the running header (see step 2 below), so don't
   duplicate them here.
2. **Header and footer, every page**: small logo (right-aligned) in the
   header; "Page X of Y" (left) and "Version X.X" (right) in the footer —
   this is the one place version lives, update it once and it's correct
   everywhere. See `references/style-guide.md` for exact layout.
3. **Overview** — 2–4 sentences: what this document covers as a whole
   (the system/area, not one process), who it's for.
4. **One section per process** — `Heading 1`: the process name (e.g.
   "Creating a New Asset Record"). Everything about that process — its
   steps, its own screenshots and callouts — nests under this heading.
   Repeat this whole block for every process the document covers:
   - Each step inside the process gets a numbered orange badge (via
     `stepHeading()` in `assets/build_template.js`) paired with a
     `Heading 2` title — just the title, no "Step N:" text prefix, since
     the badge already carries the number. Then the instruction text as a
     normal paragraph, then the matched screenshot directly below. See
     `references/style-guide.md` for image sizing/border conventions and
     callout box formatting.
5. **Notes / Exceptions** (only if the user gave you any — don't invent this
   section) — document-level, after all processes, not repeated per process
   unless a specific process needs its own caveat (in which case keep that
   inside the process section as a callout box instead).
6. **Revision history** table, last page: columns Version | Date | Author |
   Change summary. Start at "1.0 | <today> | <owner> | Initial version".

For a **QRG**: unchanged — QRGs are still single-process, single-task
lookups. Skip the cover page and ToC, keep only a single `Heading 1` title
at the top, condense each step to one short line + screenshot, and target
1–2 pages total.

## 3. Annotate screenshots (before embedding, where it helps)

See `references/style-guide.md` for the full detail. When a step points at
a specific button/field/checkbox, draw a box or arrow at it with
`scripts/annotate_screenshot.py` so the reader doesn't have to hunt for it.
Look at the annotated output before using it — coordinates are estimated
visually and can land wrong.

## 4. Placeholders — none left

Colors, font, and logo are all resolved against the official Rous Brand
Guidelines 2025 — see `references/style-guide.md`. Nothing in the visual
design is a guess anymore. The only per-document fill-ins are content:
guide title, owning team, process names, steps, and screenshots.

## 5. Build, verify, deliver

1. Start from `assets/build_template.js` — copy it, then swap in the real
   process name, step count, step text/titles, and real screenshot files
   (replace each `screenshotBox()` placeholder with a real `ImageRun`, per
   the **docx** skill's `ImageRun` gotcha). Don't write the structure from
   scratch each time; edit the copy.
2. Render to PDF and then to JPGs per the docx skill's verification step, and
   actually look at the pages before delivering — check images landed under
   the right step. (The ToC field itself will render blank in the JPG
   preview — that's expected; LibreOffice's headless converter doesn't
   recalculate field content. It populates correctly the first time the
   real user opens the file in Word.)
3. Filename: `<GuideTitle>_v1.docx` (or `<ProcessName>_QRG_v1.docx` for a
   single-process QRG).
4. Present the file to the user; don't just describe it.

## Reference files

- `references/style-guide.md` — exact heading levels, fonts, image and table
  formatting standard. Read this before generating so every guide matches.
- `assets/Guide_Template.docx` — the reference template itself, built to
  the official Rous Brand Guidelines 2025: navy text throughout (headings,
  body, links) with solid brand orange reserved for the numbered-step
  badges only, five callout tones — tip/note/caution/warning/help — each a
  solid opaque pastel fill with dark text (not bright colors with white
  text; readability was a specific fix), running header (logo,
  right-aligned) and footer (page X of Y left, version right) on every
  page, cover page merged with the Table of Contents, the real ROUS logo,
  and Calibri (a deliberate choice, not a placeholder). This is the file
  the git repo should hold as the standing reference.
- `assets/logo/rous-logo.png`, `assets/logo/rous-logo.svg` — the official
  brandmark. PNG is what's embedded in the Word doc; SVG is there for any
  web/HTML use. Navy-on-white only — swap to the reversed-white variant
  (brand guide's Brandmark section) if a cover page ever uses a coloured
  background.
- `assets/build_template.js` — the docx-js script that generates
  `Guide_Template.docx`. Copy this per real guide rather than the .docx
  itself, since editing docx-js source is far more reliable than editing
  Word XML by hand.
- `scripts/annotate_screenshot.py` — draws a highlight box and/or arrow on
  an image at given pixel coordinates. Run before embedding a screenshot
  where the step points at a specific UI element.

**Before this skill is finalized for the team:** `references/style-guide.md`
has an unresolved branding question at the bottom — every color in the
template right now is a placeholder, not the team's real brand palette, and
it's not yet confirmed whether an external design-system pipeline re-themes
the doc after generation. Resolve that before treating this as final.
