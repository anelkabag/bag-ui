import assert from "node:assert/strict";
import test from "node:test";

import { summarizeStorage } from "./storage";

test("summarizeStorage groups documents and images by size", () => {
  const summary = summarizeStorage([
    { kind: "doc", sizeKb: 200 },
    { kind: "image", sizeKb: 600 },
    { kind: "pdf", sizeKb: 300 },
    { kind: "slide", sizeKb: 100 },
    { kind: "image", sizeKb: 400 },
  ]);

  assert.equal(summary.documentsKb, 600);
  assert.equal(summary.imagesKb, 1000);
  assert.equal(summary.totalKb, 1600);
});
