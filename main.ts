// The Funniest Office Joke, Judged Head to Head
// One-line office joke: setup + turn, punchline lands on the last words.
// Gate (sealed scorer): /output/entry.txt, UTF-8, 1-200 chars, single line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Our printer has a personality: it jams only when the CFO walks past. IT replaced it. The new one waited three weeks, then jammed on the CFO's birthday card.";

const GATE_MIN = 1;
const GATE_MAX = 200;

// Guards aligned with the sealed gate + the judge brief.
if (LINE.length < GATE_MIN || LINE.length > GATE_MAX) {
  throw new Error(`entry length ${LINE.length} outside gate ${GATE_MIN}-${GATE_MAX}`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// Brief-aligned guards: setup names the printer, punchline closes the line.
if (!LINE.startsWith("Our printer has a personality:")) {
  throw new Error("entry must open with the printer setup");
}
if (!LINE.endsWith("on the CFO's birthday card.")) {
  throw new Error("entry must close with the birthday-card punchline");
}
if (!LINE.includes("CFO")) {
  throw new Error("entry must name the CFO");
}
// Judge-brief guard: the turn must be present — the replacement printer
// waits, then strikes at the worst possible moment (the birthday card).
if (!LINE.includes("waited three weeks")) {
  throw new Error("entry must contain the three-week wait (the turn)");
}
if (!LINE.includes("IT replaced it")) {
  throw new Error("entry must contain the IT replacement (the escalation)");
}
// Byte check: sealed gate counts UTF-8 characters; keep the entry ASCII-safe.
if (Buffer.byteLength(LINE, "utf8") > GATE_MAX) {
  throw new Error("entry exceeds 200 UTF-8 bytes");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

// Round-trip check: what was written must be byte-identical to the line.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== LINE) {
  throw new Error("round-trip mismatch: written entry differs from the line");
}

console.log(`entry ok: ${LINE.length} chars, 1 line`);
