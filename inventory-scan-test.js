"use strict";

(() => {
  const MAX_PROCESS_WIDTH = 1200;
  const COLS = 4;

  const els = {
    openCamera: document.getElementById("openCamera"),
    closeCamera: document.getElementById("closeCamera"),
    capture: document.getElementById("capture"),
    fileInput: document.getElementById("fileInput"),
    cameraCard: document.getElementById("cameraCard"),
    video: document.getElementById("video"),
    resultCard: document.getElementById("resultCard"),
    resultTitle: document.getElementById("resultTitle"),
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

  els.openCamera.addEventListener("click", startCamera);
  els.closeCamera.addEventListener("click", stopCamera);
  els.capture.addEventListener("click", captureFrame);
  els.fileInput.addEventListener("change", handleFile);
  els.clearImage.addEventListener("click", clearImage);
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

  async function captureFrame() {
    if (!els.video.videoWidth || !els.video.videoHeight) {
      setStatus("Die Kamera ist noch nicht bereit.", "error");
      return;
    }
    await analyzeSource(els.video, els.video.videoWidth, els.video.videoHeight);
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
      await analyzeSource(bitmap, bitmap.width, bitmap.height);
    } catch (error) {
      setStatus("Das Bild konnte lokal nicht gelesen werden.", "error");
    } finally {
      if (bitmap && typeof bitmap.close === "function") bitmap.close();
    }
  }

  async function analyzeSource(source, sourceWidth, sourceHeight) {
    els.resultCard.hidden = false;
    els.metrics.hidden = true;
    els.resultTitle.textContent = "Analyse läuft …";
    setStatus("Das Bild wird ausschließlich auf diesem Gerät ausgewertet.", "");
    await nextFrame();

    const scale = Math.min(1, MAX_PROCESS_WIDTH / sourceWidth);
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const work = els.workCanvas;
    work.width = width;
    work.height = height;
    const workCtx = work.getContext("2d", { willReadFrequently: true });
    workCtx.clearRect(0, 0, width, height);
    workCtx.drawImage(source, 0, 0, width, height);

    const imageData = workCtx.getImageData(0, 0, width, height);
    const quality = assessImageQuality(imageData);
    const detection = detectBackpack(imageData);

    const display = els.displayCanvas;
    display.width = width;
    display.height = height;
    const displayCtx = display.getContext("2d");
    displayCtx.drawImage(work, 0, 0);

    if (!detection) {
      els.resultTitle.textContent = "Rucksack nicht sicher erkannt";
      els.metrics.hidden = true;
      drawSearchArea(displayCtx, width, height);
      setStatus(
        "Das 4-spaltige Rucksackraster wurde nicht zuverlässig gefunden. Für den nächsten Versuch den kompletten Inventarbildschirm aufnehmen, etwas gerader halten und darauf achten, dass der Rucksack nicht abgeschnitten ist.",
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

    const expectedShape =
      detection.slots.length % 4 === 0
        ? detection.rows + " vollständige Reihen"
        : (detection.rows - 1) + " vollständige + letzte Teilreihe";

    let note = "Erkannt: " + detection.slots.length + " Rucksackplätze (" + expectedShape + "), davon " + occupied + " vermutlich belegt.";
    if (quality.level === "hard") {
      note += " Das Bild ist für die Erkennung relativ schwierig; genau solche Fälle sind für diesen Test besonders nützlich.";
    } else if (quality.level === "ok") {
      note += " Die Bildqualität ist brauchbar.";
    } else {
      note += " Die Bildqualität ist gut.";
    }
    setStatus(note, "good");

    clearWorkPixels();
  }

  function detectBackpack(imageData) {
    const { width, height, data } = imageData;

    // Der Scanner schaut absichtlich nur in einen breiten Mittelbereich.
    // Das verhindert, dass Waffen- und Quick-Use-Slots das Backpack-Raster dominieren.
    const roi = {
      x: Math.floor(width * 0.25),
      y: Math.floor(height * 0.12),
      w: Math.floor(width * 0.45),
      h: Math.floor(height * 0.78)
    };
    roi.w = Math.min(roi.w, width - roi.x);
    roi.h = Math.min(roi.h, height - roi.y);
    if (roi.w < 80 || roi.h < 80) return null;

    const gray = new Uint8Array(roi.w * roi.h);
    for (let y = 0; y < roi.h; y++) {
      const imageY = roi.y + y;
      for (let x = 0; x < roi.w; x++) {
        const imageX = roi.x + x;
        const p = (imageY * width + imageX) * 4;
        gray[y * roi.w + x] = Math.round(data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114);
      }
    }

    const gradients = [];
    const grad = new Uint16Array(roi.w * roi.h);
    for (let y = 1; y < roi.h - 1; y++) {
      const row = y * roi.w;
      for (let x = 1; x < roi.w - 1; x++) {
        const i = row + x;
        const gx = Math.abs(gray[i + 1] - gray[i - 1]);
        const gy = Math.abs(gray[i + roi.w] - gray[i - roi.w]);
        const value = gx + gy;
        grad[i] = value;
        if ((x & 3) === 0 && (y & 3) === 0) gradients.push(value);
      }
    }

    if (!gradients.length) return null;
    gradients.sort((a, b) => a - b);
    const q89 = percentileSorted(gradients, 0.89);
    const edgeThreshold = clamp(q89, 45, 70);

    const edge = new Uint8Array(roi.w * roi.h);
    for (let i = 0; i < grad.length; i++) {
      if (grad[i] > edgeThreshold) edge[i] = 1;
    }

    // 3x3-Dilatation: kleine Unterbrechungen in den Slot-Rahmen schließen.
    const dilated = new Uint8Array(edge.length);
    for (let y = 1; y < roi.h - 1; y++) {
      for (let x = 1; x < roi.w - 1; x++) {
        const i = y * roi.w + x;
        if (!edge[i]) continue;
        for (let dy = -1; dy <= 1; dy++) {
          const base = (y + dy) * roi.w + x;
          dilated[base - 1] = 1;
          dilated[base] = 1;
          dilated[base + 1] = 1;
        }
      }
    }

    const components = connectedComponents(dilated, roi.w, roi.h);
    const minCell = width * 0.035;
    const maxCell = width * 0.14;

    let candidates = components
      .map(c => ({
        x: c.x + roi.x,
        y: c.y + roi.y,
        w: c.w,
        h: c.h,
        pixels: c.pixels
      }))
      .filter(c => {
        const ratio = c.w / c.h;
        return c.w >= minCell && c.w <= maxCell &&
          c.h >= minCell && c.h <= maxCell &&
          ratio >= 0.65 && ratio <= 1.35;
      });

    if (candidates.length < 8) return null;
    candidates = dedupeCandidates(candidates);
    if (candidates.length < 8) return null;

    const medianW = median(candidates.map(c => c.w));
    const xGroups = clusterValues(
      candidates.map((c, index) => ({ value: c.x + c.w / 2, index })),
      medianW * 0.28
    )
      .filter(group => group.items.length >= 2)
      .sort((a, b) => a.mean - b.mean);

    if (xGroups.length < COLS) return null;

    let bestCols = null;
    for (let i = 0; i <= xGroups.length - COLS; i++) {
      const seq = xGroups.slice(i, i + COLS);
      const gaps = [];
      for (let j = 0; j < COLS - 1; j++) gaps.push(seq[j + 1].mean - seq[j].mean);
      const gapMean = mean(gaps);
      if (gapMean < medianW * 0.65 || gapMean > medianW * 1.45) continue;
      const regularity = stdDev(gaps) / Math.max(1, gapMean);
      if (regularity > 0.22) continue;

      const countScore = seq.reduce((sum, g) => sum + g.items.length, 0);
      const center = mean(seq.map(g => g.mean));
      const centerPenalty = Math.abs(center - width * 0.47) / width;
      const score = countScore - regularity * 12 - centerPenalty * 3;

      if (!bestCols || score > bestCols.score) {
        bestCols = { seq, score, regularity };
      }
    }

    if (!bestCols) return null;

    const selectedIndexes = new Set();
    for (const group of bestCols.seq) {
      for (const item of group.items) selectedIndexes.add(item.index);
    }
    const selected = [...selectedIndexes].map(index => candidates[index]);
    const medianH = median(selected.map(c => c.h));

    let yGroups = clusterValues(
      selected.map((c, index) => ({ value: c.y + c.h / 2, index })),
      medianH * 0.30
    )
      .filter(group => group.items.length >= 2)
      .sort((a, b) => a.mean - b.mean);

    yGroups = pickBestRowSequence(yGroups, medianH);
    if (yGroups.length < 3) return null;

    const xCenters = bestCols.seq.map(group => group.mean);
    const yCenters = yGroups.map(group => group.mean);
    const slots = [];
    const used = new Set();

    for (let row = 0; row < yCenters.length; row++) {
      for (let col = 0; col < xCenters.length; col++) {
        let best = null;

        for (let i = 0; i < candidates.length; i++) {
          if (used.has(i)) continue;
          const c = candidates[i];
          const cx = c.x + c.w / 2;
          const cy = c.y + c.h / 2;
          const dx = (cx - xCenters[col]) / (medianW * 0.52);
          const dy = (cy - yCenters[row]) / (medianH * 0.52);
          const distance = dx * dx + dy * dy;
          if (distance < 1 && (!best || distance < best.distance)) {
            best = { index: i, c, distance };
          }
        }

        if (best) {
          used.add(best.index);
          const occupied = isOccupiedSlot(imageData, best.c);
          slots.push({ ...best.c, row, col, occupied });
        }
      }
    }

    // Plausibilitätsregeln aus den bisher beobachteten Layouts:
    // Backpack ist vier Spalten breit und besitzt mehrere zusammenhängende Reihen.
    if (slots.length < 12 || slots.length > 32) return null;

    const rowCounts = new Array(yCenters.length).fill(0);
    for (const slot of slots) rowCounts[slot.row]++;
    if (rowCounts[0] < 3 || rowCounts[1] < 3) return null;

    return {
      slots,
      rows: yCenters.length,
      cols: COLS,
      roi,
      regularity: bestCols.regularity,
      edgeThreshold
    };
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
        const y = Math.floor(i / width);
        const x = i - y * width;
        pixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        for (let dy = -1; dy <= 1; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= height) continue;
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            if (nx < 0 || nx >= width) continue;
            const ni = ny * width + nx;
            if (!map[ni]) continue;
            map[ni] = 0;
            stack[top++] = ni;
          }
        }
      }

      out.push({
        x: minX,
        y: minY,
        w: maxX - minX + 1,
        h: maxY - minY + 1,
        pixels
      });
    }

    return out;
  }

  function dedupeCandidates(candidates) {
    const sorted = [...candidates].sort((a, b) => (b.w * b.h) - (a.w * a.h));
    const kept = [];

    for (const c of sorted) {
      const cx = c.x + c.w / 2;
      const cy = c.y + c.h / 2;
      const duplicate = kept.some(k => {
        const kx = k.x + k.w / 2;
        const ky = k.y + k.h / 2;
        return Math.abs(cx - kx) < Math.min(c.w, k.w) * 0.18 &&
          Math.abs(cy - ky) < Math.min(c.h, k.h) * 0.18;
      });
      if (!duplicate) kept.push(c);
    }

    return kept;
  }

  function clusterValues(values, tolerance) {
    const groups = [];

    for (const item of [...values].sort((a, b) => a.value - b.value)) {
      let best = null;
      let bestDistance = Infinity;

      for (const group of groups) {
        const distance = Math.abs(item.value - group.mean);
        if (distance <= tolerance && distance < bestDistance) {
          best = group;
          bestDistance = distance;
        }
      }

      if (!best) {
        groups.push({ mean: item.value, items: [item] });
      } else {
        best.items.push(item);
        best.mean = mean(best.items.map(v => v.value));
      }
    }

    return groups;
  }

  function pickBestRowSequence(groups, medianH) {
    if (groups.length <= 2) return groups;
    let best = [];

    for (let start = 0; start < groups.length; start++) {
      const seq = [groups[start]];
      for (let i = start + 1; i < groups.length; i++) {
        const gap = groups[i].mean - seq[seq.length - 1].mean;
        if (gap >= medianH * 0.65 && gap <= medianH * 1.45) {
          seq.push(groups[i]);
        } else if (gap > medianH * 1.45) {
          break;
        }
      }

      const density = seq.reduce((sum, g) => sum + Math.min(4, g.items.length), 0);
      const score = density + seq.length * 2;
      const bestDensity = best.reduce((sum, g) => sum + Math.min(4, g.items.length), 0);
      const bestScore = bestDensity + best.length * 2;
      if (score > bestScore) best = seq;
    }

    return best;
  }

  function isOccupiedSlot(imageData, box) {
    const { width, height, data } = imageData;
    const margin = Math.max(3, Math.round(Math.min(box.w, box.h) * 0.13));
    const x0 = clamp(Math.round(box.x + margin), 0, width - 1);
    const y0 = clamp(Math.round(box.y + margin), 0, height - 1);
    const x1 = clamp(Math.round(box.x + box.w - margin), x0 + 1, width);
    const y1 = clamp(Math.round(box.y + box.h - margin), y0 + 1, height);

    let n = 0, sum = 0, sumSq = 0;
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const p = (y * width + x) * 4;
        const g = data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114;
        n++;
        sum += g;
        sumSq += g * g;
      }
    }
    if (!n) return false;
    const avg = sum / n;
    const variance = Math.max(0, sumSq / n - avg * avg);
    return Math.sqrt(variance) > 18;
  }

  function assessImageQuality(imageData) {
    const { width, height, data } = imageData;
    const values = [];
    let blown = 0;
    let sampled = 0;

    const step = Math.max(2, Math.round(width / 500));
    for (let y = step; y < height - step; y += step) {
      for (let x = step; x < width - step; x += step) {
        const p = (y * width + x) * 4;
        const l = data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114;

        const px1 = (y * width + (x + step)) * 4;
        const py1 = ((y + step) * width + x) * 4;
        const lx = data[px1] * 0.299 + data[px1 + 1] * 0.587 + data[px1 + 2] * 0.114;
        const ly = data[py1] * 0.299 + data[py1 + 1] * 0.587 + data[py1 + 2] * 0.114;
        values.push(Math.abs(lx - l) + Math.abs(ly - l));

        if (data[p] > 245 && data[p + 1] > 245 && data[p + 2] > 245) blown++;
        sampled++;
      }
    }

    values.sort((a, b) => a - b);
    const edge90 = percentileSorted(values, 0.90);
    const blownRatio = sampled ? blown / sampled : 0;

    if (edge90 < 22 || blownRatio > 0.09) return { label: "schwierig", level: "hard" };
    if (edge90 < 35 || blownRatio > 0.045) return { label: "brauchbar", level: "ok" };
    return { label: "gut", level: "good" };
  }

  function drawDetection(ctx, detection) {
    ctx.save();
    ctx.lineWidth = Math.max(2, ctx.canvas.width / 500);
    ctx.font = "700 " + Math.max(11, Math.round(ctx.canvas.width / 75)) + "px system-ui, sans-serif";
    ctx.textBaseline = "top";

    for (const slot of detection.slots) {
      const color = slot.occupied ? "#69d39b" : "#7aa7d8";
      ctx.strokeStyle = color;
      ctx.fillStyle = slot.occupied ? "rgba(105,211,155,.12)" : "rgba(122,167,216,.08)";
      ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);

      const label = String(slot.row * 4 + slot.col + 1);
      const pad = 4;
      const metrics = ctx.measureText(label);
      ctx.fillStyle = "rgba(8,11,15,.8)";
      ctx.fillRect(slot.x + pad, slot.y + pad, metrics.width + 8, parseInt(ctx.font, 10) + 6);
      ctx.fillStyle = color;
      ctx.fillText(label, slot.x + pad + 4, slot.y + pad + 2);
    }
    ctx.restore();
  }

  function drawSearchArea(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = "rgba(240,198,106,.9)";
    ctx.lineWidth = Math.max(2, width / 500);
    ctx.setLineDash([10, 7]);
    ctx.strokeRect(width * 0.25, height * 0.12, width * 0.45, height * 0.78);
    ctx.restore();
  }

  function clearImage() {
    stopCamera();
    els.resultCard.hidden = true;
    els.metrics.hidden = true;
    els.resultTitle.textContent = "Analyse läuft …";
    setStatus("", "");
    clearCanvas(els.displayCanvas);
    clearCanvas(els.workCanvas);
  }

  function clearWorkPixels() {
    // Rohpixel nach der Analyse aus dem Arbeits-Canvas entfernen.
    // Auf dem sichtbaren Canvas bleibt nur das lokale Analysebild bis „Bild verwerfen“.
    clearCanvas(els.workCanvas);
  }

  function clearCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    if (canvas.width && canvas.height) ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 1;
    canvas.height = 1;
  }

  function setStatus(message, kind) {
    els.status.textContent = message;
    els.status.className = "status" + (kind ? " " + kind : "");
  }

  function percentileSorted(values, fraction) {
    if (!values.length) return 0;
    const index = Math.min(values.length - 1, Math.max(0, Math.floor((values.length - 1) * fraction)));
    return values[index];
  }

  function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function mean(values) {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function stdDev(values) {
    if (!values.length) return 0;
    const avg = mean(values);
    return Math.sqrt(mean(values.map(value => (value - avg) ** 2)));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function nextFrame() {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }
})();
