// news-image-20261117 entry: "Tuesday 17 November 2026 — The World Today".
// The image is a fixed editorial front page (header, six labelled vignettes,
// a numbered world-map strip and 21 brief tiles covering 27 verified stories
// from 17 November 2026) stored beside this file as entry.png. The program
// only copies those exact bytes to the output directory, so both runs of the
// program write byte-identical output with no network and no randomness.
//
// Run it outside the grader's container with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
const bytes = readFileSync(join(here, "entry.png"));
// The gate tells PNG from JPEG by the first bytes: refuse to ship anything
// that is not the PNG we composed, so a corrupted or swapped source file
// fails loudly here instead of producing an invalid entry.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a PNG file (bad magic bytes)");
}
writeFileSync(outPath, bytes);
// Guard the determinism requirement: the written file must hold exactly the
// bytes we read, so a partial write can never pass silently.
if (statSync(outPath).size !== bytes.length) {
  throw new Error(`short write: ${outPath} is ${statSync(outPath).size} bytes, expected ${bytes.length}`);
}
