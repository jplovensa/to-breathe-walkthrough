import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { publicAsset, assetPaths } from "../src/assets.js";
import { villas, styles, chapters, ids } from "../src/data.js";
import { filmChapters } from "../src/film-data.js";

test("every explicit catalogue and video reference names an existing file", async () => {
  for (const key of assetPaths) await access(fileURLToPath(publicAsset(key)));
  for (const villa of Object.values(villas)) {
    await access(fileURLToPath(publicAsset(`assets/${villa.image}.webp`)));
    for (const page of [villa.page, villa.gallery, villa.detail])
      await access(fileURLToPath(publicAsset(`assets/page-${page}.webp`)));
  }
  for (const options of Object.values(styles))
    for (const style of options) {
      await access(fileURLToPath(publicAsset(`assets/${style.image}.webp`)));
      await access(
        fileURLToPath(publicAsset(`assets/page-${style.page}.webp`)),
      );
    }
  assert.throws(
    () => publicAsset("assets/not-in-the-catalogue.webp"),
    /Unknown catalogue asset/,
  );
});

test("film chapters and caption cues remain synchronized", async () => {
  assert.equal(chapters.length, ids.length);
  assert.ok(ids.includes("film"));
  assert.equal(filmChapters.length, 8);
  assert.deepEqual(
    filmChapters.map((chapter) => chapter.start),
    [0, 10, 20, 30, 40, 50, 60, 70],
  );
  const captions = await readFile(
    fileURLToPath(publicAsset("video/captions.vtt")),
    "utf8",
  );
  assert.ok(captions.startsWith("WEBVTT"));
  assert.equal((captions.match(/-->/g) || []).length, filmChapters.length);
  const movie = await readFile(
    fileURLToPath(publicAsset("video/to-breathe-walkthrough.mp4")),
  );
  assert.equal(movie.toString("ascii", 4, 8), "ftyp");
});
