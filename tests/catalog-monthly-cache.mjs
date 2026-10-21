import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const start = app.indexOf("const CATALOG_CACHE_KEY='rftItemCatalogCacheV1';");
const end = app.indexOf('\nasync function boot(){', start);
assert.notEqual(start, -1, 'catalog cache constants exist');
assert.notEqual(end, -1, 'catalog cache helper boundary exists');
const helpers = app.slice(start, end);
const store = new Map();
const context = {
  localStorage: {
    getItem: key => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value))
  },
  console: { warn() {} }
};
vm.createContext(context);
vm.runInContext(`${helpers}; globalThis.readCatalogCache=readCatalogCache; globalThis.saveCatalogCache=saveCatalogCache; globalThis.catalogCheckIsDue=catalogCheckIsDue;`, context);

const items = Array.from({ length: 120 }, (_, index) => ({ id: `cache-item-${index}`, name: { en: `Item ${index}` } }));
const checkedAt = new Date().toISOString();
assert.equal(context.catalogCheckIsDue(null), true, 'first visit checks upstream');
assert.equal(context.saveCatalogCache(items, 'mahcks', checkedAt), true, 'validated catalog saves');
const cached = context.readCatalogCache();
assert.equal(cached.items.length, 120, 'complete cached catalog restores');
assert.equal(cached.source, 'mahcks', 'catalog source provenance survives caching');
assert.equal(context.catalogCheckIsDue(cached), false, 'recent successful check suppresses another API request');
const localBase = items.slice(0, 51);
assert.equal(context.saveCatalogCache(localBase, 'local-fallback', checkedAt), true, 'small local fallback saves');
assert.equal(context.readCatalogCache().items.length, 51, 'small local fallback remains reusable');

const oldDate = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
context.saveCatalogCache(items, 'mahcks', oldDate);
store.set('rftItemCatalogLastCheckV1', oldDate);
assert.equal(context.catalogCheckIsDue(context.readCatalogCache()), true, 'cache refresh becomes due after 30 days');

store.set('rftItemCatalogCacheV1', JSON.stringify({ version: 1, source: 'mahcks', checkedAt, items: [items[0], items[0]] }));
assert.equal(context.readCatalogCache(), null, 'duplicate item IDs invalidate the stored cache');
console.log('monthly catalog cache validation, provenance and 30-day refresh interval passed');
