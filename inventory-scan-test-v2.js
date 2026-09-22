"use strict";

(() => {
  const MAX_PROCESS_WIDTH = 1050;
  const COLS = 4;
  const GUIDE_ASPECT = 4 / 5.35;

  const els = {
    openCamera: document.getElementById("openCamera"),
    closeCamera: document.getElementById("closeCamera"),
    capture: document.getElementById("capture"),
    fileInput: document.getElementById("fileInput"),
    cameraCard: document.getElementById("cameraCard"),
    cameraView: document.getElementById("cameraView"),
    scanGuide: document.getElementById("scanGuide"),
    video: document.getElementById("video"),
    resultCard: document.getElementById("resultCard"),
    resultTitle: document.getElementById("resultTitle"),
    cropNote: document.getElementById("cropNote"),
    displayCanvas: document.getElementById("displayCanvas"),
    workCanvas: document.getElementById("workCanvas"),
    metrics: document.getElementById("metrics"),
    slotCount: document.getElementById("slotCount"),
    occupiedCount: document.getElementById("occupiedCount"),
    gridSize: document.getElementById("gridSize"),
    qualityState: document.getElementById("qualityState"),
    status: document.getElementById("status"),
    clearImage: document.getElementById("clearImage")
  };

  let cameraStream = null;
  let guideNorm = { x: 0.2, y: 0.12, w: 0.6, h: 0.76 };

  els.openCamera.addEventListener("click", startCamera);
  els.closeCamera.addEventListener("click", stopCamera);
  els.capture.addEventListener("click", captureFrame);
  els.fileInput.addEventListener("change", handleFile);
  els.clearImage.addEventListener("click", clearImage);
  window.addEventListener("resize", updateGuide);
  window.addEventListener("orientationchange", () => setTimeout(updateGuide, 150));
  window.addEventListener("pagehide", stopCamera);
  window.addEventListener("beforeunload", stopCamera);

  async function startCamera() {
    setStatus("", "");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("Direkter Kamerazugriff wird von diesem Browser nicht unterstützt. Bitte „Foto auswählen“ verwenden.", "error");
      return;
    }

    try {
      stopCamera();
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      els.video.srcObject = cameraStream;
      await els.video.play();
      els.cameraCard.hidden = false;
      await nextFrame();
      updateGuide();
    } catch (error) {
      setStatus("Kamera konnte nicht geöffnet werden. Bitte Kameraberechtigung erlauben oder „Foto auswählen“ verwenden.", "error");
    }
  }

  function stopCamera() {
    if (cameraStream) {
      for (const track of cameraStream.getTracks()) track.stop();
      cameraStream = null;
    }
    els.video.srcObject = null;
    els.cameraCard.hidden = true;
  }

  function updateGuide() {
    if (els.cameraCard.hidden) return;
    const w = els.cameraView.clientWidth;
    const h = els.cameraView.clientHeight;
    if (!w || !h) return;

    const maxW = w * 0.62;
    const maxH = h * 0.80;
    let gw = Math.min(maxW, maxH * GUIDE_ASPECT);
    let gh = gw / GUIDE_ASPECT;
    if (gh > maxH) {
      gh = maxH;
      gw = gh * GUIDE_ASPECT;
    }

    const gx = (w - gw) / 2;
    const gy = (h - gh) / 2;
    els.scanGuide.style.left = gx + "px";
    els.scanGuide.style.top = gy + "px";
    els.scanGuide.style.width = gw + "px";
    els.scanGuide.style.height = gh + "px";

    guideNorm = { x: gx / w, y: gy / h, w: gw / w, h: gh / h };
  }

  async function captureFrame() {
    if (!els.video.videoWidth || !els.video.videoHeight) {
      setStatus("Die Kamera ist noch nicht bereit.", "error");
      return;
    }
    updateGuide();
    await analyzeSource(els.video, els.video.videoWidth, els.video.videoHeight, guideNorm, true);
    stopCamera();
  }

  async function handleFile(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Bitte ein Bild auswählen.", "error");
      return;
    }

    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
      await analyzeSource(bitmap, bitmap.width, bitmap.height, null, false);
    } catch (error) {
      setStatus("Das Bild konnte lokal nicht gelesen werden.", "error");
    } finally {
      if (bitmap && typeof bitmap.close === "function") bitmap.close();
    }
  }

  async function analyzeSource(source, sourceWidth, sourceHeight, cropNorm, fromCamera) {
    els.resultCard.hidden = false;
    els.metrics.hidden = true;
    els.cropNote.hidden = !fromCamera;
    els.resultTitle.textContent = "Analyse läuft …";
    setStatus("Das Bild wird ausschließlich auf diesem Gerät ausgewertet.", "");
    await nextFrame();

    const crop = cropNorm ? {
      sx: clamp(Math.round(sourceWidth * cropNorm.x), 0, sourceWidth - 1),
      sy: clamp(Math.round(sourceHeight * cropNorm.y), 0, sourceHeight - 1),
      sw: Math.max(1, Math.round(sourceWidth * cropNorm.w)),
      sh: Math.max(1, Math.round(sourceHeight * cropNorm.h))
    } : { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight };
    crop.sw = Math.min(crop.sw, sourceWidth - crop.sx);
    crop.sh = Math.min(crop.sh, sourceHeight - crop.sy);

    const scale = Math.min(1, MAX_PROCESS_WIDTH / crop.sw);
    const width = Math.max(1, Math.round(crop.sw * scale));
    const height = Math.max(1, Math.round(crop.sh * scale));

    const work = els.workCanvas;
    work.width = width;
    work.height = height;
    const workCtx = work.getContext("2d", { willReadFrequently: true });
    workCtx.clearRect(0, 0, width, height);
    workCtx.drawImage(source, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);

    const imageData = workCtx.getImageData(0, 0, width, height);
    const quality = assessImageQuality(imageData);
    const detection = fromCamera ? detectBackpackGuided(imageData) : detectBackpackFree(imageData);

    const display = els.displayCanvas;
    display.width = width;
    display.height = height;
    const displayCtx = display.getContext("2d");
    displayCtx.drawImage(work, 0, 0);

    if (!detection) {
      els.resultTitle.textContent = "Rucksack noch nicht erkannt";
      els.metrics.hidden = true;
      setStatus(
        fromCamera
          ? "Der sichtbare Rahmen wurde korrekt als Analysebereich verwendet, aber darin konnte noch kein zuverlässiges 4-Spalten-Raster gefunden werden. Bitte beim nächsten Versuch nur den Rucksack in den Rahmen setzen – nicht den ganzen Inventarbildschirm – und die oberste sowie unterste Slot-Reihe vollständig sichtbar lassen."
          : "Kein zuverlässiges 4-Spalten-Rucksackraster gefunden. Der Kamera-Modus mit sichtbarem Rahmen ist für den Test zuverlässiger.",
        "error"
      );
      clearWorkPixels();
      return;
    }

    drawDetection(displayCtx, detection);
    const occupied = detection.slots.filter(slot => slot.occupied).length;
    els.slotCount.textContent = String(detection.slots.length);
    els.occupiedCount.textContent = String(occupied);
    els.gridSize.textContent = "4 Sp. / " + detection.rows + " R.";
    els.qualityState.textContent = quality.label;
    els.metrics.hidden = false;
    els.resultTitle.textContent = "Rucksack erkannt";

    let note = "Erkannt: " + detection.slots.length + " Rucksackplätze, davon " + occupied + " vermutlich belegt.";
    note += detection.method === "guided-grid" ? " Erkennung über den Kamerarahmen." : " Freie Rastererkennung.";
    if (quality.level === "hard") note += " Das Bild ist relativ schwierig; genau solche Fälle sind für den Test hilfreich.";
    setStatus(note, "good");
    clearWorkPixels();
  }

  function detectBackpackGuided(imageData) {
    const componentResult = detectGridByComponents(imageData, true);
    if (componentResult) return componentResult;
    return detectGridByProjection(imageData);
  }

  function detectBackpackFree(imageData) {
    const { width, height } = imageData;
    const zones = [
      { x: 0.22, y: 0.10, w: 0.52, h: 0.84 },
      { x: 0.28, y: 0.15, w: 0.44, h: 0.75 },
      { x: 0.18, y: 0.05, w: 0.62, h: 0.90 }
    ];
    for (const z of zones) {
      const sub = cropImageData(imageData,
        Math.round(width * z.x), Math.round(height * z.y),
        Math.round(width * z.w), Math.round(height * z.h));
      const found = detectGridByComponents(sub, false) || detectGridByProjection(sub);
      if (found) {
        const ox = Math.round(width * z.x);
        const oy = Math.round(height * z.y);
        found.slots = found.slots.map(s => ({ ...s, x: s.x + ox, y: s.y + oy }));
        return found;
      }
    }
    return null;
  }

  function detectGridByComponents(imageData, guided) {
    const { width, height } = imageData;
    if (width < 120 || height < 160) return null;

    const gray = toGray(imageData);
    const edgeThreshold = estimateEdgeThreshold(gray, width, height);
    const edge = makeEdgeMap(gray, width, height, edgeThreshold);
    const dilated = dilate(edge, width, height, 1);
    const components = connectedComponents(dilated, width, height);

    const minCell = width * (guided ? 0.12 : 0.055);
    const maxCell = width * (guided ? 0.32 : 0.20);
    let candidates = components.filter(c => {
      const ratio = c.w / Math.max(1, c.h);
      const density = c.pixels / Math.max(1, c.w * c.h);
      return c.w >= minCell && c.w <= maxCell && c.h >= minCell * 0.78 && c.h <= maxCell * 1.2 &&
        ratio >= 0.62 && ratio <= 1.45 && density >= 0.025;
    });

    candidates = dedupeCandidates(candidates);
    if (candidates.length < 10) return null;

    const medianW = median(candidates.map(c => c.w));
    const medianH = median(candidates.map(c => c.h));
    const xGroups = clusterValues(candidates.map((c, index) => ({ value: c.x + c.w / 2, index })), medianW * 0.38)
      .filter(g => g.items.length >= 2)
      .sort((a, b) => a.mean - b.mean);
    if (xGroups.length < COLS) return null;

    const bestCols = chooseFourColumns(xGroups, medianW, width);
    if (!bestCols) return null;

    const selectedIndexes = new Set(bestCols.seq.flatMap(g => g.items.map(i => i.index)));
    const selected = [...selectedIndexes].map(index => candidates[index]);
    let yGroups = clusterValues(selected.map((c, index) => ({ value: c.y + c.h / 2, index })), medianH * 0.40)
      .filter(g => g.items.length >= 2)
      .sort((a, b) => a.mean - b.mean);
    yGroups = pickBestRowSequence(yGroups, medianH);
    if (yGroups.length < 4 || yGroups.length > 7) return null;

    const xCenters = bestCols.seq.map(g => g.mean);
    const yCenters = yGroups.map(g => g.mean);
    const slots = [];
    const used = new Set();

    for (let row = 0; row < yCenters.length; row++) {
      for (let col = 0; col < xCenters.length; col++) {
        let best = null;
        for (let i = 0; i < candidates.length; i++) {
          if (used.has(i)) continue;
          const c = candidates[i];
          const dx = ((c.x + c.w / 2) - xCenters[col]) / (medianW * 0.62);
          const dy = ((c.y + c.h / 2) - yCenters[row]) / (medianH * 0.62);
          const d = dx * dx + dy * dy;
          if (d < 1 && (!best || d < best.d)) best = { i, c, d };
        }
        if (best) {
          used.add(best.i);
          slots.push({ ...best.c, row, col, occupied: isOccupiedSlot(imageData, best.c) });
        }
      }
    }

    const normalized = normalizeSlotSet(slots, yCenters.length);
    if (!normalized) return null;
    return { ...normalized, method: guided ? "guided-grid" : "free-components" };
  }

  function detectGridByProjection(imageData) {
    const { width, height } = imageData;
    const gray = toGray(imageData);
    const threshold = estimateEdgeThreshold(gray, width, height);
    const v = new Float64Array(width);
    const h = new Float64Array(height);

    for (let y = 1; y < height - 1; y += 2) {
      for (let x = 1; x < width - 1; x += 2) {
        const i = y * width + x;
        const gx = Math.abs(gray[i + 1] - gray[i - 1]);
        const gy = Math.abs(gray[i + width] - gray[i - width]);
        if (gx > threshold * 0.55) v[x] += gx;
        if (gy > threshold * 0.55) h[y] += gy;
      }
    }

    const vs = smooth(v, Math.max(2, Math.round(width * 0.006)));
    const hs = smooth(h, Math.max(2, Math.round(height * 0.004)));
    const vPeaks = findPeaks(vs, width * 0.025, 16);
    const hPeaks = findPeaks(hs, height * 0.018, 20);
    const xSeq = chooseBoundarySequence(vPeaks, 5, width, 0.12, 0.30);
    if (!xSeq) return null;

    const xGap = mean(diff(xSeq));
    const ySeq = chooseHorizontalSequence(hPeaks, height, xGap);
    if (!ySeq || ySeq.length < 5 || ySeq.length > 7) return null;

    const slots = [];
    for (let row = 0; row < ySeq.length - 1; row++) {
      for (let col = 0; col < 4; col++) {
        const box = {
          x: Math.round(xSeq[col]),
          y: Math.round(ySeq[row]),
          w: Math.round(xSeq[col + 1] - xSeq[col]),
          h: Math.round(ySeq[row + 1] - ySeq[row]),
          row,
          col
        };
        if (box.w < 20 || box.h < 20) continue;
        const border = borderStrength(gray, width, height, box);
        if (border < threshold * 0.18 && row === ySeq.length - 2 && col >= 2) continue;
        slots.push({ ...box, occupied: isOccupiedSlot(imageData, box) });
      }
    }

    const normalized = normalizeSlotSet(slots, ySeq.length - 1);
    if (!normalized) return null;
    return { ...normalized, method: "guided-grid" };
  }

  function normalizeSlotSet(slots, rows) {
    if (rows < 4 || rows > 7) return null;
    const counts = new Array(rows).fill(0);
    for (const s of slots) counts[s.row]++;
    if (counts.slice(0, Math.min(3, rows)).some(c => c < 3)) return null;

    let endRow = rows - 1;
    while (endRow >= 0 && counts[endRow] === 0) endRow--;
    const kept = slots.filter(s => s.row <= endRow);
    const keptRows = endRow + 1;
    if (keptRows < 4) return null;

    const total = kept.length;
    if (total < 14 || total > 28) return null;
    return { slots: kept, rows: keptRows, cols: 4 };
  }

  function chooseFourColumns(groups, medianW, width) {
    let best = null;
    for (let i = 0; i <= groups.length - 4; i++) {
      const seq = groups.slice(i, i + 4);
      const gaps = diff(seq.map(g => g.mean));
      const gm = mean(gaps);
      if (gm < medianW * 0.65 || gm > medianW * 1.6) continue;
      const regularity = stdDev(gaps) / Math.max(1, gm);
      if (regularity > 0.24) continue;
      const count = seq.reduce((sum, g) => sum + g.items.length, 0);
      const span = seq[3].mean - seq[0].mean;
      const centered = Math.abs(mean(seq.map(g => g.mean)) - width / 2) / width;
      const score = count + span / width * 5 - regularity * 12 - centered * 2;
      if (!best || score > best.score) best = { seq, score };
    }
    return best;
  }

  function chooseBoundarySequence(peaks, count, size, minGapFrac, maxGapFrac) {
    if (peaks.length < count) return null;
    let best = null;
    const sorted = [...peaks].sort((a, b) => a.x - b.x);
    for (let start = 0; start < sorted.length; start++) {
      for (let end = start + count - 1; end < sorted.length; end++) {
        const first = sorted[start].x;
        const last = sorted[end].x;
        const gap = (last - first) / (count - 1);
        if (gap < size * minGapFrac || gap > size * maxGapFrac) continue;
        const seq = [];
        let score = 0;
        let valid = true;
        for (let k = 0; k < count; k++) {
          const target = first + gap * k;
          let nearest = null;
          for (const p of sorted) {
            const d = Math.abs(p.x - target);
            if (d <= gap * 0.16 && (!nearest || d < nearest.d)) nearest = { ...p, d };
          }
          if (!nearest) { valid = false; break; }
          seq.push(nearest.x);
          score += nearest.value - nearest.d * 2;
        }
        if (!valid) continue;
        if (!best || score > best.score) best = { seq, score };
      }
    }
    return best ? best.seq : null;
  }

  function chooseHorizontalSequence(peaks, height, xGap) {
    const sorted = [...peaks].sort((a, b) => a.x - b.x);
    let best = null;
    for (let boundaries = 5; boundaries <= 7; boundaries++) {
      for (let i = 0; i < sorted.length; i++) {
        const first = sorted[i].x;
        for (let gapScale = 0.76; gapScale <= 1.20; gapScale += 0.04) {
          const gap = xGap * gapScale;
          const seq = [];
          let score = 0;
          let valid = true;
          for (let k = 0; k < boundaries; k++) {
            const target = first + gap * k;
            if (target > height - 2) { valid = false; break; }
            let nearest = null;
            for (const p of sorted) {
              const d = Math.abs(p.x - target);
              if (d <= gap * 0.18 && (!nearest || d < nearest.d)) nearest = { ...p, d };
            }
            if (!nearest) { valid = false; break; }
            seq.push(nearest.x);
            score += nearest.value - nearest.d * 1.5;
          }
          if (valid && (!best || score > best.score)) best = { seq, score };
        }
      }
    }
    return best ? best.seq : null;
  }

  function findPeaks(values, minDistance, maxPeaks) {
    const list = [];
    const arr = Array.from(values);
    const sortedVals = [...arr].sort((a, b) => a - b);
    const cutoff = percentileSorted(sortedVals, 0.72);
    for (let i = 1; i < arr.length - 1; i++) {
      if (arr[i] >= cutoff && arr[i] >= arr[i - 1] && arr[i] >= arr[i + 1]) list.push({ x: i, value: arr[i] });
    }
    list.sort((a, b) => b.value - a.value);
    const chosen = [];
    for (const p of list) {
      if (chosen.every(q => Math.abs(q.x - p.x) >= minDistance)) chosen.push(p);
      if (chosen.length >= maxPeaks) break;
    }
    return chosen.sort((a, b) => a.x - b.x);
  }

  function borderStrength(gray, width, height, box) {
    const x0 = clamp(box.x, 1, width - 2), x1 = clamp(box.x + box.w, 1, width - 2);
    const y0 = clamp(box.y, 1, height - 2), y1 = clamp(box.y + box.h, 1, height - 2);
    let sum = 0, n = 0;
    const sample = (x, y) => {
      const i = y * width + x;
      return Math.abs(gray[i + 1] - gray[i - 1]) + Math.abs(gray[i + width] - gray[i - width]);
    };
    for (let x = x0; x <= x1; x += 3) { sum += sample(x, y0) + sample(x, y1); n += 2; }
    for (let y = y0; y <= y1; y += 3) { sum += sample(x0, y) + sample(x1, y); n += 2; }
    return n ? sum / n : 0;
  }

  function toGray(imageData) {
    const { width, height, data } = imageData;
    const gray = new Uint8Array(width * height);
    for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
      gray[i] = Math.round(data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114);
    }
    return gray;
  }

  function estimateEdgeThreshold(gray, width, height) {
    const values = [];
    for (let y = 1; y < height - 1; y += 4) {
      for (let x = 1; x < width - 1; x += 4) {
        const i = y * width + x;
        values.push(Math.abs(gray[i + 1] - gray[i - 1]) + Math.abs(gray[i + width] - gray[i - width]));
      }
    }
    values.sort((a, b) => a - b);
    return clamp(percentileSorted(values, 0.87), 34, 78);
  }

  function makeEdgeMap(gray, width, height, threshold) {
    const edge = new Uint8Array(width * height);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = y * width + x;
        const g = Math.abs(gray[i + 1] - gray[i - 1]) + Math.abs(gray[i + width] - gray[i - width]);
        if (g >= threshold) edge[i] = 1;
      }
    }
    return edge;
  }

  function dilate(binary, width, height, radius) {
    const out = new Uint8Array(binary.length);
    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const i = y * width + x;
        if (!binary[i]) continue;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) out[(y + dy) * width + x + dx] = 1;
        }
      }
    }
    return out;
  }

  function connectedComponents(binary, width, height) {
    const map = binary.slice();
    const stack = new Int32Array(map.length);
    const out = [];
    for (let start = 0; start < map.length; start++) {
      if (!map[start]) continue;
      let top = 0;
      stack[top++] = start;
      map[start] = 0;
      let minX = width, minY = height, maxX = 0, maxY = 0, pixels = 0;
      while (top) {
        const i = stack[--top];
        const y = Math.floor(i / width), x = i - y * width;
        pixels++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
        for (let dy = -1; dy <= 1; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= height) continue;
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = x + dx;
            if (nx < 0 || nx >= width) continue;
            const ni = ny * width + nx;
            if (!map[ni]) continue;
            map[ni] = 0;
            stack[top++] = ni;
          }
        }
      }
      out.push({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, pixels });
    }
    return out;
  }

  function dedupeCandidates(candidates) {
    const sorted = [...candidates].sort((a, b) => b.w * b.h - a.w * a.h);
    const kept = [];
    for (const c of sorted) {
      const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      const dup = kept.some(k => Math.abs(cx - (k.x + k.w / 2)) < Math.min(c.w, k.w) * 0.18 && Math.abs(cy - (k.y + k.h / 2)) < Math.min(c.h, k.h) * 0.18);
      if (!dup) kept.push(c);
    }
    return kept;
  }

  function clusterValues(values, tolerance) {
    const groups = [];
    for (const item of [...values].sort((a, b) => a.value - b.value)) {
      let best = null, dist = Infinity;
      for (const g of groups) {
        const d = Math.abs(item.value - g.mean);
        if (d <= tolerance && d < dist) { best = g; dist = d; }
      }
      if (!best) groups.push({ mean: item.value, items: [item] });
      else { best.items.push(item); best.mean = mean(best.items.map(v => v.value)); }
    }
    return groups;
  }

  function pickBestRowSequence(groups, medianH) {
    let best = [];
    for (let start = 0; start < groups.length; start++) {
      const seq = [groups[start]];
      for (let i = start + 1; i < groups.length; i++) {
        const gap = groups[i].mean - seq[seq.length - 1].mean;
        if (gap >= medianH * 0.58 && gap <= medianH * 1.55) seq.push(groups[i]);
        else if (gap > medianH * 1.55) break;
      }
      const score = seq.reduce((sum, g) => sum + Math.min(4, g.items.length), 0) + seq.length * 2;
      const bestScore = best.reduce((sum, g) => sum + Math.min(4, g.items.length), 0) + best.length * 2;
      if (score > bestScore) best = seq;
    }
    return best;
  }

  function isOccupiedSlot(imageData, box) {
    const { width, height, data } = imageData;
    const margin = Math.max(3, Math.round(Math.min(box.w, box.h) * 0.14));
    const x0 = clamp(Math.round(box.x + margin), 0, width - 1);
    const y0 = clamp(Math.round(box.y + margin), 0, height - 1);
    const x1 = clamp(Math.round(box.x + box.w - margin), x0 + 1, width);
    const y1 = clamp(Math.round(box.y + box.h - margin), y0 + 1, height);
    let n = 0, sum = 0, sumSq = 0, bright = 0;
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const p = (y * width + x) * 4;
        const g = data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114;
        n++; sum += g; sumSq += g * g; if (g > 130) bright++;
      }
    }
    if (!n) return false;
    const avg = sum / n;
    const sd = Math.sqrt(Math.max(0, sumSq / n - avg * avg));
    return sd > 18 || bright / n > 0.11;
  }

  function assessImageQuality(imageData) {
    const { width, height, data } = imageData;
    const values = [];
    let blown = 0, sampled = 0;
    const step = Math.max(2, Math.round(width / 450));
    for (let y = step; y < height - step; y += step) {
      for (let x = step; x < width - step; x += step) {
        const p = (y * width + x) * 4;
        const l = data[p] * .299 + data[p + 1] * .587 + data[p + 2] * .114;
        const px = (y * width + x + step) * 4;
        const py = ((y + step) * width + x) * 4;
        const lx = data[px] * .299 + data[px + 1] * .587 + data[px + 2] * .114;
        const ly = data[py] * .299 + data[py + 1] * .587 + data[py + 2] * .114;
        values.push(Math.abs(lx - l) + Math.abs(ly - l));
        if (data[p] > 245 && data[p + 1] > 245 && data[p + 2] > 245) blown++;
        sampled++;
      }
    }
    values.sort((a, b) => a - b);
    const edge90 = percentileSorted(values, .90), blownRatio = sampled ? blown / sampled : 0;
    if (edge90 < 20 || blownRatio > .09) return { label: "schwierig", level: "hard" };
    if (edge90 < 33 || blownRatio > .045) return { label: "brauchbar", level: "ok" };
    return { label: "gut", level: "good" };
  }

  function drawDetection(ctx, detection) {
    ctx.save();
    ctx.lineWidth = Math.max(2, ctx.canvas.width / 420);
    ctx.font = "700 " + Math.max(11, Math.round(ctx.canvas.width / 48)) + "px system-ui,sans-serif";
    ctx.textBaseline = "top";
    for (const slot of detection.slots) {
      const color = slot.occupied ? "#69d39b" : "#7aa7d8";
      ctx.strokeStyle = color;
      ctx.fillStyle = slot.occupied ? "rgba(105,211,155,.12)" : "rgba(122,167,216,.08)";
      ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);
      const label = String(slot.row * 4 + slot.col + 1);
      const m = ctx.measureText(label);
      ctx.fillStyle = "rgba(8,11,15,.82)";
      ctx.fillRect(slot.x + 4, slot.y + 4, m.width + 8, Math.max(18, parseInt(ctx.font, 10) + 5));
      ctx.fillStyle = color;
      ctx.fillText(label, slot.x + 8, slot.y + 6);
    }
    ctx.restore();
  }

  function cropImageData(imageData, x, y, w, h) {
    x = clamp(x, 0, imageData.width - 1); y = clamp(y, 0, imageData.height - 1);
    w = Math.min(w, imageData.width - x); h = Math.min(h, imageData.height - y);
    const out = new Uint8ClampedArray(w * h * 4);
    for (let row = 0; row < h; row++) {
      const srcStart = ((y + row) * imageData.width + x) * 4;
      out.set(imageData.data.subarray(srcStart, srcStart + w * 4), row * w * 4);
    }
    return new ImageData(out, w, h);
  }

  function smooth(values, radius) {
    const out = new Float64Array(values.length);
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      if (i - radius - 1 >= 0) sum -= values[i - radius - 1];
      const left = Math.max(0, i - radius);
      out[i] = sum / (i - left + 1);
    }
    return out;
  }

  function clearImage() {
    stopCamera();
    els.resultCard.hidden = true;
    els.metrics.hidden = true;
    els.cropNote.hidden = true;
    els.resultTitle.textContent = "Analyse läuft …";
    setStatus("", "");
    clearCanvas(els.displayCanvas);
    clearCanvas(els.workCanvas);
  }

  function clearWorkPixels() { clearCanvas(els.workCanvas); }
  function clearCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    if (canvas.width && canvas.height) ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 1; canvas.height = 1;
  }
  function setStatus(message, kind) {
    els.status.textContent = message;
    els.status.className = "status" + (kind ? " " + kind : "");
  }
  function percentileSorted(values, fraction) {
    if (!values.length) return 0;
    return values[Math.min(values.length - 1, Math.max(0, Math.floor((values.length - 1) * fraction)))];
  }
  function median(values) {
    if (!values.length) return 0;
    const s = [...values].sort((a, b) => a - b), m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }
  function mean(values) { return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0; }
  function stdDev(values) { const a = mean(values); return values.length ? Math.sqrt(mean(values.map(v => (v - a) ** 2))) : 0; }
  function diff(values) { const out = []; for (let i = 1; i < values.length; i++) out.push(values[i] - values[i - 1]); return out; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function nextFrame() { return new Promise(resolve => requestAnimationFrame(() => resolve())); }
})();