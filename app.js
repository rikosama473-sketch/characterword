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
  const STORAGE_KEY = "characterword.studio.project.v2";
  const LEGACY_STORAGE_KEY = "characterword.studio.project.v1";
  const svg = document.getElementById("character-svg");
  const partsList = document.getElementById("parts-list");
  const $ = (id) => document.getElementById(id);
  let selectedPart = "head";
  let saveTimer = null;
  let toastTimer = null;
  let drag = null;
  let state = makeDefaultProject();

  function defaultPart() {
    return { dx: 0, dy: 0, rotation: 0, scale: 1, visible: true, layers: [] };
  }

  function makeDefaultProject() {
    const parts = {};
    PARTS.forEach((part) => { parts[part.id] = defaultPart(); });
    return { version: 2, name: "Nueva waifu", colors: Object.assign({}, DEFAULT_COLORS), parts };
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
      return '<button class="part-button' + active + '" type="button" data-select-part="' + part.id + '">' +
        '<span class="part-thumb">' + part.icon + '</span><span class="part-labels"><strong>' + part.short + '</strong><small>' + label + '</small></span>' +
        '<span class="part-state' + imported + '" aria-label="' + (count ? count + " capas importadas" : "Dibujo de muestra") + '"></span></button>';
    }).join("");
    $("part-count").textContent = PARTS.length + " piezas";
  }

  function setPartTransform(def) {
    const piece = state.parts[def.id];
    const group = $("part-" + def.id);
    if (!group) return;
    group.style.display = piece.visible ? "" : "none";
    group.classList.toggle("is-selected", def.id === selectedPart);
    group.setAttribute("transform",
      "translate(" + piece.dx + " " + piece.dy + ") " +
      "translate(" + def.anchor.x + " " + def.anchor.y + ") " +
      "rotate(" + piece.rotation + ") scale(" + piece.scale + ") " +
      "translate(" + (-def.anchor.x) + " " + (-def.anchor.y) + ")");

    const fallback = group.querySelector(".fallback-art");
    const layers = Array.isArray(piece.layers) ? piece.layers : [];
    const existing = new Map(
      Array.from(group.querySelectorAll(".imported-art")).map((image) => [image.getAttribute("data-layer-id"), image])
    );

    if (layers.length) {
      if (fallback) fallback.style.display = "none";
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
    ["skin", "hair", "eyes", "outfit"].forEach((key) => { $("color-" + key).value = state.colors[key]; });
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

    layers.forEach((layer, index) => {
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
    $("selected-part-desc").textContent = def.desc;
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
    $("remove-image").hidden = piece.layers.length === 0;
    $("choose-image").textContent = "Añadir capa";
    $("selected-indicator").style.background = piece.layers.length ? "#a4f1d0" : "#d8a8ff";
    renderImportedLayerList();
  }

  function render() {
    renderPartList();
    renderColors();
    PARTS.forEach(setPartTransform);
    renderInspector();
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
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
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
    if (!input || (input.version !== 1 && input.version !== 2) || !input.parts || !input.colors) {
      throw new Error("El archivo no tiene el formato de proyecto CharacterWord v1/v2.");
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
        layers: importedLayers
      };
    });
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
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!saved) return false;
      state = sanitizeProject(JSON.parse(saved));
      // Persist the normalized v2 project after migrating old single-image slots.
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
  $("remove-image").addEventListener("click", () => {
    state.parts[selectedPart].layers = [];
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