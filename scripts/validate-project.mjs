import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");
const html = await read("index.html");
const css = await read("styles.css");
const app = await read("app.js");
const catalog = JSON.parse(await read("data/asset-sources.json"));
const animePackDoc = await read("docs/ANIME_PACK_INTEGRATION.md");
const zipReader = await read("vendor/jszip.min.js");
const zipReaderLicense = await read("vendor/JSZIP-LICENSE.markdown");

assert.ok(html.includes('href="styles.css"'), "index.html must load styles.css");
assert.ok(html.includes('src="app.js"'), "index.html must load app.js");
assert.ok(html.includes('src="vendor/jszip.min.js"'), "index.html must load the local ZIP reader before the app");
assert.ok(zipReader.includes("JSZip v3.10.2"), "The vendored ZIP reader must identify its upstream version");
assert.ok(zipReaderLicense.includes("The MIT License"), "The vendored ZIP reader must retain its license");
assert.ok(css.includes(".workspace"), "styles.css must define the editor layout");
assert.ok(css.includes(".layer-row"), "Styles must include the imported-layer list");
assert.ok(css.includes("#character-svg image.imported-art { pointer-events: visiblePainted; }"), "Imported images must remain pointer-draggable");
assert.ok(app.includes("const PARTS = ["), "app.js must define the parts list");
assert.ok(html.includes('id="image-mode"'), "Import UI must provide cropped/aligned layer modes");
assert.ok(html.includes('id="imported-layer-list"'), "Import UI must provide a per-part layer stack");
assert.ok(html.includes('id="show-fallback"'), "Each body part must support a temporary sample-art underlay toggle");
assert.ok(html.includes('id="asset-pack-select"'), "Editor must expose the two inspected anime pack profiles");
assert.ok(html.includes('id="asset-base-input"'), "Editor must allow selecting one full-canvas base PNG");
assert.ok(html.includes('id="asset-overlay-input"'), "Editor must allow selecting aligned expression/detail overlays");
assert.ok(html.includes('id="asset-composition"'), "SVG must contain the separate full-body composition group");
assert.ok(html.includes('id="asset-layer-list"'), "Editor must expose controls for imported full-canvas layers");
assert.ok(animePackDoc.includes("FBFFFM001_000_BASE_BODY.zip"), "Inspection guide must document the FBFFFM001 archive");
assert.ok(animePackDoc.includes("HFFF001_OJOU_00_BASE_ESSENTIALS.zip"), "Inspection guide must document the HFFF001 archive");
assert.equal((html.match(/Fuentes de arte/g) || []).length, 1, "Editor must show one research link");
assert.ok(app.includes("function renderImportedLayerList"), "Editor must render imported layers");
assert.ok(app.includes("layers: []"), "Default anatomical parts must support zero or more layers");
assert.ok(app.includes("showFallback: true"), "Body parts must track whether the temporary sample art remains visible");
assert.ok(app.includes('$("show-fallback").addEventListener'), "Sample-art underlay control must be wired to editor state");
assert.ok(app.includes('layer.mode === "canvas"'), "Aligned layers must preserve artboard coordinate placement");
assert.ok(app.includes("Migration from v1 projects"), "Old single-image projects must be migratable");
assert.ok(app.includes("characterword.studio.project.v2"), "Layered projects must use v2 local storage");

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(htmlIds).size, htmlIds.length, "HTML ids must be unique");

const partIds = [...app.matchAll(/\{ id: "([^"]+)", name:/g)].map((match) => match[1]);
assert.equal(partIds.length, 6, "First editor version should define six starter anatomical pieces");
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

console.log("CharacterWord validation passed: " + partIds.length + " starter parts, " + catalog.sources.length + " sources, unique HTML ids, stacked layers, v1 migration, and project exports.");
