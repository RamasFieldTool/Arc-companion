import assert from 'node:assert/strict';
import fs from 'node:fs';

const blueprints = JSON.parse(fs.readFileSync('blueprints.json', 'utf8'));
const acquisition = JSON.parse(fs.readFileSync('blueprint-acquisition-v2130.json', 'utf8'));
const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('blueprints-v2130.js', 'utf8');
const ids = blueprints.map(row => row.id);

assert.equal(blueprints.length, 91, 'catalog should contain the 91 game blueprints');
assert.equal(new Set(ids).size, 91, 'blueprint IDs must be unique');
assert(ids.includes('emperor-gateway-conduit'), 'Emperor Gateway Conduit must be catalogued');
for (const id of ['advanced-camera','banjo','bantam','emperor-gateway-conduit','grappling-hook','stiletto','tether-launcher','yank-grenade']) {
  assert.equal(typeof acquisition[id]?.source, 'string', `${id} needs a visible acquisition note`);
}
assert.match(acquisition['banjo'].source, /Collector Set DLC/);
assert.match(acquisition['emperor-gateway-conduit'].source, /Redirection/);
assert.match(script, /a\.source\?field\(x,'source'\)/, 'acquisition notes must display in blueprint details');
assert.match(script, /a\.source\]/, 'acquisition notes must be searchable');
assert.match(script, /blueprint-91-20261128-1/, 'data fetch cache-buster must be updated');
assert.match(html, /blueprint-91-20261128-1/, 'page asset cache-buster must be updated');
console.log('Blueprint catalog integrity OK: 91 unique entries and eight acquisition notes.');
