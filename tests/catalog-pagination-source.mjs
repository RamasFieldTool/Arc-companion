import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const start = app.indexOf('async function loadFullCatalog(){');
const end = app.indexOf('\nasync function boot(){', start);
assert.notEqual(start, -1, 'loadFullCatalog exists');
assert.notEqual(end, -1, 'loadFullCatalog boundary exists');
const loaderSource = app.slice(start, end).replace(/^async function loadFullCatalog\(\)/, 'async function loadFullCatalog()');

const requests = [];
const apiItems = Array.from({ length: 581 }, (_, i) => ({ id: `mahcks-${i}` }));
let fallbackSelected = false;
const context = {
  console: { warn() {} },
  fetch: async (url) => {
    const offset = Number(new URL(url).searchParams.get('offset'));
    requests.push(offset);
    // Simulate Mahcks succeeding for two pages, then the resilience layer switching
    // to its validated snapshot after the next Mahcks request fails.
    if (!fallbackSelected && offset === 90) fallbackSelected = true;
    const source = fallbackSelected ? 'Ramas-Snapshot' : null;
    const page = apiItems.slice(offset, offset + 45);
    const headers = new Headers();
    if (source) headers.set('X-ARC-Catalog-Source', source);
    return {
      ok: true,
      headers,
      json: async () => ({
        total: apiItems.length,
        count: page.length,
        offset,
        items: page,
        ...(offset + 45 < apiItems.length ? { next: `/v1/items?full=true&offset=${offset + 45}&limit=45` } : {})
      })
    };
  }
};
vm.createContext(context);
vm.runInContext(`${loaderSource}; globalThis.loadFullCatalog=loadFullCatalog;`, context);
const loaded = await context.loadFullCatalog();

assert.equal(loaded.length, 581, 'all raw API pages returned before app-specific catalog extension');
assert.deepEqual(requests.slice(0, 4), [0, 45, 90, 0], 'mixed first attempt discarded and pagination restarted at zero');
assert.equal(requests.at(-1), 540, 'pagination reaches final page');
console.log(`catalog pagination source-switch recovery passed (${loaded.length} raw items before app extension)`);

const status = await readFile(new URL('../status-v1300.js', import.meta.url), 'utf8');
const statusStart = status.indexOf('function currentDataState(){');
const statusEnd = status.indexOf('\nfunction ensurePersistentDataStatus(){', statusStart);
assert.notEqual(statusStart, -1, 'currentDataState exists');
assert.notEqual(statusEnd, -1, 'currentDataState boundary exists');
const stateSource = status.slice(statusStart, statusEnd);
const stateContext = {
  items: [{ id: 'item-1' }],
  quests: [{ id: 'quest-1' }],
  questLoadError: false,
  questLoadState: 'live',
  usingFallback: false,
  window: { __arcCatalogMeta: { source: 'mahcks' } },
  document: { getElementById: () => ({ classList: { contains: () => false } }) }
};
vm.createContext(stateContext);
vm.runInContext(`${stateSource}; globalThis.currentDataState=currentDataState;`, stateContext);
assert.equal(stateContext.currentDataState(), 'live', 'Mahcks source is the only confirmed LIVE source');
stateContext.window.__arcCatalogMeta = { source: 'snapshot' };
assert.equal(stateContext.currentDataState(), 'snapshot', 'snapshot is reported separately');
stateContext.window.__arcCatalogMeta = { source: 'github' };
assert.equal(stateContext.currentDataState(), 'github', 'GitHub catalog is reported separately');
stateContext.window.__arcCatalogMeta = { source: 'local-fallback' };
assert.equal(stateContext.currentDataState(), 'fallback', 'local base data retains BASISDATEN label');
console.log('catalog source status mapping passed');
