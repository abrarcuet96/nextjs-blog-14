import test from "node:test";
import assert from "node:assert/strict";
import {
  escapeRegex,
  getReadingTime,
  makeExcerpt,
  normalizeTags,
  splitTagsInput,
} from "../lib/post-utils.mjs";

test("getReadingTime returns at least one minute", () => {
  assert.equal(getReadingTime(""), 1);
  assert.equal(getReadingTime("one short article"), 1);
  assert.equal(getReadingTime(`${"word ".repeat(200)}last`), 2);
});

test("makeExcerpt cleans whitespace and shortens long text", () => {
  assert.equal(makeExcerpt("  Learn   Next.js today  "), "Learn Next.js today");
  assert.equal(makeExcerpt("A useful beginner article", 10), "A useful…");
});

test("normalizeTags cleans, deduplicates, and limits tags", () => {
  assert.deepEqual(
    normalizeTags([" NextJS ", "nextjs", "MongoDB", "React", "CSS", "HTML", "Node"]),
    ["nextjs", "mongodb", "react", "css", "html"],
  );
  assert.deepEqual(splitTagsInput("NextJS, MongoDB, nextjs"), ["nextjs", "mongodb"]);
});

test("escapeRegex makes search input literal", () => {
  assert.equal(escapeRegex("next.js (blog)?"), "next\\.js \\(blog\\)\\?");
});
