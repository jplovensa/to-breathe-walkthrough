import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { publicAsset } from "../src/assets.js";

const root = resolve("dist");
const base = new URL("https://example.com/to-breathe-walkthrough/");

async function assertHostedFile(reference, parent = base) {
  const url = new URL(reference, parent);
  assert.equal(
    url.origin,
    base.origin,
    `Unexpected external dependency: ${reference}`,
  );
  assert.ok(
    url.pathname.startsWith(base.pathname),
    `Asset escapes repository path: ${reference}`,
  );
  const filename = resolve(
    root,
    decodeURIComponent(url.pathname.slice(base.pathname.length)),
  );
  assert.ok(filename.startsWith(`${root}/`));
  await access(filename);
  return { filename, url };
}

test("built HTML and stylesheet resources resolve under a repository Pages URL", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const stylesheets = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map(
    (match) => match[1],
  );
  assert.ok(
    scripts.length > 0,
    "Built page must have an application entrypoint",
  );
  assert.ok(stylesheets.length > 0, "Built page must have a stylesheet");
  for (const script of scripts) await assertHostedFile(script);
  for (const stylesheet of stylesheets) {
    const { filename, url } = await assertHostedFile(stylesheet);
    const css = await readFile(filename, "utf8");
    const resources = [...css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)].map(
      (match) => match[1],
    );
    assert.ok(resources.length >= 3, "Locally hosted fonts must be included");
    for (const resource of resources) await assertHostedFile(resource, url);
  }
  await assertHostedFile("catalogue.pdf");
  for (let page = 1; page <= 23; page++)
    await assertHostedFile(`assets/page-${page}.webp`);
});

test("unbuilt static publishing has native module and public asset paths", async () => {
  assert.equal(
    publicAsset("assets/shelter.webp"),
    "./public/assets/shelter.webp",
  );
  const html = await readFile("index.html", "utf8");
  assert.ok(html.includes('src="./src/main.js"'));
  assert.ok(html.includes('href="./src/style.css"'));
  const css = await readFile("src/style.css", "utf8");
  for (const match of css.matchAll(/url\("([^"]+)"\)/g)) {
    assert.ok(!match[1].startsWith("/"));
    await access(resolve(dirname(resolve("src/style.css")), match[1]));
  }
});
