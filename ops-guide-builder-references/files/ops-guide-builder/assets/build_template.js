const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  TableOfContents, PageBreak, VerticalAlign, ImageRun,
  Header, Footer, PageNumber, TabStopType, TabStopPosition
} = require("docx");

const LETTER = { width: 12240, height: 15840 }; // US Letter, DXA

// Official Rous Brand Guidelines 2025
const NAVY = "032942";
const ORANGE = "F95623";
const LIGHT_GREY = "EBE8E1";
const SLATE_BLUE = "3D6B96";
const WHITE = "FFFFFF";

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: WHITE },
  bottom: { style: BorderStyle.NONE, size: 0, color: WHITE },
  left: { style: BorderStyle.NONE, size: 0, color: WHITE },
  right: { style: BorderStyle.NONE, size: 0, color: WHITE },
};

function placeholder(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after: 200 },
    children: [
      new TextRun({
        text,
        italics: true,
        color: "808080",
        size: opts.size || 22,
      }),
    ],
  });
}

function screenshotBox() {
  // Bordered, shaded placeholder box standing in for an embedded screenshot.
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, // 6.5in
    columnWidths: [9360],
    rows: [
      new TableRow({
        height: { value: 2400, rule: "atLeast" },
        children: [
          new TableCell({
            width: { size: 9360, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: LIGHT_GREY },
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: NAVY },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY },
              left: { style: BorderStyle.SINGLE, size: 6, color: NAVY },
              right: { style: BorderStyle.SINGLE, size: 6, color: NAVY },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "[Insert screenshot here]",
                    italics: true,
                    color: "595959",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Five tones — brand purity is deliberately waived here per explicit
// instruction: green/red/orange are fine for callouts even though they're
// not in the official Rous palette. Each has a bold label since color
// alone no longer carries the meaning consistently.
function calloutBox(tone, label, text) {
  const cfg = {
    tip: { fill: "D4EDDA", textColor: "155724" }, // solid soft green, dark text
    note: { fill: WHITE, textColor: NAVY, border: NAVY }, // outline, already solid
    caution: { fill: "FCE4CE", textColor: "7A3B00" }, // solid soft orange, dark text
    warning: { fill: "F5C6CB", textColor: "5C1A1F" }, // solid soft red, dark text
    help: { fill: "D6E4ED", textColor: NAVY }, // solid soft navy tint, dark text
  }[tone];
  const borders = cfg.border
    ? {
        top: { style: BorderStyle.SINGLE, size: 6, color: cfg.border },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: cfg.border },
        left: { style: BorderStyle.SINGLE, size: 6, color: cfg.border },
        right: { style: BorderStyle.SINGLE, size: 6, color: cfg.border },
      }
    : NO_BORDERS;
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9360, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: cfg.fill },
            borders,
            margins: { top: 100, bottom: 100, left: 150, right: 150 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: label + " ", bold: true, color: cfg.textColor }),
                  new TextRun({ text, color: cfg.textColor }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Small solid-orange numbered badge next to the step title — the closest
// docx-js approximation of Rous's real circular NumberedStep device.
function stepHeading(n, title) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [500, 8860],
    borders: {
      ...NO_BORDERS,
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: WHITE },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: WHITE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 500, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: ORANGE },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: String(n), bold: true, color: WHITE }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 8860, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            margins: { left: 150 },
            children: [
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [new TextRun({ text: title })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function revisionHistoryTable() {
  const header = ["Version", "Date", "Author", "Change summary"];
  const widths = [1200, 1600, 1800, 4760]; // sums to 9360 (6.5in)
  const headerRow = new TableRow({
    tableHeader: true,
    children: header.map(
      (h, i) =>
        new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: NAVY },
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, color: WHITE })],
            }),
          ],
        })
    ),
  });
  const exampleRow = new TableRow({
    children: ["1.0", "[Date]", "[Author]", "Initial version"].map(
      (v, i) =>
        new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          children: [new Paragraph({ text: v })],
        })
    ),
  });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, exampleRow],
  });
}

function pageHeader() {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 6 },
        },
        children: [
          new ImageRun({
            data: require("fs").readFileSync(require("path").join(__dirname, "logo", "rous-logo.png")),
            type: "png",
            transformation: { width: 85, height: 40 }, // small running logo
          }),
        ],
      }),
    ],
  });
}

function pageFooter() {
  return new Footer({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: "Page ", size: 18, color: "595959" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "595959" }),
          new TextRun({ text: " of ", size: 18, color: "595959" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "595959" }),
          new TextRun({ text: "\t" }),
          new TextRun({ text: "Version 1.0", size: 18, color: "595959" }),
        ],
      }),
    ],
  });
}

const doc = new Document({
  styles: {
    default: {
      document: {
        // NOTE: Geologica is the official Rous typeface (Google Fonts), but
        // Word can't load it from a CDN. This falls back to Calibri so the
        // file works everywhere until the team decides whether to embed
        // Geologica in the .docx or require local install — see the
        // "Word caveat" note in references/style-guide.md before shipping.
        run: { font: "Calibri", size: 22 }, // 11pt body
      },
    },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        next: "Normal",
        run: { font: "Calibri", size: 56, bold: true, color: NAVY },
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        run: { font: "Calibri", size: 32, bold: true, color: NAVY },
        paragraph: { spacing: { before: 240, after: 120 } },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        // Navy, not orange — orange is reserved for callout boxes/badges
        // (fills), never for readable body/heading text.
        run: { font: "Calibri", size: 26, bold: true, color: NAVY },
        paragraph: { spacing: { before: 120, after: 80 } },
      },
    ],
    characterStyles: [
      {
        id: "Hyperlink",
        name: "Hyperlink",
        basedOn: "DefaultParagraphFont",
        run: { color: NAVY, underline: {} },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: LETTER,
          margin: { top: 1800, bottom: 1440, left: 1440, right: 1440, header: 850, footer: 720 },
        },
      },
      headers: { default: pageHeader() },
      footers: { default: pageFooter() },
      children: [
        // ---- Cover + Table of Contents, one page ----
        new Paragraph({
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [new TextRun({ text: "[Guide Title — e.g. Asset Vision Administration Guide]" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Owning team: [Team Name]" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: "[Date]" })],
        }),

        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Table of Contents" })],
        }),
        new TableOfContents("Table of Contents", {
          hyperlink: true,
          headingStyleRange: "1-2",
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- Overview ----
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Overview" })],
        }),
        placeholder(
          "[2–4 sentences: what this document covers as a whole (the system or area — not one process), who it's for.]"
        ),

        // ---- Process 1 ----
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400 },
          children: [new TextRun({ text: "[Process 1 Name — e.g. Creating a New Asset Record]" })],
        }),

        stepHeading(1, "[Imperative action title]"),
        placeholder("[Instruction text for this step goes here.]"),
        screenshotBox(),
        new Paragraph({ spacing: { before: 150, after: 150 }, text: "" }),
        calloutBox("tip", "Tip:", "[Optional shortcut or nice-to-know.]"),

        new Paragraph({ spacing: { before: 300 }, text: "" }),
        stepHeading(2, "[Imperative action title]"),
        placeholder("[Instruction text for this step goes here.]"),
        screenshotBox(),
        new Paragraph({ spacing: { before: 150, after: 150 }, text: "" }),
        calloutBox("note", "Note:", "[Neutral extra context for this step.]"),

        // ---- Process 2 ----
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400 },
          children: [new TextRun({ text: "[Process 2 Name — e.g. Deactivating an Asset]" })],
        }),

        stepHeading(1, "[Imperative action title]"),
        placeholder("[Instruction text for this step goes here.]"),
        screenshotBox(),
        new Paragraph({ spacing: { before: 150, after: 150 }, text: "" }),
        calloutBox("caution", "Caution:", "[Could cause a minor mistake if missed.]"),

        new Paragraph({ spacing: { before: 300 }, text: "" }),
        stepHeading(2, "[Imperative action title]"),
        placeholder("[Instruction text for this step goes here.]"),
        screenshotBox(),
        new Paragraph({ spacing: { before: 150, after: 150 }, text: "" }),
        calloutBox("warning", "Warning:", "[Could cause real harm — data loss, wrong customer charged, irreversible action. Use sparingly.]"),

        // Add further "[Process N Name]" Heading 1 sections here, following
        // the same pattern, for every additional process this guide covers.

        // ---- Notes / Exceptions ----
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400 },
          children: [new TextRun({ text: "Notes / Exceptions" })],
        }),
        placeholder(
          "[Edge cases. Delete this section if not needed.]"
        ),
        calloutBox("help", "Need help?", "[Who to contact if stuck — team name, email, or channel.]"),

        // ---- Revision History ----
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400 },
          children: [new TextRun({ text: "Revision History" })],
        }),
        revisionHistoryTable(),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  require("fs").writeFileSync("Guide_Template.docx", buffer);
  console.log("done");
});
