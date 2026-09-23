"use strict";
(() => {
  const display = document.getElementById('displayCanvas');
  const work = document.getElementById('workCanvas');
  const quickOccupied = document.getElementById('quickOccupied');
  const quickSlots = document.getElementById('quickSlots');
  const backpackOccupied = document.getElementById('backpackOccupied');
  const safeOccupied = document.getElementById('safeOccupied');
  const totalOccupied = document.getElementById('totalOccupied');
  const status = document.getElementById('status');
  if (!display || !work || !quickOccupied) return;

  let cleanFrame = null;
  let quickBoxes = [];
  let correcting = false;

  const proto = CanvasRenderingContext2D.prototype;
  const originalDrawImage = proto.drawImage;
  const originalStrokeRect = proto.strokeRect;

  proto.drawImage = function(...args) {
    const result = originalDrawImage.apply(this, args);
    try {
      if (this.canvas === display && args[0] === work) {
        quickBoxes = [];
        cleanFrame = this.getImageData(0, 0, display.width, display.height);
      }
    } catch (_) {}
    return result;
  };

  proto.strokeRect = function(x, y, w, h) {
    try {
      if (this.canvas === display) {
        const style = String(this.strokeStyle || '').toLowerCase();
        if (style === '#ffb17f' || style.includes('255, 177, 127')) {
          const duplicate = quickBoxes.some(b => Math.abs(b.x - x) < 2 && Math.abs(b.y - y) < 2);
          if (!duplicate) quickBoxes.push({ x, y, w, h });
        }
      }
    } catch (_) {}
    return originalStrokeRect.call(this, x, y, w, h);
  };

  const observer = new MutationObserver(() => {
    if (correcting) return;
    const declaredSlots = Number.parseInt(quickSlots?.textContent || '', 10);
    if (!cleanFrame || !Number.isFinite(declaredSlots) || declaredSlots < 1 || quickBoxes.length < declaredSlots) return;
    setTimeout(correctQuickCount, 0);
  });
  observer.observe(quickOccupied, { childList: true, characterData: true, subtree: true });

  function correctQuickCount() {
    if (correcting || !cleanFrame) return;
    const declaredSlots = Number.parseInt(quickSlots?.textContent || '', 10);
    if (!Number.isFinite(declaredSlots) || quickBoxes.length < declaredSlots) return;

    const boxes = quickBoxes
      .slice(0, declaredSlots)
      .sort((a, b) => (a.y - b.y) || (a.x - b.x));

    const occupied = boxes.filter(slotLooksOccupied).length;
    const old = Number.parseInt(quickOccupied.textContent || '', 10);
    if (!Number.isFinite(old) || old === occupied) return;

    correcting = true;
    quickOccupied.textContent = String(occupied);

    const b = Number.parseInt(backpackOccupied?.textContent || '', 10);
    const s = Number.parseInt(safeOccupied?.textContent || '', 10);
    if (Number.isFinite(b) && Number.isFinite(s)) totalOccupied.textContent = String(b + occupied + s);

    if (status) {
      status.textContent = status.textContent.replace(
        /Schnelleinsatz:\s*(\d+)\s*Plätze\s*\/\s*\d+\s*belegt\./,
        `Schnelleinsatz: $1 Plätze / ${occupied} belegt.`
      );
    }
    correcting = false;
  }

  function slotLooksOccupied(box) {
    const { width, height, data } = cleanFrame;
    const margin = Math.max(3, Math.round(Math.min(box.w, box.h) * 0.14));
    const x0 = clamp(Math.round(box.x + margin), 0, width - 1);
    const y0 = clamp(Math.round(box.y + margin), 0, height - 1);
    const x1 = clamp(Math.round(box.x + box.w - margin), x0 + 1, width);
    const y1 = clamp(Math.round(box.y + box.h - margin), y0 + 1, height);

    const luminance = [];
    let saturated = 0;
    let samples = 0;
    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const p = (y * width + x) * 4;
        const r = data[p], g = data[p + 1], b = data[p + 2];
        const lum = r * 0.299 + g * 0.587 + b * 0.114;
        luminance.push(lum);
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const sat = mx ? (mx - mn) / mx : 0;
        if (mx > 75 && sat > 0.38) saturated++;
        samples++;
      }
    }
    if (!luminance.length) return false;
    luminance.sort((a, b) => a - b);
    const median = percentile(luminance, 0.50);
    const p90 = percentile(luminance, 0.90);
    const contrast = p90 - median;
    const satRatio = samples ? saturated / samples : 0;

    // Echte Quick-Use-Items besitzen in ARC typischerweise eine sehr helle Icon-Silhouette
    // oder eine deutliche Raritätsfarbe. Der graue leere Platzhalter hat beides nicht.
    return (p90 > 150 && contrast > 100) || satRatio > 0.16;
  }

  function percentile(sorted, f) {
    const i = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * f)));
    return sorted[i];
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
})();