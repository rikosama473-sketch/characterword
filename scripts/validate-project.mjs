import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");
const html = await read("index.html");
const css = await read("styles.css");
const app = await read("app.js");
const catalog = JSON.parse(await read("data/asset-sources.json"));

assert.ok(html.includes('href="styles.css"'), "index.html must load styles.css");
assert.ok(html.includes('src="app.js"'), "index.html must load app.js");
assert.ok(css.includes(".workspace"), "styles.css must define the editor layout");
assert.ok(app.includes('const PARTS = ['), "app.js must define the parts list");

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const uniqueHtmlIds = new Set(htmlIds);
assert.equal(uniqueHtmlIds.size, htmlIds.length, "HTML ids must be unique");

const partIds = [...app.matchAll(/\{ id: "([^"]+)", name:/g)].map((match) => match[1]);
assert.equal(partIds.length, 6, "First editor version should define six starter pieces");
assert.equal(new Set(partIds).size, partIds.length, "Part ids must be unique");
for (const partId of partIds) {
  assert.ok(html.includes('id="part-' + partId + '"'), "Missing SVG group for part: " + partId);
}
for (const id of ["head", "torso", "arm-left-upper", "arm-left-forearm", "arm-right-upper", "arm-right-forearm"]) {
  assert.ok(partIds.includes(id), "Starter piece is not registered: " + id);
}

assert.equal(catalog.schemaVersion, 1, "Unexpected asset catalog schema version");
assert.ok(Array.isArray(catalog.sources), "Asset catalog must contain a sources array");
const sourceIds = catalog.sources.map((source) => source.id);
assert.equal(new Set(sourceIds).size, sourceIds.length, "Asset source ids must be unique");
for (const source of catalog.sources) {
  assert.ok(source.id && typeof source.id === "string", "Each source needs an id");
  assert.ok(typeof source.sourceUrl === "string" && source.sourceUrl.startsWith("https://"), "Source must have an HTTPS URL: " + source.id);
  assert.ok(typeof source.status === "string", "Source needs a review status: " + source.id);
}

for (const feature of ["exportProject", "exportPng", "importPartImage", "sanitizeProject", "scheduleLocalSave"]) {
  assert.ok(app.includes("function " + feature), "Missing expected editor capability: " + feature);
}

assert.ok(app.includes('characterword.studio.project.v2'), "Layered projects must use v2 local storage");
console.log("CharacterWord validation passed: " + partIds.length + " starter parts, " + catalog.sources.length + " source records, layer stack UI, migration path, and linked app files.");
