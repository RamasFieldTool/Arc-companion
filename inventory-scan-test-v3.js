"use strict";

(() => {
  const MAX_PROCESS_WIDTH = 1100;
  const GUIDE_ASPECT = 2.0;
  const COLS = 4;

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
    backpackSlots: document.getElementById("backpackSlots"),
    backpackOccupied: document.getElementById("backpackOccupied"),
    quickSlots: document.getElementById("quickSlots"),
    quickOccupied: document.getElementById("quickOccupied"),
    safeSlots: document.getElementById("safeSlots"),
    safeOccupied: document.getElementById("safeOccupied"),
    totalOccupied: document.getElementById("totalOccupied"),
    qualityState: document.getElementById("qualityState"),
    status: document.getElementById("status"),
    clearImage: document.getElementById("clearImage")
  };

  let cameraStream = null;
  let guideNorm = { x: 0.11, y: 0.15, w: 0.78, h: 0.70 };

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
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
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

    const maxW = w * 0.82;
    const maxH = h * 0.70;
    let gw = Math.min(maxW, maxH * GUIDE_ASPECT);
    let gh = gw / GUIDE_ASPECT;
    if (gh > maxH) {
      gh = maxH;
      gw = gh * GUIDE_ASPECT;
    }

    const gx = (w - gw) / 2;
    const gy = (h - gh) / 2;
    Object.assign(els.scanGuide.style, {
      left: gx + "px",
      top: gy + "px",
      width: gw + "px",
      height: gh + "px"
    });
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
    if (!file || !file.type.startsWith("image/")) return;
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
    const backpack = detectBackpack(imageData);

    const display = els.displayCanvas;
    display.width = width;
    display.height = height;
    const displayCtx = display.getContext("2d");
    displayCtx.drawImage(work, 0, 0);

    if (!backpack) {
      els.resultTitle.textContent = "Rucksack noch nicht erkannt";
      setStatus("Das Rucksackraster wurde im grünen Bereich nicht sicher erkannt. Bitte den Rucksack links in den grünen Bereich, Schnelleinsatz rechts oben und Sicherheitstasche rechts unten legen.", "error");
      clearWorkPixels();
      return;
    }

    const expected = median(backpack.slots.map(s => (s.w + s.h) / 2));
    const quick = detectAuxSlots(imageData, { x: .60, y: .04, w: .39, h: .46 }, expected, 5, "quick");
    const safe = detectAuxSlots(imageData, { x: .60, y: .64, w: .39, h: .35 }, expected, 3, "safe");

    drawDetection(displayCtx, backpack, quick, safe);

    const backpackOcc = backpack.slots.filter(s => s.occupied).length;
    const quickOcc = quick.slots.filter(s => s.occupied).length;
    const safeOcc = safe.slots.filter(s => s.occupied).length;
    const totalOcc = backpackOcc + quickOcc + safeOcc;

    els.backpackSlots.textContent = String(backpack.slots.length);
    els.backpackOccupied.textContent = String(backpackOcc);
    els.quickSlots.textContent = quick.confident ? String(quick.slots.length) : "?";
    els.quickOccupied.textContent = quick.confident ? String(quickOcc) : "?";
    els.safeSlots.textContent = safe.confident ? String(safe.slots.length) : "?";
    els.safeOccupied.textContent = safe.confident ? String(safeOcc) : "?";
    els.totalOccupied.textContent = String(totalOcc) + (quick.confident && safe.confident ? "" : "+");
    els.qualityState.textContent = quality.label;
    els.metrics.hidden = false;
    els.resultTitle.textContent = "Inventarbereiche erkannt";

    let note = `Rucksack: ${backpack.slots.length} Plätze / ${backpackOcc} belegt.`;
    note += quick.confident ? ` Schnelleinsatz: ${quick.slots.length} Plätze / ${quickOcc} belegt.` : " Schnelleinsatz noch unsicher.";
    note += safe.confident ? ` Sicherheitstasche: ${safe.slots.length} Plätze / ${safeOcc} belegt.` : " Sicherheitstasche noch unsicher.";
    note += " Augment-Plätze werden bewusst nicht mitgezählt.";
    setStatus(note, quick.confident && safe.confident ? "good" : "");
    clearWorkPixels();
  }

  function detectBackpack(imageData) {
    const zone = normZone(imageData, { x: .01, y: .04, w: .58, h: .94 });
    const sub = cropImageData(imageData, zone.x, zone.y, zone.w, zone.h);
    const gray = toGray(sub);
    const threshold = estimateEdgeThreshold(gray, sub.width, sub.height);
    const v = new Float64Array(sub.width);
    const h = new Float64Array(sub.height);

    for (let y = 1; y < sub.height - 1; y += 2) {
      for (let x = 1; x < sub.width - 1; x += 2) {
        const i = y * sub.width + x;
        const gx = Math.abs(gray[i + 1] - gray[i - 1]);
        const gy = Math.abs(gray[i + sub.width] - gray[i - sub.width]);
        if (gx > threshold * .5) v[x] += gx;
        if (gy > threshold * .5) h[y] += gy;
      }
    }

    const vPeaks = findPeaks(smooth(v, Math.max(2, Math.round(sub.width * .006))), sub.width * .035, 18);
    const hPeaks = findPeaks(smooth(h, Math.max(2, Math.round(sub.height * .005))), sub.height * .025, 22);
    const xSeq = chooseEqualSequence(vPeaks, 5, sub.width, .13, .30);
    if (!xSeq) return null;
    const xGap = mean(diff(xSeq));
    const ySeq = chooseRows(hPeaks, sub.height, xGap);
    if (!ySeq) return null;

    const slots = [];
    for (let row = 0; row < ySeq.length - 1; row++) {
      for (let col = 0; col < COLS; col++) {
        const box = {
          x: Math.round(zone.x + xSeq[col]),
          y: Math.round(zone.y + ySeq[row]),
          w: Math.round(xSeq[col + 1] - xSeq[col]),
          h: Math.round(ySeq[row + 1] - ySeq[row]),
          row, col
        };
        if (box.w < 18 || box.h < 18) continue;
        const localBox = { x: box.x - zone.x, y: box.y - zone.y, w: box.w, h: box.h };
        const border = borderStrength(gray, sub.width, sub.height, localBox);
        if (row === ySeq.length - 2 && col >= 2 && border < threshold * .20) continue;
        slots.push({ ...box, occupied: isOccupiedSlot(imageData, box) });
      }
    }

    if (slots.length < 14 || slots.length > 28) return null;
    const counts = new Array(ySeq.length - 1).fill(0);
    for (const s of slots) counts[s.row]++;
    if (counts.slice(0, Math.min(3, counts.length)).some(c => c < 3)) return null;
    return { slots, rows: ySeq.length - 1 };
  }

  function detectAuxSlots(imageData, z, expected, limit, type) {
    const zone = normZone(imageData, z);
    const sub = cropImageData(imageData, zone.x, zone.y, zone.w, zone.h);
    const gray = toGray(sub);
    const threshold = estimateEdgeThreshold(gray, sub.width, sub.height);
    const edge = makeEdgeMap(gray, sub.width, sub.height, threshold);
    const comps = connectedComponents(dilate(edge, sub.width, sub.height, 1), sub.width, sub.height);

    let candidates = comps.map(c => ({ ...c, x: c.x + zone.x, y: c.y + zone.y }))
      .filter(c => {
        const ratio = c.w / Math.max(1, c.h);
        const size = (c.w + c.h) / 2;
        return ratio >= .65 && ratio <= 1.4 && size >= expected * .62 && size <= expected * 1.42;
      });
    candidates = dedupeCandidates(candidates);
    candidates.sort((a, b) => {
      const da = Math.abs((a.w + a.h) / 2 - expected);
      const db = Math.abs((b.w + b.h) / 2 - expected);
      return da - db;
    });
    candidates = candidates.slice(0, limit).sort((a, b) => (a.y - b.y) || (a.x - b.x));

    const minNeeded = type === "quick" ? 4 : 1;
    const confident = candidates.length >= minNeeded;
    const slots = candidates.map((c, index) => ({ ...c, index, occupied: isOccupiedSlot(imageData, c) }));
    return { slots, confident };
  }

  function drawDetection(ctx, backpack, quick, safe) {
    ctx.save();
    ctx.lineWidth = Math.max(2, ctx.canvas.width / 450);
    ctx.font = `700 ${Math.max(11, Math.round(ctx.canvas.width / 60))}px system-ui,sans-serif`;
    ctx.textBaseline = "top";

    drawSet(backpack.slots, "B", "#69d39b");
    drawSet(quick.slots, "Q", "#ffb17f");
    drawSet(safe.slots, "S", "#9dbfff");

    function drawSet(slots, prefix, color) {
      slots.forEach((slot, i) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = slot.occupied ? color + "22" : "rgba(80,100,120,.08)";
        ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
        ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);
        const label = prefix + (i + 1);
        const m = ctx.measureText(label);
        ctx.fillStyle = "rgba(8,11,15,.82)";
        ctx.fillRect(slot.x + 3, slot.y + 3, m.width + 7, 18);
        ctx.fillStyle = color;
        ctx.fillText(label, slot.x + 6, slot.y + 5);
      });
    }
    ctx.restore();
  }

  function normZone(imageData, z) {
    return {
      x: Math.round(imageData.width * z.x),
      y: Math.round(imageData.height * z.y),
      w: Math.round(imageData.width * z.w),
      h: Math.round(imageData.height * z.h)
    };
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

  function toGray(imageData) {
    const { width, height, data } = imageData;
    const gray = new Uint8Array(width * height);
    for (let i = 0, p = 0; i < gray.length; i++, p += 4) gray[i] = Math.round(data[p] * .299 + data[p + 1] * .587 + data[p + 2] * .114);
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
    return clamp(percentileSorted(values, .87), 32, 78);
  }

  function makeEdgeMap(gray, width, height, threshold) {
    const out = new Uint8Array(width * height);
    for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const g = Math.abs(gray[i + 1] - gray[i - 1]) + Math.abs(gray[i + width] - gray[i - width]);
      if (g >= threshold) out[i] = 1;
    }
    return out;
  }

  function dilate(binary, width, height, radius) {
    const out = new Uint8Array(binary.length);
    for (let y = radius; y < height - radius; y++) for (let x = radius; x < width - radius; x++) {
      const i = y * width + x;
      if (!binary[i]) continue;
      for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) out[(y + dy) * width + x + dx] = 1;
    }
    return out;
  }

  function connectedComponents(binary, width, height) {
    const map = binary.slice();
    const stack = new Int32Array(map.length);
    const out = [];
    for (let start = 0; start < map.length; start++) {
      if (!map[start]) continue;
      let top = 0; stack[top++] = start; map[start] = 0;
      let minX = width, minY = height, maxX = 0, maxY = 0, pixels = 0;
      while (top) {
        const i = stack[--top], y = Math.floor(i / width), x = i - y * width;
        pixels++; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        for (let dy = -1; dy <= 1; dy++) {
          const ny = y + dy; if (ny < 0 || ny >= height) continue;
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = x + dx; if (nx < 0 || nx >= width) continue;
            const ni = ny * width + nx;
            if (!map[ni]) continue;
            map[ni] = 0; stack[top++] = ni;
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
      const dup = kept.some(k => Math.abs(cx - (k.x + k.w / 2)) < Math.min(c.w, k.w) * .18 && Math.abs(cy - (k.y + k.h / 2)) < Math.min(c.h, k.h) * .18);
      if (!dup) kept.push(c);
    }
    return kept;
  }

  function chooseEqualSequence(peaks, count, size, minGapFrac, maxGapFrac) {
    if (peaks.length < count) return null;
    let best = null;
    const sorted = [...peaks].sort((a, b) => a.x - b.x);
    for (let start = 0; start < sorted.length; start++) {
      for (let end = start + count - 1; end < sorted.length; end++) {
        const first = sorted[start].x, last = sorted[end].x;
        const gap = (last - first) / (count - 1);
        if (gap < size * minGapFrac || gap > size * maxGapFrac) continue;
        const seq = []; let score = 0, valid = true;
        for (let k = 0; k < count; k++) {
          const target = first + gap * k;
          let nearest = null;
          for (const p of sorted) {
            const d = Math.abs(p.x - target);
            if (d <= gap * .16 && (!nearest || d < nearest.d)) nearest = { ...p, d };
          }
          if (!nearest) { valid = false; break; }
          seq.push(nearest.x); score += nearest.value - nearest.d * 2;
        }
        if (valid && (!best || score > best.score)) best = { seq, score };
      }
    }
    return best ? best.seq : null;
  }

  function chooseRows(peaks, height, xGap) {
    const sorted = [...peaks].sort((a, b) => a.x - b.x);
    let best = null;
    for (let boundaries = 5; boundaries <= 7; boundaries++) {
      for (let i = 0; i < sorted.length; i++) {
        const first = sorted[i].x;
        for (let scale = .72; scale <= 1.22; scale += .04) {
          const gap = xGap * scale;
          const seq = []; let score = 0, valid = true;
          for (let k = 0; k < boundaries; k++) {
            const target = first + gap * k;
            if (target > height - 2) { valid = false; break; }
            let nearest = null;
            for (const p of sorted) {
              const d = Math.abs(p.x - target);
              if (d <= gap * .18 && (!nearest || d < nearest.d)) nearest = { ...p, d };
            }
            if (!nearest) { valid = false; break; }
            seq.push(nearest.x); score += nearest.value - nearest.d * 1.5;
          }
          if (valid && (!best || score > best.score)) best = { seq, score };
        }
      }
    }
    return best ? best.seq : null;
  }

  function findPeaks(values, minDistance, maxPeaks) {
    const arr = Array.from(values), sortedVals = [...arr].sort((a, b) => a - b);
    const cutoff = percentileSorted(sortedVals, .72), list = [];
    for (let i = 1; i < arr.length - 1; i++) if (arr[i] >= cutoff && arr[i] >= arr[i - 1] && arr[i] >= arr[i + 1]) list.push({ x: i, value: arr[i] });
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

  function isOccupiedSlot(imageData, box) {
    const { width, height, data } = imageData;
    const margin = Math.max(3, Math.round(Math.min(box.w, box.h) * .14));
    const x0 = clamp(Math.round(box.x + margin), 0, width - 1), y0 = clamp(Math.round(box.y + margin), 0, height - 1);
    const x1 = clamp(Math.round(box.x + box.w - margin), x0 + 1, width), y1 = clamp(Math.round(box.y + box.h - margin), y0 + 1, height);
    let n = 0, sum = 0, sumSq = 0, bright = 0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
      const p = (y * width + x) * 4;
      const g = data[p] * .299 + data[p + 1] * .587 + data[p + 2] * .114;
      n++; sum += g; sumSq += g * g; if (g > 130) bright++;
    }
    if (!n) return false;
    const avg = sum / n, sd = Math.sqrt(Math.max(0, sumSq / n - avg * avg));
    return sd > 18 || bright / n > .11;
  }

  function assessImageQuality(imageData) {
    const { width, height, data } = imageData;
    const values = []; let blown = 0, sampled = 0;
    const step = Math.max(2, Math.round(width / 450));
    for (let y = step; y < height - step; y += step) for (let x = step; x < width - step; x += step) {
      const p = (y * width + x) * 4, l = data[p] * .299 + data[p + 1] * .587 + data[p + 2] * .114;
      const px = (y * width + x + step) * 4, py = ((y + step) * width + x) * 4;
      const lx = data[px] * .299 + data[px + 1] * .587 + data[px + 2] * .114;
      const ly = data[py] * .299 + data[py + 1] * .587 + data[py + 2] * .114;
      values.push(Math.abs(lx - l) + Math.abs(ly - l));
      if (data[p] > 245 && data[p + 1] > 245 && data[p + 2] > 245) blown++;
      sampled++;
    }
    values.sort((a, b) => a - b);
    const edge90 = percentileSorted(values, .90), blownRatio = sampled ? blown / sampled : 0;
    if (edge90 < 20 || blownRatio > .09) return { label: "schwierig", level: "hard" };
    if (edge90 < 33 || blownRatio > .045) return { label: "brauchbar", level: "ok" };
    return { label: "gut", level: "good" };
  }

  function smooth(values, radius) {
    const out = new Float64Array(values.length); let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i]; if (i - radius - 1 >= 0) sum -= values[i - radius - 1];
      const left = Math.max(0, i - radius); out[i] = sum / (i - left + 1);
    }
    return out;
  }

  function clearImage() {
    stopCamera(); els.resultCard.hidden = true; els.metrics.hidden = true; els.cropNote.hidden = true;
    els.resultTitle.textContent = "Analyse läuft …"; setStatus("", ""); clearCanvas(els.displayCanvas); clearCanvas(els.workCanvas);
  }
  function clearWorkPixels() { clearCanvas(els.workCanvas); }
  function clearCanvas(canvas) { const ctx = canvas.getContext("2d"); if (canvas.width && canvas.height) ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.width = 1; canvas.height = 1; }
  function setStatus(message, kind) { els.status.textContent = message; els.status.className = "status" + (kind ? " " + kind : ""); }
  function percentileSorted(values, fraction) { if (!values.length) return 0; return values[Math.min(values.length - 1, Math.max(0, Math.floor((values.length - 1) * fraction)))]; }
  function median(values) { if (!values.length) return 0; const s = [...values].sort((a, b) => a - b), m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
  function mean(values) { return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0; }
  function diff(values) { const out = []; for (let i = 1; i < values.length; i++) out.push(values[i] - values[i - 1]); return out; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function nextFrame() { return new Promise(resolve => requestAnimationFrame(resolve)); }
})();