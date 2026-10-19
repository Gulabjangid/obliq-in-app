import { run } from "node:test";
import { spec } from "node:test/reporters";
import { globSync } from "node:fs";
import os from "node:os";
import process from "node:process";

const files = globSync("tests/**/*.test.mjs");
const concurrency = Math.min(files.length, os.availableParallelism());

console.log(`[Test Runner] Total files: ${files.length}`);
console.log(`[Test Runner] Active concurrency count: ${concurrency}\n`);

const testStream = run({ files, concurrency });

testStream.compose(new spec()).pipe(process.stdout);

testStream.on("test:fail", () => {
  process.exitCode = 1;
});
