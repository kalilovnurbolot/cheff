// Shared formatting helpers for dissertation DOCX generation
const {
  Paragraph, TextRun, AlignmentType, UnderlineType,
  PageBreak, Table, TableRow, TableCell, WidthType,
  BorderStyle, Footer, PageNumber, LineRuleType
} = require("docx");

// A4 page settings (twips: 1mm = 56.7 twips)
const PAGE = {
  size: { width: 11906, height: 16838 },
  margin: { top: 1134, right: 567, bottom: 1134, left: 1701 }
};

// Standard paragraph style
const SPACING = { after: 0, before: 0, line: 360, lineRule: LineRuleType.AUTO };
const INDENT  = { firstLine: 709 }; // 1.25cm
const FONT    = "Times New Roman";
const SZ      = 28; // 14pt = 28 half-points
const SZ_SM   = 22; // 11pt for code
const SZ_TBL  = 24; // 12pt for tables

// ─── helpers ────────────────────────────────────────────────────────────────

function run(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: SZ, ...opts });
}

/** Chapter title — centred, bold, starts on new page */
function chapterTitle(text) {
  return new Paragraph({
    pageBreakBefore: true,
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 480, line: 360, lineRule: LineRuleType.AUTO },
    children: [run(text, { bold: true, size: 28 })]
  });
}

/** Section heading 2 — left, bold */
function h2(text) {
  return new Paragraph({
    spacing: { before: 360, after: 240, line: 360, lineRule: LineRuleType.AUTO },
    children: [run(text, { bold: true })]
  });
}

/** Section heading 3 — left, bold underline */
function h3(text) {
  return new Paragraph({
    spacing: { before: 280, after: 160, line: 360, lineRule: LineRuleType.AUTO },
    children: [run(text, { bold: true, underline: { type: UnderlineType.SINGLE } })]
  });
}

/** Body paragraph — justified, first-line indent 1.25 cm */
function p(text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: SPACING,
    indent: INDENT,
    children: [run(text)]
  });
}

/** Body with mixed runs: array of {text, bold?, italic?} */
function pm(runs) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: SPACING,
    indent: INDENT,
    children: runs.map(r => run(r.text, { bold: r.bold, italic: r.italic }))
  });
}

/** Bullet item */
function li(text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 80, before: 0, line: 360, lineRule: LineRuleType.AUTO },
    indent: { left: 709 },
    children: [run(`— ${text}`)]
  });
}

/** Numbered list item */
function ni(n, text) {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    spacing: { after: 100, before: 0, line: 360, lineRule: LineRuleType.AUTO },
    indent: { left: 709, hanging: 355 },
    children: [run(`${n}. ${text}`)]
  });
}

/** Monospace code line */
function code(text) {
  return new Paragraph({
    spacing: { after: 40, before: 0, line: 280, lineRule: LineRuleType.AUTO },
    indent: { left: 709 },
    children: [new TextRun({ text, font: "Courier New", size: SZ_SM })]
  });
}

/** Blank line gap */
function gap(n = 1) {
  return Array.from({ length: n }, () =>
    new Paragraph({ spacing: { after: 0, before: 0, line: 360, lineRule: LineRuleType.AUTO }, children: [] })
  );
}

/** Centred label (figure/table caption) */
function label(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120, line: 360, lineRule: LineRuleType.AUTO },
    children: [run(text, { bold: true })]
  });
}

const borderStyle = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const cellBorders = { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle };

function tc(text, bold = false, shade = false) {
  return new TableCell({
    borders: cellBorders,
    shading: shade ? { fill: "D9D9D9" } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 0, line: 280, lineRule: LineRuleType.AUTO },
      children: [new TextRun({ text, bold, font: FONT, size: SZ_TBL })]
    })]
  });
}

function tcLeft(text, bold = false) {
  return new TableCell({
    borders: cellBorders,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.BOTH,
      spacing: { after: 0, line: 280, lineRule: LineRuleType.AUTO },
      children: [new TextRun({ text, bold, font: FONT, size: SZ_TBL })]
    })]
  });
}

function trow(cells) { return new TableRow({ children: cells }); }

function tableNote(text) {
  return new Paragraph({
    spacing: { before: 80, after: 200, line: 320, lineRule: LineRuleType.AUTO },
    children: [run(`Эскертүү: ${text}`, { italic: true, size: 24 })]
  });
}

/** Default footer with page number right-aligned */
function makeFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: SZ })
        ]
      })
    ]
  });
}

module.exports = {
  PAGE, SPACING, INDENT, FONT, SZ, SZ_SM, SZ_TBL,
  run, chapterTitle, h2, h3, p, pm, li, ni, code, gap, label,
  tc, tcLeft, trow, tableNote, makeFooter,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  Paragraph, TextRun, PageBreak, Footer, LineRuleType
};
