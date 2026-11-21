import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, css] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../startup-animation.css', import.meta.url), 'utf8')
]);

const intro = html.match(/<section class="rft-intro"[\s\S]*?<\/section>/)?.[0];
assert.ok(intro, 'The startup animation section must exist');
assert.equal((intro.match(/class="rft-intro__ring rft-intro__ring--(?:one|two|three)"/g) || []).length, 3,
  'The logo must have three expanding rings');
assert.equal((intro.match(/class="rft-intro__ring rft-intro__ring--/g) || []).length, 3,
  'Every ring must use the shared ring animation component');
assert.equal((intro.match(/aria-hidden="true"/g) || []).length >= 4, true,
  'Decorative rings and sweep must be hidden from assistive technology');

assert.match(css, /\.rft-intro__ring\s*\{[^}]*position:\s*absolute;[^}]*z-index:\s*0;/s,
  'Rings must render above the intro background');
assert.match(css, /animation:\s*rft-ring-expand\s+1\.9s[^;]*infinite;/,
  'Rings must repeatedly animate while the intro is visible');
assert.match(css, /\.rft-intro__ring--two\s*\{[^}]*animation-delay:\s*\.48s;/s);
assert.match(css, /\.rft-intro__ring--three\s*\{[^}]*animation-delay:\s*\.96s;/s);
const ringKeyframes = css.match(/@keyframes rft-ring-expand\s*\{([\s\S]*?)\n\}/)?.[1] || '';
assert.match(ringKeyframes, /0%\s*\{\s*opacity:\s*0;\s*transform:\s*scale\(\.3\);\s*\}/);
assert.match(ringKeyframes, /100%\s*\{\s*opacity:\s*0;\s*transform:\s*scale\(2\.45\);\s*\}/,
  'Rings must visibly expand outward from the logo');
assert.match(css, /prefers-reduced-motion:\s*reduce/,
  'Reduced-motion preferences must remain supported');

console.log('PASS startup animation: three visible, staggered outward rings');
