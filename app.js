(() => {
  "use strict";

  const PARTS = [
    { id: "head", name: "Cabeza y rostro", short: "Cabeza", desc: "Rostro, flequillo y cabello base", icon: "◉", anchor: { x: 220, y: 203 }, box: { x: 132, y: 37, w: 176, h: 185 } },
    { id: "torso", name: "Pecho y torso", short: "Pecho / torso", desc: "Cuello, pecho y prenda superior", icon: "◇", anchor: { x: 220, y: 388 }, box: { x: 135, y: 204, w: 170, h: 230 } },
    { id: "arm-left-upper", name: "Brazo izquierdo", short: "Brazo izquierdo", desc: "Hombro y manga superior", icon: "↙", anchor: { x: 148, y: 255 }, box: { x: 120, y: 235, w: 57, h: 105 } },
    { id: "arm-left-forearm", name: "Antebrazo izquierdo", short: "Antebrazo izq.", desc: "Antebrazo, puño y mano", icon: "↙", anchor: { x: 151, y: 331 }, box: { x: 126, y: 315, w: 60, h: 112 } },
    { id: "arm-right-upper", name: "Brazo derecho", short: "Brazo derecho", desc: "Hombro y manga superior", icon: "↘", anchor: { x: 292, y: 255 }, box: { x: 263, y: 235, w: 57, h: 105 } },
    { id: "arm-right-forearm", name: "Antebrazo derecho", short: "Antebrazo der.", desc: "Antebrazo, puño y mano", icon: "↘", anchor: { x: 289, y: 331 }, box: { x: 254, y: 315, w: 60, h: 112 } }
  ];

  const DEFAULT_COLORS = { skin: "#f6c9c3", hair: "#70458b", eyes: "#6b64d8", outfit: "#f1b4d6" };
  const ASSET_PACKS = Object.freeze({
    manual: {
      id: "manual",
      label: "Muñeca provisional por piezas",
      description: "Modo articulable de prueba. Permite mover cabeza, torso, brazos y antebrazos por separado con el dibujo provisional.",
      instructions: "Selecciona un paquete anime para importar capas PNG de cuerpo completo, o vuelve a este modo para trabajar con las piezas provisionales.",
      width: 0, height: 0, sourceUrl: "", author: "", license: ""
    },
    fbfffm001: {
      id: "fbfffm001",
      label: "FBFFFM001 — Fullbody Girl",
      description: "Personaje anime de cuerpo completo. Importa directamente el ZIP base verificado: contiene 27 PNG RGBA de 800 × 1200 (9 variantes de cuerpo, 5 bocas y 12 cejas). No contiene cabeza, torso ni brazos recortados por separado.",
      instructions: "Pulsa “Importar ZIP original” y elige FBFFFM001_000_BASE_BODY.zip sin extraerlo. Selecciona una variante de 00_BODYBASE como base y añade las bocas de 01_MOUTHS o cejas de 03_BROWS que quieras. Los PNG deben ser de 800 × 1200.",
      width: 800, height: 1200,
      sourceUrl: "https://linxuelian.itch.io/customchar-fbfffm001-fullbodyfemale",
      author: "LinXueLian",
      license: "CC BY-SA 4.0"
    },
    hfff001: {
      id: "hfff001",
      label: "HFFF001 — Oujousama",
      description: "Sprite anime de lienzo 537 × 700. El ZIP base verificado contiene 16 PNG RGBA (5 variantes de cuerpo, 2 capas de maquillaje y 8 bocas); no contiene piezas anatómicas independientes.",
      instructions: "Pulsa “Importar ZIP original” y elige HFFF001_OJOU_00_BASE_ESSENTIALS.zip sin extraerlo. Selecciona una variante de 00_BASE_BODY y añade los detalles de 01_FACE_AND_MAKEUP o 02_MOUTH. Los PNG deben ser de 537 × 700.",
      width: 537, height: 700,
      sourceUrl: "https://linxuelian.itch.io/charres-custom-hfff001-ega-ojousama",
      author: "LinXueLian",
      license: "CC BY-SA 4.0"
    },
    hmlf001: {
      id: "hmlf001",
      label: "HMLF001 — Anime Boy (masculino, busto)",
      description: "Sprite anime masculino de capas para novela visual. La página de LinXueLian declara lienzo de 600 × 800 px y ofrece ZIP separados para base, Warlock, Shopkeeper, bufanda, cabello y vampiro. No es un cuerpo anatómico articulado.",
      instructions: "Importa HMLF001_BASE_BODY.zip para empezar. Elige una variante de la carpeta BASE_BODY como cuerpo base; después importa otros ZIP de HMLF001 de uno en uno y añade las capas compatibles. Solo se aceptan PNG de 600 × 800 px. El archivo debe descargarse desde la página original.",
      width: 600, height: 800,
      sourceUrl: "https://linxuelian.itch.io/customchar-hmlf001-malebust",
      author: "LinXueLian",
      license: "CC BY-SA 4.0"
    }
  });
  const STORAGE_KEY = "characterword.studio.project.v3";
  const LEGACY_STORAGE_KEY = "characterword.studio.project.v2";
  const OLDEST_STORAGE_KEY = "characterword.studio.project.v1";
  const svg = document.getElementById("character-svg");
  const partsList = document.getElementById("parts-list");
  const $ = (id) => document.getElementById(id);
  let selectedPart = "head";
  let saveTimer = null;
  let toastTimer = null;
  let drag = null;
  let state = makeDefaultProject();
  let assetLibrary = [];
  let assetLibraryZipName = "";

  function defaultPart() {
    return { dx: 0, dy: 0, rotation: 0, scale: 1, visible: true, showFallback: true, layers: [] };
  }

  function makeDefaultProject() {
    const parts = {};
    PARTS.forEach((part) => { parts[part.id] = defaultPart(); });
    return { version: 3, name: "Nueva waifu", colors: Object.assign({}, DEFAULT_COLORS), parts, assetPack: { id: "manual" }, assetBase: null, compositionLayers: [] };
  }

  function getPart(id) {
    return PARTS.find((part) => part.id === id) || PARTS[0];
  }

  function renderPartList() {
    partsList.innerHTML = PARTS.map((part) => {
      const item = state.parts[part.id];
      const count = item.layers.length;
      const active = part.id === selectedPart ? " active" : "";
      const imported = count ? " imported" : "";
      const label = count ? (count + (count === 1 ? " capa importada" : " capas importadas")) : part.desc;
      const disabled = hasActiveAssetComposition() ? " disabled" : "";
      return '<button class="part-button' + active + '" type="button" data-select-part="' + part.id + '"' + disabled + '>' +
        '<span class="part-thumb">' + part.icon + '</span><span class="part-labels"><strong>' + part.short + '</strong><small>' + label + '</small></span>' +
        '<span class="part-state' + imported + '" aria-label="' + (count ? count + " capas importadas" : "Dibujo de muestra") + '"></span></button>';
    }).join("");
    $("part-count").textContent = PARTS.length + " piezas";
  }

  function setPartTransform(def) {
    const piece = state.parts[def.id];
    const group = $("part-" + def.id);
    if (!group) return;
    const fullBodyCompositionActive = Boolean(state.assetBase && state.assetPack && state.assetPack.id !== "manual");
    group.style.display = fullBodyCompositionActive ? "none" : (piece.visible ? "" : "none");
    group.classList.toggle("is-selected", def.id === selectedPart);
    group.setAttribute("transform",
      "translate(" + piece.dx + " " + piece.dy + ") " +
      "translate(" + def.anchor.x + " " + def.anchor.y + ") " +
      "rotate(" + piece.rotation + ") scale(" + piece.scale + ") " +
      "translate(" + (-def.anchor.x) + " " + (-def.anchor.y) + ")");

    const fallback = group.querySelector(".fallback-art");
    const layers = Array.isArray(piece.layers) ? piece.layers : [];
    if (fallback) fallback.style.display = (!layers.length || piece.showFallback) ? "" : "none";
    const existing = new Map(
      Array.from(group.querySelectorAll(".imported-art")).map((image) => [image.getAttribute("data-layer-id"), image])
    );

    if (layers.length) {
      layers.forEach((layer) => {
        let image = existing.get(layer.id);
        if (!image) {
          image = document.createElementNS("http://www.w3.org/2000/svg", "image");
          image.setAttribute("class", "imported-art");
          image.setAttribute("preserveAspectRatio", "xMidYMid meet");
          image.setAttribute("pointer-events", "none");
          image.setAttribute("data-layer-id", layer.id);
        }
        const box = layer.mode === "canvas" ? { x: 0, y: 0, w: 440, h: 620 } : def.box;
        image.setAttribute("x", String(box.x));
        image.setAttribute("y", String(box.y));
        image.setAttribute("width", String(box.w));
        image.setAttribute("height", String(box.h));
        image.setAttribute("href", layer.dataUrl);
        image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", layer.dataUrl);
        image.style.display = layer.visible ? "" : "none";
        group.appendChild(image);
        existing.delete(layer.id);
      });
      existing.forEach((image) => image.remove());
    } else {
      if (fallback) fallback.style.display = "";
      existing.forEach((image) => image.remove());
    }
  }

  function renderColors() {
    Object.keys(state.colors).forEach((key) => svg.style.setProperty("--" + key, state.colors[key]));
    const compositionActive = hasActiveAssetComposition();
    ["skin", "hair", "eyes", "outfit"].forEach((key) => { $("color-" + key).value = state.colors[key]; $("color-" + key).disabled = compositionActive; });
    $("random-colors").disabled = compositionActive;
  }

  function renderImportedLayerList() {
    const host = $("imported-layer-list");
    const layers = state.parts[selectedPart].layers;
    host.replaceChildren();

    if (!layers.length) {
      const empty = document.createElement("p");
      empty.className = "layer-list-empty";
      empty.textContent = "Todavía no hay capas. Añade cabello, ojos, ropa u otra imagen transparente.";
      host.appendChild(empty);
      return;
    }

    // The list is displayed top-to-bottom (front-to-back), while the stored
    // array is painted bottom-to-top for SVG stacking.
    layers.map((layer, index) => ({ layer, index })).reverse().forEach(({ layer, index }) => {
      const row = document.createElement("div");
      row.className = "layer-row";
      row.dataset.layerRow = layer.id;

      const visibilityLabel = document.createElement("label");
      visibilityLabel.className = "layer-visibility";
      visibilityLabel.title = layer.visible ? "Ocultar capa" : "Mostrar capa";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = layer.visible;
      checkbox.dataset.layerAction = "visibility";
      checkbox.dataset.layerId = layer.id;
      checkbox.setAttribute("aria-label", (layer.visible ? "Ocultar " : "Mostrar ") + layer.name);
      const eye = document.createElement("span");
      eye.textContent = layer.visible ? "◉" : "○";
      visibilityLabel.append(checkbox, eye);

      const label = document.createElement("div");
      label.className = "layer-name";
      const strong = document.createElement("strong");
      strong.textContent = layer.name;
      strong.title = layer.name;
      const small = document.createElement("small");
      small.textContent = layer.mode === "canvas" ? "Lámina alineada" : "Pieza recortada";
      label.append(strong, small);

      const actions = document.createElement("div");
      actions.className = "layer-actions";
      [
        { action: "up", text: "↑", title: "Subir capa", disabled: index === layers.length - 1 },
        { action: "down", text: "↓", title: "Bajar capa", disabled: index === 0 },
        { action: "remove", text: "×", title: "Eliminar capa", disabled: false }
      ].forEach((config) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "layer-action layer-action-" + config.action;
        button.textContent = config.text;
        button.title = config.title;
        button.setAttribute("aria-label", config.title + ": " + layer.name);
        button.dataset.layerAction = config.action;
        button.dataset.layerId = layer.id;
        button.disabled = config.disabled;
        actions.appendChild(button);
      });

      row.append(visibilityLabel, label, actions);
      host.appendChild(row);
    });
  }

  function renderInspector() {
    const def = getPart(selectedPart);
    const piece = state.parts[def.id];
    $("selected-part-name").textContent = def.name;
    $("selected-part-desc").textContent = hasActiveAssetComposition() ? "Desactivado en el modo de sprite completo" : def.desc;
    $("selected-part-icon").textContent = def.icon;
    $("rotation").value = String(piece.rotation);
    $("rotation-value").textContent = piece.rotation + "°";
    $("scale").value = String(Math.round(piece.scale * 100));
    $("scale-value").textContent = Math.round(piece.scale * 100) + "%";
    $("move-x").value = String(piece.dx);
    $("move-x-value").textContent = String(piece.dx);
    $("move-y").value = String(piece.dy);
    $("move-y-value").textContent = String(piece.dy);
    $("part-visible").checked = piece.visible;
    const compositionActive = hasActiveAssetComposition();
    ["rotation", "scale", "move-x", "move-y", "part-visible", "reset-part", "choose-image", "image-mode", "remove-image", "show-fallback"].forEach((id) => { $(id).disabled = compositionActive || (id === "remove-image" || id === "show-fallback") && piece.layers.length === 0; });
    $("remove-image").hidden = piece.layers.length === 0;
    $("show-fallback").checked = Boolean(piece.showFallback);
    $("show-fallback").disabled = piece.layers.length === 0;
    $("choose-image").textContent = "Añadir capa";
    $("selected-indicator").style.background = piece.layers.length ? "#a4f1d0" : "#d8a8ff";
    renderImportedLayerList();
  }

  function render() {
    renderPartList();
    renderColors();
    PARTS.forEach(setPartTransform);
    renderAssetComposition();
    renderInspector();
    renderAssetPackControls();
    const stageNote = $("stage-note-text");
    if (stageNote) {
      stageNote.textContent = hasActiveAssetComposition()
        ? "Modo anime compuesto: las capas del paquete se dibujan alineadas sobre el cuerpo base. Puedes cambiar expresiones y detalles, pero este recurso no incluye brazos ni torso recortados para moverlos por separado."
        : activeAssetPack().id !== "manual"
          ? "Paquete seleccionado sin cuerpo importado. Añade un PNG base para previsualizar el personaje y después agrega expresiones o detalles de la misma base."
          : "Modo provisional por piezas: puedes mover cabeza, torso, brazos y antebrazos por separado. Las imágenes anime de cuerpo completo se componen en el modo Base anime / waifu.";
    }
  }

  function activeAssetPack() {
    const id = state.assetPack && state.assetPack.id;
    return ASSET_PACKS[id] || ASSET_PACKS.manual;
  }

  function hasActiveAssetComposition() {
    return activeAssetPack().id !== "manual" && Boolean(state.assetBase && state.assetBase.dataUrl);
  }

  function renderAssetComposition() {
    const group = $("asset-composition");
    if (!group) return;
    group.replaceChildren();
    if (!hasActiveAssetComposition()) {
      group.style.display = "none";
      return;
    }

    group.style.display = "";
    const appendImage = (dataUrl, name, visible) => {
      const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
      image.setAttribute("class", "asset-composition-image");
      image.setAttribute("x", "0");
      image.setAttribute("y", "0");
      image.setAttribute("width", "440");
      image.setAttribute("height", "620");
      image.setAttribute("preserveAspectRatio", "xMidYMid meet");
      image.setAttribute("pointer-events", "none");
      image.setAttribute("aria-label", name);
      image.setAttribute("href", dataUrl);
      image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", dataUrl);
      image.style.display = visible ? "" : "none";
      group.appendChild(image);
    };

    // All files in each official pack share one transparent artboard. The
    // SVG preserves the source aspect ratio so overlays remain aligned.
    appendImage(state.assetBase.dataUrl, state.assetBase.name || "Cuerpo base", true);
    state.compositionLayers.forEach((layer) => appendImage(layer.dataUrl, layer.name, layer.visible));
  }

  function renderAssetLibrary() {
    const host = $("asset-library-list");
    const title = $("asset-library-title");
    const clearButton = $("clear-asset-library");
    if (!host || !title || !clearButton) return;
    host.replaceChildren();
    clearButton.hidden = assetLibrary.length === 0;
    title.textContent = assetLibrary.length
      ? "Biblioteca · " + assetLibraryZipName + " · " + assetLibrary.length + " PNG"
      : "Biblioteca del ZIP";

    if (!assetLibrary.length) {
      const empty = document.createElement("p");
      empty.className = "asset-library-empty";
      empty.textContent = "Importa un ZIP descargado de la página original para elegir entre sus variantes. Solo se aceptan imágenes que coincidan con las dimensiones de la base seleccionada.";
      host.appendChild(empty);
      return;
    }

    assetLibrary.forEach((item) => {
      const row = document.createElement("div");
      row.className = "asset-library-row" + (item.type === "base" ? " is-base" : "");
      const thumb = document.createElement("img");
      thumb.className = "asset-library-thumb";
      thumb.src = item.dataUrl;
      thumb.alt = "";
      thumb.loading = "lazy";
      thumb.decoding = "async";
      thumb.title = item.name;

      const meta = document.createElement("div");
      meta.className = "asset-library-meta";
      const name = document.createElement("strong");
      name.textContent = item.name;
      name.title = item.path;
      const detail = document.createElement("small");
      detail.textContent = (item.type === "base" ? "CUERPO BASE" : item.category) + " · " + item.width + " × " + item.height;
      detail.title = item.path;
      meta.append(name, detail);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "asset-library-action";
      button.dataset.libraryAction = item.type === "base" ? "use-base" : "add-overlay";
      button.dataset.libraryId = item.id;
      if (item.type === "base") {
        const active = state.assetBase && state.assetBase.libraryId === item.id;
        button.textContent = active ? "Seleccionada" : "Usar base";
        button.disabled = Boolean(active);
        button.setAttribute("aria-label", "Usar cuerpo base " + item.name);
      } else {
        const alreadyAdded = state.compositionLayers.some((layer) => layer.libraryId === item.id);
        button.textContent = alreadyAdded ? "Añadida" : "Añadir capa";
        button.disabled = !state.assetBase || alreadyAdded;
        button.setAttribute("aria-label", "Añadir capa " + item.name);
      }
      row.append(thumb, meta, button);
      host.appendChild(row);
    });
  }

  function clearAssetLibrary() {
    assetLibrary = [];
    assetLibraryZipName = "";
    renderAssetLibrary();
    showToast("Biblioteca del ZIP vaciada. La composición actual no se ha borrado.");
  }

  async function importAssetZip(file) {
    if (!file) return;
    const pack = activeAssetPack();
    if (pack.id === "manual") {
      showToast("Selecciona primero el perfil de la base anime que vas a importar.", true);
      return;
    }
    if (!window.JSZip || typeof window.JSZip.loadAsync !== "function") {
      showToast("No se ha cargado el lector ZIP local. Recarga CharacterWord e inténtalo otra vez.", true);
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast("Este ZIP supera el límite de 20 MB para la importación local.", true);
      return;
    }

    try {
      $("asset-library-title").textContent = "Leyendo ZIP…";
      const archive = await window.JSZip.loadAsync(file);
      const entries = Object.values(archive.files)
        .filter((entry) => !entry.dir && /\.png$/i.test(entry.name) && !entry.name.split("/").some((part) => part === "__MACOSX" || part.startsWith(".")))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      if (!entries.length) {
        renderAssetLibrary();
        showToast("El ZIP no contiene archivos PNG.", true);
        return;
      }
      if (entries.length > 150) {
        renderAssetLibrary();
        showToast("El ZIP tiene más de 150 PNG. Importa un paquete más pequeño de la misma base.", true);
        return;
      }

      const found = [];
      const rejected = [];
      let decodedBytes = 0;
      for (const entry of entries) {
        try {
          const base64 = await entry.async("base64");
          decodedBytes += Math.floor(base64.length * 3 / 4);
          if (decodedBytes > 30 * 1024 * 1024) {
            rejected.push("límite de memoria alcanzado");
            break;
          }
          const dataUrl = "data:image/png;base64," + base64;
          const dimensions = await inspectImageDimensions(dataUrl);
          if (!validatePackImageDimensions(dimensions.width, dimensions.height)) {
            rejected.push(entry.name + " (" + dimensions.width + " × " + dimensions.height + ")");
            continue;
          }
          const parts = entry.name.split("/").filter(Boolean);
          const parentFolder = parts.length > 1 ? parts[parts.length - 2] : "";
          const normalizedFolder = parentFolder.replace(/^\d+[_\s-]*/, "").toUpperCase();
          const isBase = normalizedFolder.includes("BODYBASE") || normalizedFolder === "BASE_BODY" || normalizedFolder.includes("BASE_BODY");
          const category = normalizedFolder || (isBase ? "BASE_BODY" : "DETALLE");
          const folderOrder = Number((parentFolder.match(/^\d+/) || ["999"])[0]);
          found.push({
            id: "library-" + Date.now().toString(36) + "-" + found.length.toString(36) + "-" + Math.random().toString(36).slice(2, 6),
            name: parts[parts.length - 1] || "imagen.png",
            path: entry.name,
            folder: parentFolder,
            order: Number.isFinite(folderOrder) ? folderOrder : 999,
            category,
            type: isBase ? "base" : "overlay",
            dataUrl,
            width: dimensions.width,
            height: dimensions.height
          });
        } catch (_) {
          rejected.push(entry.name + " (archivo ilegible)");
        }
      }

      if (!found.length) {
        renderAssetLibrary();
        showToast("Ningún PNG coincide con " + pack.label + ". Se esperaba " + pack.width + " × " + pack.height + ".", true);
        return;
      }

      assetLibrary = found;
      assetLibraryZipName = file.name;
      renderAssetLibrary();
      renderAssetPackControls();
      const bases = found.filter((item) => item.type === "base").length;
      const overlays = found.length - bases;
      showToast("ZIP leído localmente: " + bases + " variantes de cuerpo y " + overlays + " capas de detalle." + (rejected.length ? " " + rejected.length + " archivo(s) omitidos por dimensiones o tamaño." : ""));
    } catch (error) {
      renderAssetLibrary();
      showToast(error.message || "No se pudo abrir el ZIP. Comprueba que el archivo se descargó por completo.", true);
    }
  }

  function useLibraryBase(libraryId) {
    const item = assetLibrary.find((candidate) => candidate.id === libraryId);
    if (!item || item.type !== "base") return;
    if (!validatePackImageDimensions(item.width, item.height)) {
      showToast("Esta imagen no coincide con las dimensiones de la base activa.", true);
      return;
    }
    state.assetBase = {
      name: item.name,
      dataUrl: item.dataUrl,
      width: item.width,
      height: item.height,
      originPath: item.path,
      libraryId: item.id
    };
    render();
    scheduleLocalSave();
    showToast("Cuerpo base seleccionado: " + item.name + ".");
  }

  function addLibraryOverlay(libraryId) {
    const item = assetLibrary.find((candidate) => candidate.id === libraryId);
    if (!item || item.type === "base") return;
    if (!state.assetBase) {
      showToast("Selecciona primero una variante de cuerpo base.", true);
      return;
    }
    if (state.compositionLayers.some((layer) => layer.libraryId === item.id)) {
      showToast("Esta capa ya está añadida.");
      return;
    }
    if (!validatePackImageDimensions(item.width, item.height)) {
      showToast("Esta capa no coincide con la base activa y no se puede alinear.", true);
      return;
    }
    if (state.compositionLayers.length >= 40) {
      showToast("La composición admite hasta 40 capas de detalle.", true);
      return;
    }
    const newLayer = {
      id: "asset-layer-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      libraryId: item.id,
      name: item.name,
      originPath: item.path,
      order: item.order,
      dataUrl: item.dataUrl,
      visible: true
    };
    // The original packs number their folders back-to-front. Insert in that
    // order initially; the visible up/down controls still allow manual tuning.
    const insertAt = state.compositionLayers.findIndex((layer) => Number.isFinite(layer.order) && layer.order > item.order);
    if (insertAt < 0) state.compositionLayers.push(newLayer);
    else state.compositionLayers.splice(insertAt, 0, newLayer);
    render();
    scheduleLocalSave();
    showToast("Capa añadida: " + item.name + ".");
  }

  function renderAssetLayerList() {
    const host = $("asset-layer-list");
    if (!host) return;
    host.replaceChildren();
    const pack = activeAssetPack();
    if (pack.id === "manual") {
      const empty = document.createElement("p");
      empty.className = "asset-layer-empty";
      empty.textContent = "Selecciona una base anime para ver las capas de composición.";
      host.appendChild(empty);
      return;
    }

    if (state.assetBase) {
      const baseRow = document.createElement("div");
      baseRow.className = "asset-layer-row is-base";
      const marker = document.createElement("span");
      marker.className = "asset-layer-toggle";
      marker.textContent = "◉";
      const label = document.createElement("div");
      label.className = "asset-layer-name";
      const name = document.createElement("strong");
      name.textContent = state.assetBase.name || "Cuerpo base";
      name.title = name.textContent;
      const detail = document.createElement("small");
      detail.textContent = "CUERPO BASE · " + pack.width + " × " + pack.height;
      label.append(name, detail);
      const actions = document.createElement("div");
      actions.className = "asset-layer-actions";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "asset-layer-action remove";
      remove.dataset.assetAction = "remove-base";
      remove.textContent = "×";
      remove.title = "Quitar cuerpo base";
      remove.setAttribute("aria-label", "Quitar cuerpo base");
      actions.appendChild(remove);
      baseRow.append(marker, label, actions);
      host.appendChild(baseRow);
    }

    if (!state.assetBase) {
      const empty = document.createElement("p");
      empty.className = "asset-layer-empty";
      empty.textContent = "Aún no hay cuerpo base. Elige un PNG de la carpeta de cuerpo para empezar.";
      host.appendChild(empty);
    }

    if (state.compositionLayers.length === 0) {
      if (state.assetBase) {
        const empty = document.createElement("p");
        empty.className = "asset-layer-empty";
        empty.textContent = "Sin capas de expresión todavía. Puedes añadir una boca, cejas o maquillaje.";
        host.appendChild(empty);
      }
      return;
    }

    // Stored from back to front, listed from front to back.
    state.compositionLayers.map((layer, index) => ({ layer, index })).reverse().forEach(({ layer, index }) => {
      const row = document.createElement("div");
      row.className = "asset-layer-row";
      const toggleLabel = document.createElement("label");
      toggleLabel.className = "asset-layer-toggle";
      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.checked = layer.visible;
      toggle.dataset.assetAction = "toggle-layer";
      toggle.dataset.assetLayerId = layer.id;
      toggle.setAttribute("aria-label", (layer.visible ? "Ocultar " : "Mostrar ") + layer.name);
      toggleLabel.appendChild(toggle);

      const label = document.createElement("div");
      label.className = "asset-layer-name";
      const name = document.createElement("strong");
      name.textContent = layer.name;
      name.title = layer.originPath || layer.name;
      const detail = document.createElement("small");
      detail.textContent = layer.visible ? "CAPA VISIBLE" : "CAPA OCULTA";
      label.append(name, detail);

      const actions = document.createElement("div");
      actions.className = "asset-layer-actions";
      [
        { action: "up", text: "↑", title: "Traer al frente", disabled: index === state.compositionLayers.length - 1 },
        { action: "down", text: "↓", title: "Enviar al fondo", disabled: index === 0 },
        { action: "remove", text: "×", title: "Eliminar capa", disabled: false }
      ].forEach((config) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "asset-layer-action" + (config.action === "remove" ? " remove" : "");
        button.textContent = config.text;
        button.title = config.title;
        button.setAttribute("aria-label", config.title + ": " + layer.name);
        button.dataset.assetAction = config.action;
        button.dataset.assetLayerId = layer.id;
        button.disabled = config.disabled;
        actions.appendChild(button);
      });

      row.append(toggleLabel, label, actions);
      host.appendChild(row);
    });
  }

  function renderAssetPackControls() {
    const pack = activeAssetPack();
    $("asset-pack-select").value = pack.id;
    $("asset-pack-description").textContent = pack.description;
    $("asset-pack-note").textContent = pack.instructions;
    $("choose-asset-base").disabled = pack.id === "manual";
    $("choose-asset-overlays").disabled = pack.id === "manual" || !state.assetBase;
    $("clear-asset-composition").hidden = !state.assetBase && state.compositionLayers.length === 0;
    $("asset-rig-note").hidden = !hasActiveAssetComposition();

    const credit = $("asset-pack-credit");
    credit.replaceChildren();
    if (pack.id === "manual") {
      credit.textContent = "Paquetes anime de LinXueLian: CC BY-SA 4.0. La atribución se mantiene también en la documentación del proyecto.";
    } else {
      const author = document.createElement("span");
      author.textContent = "Arte: LinXueLian · Licencia ";
      const licence = document.createElement("a");
      licence.href = "https://creativecommons.org/licenses/by-sa/4.0/";
      licence.target = "_blank";
      licence.rel = "noopener noreferrer";
      licence.textContent = "CC BY-SA 4.0";
      const source = document.createElement("a");
      source.href = pack.sourceUrl;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = " · Fuente original";
      credit.append(author, licence, source);
    }
    renderAssetLayerList();
    renderAssetLibrary();
  }

  function switchAssetPack(nextId) {
    const next = ASSET_PACKS[nextId] ? nextId : "manual";
    const current = activeAssetPack().id;
    if (next === current) return;
    const hasComposition = Boolean(state.assetBase || state.compositionLayers.length);
    if (hasComposition && !window.confirm("Cambiar de base elimina la composición anime actual. ¿Continuar?")) {
      $("asset-pack-select").value = current;
      return;
    }
    state.assetPack = { id: next };
    state.assetBase = null;
    state.compositionLayers = [];
    assetLibrary = [];
    assetLibraryZipName = "";
    render();
    scheduleLocalSave();
    showToast(next === "manual" ? "Modo de muñeca por piezas activado." : "Base seleccionada: " + ASSET_PACKS[next].label + ".");
  }

  function validatePackImageDimensions(width, height) {
    const pack = activeAssetPack();
    return pack.id !== "manual" && width === pack.width && height === pack.height;
  }

  async function importAssetBase(file) {
    if (!file) return;
    const pack = activeAssetPack();
    if (pack.id === "manual") {
      showToast("Primero selecciona un perfil de base anime.", true);
      return;
    }
    if (!["image/png", "image/webp"].includes(file.type)) {
      showToast("El cuerpo base debe ser PNG o WebP.", true);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("El cuerpo base supera el límite de 5 MB.", true);
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const dimensions = await inspectImageDimensions(dataUrl);
      if (!validatePackImageDimensions(dimensions.width, dimensions.height)) {
        showToast("Dimensiones incorrectas para " + pack.label + ": se esperaba " + pack.width + " × " + pack.height + " y el archivo mide " + dimensions.width + " × " + dimensions.height + ".", true);
        return;
      }
      state.assetBase = { name: file.name, dataUrl, width: dimensions.width, height: dimensions.height };
      render();
      scheduleLocalSave();
      showToast("Cuerpo base importado: " + file.name + ".");
    } catch (error) {
      showToast(error.message || "No se pudo importar el cuerpo base.", true);
    }
  }

  async function importAssetOverlays(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const pack = activeAssetPack();
    if (pack.id === "manual") {
      showToast("Selecciona una base anime primero.", true);
      return;
    }
    if (!state.assetBase) {
      showToast("Importa primero un cuerpo base para mantener alineadas las capas.", true);
      return;
    }
    if (state.compositionLayers.length + files.length > 40) {
      showToast("La composición admite hasta 40 capas de expresión y detalles.", true);
      return;
    }

    const accepted = [];
    const rejected = [];
    // Sort naturally when a browser provides relative paths; users can also
    // refine order with the up/down controls after importing.
    files.sort((a, b) => String(a.webkitRelativePath || a.name).localeCompare(String(b.webkitRelativePath || b.name), undefined, { numeric: true }));
    for (const file of files) {
      if (!["image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
        rejected.push(file.name + " (tipo o tamaño)");
        continue;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const dimensions = await inspectImageDimensions(dataUrl);
        if (!validatePackImageDimensions(dimensions.width, dimensions.height)) {
          rejected.push(file.name + " (" + dimensions.width + " × " + dimensions.height + ")");
          continue;
        }
        accepted.push({
          id: "asset-layer-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          name: file.name,
          originPath: file.webkitRelativePath || file.name,
          dataUrl,
          visible: true
        });
      } catch (_) {
        rejected.push(file.name + " (no se pudo leer)");
      }
    }
    if (accepted.length) {
      state.compositionLayers.push(...accepted);
      render();
      scheduleLocalSave();
      showToast("Añadidas " + accepted.length + " capas a " + pack.label + (rejected.length ? "; " + rejected.length + " se omitieron." : "."));
    } else {
      showToast("No se añadió ninguna capa. Comprueba el formato y que las imágenes midan " + pack.width + " × " + pack.height + ".", true);
    }
  }

  function inspectImageDimensions(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error("La imagen no se puede interpretar."));
      image.src = dataUrl;
    });
  }

  function removeAssetLayer(layerId) {
    const index = state.compositionLayers.findIndex((layer) => layer.id === layerId);
    if (index >= 0) state.compositionLayers.splice(index, 1);
  }

  function scheduleLocalSave() {
    window.clearTimeout(saveTimer);
    $("save-status").textContent = "Guardando en este navegador…";
    saveTimer = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        $("save-status").textContent = "Guardado local";
      } catch (error) {
        $("save-status").textContent = "Exporta JSON para conservarlo";
        showToast("El navegador no pudo guardar todo localmente. Exporta el proyecto JSON para no perderlo.", true);
      }
    }, 400);
  }

  function updateAndRender() {
    render();
    scheduleLocalSave();
  }

  function selectPart(id) {
    if (!state.parts[id]) return;
    selectedPart = id;
    render();
  }

  function resetPart(id) {
    const def = getPart(id);
    state.parts[def.id] = defaultPart();
    render();
    scheduleLocalSave();
    showToast(def.name + " restablecido.");
  }

  function resetPose() {
    if (hasActiveAssetComposition()) return;
    PARTS.forEach((part) => {
      state.parts[part.id].dx = 0;
      state.parts[part.id].dy = 0;
      state.parts[part.id].rotation = 0;
      state.parts[part.id].scale = 1;
    });
    render();
    scheduleLocalSave();
    showToast("Pose y posición restablecidas.");
  }

  function resetAll() {
    state = makeDefaultProject();
    selectedPart = "head";
    render();
    scheduleLocalSave();
    showToast("Diseño de muestra restablecido.");
  }

  function validHex(value) {
    return /^#[0-9a-fA-F]{6}$/.test(value);
  }

  function randomizeColors() {
    if (hasActiveAssetComposition()) return;
    const palettes = [
      { hair: "#70458b", eyes: "#6b64d8", outfit: "#f1b4d6" },
      { hair: "#49364f", eyes: "#6e9ed8", outfit: "#b7d7ee" },
      { hair: "#be6e72", eyes: "#b77ab4", outfit: "#f1c48d" },
      { hair: "#477c78", eyes: "#4da6a4", outfit: "#d4c6fa" },
      { hair: "#d5a35e", eyes: "#65a7c5", outfit: "#ffccd6" },
      { hair: "#35415c", eyes: "#d07a9c", outfit: "#d8e5f1" },
      { hair: "#9a596e", eyes: "#8476d9", outfit: "#e5a8be" }
    ];
    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    state.colors.hair = palette.hair;
    state.colors.eyes = palette.eyes;
    state.colors.outfit = palette.outfit;
    updateAndRender();
    showToast("Paleta de colores cambiada.");
  }

  function randomizePose() {
    if (hasActiveAssetComposition()) return;
    ["head", "arm-left-upper", "arm-left-forearm", "arm-right-upper", "arm-right-forearm"].forEach((id) => {
      const span = id === "head" ? 9 : 35;
      state.parts[id].rotation = Math.round((Math.random() * 2 - 1) * span);
    });
    updateAndRender();
    showToast("Pose provisional variada. Ajusta cada pieza para afinarla.");
  }

  function svgPoint(event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }

  function onPointerDown(event) {
    const group = event.target.closest ? event.target.closest("[data-part]") : null;
    if (!group || !svg.contains(group)) return;
    const id = group.getAttribute("data-part");
    if (!state.parts[id] || !state.parts[id].visible) return;
    selectPart(id);
    const point = svgPoint(event);
    drag = { id, startX: point.x, startY: point.y, dx: state.parts[id].dx, dy: state.parts[id].dy };
    if (svg.setPointerCapture) {
      try { svg.setPointerCapture(event.pointerId); } catch (_) {}
    }
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!drag) return;
    const point = svgPoint(event);
    const piece = state.parts[drag.id];
    piece.dx = Math.round(Math.max(-120, Math.min(120, drag.dx + point.x - drag.startX)));
    piece.dy = Math.round(Math.max(-120, Math.min(120, drag.dy + point.y - drag.startY)));
    PARTS.forEach(setPartTransform);
    renderInspector();
  }

  function onPointerUp() {
    if (!drag) return;
    drag = null;
    renderPartList();
    scheduleLocalSave();
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
      reader.readAsDataURL(file);
    });
  }

  async function importPartImage(file) {
    if (!file) return;
    if (!["image/png", "image/webp"].includes(file.type)) {
      showToast("Usa una imagen PNG o WebP con transparencia.", true);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Cada capa puede pesar hasta 5 MB en esta primera versión.", true);
      return;
    }

    const targetPartId = selectedPart;
    const mode = $("image-mode").value === "cropped" ? "cropped" : "canvas";
    const layers = state.parts[targetPartId].layers;
    if (layers.length >= 80) {
      showToast("Esta pieza ya tiene 80 capas. Divide el diseño en otra pieza.", true);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const probe = new Image();
      probe.onload = () => {
        if (!probe.naturalWidth || !probe.naturalHeight) {
          showToast("No se pudo interpretar la imagen.", true);
          return;
        }
        const target = state.parts[targetPartId];
        const layerId = "layer-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        if (target.layers.length === 0) target.showFallback = false;
        target.layers.push({
          id: layerId,
          name: String(file.name || "Capa importada").slice(0, 180),
          dataUrl,
          mode,
          visible: true
        });
        render();
        scheduleLocalSave();
        showToast("Se añadió " + file.name + " a " + getPart(targetPartId).name + ".");
      };
      probe.onerror = () => showToast("La imagen no parece válida.", true);
      probe.src = dataUrl;
    } catch (error) {
      showToast(error.message || "Error al importar la imagen.", true);
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function exportProject() {
    const pack = activeAssetPack();
    const exportState = Object.assign({}, state);
    exportState.attribution = pack.id === "manual" ? null : {
      author: pack.author,
      sourceUrl: pack.sourceUrl,
      license: pack.license,
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      note: "Original transparent PNG layers were composed in CharacterWord. The selected base and visible layer order may have been changed; the imported source PNG files were not retouched by this editor.",
      shareAlike: true
    };
    const blob = new Blob([JSON.stringify(exportState, null, 2)], { type: "application/json;charset=utf-8" });
    downloadBlob(blob, "characterword-project.json");
    showToast("Proyecto JSON exportado con las piezas y sus ajustes.");
  }

  function exportPng() {
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "880");
    clone.setAttribute("height", "1240");
    clone.querySelectorAll(".is-selected").forEach((el) => el.classList.remove("is-selected"));
    clone.querySelectorAll("[data-part]").forEach((el) => {
      el.style.cursor = "";
    });
    const markup = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 880;
      canvas.height = 1240;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((png) => {
        if (png) {
          downloadBlob(png, "characterword-waifu.png");
          showToast("Imagen PNG exportada.");
        } else {
          showToast("No se pudo crear el PNG. Prueba exportar el proyecto JSON.", true);
        }
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      showToast("No se pudo renderizar la ilustración. Exporta el proyecto JSON como alternativa.", true);
    };
    image.src = url;
  }

  function sanitizeProject(input) {
    if (!input || ![1, 2, 3].includes(input.version) || !input.parts || !input.colors) {
      throw new Error("El archivo no tiene el formato de proyecto CharacterWord v1/v2/v3.");
    }
    const clean = makeDefaultProject();
    clean.name = typeof input.name === "string" ? input.name.slice(0, 100) : "Proyecto importado";
    ["skin", "hair", "eyes", "outfit"].forEach((key) => {
      if (typeof input.colors[key] === "string" && validHex(input.colors[key])) clean.colors[key] = input.colors[key];
    });

    const isValidDataUrl = (value) =>
      typeof value === "string" &&
      /^data:image\/(png|webp);base64,/.test(value) &&
      value.length < 8_000_000;

    PARTS.forEach((part) => {
      const incoming = input.parts[part.id];
      if (!incoming || typeof incoming !== "object") return;
      const numeric = (key, fallback, min, max) => {
        const value = Number(incoming[key]);
        return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
      };

      let importedLayers = [];
      if (Array.isArray(incoming.layers)) {
        importedLayers = incoming.layers.slice(0, 80).map((layer, index) => {
          if (!layer || typeof layer !== "object" || !isValidDataUrl(layer.dataUrl)) return null;
          const suppliedId = typeof layer.id === "string" && /^layer-[a-zA-Z0-9_-]{1,100}$/.test(layer.id)
            ? layer.id
            : "layer-imported-" + index;
          return {
            id: suppliedId,
            name: typeof layer.name === "string" ? layer.name.slice(0, 180) : "Capa " + (index + 1),
            dataUrl: layer.dataUrl,
            mode: layer.mode === "cropped" ? "cropped" : "canvas",
            visible: typeof layer.visible === "boolean" ? layer.visible : true
          };
        }).filter(Boolean);
      } else if (isValidDataUrl(incoming.imageData)) {
        // Migration from v1 projects: each old slot had at most one imported image.
        importedLayers.push({
          id: "layer-migrated-" + part.id,
          name: "Capa importada",
          dataUrl: incoming.imageData,
          mode: incoming.imageMode === "cropped" ? "cropped" : "canvas",
          visible: true
        });
      }

      const unique = new Set();
      importedLayers = importedLayers.map((layer, index) => {
        let id = layer.id;
        while (unique.has(id)) id = id + "-" + (index + 1);
        unique.add(id);
        return Object.assign({}, layer, { id });
      });

      clean.parts[part.id] = {
        dx: numeric("dx", 0, -120, 120),
        dy: numeric("dy", 0, -120, 120),
        rotation: numeric("rotation", 0, -180, 180),
        scale: numeric("scale", 1, 0.5, 1.8),
        visible: typeof incoming.visible === "boolean" ? incoming.visible : true,
        showFallback: typeof incoming.showFallback === "boolean" ? incoming.showFallback : importedLayers.length === 0,
        layers: importedLayers
      };
    });
    clean.assetPack = { id: ["fbfffm001", "hfff001"].includes(input.assetPack && input.assetPack.id) ? input.assetPack.id : "manual" };
    const activePack = ASSET_PACKS[clean.assetPack.id];
    const validPackImage = (item) => item && typeof item === "object" && isValidDataUrl(item.dataUrl);
    if (clean.assetPack.id !== "manual" && validPackImage(input.assetBase)) {
      const base = input.assetBase;
      if (Number(base.width) === activePack.width && Number(base.height) === activePack.height) {
        clean.assetBase = {
          name: typeof base.name === "string" ? base.name.slice(0, 220) : "Cuerpo base",
          dataUrl: base.dataUrl,
          width: activePack.width,
          height: activePack.height
        };
      }
      clean.compositionLayers = Array.isArray(input.compositionLayers) ? input.compositionLayers.slice(0, 40).map((layer, index) => {
        if (!validPackImage(layer)) return null;
        return {
          id: typeof layer.id === "string" && /^asset-layer-[a-zA-Z0-9_-]{1,100}$/.test(layer.id) ? layer.id : "asset-layer-imported-" + index,
          name: typeof layer.name === "string" ? layer.name.slice(0, 220) : "Capa " + (index + 1),
          originPath: typeof layer.originPath === "string" ? layer.originPath.slice(0, 500) : "",
          dataUrl: layer.dataUrl,
          libraryId: typeof layer.libraryId === "string" ? layer.libraryId.slice(0, 220) : null,
          order: Number.isFinite(Number(layer.order)) ? Number(layer.order) : null,
          visible: typeof layer.visible === "boolean" ? layer.visible : true
        };
      }).filter(Boolean) : [];
      if (!clean.assetBase) clean.compositionLayers = [];
    } else {
      clean.assetPack = { id: "manual" };
      clean.assetBase = null;
      clean.compositionLayers = [];
    }
    clean.version = 3;
    return clean;
  }

  async function loadProject(file) {
    if (!file) return;
    if (file.size > 40 * 1024 * 1024) {
      showToast("El archivo JSON supera el límite de 40 MB.", true);
      return;
    }
    try {
      const raw = await file.text();
      state = sanitizeProject(JSON.parse(raw));
      selectedPart = "head";
      render();
      scheduleLocalSave();
      showToast("Proyecto cargado.");
    } catch (error) {
      showToast(error.message || "No se pudo cargar el proyecto JSON.", true);
    }
  }

  function showToast(message, error) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.toggle("error", Boolean(error));
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3400);
  }

  function loadLocalProject() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || localStorage.getItem(OLDEST_STORAGE_KEY);
      if (!saved) return false;
      state = sanitizeProject(JSON.parse(saved));
      // Persist the normalized v3 project after migrating old single-image slots.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
  }

  partsList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-part]");
    if (button) selectPart(button.getAttribute("data-select-part"));
  });
  svg.addEventListener("pointerdown", onPointerDown);
  svg.addEventListener("pointermove", onPointerMove);
  svg.addEventListener("pointerup", onPointerUp);
  svg.addEventListener("pointercancel", onPointerUp);
  $("rotation").addEventListener("input", (event) => {
    state.parts[selectedPart].rotation = Number(event.target.value);
    updateAndRender();
  });
  $("scale").addEventListener("input", (event) => {
    state.parts[selectedPart].scale = Number(event.target.value) / 100;
    updateAndRender();
  });
  $("move-x").addEventListener("input", (event) => {
    state.parts[selectedPart].dx = Number(event.target.value);
    updateAndRender();
  });
  $("move-y").addEventListener("input", (event) => {
    state.parts[selectedPart].dy = Number(event.target.value);
    updateAndRender();
  });
  $("part-visible").addEventListener("change", (event) => {
    state.parts[selectedPart].visible = event.target.checked;
    updateAndRender();
  });
  $("reset-part").addEventListener("click", () => resetPart(selectedPart));
  $("reset-all").addEventListener("click", resetAll);
  $("pose-reset").addEventListener("click", resetPose);
  $("pose-random").addEventListener("click", randomizePose);
  $("random-colors").addEventListener("click", randomizeColors);
  ["skin", "hair", "eyes", "outfit"].forEach((key) => {
    $("color-" + key).addEventListener("input", (event) => {
      if (!validHex(event.target.value)) return;
      state.colors[key] = event.target.value;
      renderColors();
      scheduleLocalSave();
    });
  });
  $("choose-image").addEventListener("click", () => $("part-image-input").click());
  $("part-image-input").addEventListener("change", (event) => {
    importPartImage(event.target.files && event.target.files[0]);
    event.target.value = "";
  });
  $("show-fallback").addEventListener("change", (event) => {
    state.parts[selectedPart].showFallback = event.target.checked;
    render();
    scheduleLocalSave();
  });
  $("remove-image").addEventListener("click", () => {
    state.parts[selectedPart].layers = [];
    state.parts[selectedPart].showFallback = true;
    render();
    scheduleLocalSave();
    showToast("Se quitaron las capas y se restauró el dibujo de muestra.");
  });
  $("imported-layer-list").addEventListener("change", (event) => {
    const input = event.target.closest('[data-layer-action="visibility"]');
    if (!input) return;
    const layer = state.parts[selectedPart].layers.find((item) => item.id === input.dataset.layerId);
    if (!layer) return;
    layer.visible = input.checked;
    render();
    scheduleLocalSave();
  });
  $("imported-layer-list").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-layer-action]");
    if (!button || button.dataset.layerAction === "visibility") return;
    const layers = state.parts[selectedPart].layers;
    const index = layers.findIndex((item) => item.id === button.dataset.layerId);
    if (index < 0) return;
    if (button.dataset.layerAction === "remove") {
      layers.splice(index, 1);
    } else if (button.dataset.layerAction === "up" && index < layers.length - 1) {
      [layers[index], layers[index + 1]] = [layers[index + 1], layers[index]];
    } else if (button.dataset.layerAction === "down" && index > 0) {
      [layers[index], layers[index - 1]] = [layers[index - 1], layers[index]];
    } else {
      return;
    }
    render();
    scheduleLocalSave();
  });
  $("asset-pack-select").addEventListener("change", (event) => switchAssetPack(event.target.value));
  $("choose-asset-zip").addEventListener("click", () => $("asset-zip-input").click());
  $("asset-zip-input").addEventListener("change", (event) => {
    importAssetZip(event.target.files && event.target.files[0]);
    event.target.value = "";
  });
  $("clear-asset-library").addEventListener("click", clearAssetLibrary);
  $("asset-library-list").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-library-action]");
    if (!button || button.disabled) return;
    if (button.dataset.libraryAction === "use-base") useLibraryBase(button.dataset.libraryId);
    else if (button.dataset.libraryAction === "add-overlay") addLibraryOverlay(button.dataset.libraryId);
  });
  $("choose-asset-base").addEventListener("click", () => $("asset-base-input").click());
  $("asset-base-input").addEventListener("change", (event) => {
    importAssetBase(event.target.files && event.target.files[0]);
    event.target.value = "";
  });
  $("choose-asset-overlays").addEventListener("click", () => $("asset-overlay-input").click());
  $("asset-overlay-input").addEventListener("change", (event) => {
    importAssetOverlays(event.target.files);
    event.target.value = "";
  });
  $("clear-asset-composition").addEventListener("click", () => {
    state.assetBase = null;
    state.compositionLayers = [];
    render();
    scheduleLocalSave();
    showToast("Composición anime retirada.");
  });
  $("asset-layer-list").addEventListener("change", (event) => {
    const input = event.target.closest('input[data-asset-action="toggle-layer"]');
    if (!input) return;
    const layer = state.compositionLayers.find((item) => item.id === input.dataset.assetLayerId);
    if (!layer) return;
    layer.visible = input.checked;
    render();
    scheduleLocalSave();
  });
  $("asset-layer-list").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-asset-action]");
    if (!button) return;
    const action = button.dataset.assetAction;
    const id = button.dataset.assetLayerId;
    if (action === "remove-base") {
      state.assetBase = null;
      state.compositionLayers = [];
    } else {
      const index = state.compositionLayers.findIndex((item) => item.id === id);
      if (index < 0) return;
      if (action === "remove") state.compositionLayers.splice(index, 1);
      else if (action === "up" && index < state.compositionLayers.length - 1) {
        [state.compositionLayers[index], state.compositionLayers[index + 1]] = [state.compositionLayers[index + 1], state.compositionLayers[index]];
      } else if (action === "down" && index > 0) {
        [state.compositionLayers[index], state.compositionLayers[index - 1]] = [state.compositionLayers[index - 1], state.compositionLayers[index]];
      } else return;
    }
    render();
    scheduleLocalSave();
  });

  $("export-project").addEventListener("click", exportProject);
  $("export-png").addEventListener("click", exportPng);
  $("import-project").addEventListener("click", () => $("project-input").click());
  $("project-input").addEventListener("change", (event) => {
    loadProject(event.target.files && event.target.files[0]);
    event.target.value = "";
  });

  const restored = loadLocalProject();
  render();
  if (restored) $("save-status").textContent = "Proyecto local restaurado";
})();