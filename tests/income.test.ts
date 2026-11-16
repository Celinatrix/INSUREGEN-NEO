import { test } from "node:test";
import assert from "node:assert/strict";
import { readIncomeMillion } from "../src/lib/income.ts";

const million = (s: string) => {
  const r = readIncomeMillion(s);
  return r.kind === "ok" ? r.million : r.kind;
};

test("Income: dot or comma as the decimal mark both read as 281.5 million", () => {
  assert.equal(million("281.5"), 281.5);
  assert.equal(million("281,5"), 281.5);
});

test("Income: a group of three digits after the mark is a thousands separator", () => {
  assert.equal(million("1.250"), 1250);
  assert.equal(million("1,250"), 1250);
  assert.equal(million("1.250,5"), 1250.5);
  assert.equal(million("1,250.5"), 1250.5);
  assert.equal(million("12.345.678"), "tooLarge");
});

test("Income: empty, text, zero and absurd values are not used", () => {
  assert.equal(million(""), "empty");
  assert.equal(million("   "), "empty");
  assert.equal(million("abc"), "invalid");
  assert.equal(million("-50"), "invalid");
  assert.equal(million("0"), "invalid");
  assert.equal(million("1.2.3"), "invalid");
  assert.equal(million("99999999"), "tooLarge");
  assert.equal(million("100000"), 100000);
});
