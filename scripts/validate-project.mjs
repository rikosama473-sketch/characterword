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
const pagesWorkflow = await read(".github/workflows/pages.yml");

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
assert.ok(html.includes('id="asset-pack-select"'), "Editor must expose the anime pack profile selector");
assert.ok(html.includes('<option value="dorathy-girl-psd">Dorathy'), "Editor must expose the layered female Dorathy profile");
assert.ok(html.includes('<option value="pung-female-psd">Pung Lone Wolf'), "Editor must expose the layered female Pung profile");
assert.ok(app.includes('id: "dorathy-girl-psd"'), "Editor must validate the Dorathy canvas separately");
assert.ok(app.includes('id: "pung-female-psd"'), "Editor must validate the Pung canvas separately");
assert.ok(!app.includes('id: "hmlf001"') && !html.includes('value="hmlf001"'), "Conventional male models must not be selectable");
assert.ok(html.includes('id="asset-base-input"'), "Editor must allow selecting one full-canvas base PNG");
assert.ok(html.includes('id="asset-overlay-input"'), "Editor must allow selecting aligned expression/detail overlays");
assert.ok(html.includes('id="asset-zip-input"'), "Editor must allow importing original ZIP archives");
assert.ok(html.includes('id="asset-library-list"'), "ZIP contents must be exposed as a selectable library");
assert.ok(app.includes("async function importAssetZip"), "Editor must parse original ZIP archives locally");
assert.ok(app.includes("window.JSZip.loadAsync"), "ZIP parsing must use the bundled reader");
assert.ok(app.includes("function renderAssetLibrary"), "Editor must display choices found inside the ZIP");
assert.ok(app.includes("function useLibraryBase"), "Users must be able to select a body-base variant");
assert.ok(app.includes("function addLibraryOverlay"), "Users must be able to add overlay variants from the archive");
assert.ok(pagesWorkflow.includes("cp vendor/jszip.min.js _site/vendor/"), "Pages deploy must publish the ZIP reader");
assert.ok(pagesWorkflow.includes("cp vendor/JSZIP-LICENSE.markdown _site/vendor/"), "Pages deploy must publish the ZIP reader license");
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
assert.ok(app.includes("characterword.studio.project.v3"), "Layered projects must use v3 local storage");

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


const fbRecord = catalog.sources.find((source) => source.id === "linxuelian-fbfffm001-fullbody-girl");
const hfffRecord = catalog.sources.find((source) => source.id === "linxuelian-hfff001-oujousama");
const dorathyRecord = catalog.sources.find((source) => source.id === "dorathy-customizable-visual-novel-girl");
const pungRecord = catalog.sources.find((source) => source.id === "pung-lonewolf-layered-female-psd");
assert.ok(fbRecord && fbRecord.inspectedArchive, "Catalog must include the verified FBFFFM001 archive inspection");
assert.equal(fbRecord.inspectedArchive.pngCount, 27, "FBFFFM001 base ZIP should list 27 PNGs");
assert.equal(fbRecord.inspectedArchive.dimensions, "800x1200", "FBFFFM001 canvas dimensions must be recorded");
assert.equal(fbRecord.inspectedArchive.anatomicalPartsSeparated, false, "FBFFFM001 archive must not be labelled as articulated body parts");
assert.ok(hfffRecord && hfffRecord.inspectedArchive, "Catalog must include the verified HFFF001 archive inspection");
assert.equal(hfffRecord.inspectedArchive.pngCount, 16, "HFFF001 base ZIP should list 16 PNGs");
assert.equal(hfffRecord.inspectedArchive.dimensions, "537x700", "HFFF001 canvas dimensions must be recorded");
assert.equal(hfffRecord.inspectedArchive.anatomicalPartsSeparated, false, "HFFF001 archive must not be labelled as articulated body parts");
assert.ok(dorathyRecord, "Catalog must track the Dorathy layered female source");
assert.equal(dorathyRecord.sourcePageDimensions, "820x1080", "Dorathy source canvas dimensions must be recorded");
assert.equal(dorathyRecord.testedInCharacterWord, false, "Dorathy round-trip must remain pending until tested");
assert.ok(pungRecord, "Catalog must track the Pung layered female source");
assert.equal(pungRecord.sourcePageDimensions, "1504x2409", "Pung source canvas dimensions must be recorded");
assert.equal(pungRecord.testedInCharacterWord, false, "Pung round-trip must remain pending until tested");
assert.ok(!catalog.sources.some((source) => source.id === "linxuelian-hmlf001-anime-boy"), "The conventional male source must not remain in the art catalog");
assert.equal(hfffRecord.license, "CC-BY-4.0", "HFFF001 licence must match the current source page");
assert.equal(hfffRecord.shareAlike, false, "HFFF001 must not inherit the ShareAlike restriction");
assert.ok(catalog.sources.some((source) => source.id === "see-through-anime-layer-decomposition"), "Catalog must track the See-through layer decomposition tool and its memory constraints");
assert.ok(catalog.sources.some((source) => source.id === "psrc-human-mk2-ultimate-devkit"), "Catalog must track the CC0 modular body-parts candidate");
assert.ok(catalog.sources.some((source) => source.id === "konard-anime-avatar-procedural-svg"), "Catalog must track the procedural anime SVG generator reference");
assert.equal(catalog.policy.runtimeMemoryTargetMB, 2048, "The project's low-memory runtime target must remain explicit");
assert.ok(String(catalog.sources.find((source) => source.id === "animosity-thin-girl-modular-cc-by-4")?.aiTrainingTerms || "").includes("permission"), "Thin Girl's restriction on AI training must remain recorded");
assert.equal(catalog.policy.ownModelStrategy, "train-from-random-initialization", "The planned generator must train from random initialization");
assert.equal(catalog.policy.allowPretrainedImageGenerationCheckpoints, false, "Pretrained image-generation checkpoints must not be the project model");
assert.equal(catalog.policy.allowLoraAsStandaloneGenerator, false, "A LoRA must not be misrepresented as a standalone model");
assert.equal(catalog.policy.allowDmd2OrTeacherDistillationAsCoreStrategy, false, "DMD2/teacher distillation must not be the core strategy");
assert.equal(catalog.policy.initialTrainingImageTarget, 100, "The initial 100-image dataset target must be documented");
assert.equal(catalog.policy.modelRuntimeBudgetMB, 2048, "Model inference memory target must be explicit");
assert.ok(readme.includes("desde inicialización aleatoria"), "README must state the from-scratch training direction");
assert.ok(readme.includes("no un LoRA"), "README must distinguish training images from a LoRA");


console.log("CharacterWord validation passed: " + partIds.length + " starter parts, " + catalog.sources.length + " sources, unique HTML ids, stacked layers, v1 migration, and project exports.");
