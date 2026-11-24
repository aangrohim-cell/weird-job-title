// make.fun entry: weirdest job title blind judge showdown.
// This program is fully deterministic: same source, same bytes, every run.
// Node 22, standard library only. No network, no randomness, no clock.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The title is assembled from small, reusable parts. Keeping each fragment
// as its own constant makes the final string easy to audit character by
// character, and makes accidental typos obvious at a glance.
const LEAD_ROLE: string = "Chief Officer";
const PREPOSITION: string = "of";
const DOMAIN: string = "Tabs";
const PRONOUN: string = "I";
const VOW: string = "Swear";
const AUXILIARY: string = "Will";
const ACTION: string = "Close";
const ADVERB: string = "Later";

// A single space is the only separator we ever need. By centralizing it we
// avoid scattering literal spaces through the assembly logic below.
const SPACE: string = " ";

// Join the fragments in the canonical order. This helper is the only place
// that decides how the pieces fit together, so the output stays stable even
// if we later reorder the constant declarations above.
function assembleTitle(parts: readonly string[]): string {
  return parts.join(SPACE);
}

// Build the ordered list of parts. Nothing mutates this list after creation,
// which guarantees that the title produced here is identical on every machine
// and every run, regardless of locale or environment.
function titleParts(): readonly string[] {
  return [
    LEAD_ROLE,
    PREPOSITION,
    DOMAIN,
    PRONOUN,
    VOW,
    PRONOUN,
    AUXILIARY,
    ACTION,
    ADVERB,
  ];
}

// Resolve the destination directory. An explicit environment variable wins;
// otherwise we fall back to the /output default expected by the judge.
function resolveOutputDir(): string {
  const fromEnv: string | undefined = process.env["MAKEFUN_OUTPUT_DIR"];
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return "/output";
}

// Entry point: create the directory (recursive, idempotent), assemble the
// title, and write exactly one trailing newline. No extra whitespace, no BOM.
function main(): void {
  const outputDir: string = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });

  const title: string = assembleTitle(titleParts());
  const lineWithNewline: string = title + "\n";
  const destination: string = join(outputDir, "entry.txt");

  // A real title with one absurdly specific promise.
  writeFileSync(destination, lineWithNewline, "utf8");
}

main();
