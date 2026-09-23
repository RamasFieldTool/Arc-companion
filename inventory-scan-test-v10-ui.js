"use strict";
(() => {
  const resultTitle = document.getElementById('resultTitle');
  const output = document.getElementById('itemRecognitionOutput');
  const state = document.getElementById('itemRecognitionState');
  const names = document.getElementById('itemRecognitionNames');
  const retry = document.getElementById('itemRecognitionRetry');
  if (!resultTitle || !output || !state || !names) return;

  let itemMap = null;
  let lastRendered = '';

  async function getItemMap() {
    if (itemMap) return itemMap;
    itemMap = new Map();
    try {
      const response = await fetch('items.json', { cache: 'force-cache', credentials: 'same-origin' });
      const items = await response.json();
      for (const item of Array.isArray(items) ? items : []) {
        if (!item?.id) continue;
        itemMap.set(String(item.id), {
          de: String(item.de || item.en || item.id),
          en: String(item.en || item.de || item.id)
        });
      }
    } catch (_) {}
    return itemMap;
  }

  function nudgeRecognition() {
    if (!/inventarbereiche erkannt/i.test(resultTitle.textContent || '')) {
      state.textContent = 'Erst einen Scan durchführen. Danach startet die Item-Erkennung automatisch.';
      return;
    }
    state.textContent = 'Item-Erkennung wird gestartet …';
    const current = resultTitle.textContent;
    resultTitle.textContent = current + ' ';
    setTimeout(() => { resultTitle.textContent = current; }, 30);
  }

  retry?.addEventListener('click', nudgeRecognition);

  const titleObserver = new MutationObserver(() => {
    if (!/inventarbereiche erkannt/i.test(resultTitle.textContent || '')) return;
    state.textContent = 'Inventar erkannt. Item-Vergleich startet …';
    setTimeout(() => {
      if (!/\[camera test v9\]/i.test(output.textContent || '')) nudgeRecognition();
    }, 650);
  });
  titleObserver.observe(resultTitle, { childList: true, characterData: true, subtree: true });

  const outObserver = new MutationObserver(renderNames);
  outObserver.observe(output, { childList: true, characterData: true, subtree: true });
  renderNames();

  async function renderNames() {
    const text = output.textContent || '';
    if (!text || text === lastRendered) return;
    lastRendered = text;

    if (/loading reference icons/i.test(text)) {
      state.textContent = 'Referenz-Icons werden geladen. Das kann beim ersten Durchlauf etwas dauern …';
      names.innerHTML = '';
      return;
    }
    if (/error:/i.test(text)) {
      state.textContent = 'Die Item-Erkennung ist mit einem Fehler abgebrochen. Unten steht die Diagnose.';
      names.innerHTML = '';
      return;
    }

    const map = await getItemMap();
    const rows = [];
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^([BQS]\d+):\s*(.+)$/i);
      if (!match) continue;
      const slot = match[1].toUpperCase();
      const candidates = match[2].split('|').map(part => part.trim()).filter(Boolean).map(part => {
        const m = part.match(/^([a-z0-9_]+)\s+([0-9.]+)$/i);
        if (!m) return null;
        const id = m[1];
        const score = Number(m[2]);
        const item = map.get(id);
        return { id, score, name: item?.de || item?.en || id };
      }).filter(Boolean);
      if (candidates.length) rows.push({ slot, candidates });
    }

    if (!rows.length) {
      const loaded = text.match(/reference-icons:\s*(\d+)\/(\d+)\s*loaded/i);
      if (loaded) {
        state.textContent = `Referenz-Icons geladen (${loaded[1]}/${loaded[2]}), aber noch keine Item-Kandidaten ausgegeben.`;
      }
      names.innerHTML = '';
      return;
    }

    state.textContent = `${rows.length} belegte Slots haben Item-Kandidaten. Der erste Name ist jeweils der aktuell ähnlichste Treffer.`;
    names.innerHTML = '';
    for (const row of rows) {
      const card = document.createElement('div');
      card.className = 'item-result-card';

      const top = row.candidates[0];
      const title = document.createElement('div');
      title.className = 'item-result-title';
      title.textContent = `${row.slot}: ${top.name}`;

      const score = document.createElement('div');
      score.className = 'item-result-score';
      score.textContent = `Ähnlichkeit ${top.score.toFixed(1)}%`;

      card.append(title, score);

      if (row.candidates.length > 1) {
        const alt = document.createElement('div');
        alt.className = 'item-result-alt';
        alt.textContent = 'Alternativen: ' + row.candidates.slice(1).map(c => `${c.name} ${c.score.toFixed(1)}%`).join(' · ');
        card.appendChild(alt);
      }
      names.appendChild(card);
    }
  }
})();
