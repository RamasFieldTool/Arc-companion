"use strict";
(() => {
  const TEST_TAG = "camera test v9";
  const RAW_ICON_BASE = "https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/images/items/";
  const MAX_TEMPLATES = 240;
  const TEMPLATE_WORKERS = 10;

  const display = document.getElementById("displayCanvas");
  const work = document.getElementById("workCanvas");
  const resultTitle = document.getElementById("resultTitle");
  const totalOccupied = document.getElementById("totalOccupied");
  const backpackSlots = document.getElementById("backpackSlots");
  const backpackOccupied = document.getElementById("backpackOccupied");
  const quickSlots = document.getElementById("quickSlots");
  const quickOccupied = document.getElementById("quickOccupied");
  const safeSlots = document.getElementById("safeSlots");
  const safeOccupied = document.getElementById("safeOccupied");
  if (!display || !work || !resultTitle) return;

  const boxes = { B: [], Q: [], S: [] };
  let cleanFrame = null;
  let templatePromise = null;
  let scanGeneration = 0;
  let scheduled = 0;

  const proto = CanvasRenderingContext2D.prototype;
  const previousDrawImage = proto.drawImage;
  const previousStrokeRect = proto.strokeRect;

  proto.drawImage = function (...args) {
    const result = previousDrawImage.apply(this, args);
    try {
      if (this.canvas === display && args[0] === work) {
        boxes.B.length = 0;
        boxes.Q.length = 0;
        boxes.S.length = 0;
        cleanFrame = this.getImageData(0, 0, display.width, display.height);
        scanGeneration += 1;
      }
    } catch (_) {}
    return result;
  };

  proto.strokeRect = function (x, y, w, h) {
    try {
      if (this.canvas === display && [x, y, w, h].every(Number.isFinite)) {
        const kind = kindForColor(this.strokeStyle);
        if (kind) addUnique(boxes[kind], { x, y, w, h });
      }
    } catch (_) {}
    return previousStrokeRect.call(this, x, y, w, h);
  };

  function kindForColor(style) {
    const s = String(style || "").replace(/\s+/g, "").toLowerCase();
    if (s === "#69d39b" || s.includes("105,211,155")) return "B";
    if (s === "#ffb17f" || s.includes("255,177,127")) return "Q";
    if (s === "#9dbfff" || s.includes("157,191,255")) return "S";
    return null;
  }

  function addUnique(list, box) {
    const duplicate = list.some(b =>
      Math.abs(b.x - box.x) < 2 &&
      Math.abs(b.y - box.y) < 2 &&
      Math.abs(b.w - box.w) < 3 &&
      Math.abs(b.h - box.h) < 3
    );
    if (!duplicate) list.push(box);
  }

  const observer = new MutationObserver(scheduleRecognition);
  observer.observe(resultTitle, { childList: true, characterData: true, subtree: true });
  if (totalOccupied) observer.observe(totalOccupied, { childList: true, characterData: true, subtree: true });
  if (backpackOccupied) observer.observe(backpackOccupied, { childList: true, characterData: true, subtree: true });
  if (quickOccupied) observer.observe(quickOccupied, { childList: true, characterData: true, subtree: true });

  function scheduleRecognition() {
    if (!cleanFrame || !/inventarbereiche erkannt/i.test(resultTitle.textContent || "")) return;
    clearTimeout(scheduled);
    const generation = scanGeneration;
    scheduled = setTimeout(() => runRecognition(generation), 260);
  }

  async function runRecognition(generation) {
    if (!cleanFrame || generation !== scanGeneration) return;

    const panel = ensurePanel();
    panel.state.textContent = "Referenz-Icons werden geladen und die belegten Slots lokal verglichen …";
    panel.output.textContent = `[${TEST_TAG}]\nstatus: loading reference icons`;

    let catalog;
    try {
      catalog = await loadTemplates();
    } catch (error) {
      if (generation !== scanGeneration) return;
      panel.state.textContent = "Referenz-Icons konnten nicht geladen werden.";
      panel.output.textContent = `[${TEST_TAG}]\nerror: ${safeMessage(error)}`;
      return;
    }
    if (generation !== scanGeneration) return;

    if (!catalog.templates.length) {
      panel.state.textContent = "Keine nutzbaren Referenz-Icons geladen.";
      panel.output.textContent = `[${TEST_TAG}]\nreference-icons: 0/${catalog.attempted}`;
      return;
    }

    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = cleanFrame.width;
    sourceCanvas.height = cleanFrame.height;
    const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
    sourceCtx.putImageData(cleanFrame, 0, 0);

    const groups = [
      makeGroup("B", "Rucksack", boxes.B, backpackSlots, backpackOccupied),
      makeGroup("Q", "Schnelleinsatz", boxes.Q, quickSlots, quickOccupied),
      makeGroup("S", "Sicherheitstasche", boxes.S, safeSlots, safeOccupied)
    ];

    const results = [];
    for (const group of groups) {
      const selected = selectOccupied(group.kind, group.boxes, group.occupiedCount);
      for (const entry of selected) {
        if (generation !== scanGeneration) return;
        const variants = descriptorsForDrawable(sourceCanvas, entry.box.x, entry.box.y, entry.box.w, entry.box.h);
        if (!variants.length) continue;
        const top = rankTemplates(variants, catalog.templates, 3);
        if (!top.length) continue;
        results.push({
          kind: group.kind,
          area: group.name,
          index: entry.index,
          box: entry.box,
          top
        });
      }
    }

    if (generation !== scanGeneration) return;
    drawTopMatches(results);
    renderResults(panel, catalog, results);
  }

  function makeGroup(kind, name, rawBoxes, slotsEl, occupiedEl) {
    let ordered = rawBoxes.slice().sort((a, b) => (a.y - b.y) || (a.x - b.x));
    const declaredSlots = parseCount(slotsEl?.textContent);
    if (Number.isFinite(declaredSlots) && declaredSlots >= 0 && ordered.length > declaredSlots) {
      ordered = ordered.slice(0, declaredSlots);
    }
    return {
      kind,
      name,
      boxes: ordered,
      occupiedCount: parseCount(occupiedEl?.textContent)
    };
  }

  function selectOccupied(kind, orderedBoxes, occupiedCount) {
    const entries = orderedBoxes.map((box, index) => ({
      box,
      index: index + 1,
      occupancy: occupancyScore(kind, box)
    }));

    if (Number.isFinite(occupiedCount) && occupiedCount >= 0) {
      const selected = new Set(
        entries
          .slice()
          .sort((a, b) => b.occupancy - a.occupancy)
          .slice(0, Math.min(occupiedCount, entries.length))
          .map(e => e.index)
      );
      return entries.filter(e => selected.has(e.index));
    }

    return entries.filter(e => e.occupancy >= 0.22);
  }

  function occupancyScore(kind, box) {
    if (!cleanFrame) return 0;
    const body = regionStats(box, 0.14, 0.08, 0.86, 0.70);
    const left = regionStats(box, 0.05, 0.62, 0.38, 0.94);
    const right = regionStats(box, 0.58, 0.62, 0.96, 0.94);

    if (kind === "Q") {
      return left.whiteRatio * 1.8 + right.whiteRatio * 1.7 + body.satRatio * 0.8 + body.brightRatio * 0.55;
    }
    if (kind === "S") {
      return body.brightRatio * 1.35 + body.satRatio * 0.55 + (left.whiteRatio + right.whiteRatio) * 0.75;
    }
    return body.brightRatio * 1.45 + body.satRatio * 0.42 + (left.whiteRatio + right.whiteRatio) * 0.58;
  }

  function regionStats(box, fx0, fy0, fx1, fy1) {
    const { width, height, data } = cleanFrame;
    const x0 = clamp(Math.round(box.x + box.w * fx0), 0, width - 1);
    const y0 = clamp(Math.round(box.y + box.h * fy0), 0, height - 1);
    const x1 = clamp(Math.round(box.x + box.w * fx1), x0 + 1, width);
    const y1 = clamp(Math.round(box.y + box.h * fy1), y0 + 1, height);

    let n = 0, bright = 0, white = 0, saturated = 0;
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const p = (y * width + x) * 4;
        const r = data[p], g = data[p + 1], b = data[p + 2];
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const lum = r * 0.299 + g * 0.587 + b * 0.114;
        const sat = mx ? (mx - mn) / mx : 0;
        if (lum > 145) bright += 1;
        if (lum > 138 && sat < 0.30) white += 1;
        if (mx > 68 && sat > 0.32) saturated += 1;
        n += 1;
      }
    }
    return {
      brightRatio: n ? bright / n : 0,
      whiteRatio: n ? white / n : 0,
      satRatio: n ? saturated / n : 0
    };
  }

  async function loadTemplates() {
    if (templatePromise) return templatePromise;
    templatePromise = (async () => {
      let items = [];
      try {
        const response = await fetch("items.json", { cache: "force-cache", credentials: "same-origin" });
        if (!response.ok) throw new Error(`items.json HTTP ${response.status}`);
        items = await response.json();
      } catch (_) {
        items = [
          { id: "metal_parts", en: "Metal Parts", de: "Metallteile" },
          { id: "rubber_parts", en: "Rubber Parts", de: "Gummiteile" },
          { id: "wires", en: "Wires", de: "Kabel" },
          { id: "duct_tape", en: "Duct Tape", de: "Isolierband" },
          { id: "plastic_parts", en: "Plastic Parts", de: "Plastikteile" }
        ];
      }

      const unique = [];
      const seen = new Set();
      for (const item of Array.isArray(items) ? items : []) {
        const id = String(item?.id || "").trim();
        if (!/^[a-z0-9_]+$/.test(id) || seen.has(id)) continue;
        seen.add(id);
        unique.push({ id, en: String(item.en || id), de: String(item.de || item.en || id) });
        if (unique.length >= MAX_TEMPLATES) break;
      }

      const templates = [];
      let cursor = 0;
      async function worker() {
        while (true) {
          const i = cursor++;
          if (i >= unique.length) return;
          const item = unique[i];
          const template = await loadTemplate(item);
          if (template) templates.push(template);
        }
      }
      const workerCount = Math.max(1, Math.min(TEMPLATE_WORKERS, unique.length));
      await Promise.all(Array.from({ length: workerCount }, worker));
      templates.sort((a, b) => a.id.localeCompare(b.id));
      return { templates, attempted: unique.length, catalogSize: Array.isArray(items) ? items.length : unique.length };
    })();
    return templatePromise;
  }

  async function loadTemplate(item) {
    const image = await loadImage(`${RAW_ICON_BASE}${item.id}.png`, 7000);
    if (!image) return null;
    try {
      const variants = descriptorsForDrawable(image, 0, 0, image.naturalWidth || image.width, image.naturalHeight || image.height);
      if (!variants.length) return null;
      return { ...item, variants };
    } catch (_) {
      return null;
    }
  }

  function loadImage(url, timeoutMs) {
    return new Promise(resolve => {
      const img = new Image();
      let done = false;
      const finish = value => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        img.onload = null;
        img.onerror = null;
        resolve(value);
      };
      const timer = setTimeout(() => finish(null), timeoutMs);
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.onload = () => finish(img);
      img.onerror = () => finish(null);
      img.src = url;
    });
  }

  function descriptorsForDrawable(source, sx, sy, sw, sh) {
    if (!(sw > 2 && sh > 2)) return [];
    const variants = [];
    for (const zoom of [1.00, 0.84]) {
      const desc = makeDescriptor(source, sx, sy, sw, sh, zoom);
      if (desc) variants.push(desc);
    }
    return variants;
  }

  function makeDescriptor(source, sx, sy, sw, sh, zoom) {
    const SIZE = 24;
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    // Ignore most borders and the lower quantity/type UI. The same crop is
    // applied to canonical icons and screenshot slots so the item silhouette
    // dominates the comparison.
    let x = sx + sw * 0.05;
    let y = sy + sh * 0.04;
    let w = sw * 0.90;
    let h = sh * 0.74;
    if (zoom < 1) {
      const nw = w * zoom, nh = h * zoom;
      x += (w - nw) * 0.5;
      y += (h - nh) * 0.48;
      w = nw; h = nh;
    }

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.drawImage(source, x, y, w, h, 0, 0, SIZE, SIZE);
    const pixels = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const grayRaw = new Float32Array(SIZE * SIZE);
    const hueHist = new Float32Array(12);
    const lumHist = new Float32Array(8);

    for (let i = 0; i < grayRaw.length; i++) {
      const p = i * 4;
      const r = pixels[p], g = pixels[p + 1], b = pixels[p + 2];
      const lum = r * 0.299 + g * 0.587 + b * 0.114;
      grayRaw[i] = lum;
      lumHist[Math.min(7, Math.floor(lum / 32))] += 1;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const delta = mx - mn;
      const sat = mx ? delta / mx : 0;
      if (delta > 7 && sat > 0.12) {
        let hue;
        if (mx === r) hue = ((g - b) / delta) % 6;
        else if (mx === g) hue = (b - r) / delta + 2;
        else hue = (r - g) / delta + 4;
        hue = (hue * 60 + 360) % 360;
        hueHist[Math.min(11, Math.floor(hue / 30))] += Math.max(0.15, sat);
      }
    }

    const gray = standardize(grayRaw);
    const edgeRaw = [];
    for (let yy = 1; yy < SIZE - 1; yy++) {
      for (let xx = 1; xx < SIZE - 1; xx++) {
        const i = yy * SIZE + xx;
        const gx = grayRaw[i + 1] - grayRaw[i - 1];
        const gy = grayRaw[i + SIZE] - grayRaw[i - SIZE];
        edgeRaw.push(Math.sqrt(gx * gx + gy * gy));
      }
    }
    const edge = standardize(Float32Array.from(edgeRaw));
    normalizeHistogram(hueHist);
    normalizeHistogram(lumHist);
    return { gray, edge, hueHist, lumHist };
  }

  function standardize(values) {
    let mean = 0;
    for (const v of values) mean += v;
    mean /= Math.max(1, values.length);
    let variance = 0;
    for (const v of values) {
      const d = v - mean;
      variance += d * d;
    }
    const sd = Math.sqrt(variance / Math.max(1, values.length)) || 1;
    const out = new Float32Array(values.length);
    for (let i = 0; i < values.length; i++) out[i] = (values[i] - mean) / sd;
    return out;
  }

  function normalizeHistogram(hist) {
    let sum = 0;
    for (const v of hist) sum += v * v;
    const norm = Math.sqrt(sum) || 1;
    for (let i = 0; i < hist.length; i++) hist[i] /= norm;
  }

  function rankTemplates(slotVariants, templates, limit) {
    const best = [];
    for (const template of templates) {
      let score = 0;
      for (const slot of slotVariants) {
        for (const ref of template.variants) {
          score = Math.max(score, descriptorSimilarity(slot, ref));
        }
      }
      insertRanked(best, { template, score }, limit);
    }
    return best;
  }

  function descriptorSimilarity(a, b) {
    const gray = (correlation(a.gray, b.gray) + 1) * 0.5;
    const edge = (correlation(a.edge, b.edge) + 1) * 0.5;
    const hue = dot(a.hueHist, b.hueHist);
    const lum = dot(a.lumHist, b.lumHist);
    return clamp(gray * 0.46 + edge * 0.36 + hue * 0.10 + lum * 0.08, 0, 1);
  }

  function correlation(a, b) {
    const n = Math.min(a.length, b.length);
    if (!n) return 0;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += a[i] * b[i];
    return clamp(sum / n, -1, 1);
  }

  function dot(a, b) {
    const n = Math.min(a.length, b.length);
    let sum = 0;
    for (let i = 0; i < n; i++) sum += a[i] * b[i];
    return clamp(sum, 0, 1);
  }

  function insertRanked(list, value, limit) {
    let i = 0;
    while (i < list.length && list[i].score >= value.score) i += 1;
    list.splice(i, 0, value);
    if (list.length > limit) list.length = limit;
  }

  function drawTopMatches(results) {
    const ctx = display.getContext("2d");
    if (!ctx) return;
    ctx.save();
    const fontSize = Math.max(10, Math.round(display.width / 82));
    ctx.font = `700 ${fontSize}px ui-monospace,monospace`;
    ctx.textBaseline = "bottom";
    for (const result of results) {
      const top = result.top[0];
      if (!top) continue;
      const label = `${result.kind}${result.index} ${shortId(top.template.id)} ${Math.round(top.score * 100)}`;
      const metrics = ctx.measureText(label);
      const x = Math.max(1, result.box.x + 2);
      const y = Math.max(fontSize + 4, result.box.y + result.box.h - 3);
      ctx.fillStyle = "rgba(8,11,15,.82)";
      ctx.fillRect(x - 1, y - fontSize - 2, metrics.width + 4, fontSize + 4);
      ctx.fillStyle = "#f4f6f8";
      ctx.fillText(label, x + 1, y);
    }
    ctx.restore();
  }

  function renderResults(panel, catalog, results) {
    const lines = [
      `[${TEST_TAG}]`,
      `reference-icons: ${catalog.templates.length}/${catalog.attempted} loaded`,
      `catalog-items: ${catalog.catalogSize}`,
      `occupied-slots-tested: ${results.length}`
    ];

    for (const result of results) {
      const candidates = result.top.map(({ template, score }) => `${template.id} ${(score * 100).toFixed(1)}`).join(" | ");
      lines.push(`${result.kind}${result.index}: ${candidates}`);
    }

    if (!results.length) {
      lines.push("note: no occupied slot boxes available for recognition");
    }

    panel.state.textContent = results.length
      ? `${results.length} belegte Slots gegen ${catalog.templates.length} Referenz-Icons verglichen. Die Prozentwerte sind Ähnlichkeitswerte, noch keine verlässlichen Trefferwahrscheinlichkeiten.`
      : "Slot-Erkennung lief, aber für Test 9 konnten keine belegten Slots ausgewählt werden.";
    panel.output.textContent = lines.join("\n");
  }

  function ensurePanel() {
    let root = document.getElementById("itemRecognitionTest");
    if (!root) {
      root = document.createElement("section");
      root.id = "itemRecognitionTest";
      root.className = "scope-card";

      const heading = document.createElement("strong");
      heading.textContent = "Test 9 – Item-Erkennung (experimentell)";
      const note = document.createElement("p");
      note.textContent = "Nur die bereits als belegt gezählten Slots werden mit öffentlichen ARC-Raiders-Referenz-Icons verglichen. Das Inventarbild selbst bleibt auf diesem Gerät.";
      const state = document.createElement("p");
      state.id = "itemRecognitionState";
      const output = document.createElement("pre");
      output.id = "itemRecognitionOutput";
      output.setAttribute("aria-label", "Test-9-Diagnose");

      root.append(heading, note, state, output);
      const resultCard = document.getElementById("resultCard");
      if (resultCard?.parentNode) resultCard.parentNode.insertBefore(root, resultCard.nextSibling);
      else document.querySelector("main")?.appendChild(root);
    }
    return {
      root,
      state: document.getElementById("itemRecognitionState"),
      output: document.getElementById("itemRecognitionOutput")
    };
  }

  function parseCount(text) {
    const match = String(text || "").match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : NaN;
  }

  function shortId(id) {
    const s = String(id || "?");
    return s.length > 16 ? s.slice(0, 15) + "…" : s;
  }

  function safeMessage(error) {
    return String(error?.message || error || "unknown error").replace(/[\r\n]+/g, " ").slice(0, 180);
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
})();
