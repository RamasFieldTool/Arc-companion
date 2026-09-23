"use strict";
(() => {
  const display = document.getElementById('displayCanvas');
  const work = document.getElementById('workCanvas');
  const backpackOccupied = document.getElementById('backpackOccupied');
  const backpackSlots = document.getElementById('backpackSlots');
  const quickOccupied = document.getElementById('quickOccupied');
  const quickSlots = document.getElementById('quickSlots');
  const safeOccupied = document.getElementById('safeOccupied');
  const totalOccupied = document.getElementById('totalOccupied');
  const status = document.getElementById('status');
  if (!display || !work || !backpackOccupied || !quickOccupied) return;

  let cleanFrame = null;
  let backpackBoxes = [];
  let quickBoxes = [];
  let correcting = false;
  let frameBrightThreshold = 155;

  const proto = CanvasRenderingContext2D.prototype;
  const originalDrawImage = proto.drawImage;
  const originalStrokeRect = proto.strokeRect;

  proto.drawImage = function(...args) {
    const result = originalDrawImage.apply(this, args);
    try {
      if (this.canvas === display && args[0] === work) {
        backpackBoxes = [];
        quickBoxes = [];
        cleanFrame = this.getImageData(0, 0, display.width, display.height);
        frameBrightThreshold = estimateBrightThreshold(cleanFrame);
      }
    } catch (_) {}
    return result;
  };

  proto.strokeRect = function(x, y, w, h) {
    try {
      if (this.canvas === display) {
        const style = String(this.strokeStyle || '').toLowerCase();
        if (style === '#69d39b' || style.includes('105, 211, 155')) {
          addUnique(backpackBoxes, { x, y, w, h });
        }
        if (style === '#ffb17f' || style.includes('255, 177, 127')) {
          addUnique(quickBoxes, { x, y, w, h });
        }
      }
    } catch (_) {}
    return originalStrokeRect.call(this, x, y, w, h);
  };

  function addUnique(list, box) {
    const duplicate = list.some(b => Math.abs(b.x - box.x) < 2 && Math.abs(b.y - box.y) < 2);
    if (!duplicate) list.push(box);
  }

  const observer = new MutationObserver(() => {
    if (correcting || !cleanFrame) return;
    setTimeout(correctCounts, 0);
  });
  observer.observe(backpackOccupied, { childList: true, characterData: true, subtree: true });
  observer.observe(quickOccupied, { childList: true, characterData: true, subtree: true });

  function correctCounts() {
    if (correcting || !cleanFrame) return;
    correcting = true;

    const declaredBackpack = Number.parseInt(backpackSlots?.textContent || '', 10);
    const declaredQuick = Number.parseInt(quickSlots?.textContent || '', 10);

    let bCount = Number.parseInt(backpackOccupied.textContent || '', 10);
    let qCount = Number.parseInt(quickOccupied.textContent || '', 10);
    const sCount = Number.parseInt(safeOccupied?.textContent || '', 10);

    if (Number.isFinite(declaredBackpack) && declaredBackpack > 0 && backpackBoxes.length >= declaredBackpack) {
      const boxes = backpackBoxes
        .slice(0, declaredBackpack)
        .sort((a, b) => (a.y - b.y) || (a.x - b.x));
      bCount = boxes.filter(backpackSlotLooksOccupied).length;
      backpackOccupied.textContent = String(bCount);
    }

    if (Number.isFinite(declaredQuick) && declaredQuick > 0 && quickBoxes.length >= declaredQuick) {
      const boxes = quickBoxes
        .slice(0, declaredQuick)
        .sort((a, b) => (a.y - b.y) || (a.x - b.x));
      qCount = boxes.filter(quickSlotLooksOccupied).length;
      quickOccupied.textContent = String(qCount);
    }

    if (Number.isFinite(bCount) && Number.isFinite(qCount) && Number.isFinite(sCount)) {
      totalOccupied.textContent = String(bCount + qCount + sCount);
    }

    if (status) {
      if (Number.isFinite(bCount)) {
        status.textContent = status.textContent.replace(
          /Rucksack:\s*(\d+)\s*Plätze\s*\/\s*\d+\s*belegt\./,
          `Rucksack: $1 Plätze / ${bCount} belegt.`
        );
      }
      if (Number.isFinite(qCount)) {
        status.textContent = status.textContent.replace(
          /Schnelleinsatz:\s*(\d+)\s*Plätze\s*\/\s*\d+\s*belegt\./,
          `Schnelleinsatz: $1 Plätze / ${qCount} belegt.`
        );
      }
    }

    correcting = false;
  }

  function backpackSlotLooksOccupied(box) {
    // ARC item icons are drawn as a bright silhouette in the slot interior.
    // We deliberately ignore the slot border and most of the lower UI so
    // perspective lines/reflections in empty slots cannot count as items.
    const body = regionStats(box, 0.17, 0.10, 0.83, 0.72, frameBrightThreshold);

    if (body.brightRatio >= 0.18) return true;

    // Borderline fallback: a smaller bright body plus genuine lower-corner
    // metadata (type icon / quantity) still means the slot is occupied.
    const leftMeta = regionStats(box, 0.06, 0.68, 0.34, 0.94, frameBrightThreshold);
    const rightMeta = regionStats(box, 0.64, 0.68, 0.96, 0.94, frameBrightThreshold);
    return body.brightRatio >= 0.10 && (leftMeta.whiteRatio >= 0.055 || rightMeta.whiteRatio >= 0.045);
  }

  function quickSlotLooksOccupied(box) {
    // Filled quick-use slots expose lower-corner UI metadata. The gray empty
    // circular placeholder is centered and lacks those corner marks.
    const leftBadge = regionStats(box, 0.05, 0.57, 0.38, 0.94, frameBrightThreshold);
    const rightQty = regionStats(box, 0.56, 0.58, 0.96, 0.95, frameBrightThreshold);

    if (leftBadge.whiteRatio > 0.055 || leftBadge.brightRatio > 0.105) return true;
    if (rightQty.whiteRatio > 0.030 || rightQty.brightRatio > 0.072) return true;

    const body = regionStats(box, 0.18, 0.12, 0.82, 0.64, frameBrightThreshold);
    return body.satRatio > 0.14 && body.p90 > frameBrightThreshold * 0.78;
  }

  function estimateBrightThreshold(frame) {
    const { width, height, data } = frame;
    const lum = [];
    const step = Math.max(6, Math.round(width / 180));
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const p = (y * width + x) * 4;
        lum.push(data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114);
      }
    }
    lum.sort((a, b) => a - b);
    const p95 = percentile(lum, 0.95);
    return clamp(p95 * 0.66, 120, 165);
  }

  function regionStats(box, fx0, fy0, fx1, fy1, brightThreshold) {
    const { width, height, data } = cleanFrame;
    const x0 = clamp(Math.round(box.x + box.w * fx0), 0, width - 1);
    const y0 = clamp(Math.round(box.y + box.h * fy0), 0, height - 1);
    const x1 = clamp(Math.round(box.x + box.w * fx1), x0 + 1, width);
    const y1 = clamp(Math.round(box.y + box.h * fy1), y0 + 1, height);

    let n = 0, white = 0, bright = 0, saturated = 0;
    const luminance = [];
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const p = (y * width + x) * 4;
        const r = data[p], g = data[p + 1], b = data[p + 2];
        const l = r * 0.299 + g * 0.587 + b * 0.114;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const sat = mx ? (mx - mn) / mx : 0;
        luminance.push(l);
        if (l > brightThreshold) bright++;
        if (l > brightThreshold - 6 && sat < 0.30) white++;
        if (mx > 72 && sat > 0.34) saturated++;
        n++;
      }
    }
    luminance.sort((a, b) => a - b);
    return {
      whiteRatio: n ? white / n : 0,
      brightRatio: n ? bright / n : 0,
      satRatio: n ? saturated / n : 0,
      p90: luminance.length ? percentile(luminance, 0.90) : 0
    };
  }

  function percentile(sorted, f) {
    if (!sorted.length) return 0;
    const i = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * f)));
    return sorted[i];
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
})();