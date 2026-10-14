import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeState,
  selectVilla,
  createBrief,
  MAX_NOTES_LENGTH,
} from "../src/state.js";

test("invalid saved selections cannot break rendering or leak into a brief", () => {
  for (const input of [
    null,
    "bad data",
    {},
    { villa: "__proto__", style: "Unavailable", finish: "other", notes: 42 },
  ]) {
    assert.deepEqual(normalizeState(input), {
      villa: "shelter",
      finish: "warm",
      style: null,
      notes: "",
    });
  }
  assert.equal(
    normalizeState({ villa: "shelter", style: "Luxury" }).style,
    null,
  );
  assert.equal(
    normalizeState({ notes: "x".repeat(5000) }).notes.length,
    MAX_NOTES_LENGTH,
  );
});

test("reselecting the current architecture preserves the chosen interior", () => {
  const selected = {
    villa: "veil",
    finish: "white",
    style: "Luxury",
    notes: "Morning light",
  };
  assert.deepEqual(selectVilla(selected, "veil"), selected);
  assert.deepEqual(selectVilla(selected, "missing"), selected);
  assert.deepEqual(selectVilla(selected, "shelter"), {
    ...selected,
    villa: "shelter",
    style: null,
  });
});

test("downloaded briefs reflect validated selections and discussion notes", () => {
  const brief = createBrief({
    villa: "veil",
    finish: "white",
    style: "Luxury",
    notes: "Morning light",
  });
  for (const expected of [
    "Veil of Light",
    "Soft white",
    "Luxury",
    "Morning light",
  ])
    assert.ok(brief.includes(expected));
  const invalid = createBrief({
    villa: "shelter",
    finish: "white",
    style: "Luxury",
  });
  assert.ok(invalid.includes("Exterior: Warm beige"));
  assert.ok(invalid.includes("Interior: Still exploring"));
});
