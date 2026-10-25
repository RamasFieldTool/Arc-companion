import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('catalog-data/amplified-variants.json','utf8'));
const browser=await chromium.launch({headless:true});
try{
const page=await browser.newPage({viewport:{width:430,height:932},isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('about:blank');
await page.evaluate(data=>{
document.body.innerHTML='<div id="outpostAmplifiedHost"></div>';
window.RFTAmplified={data,familyName:id=>id,materialName:id=>id,ready:Promise.resolve(data)};
},data);
await page.addScriptTag({path:'amplified-planner-v15.js'});
await page.waitForSelector('#rftAmplifiedPlanner select');
assert.equal(await page.locator('#rftAmplifiedPlanner select option').count(),15);
await page.locator('#rftAmplifiedPlanner select').selectOption('hairpin');
assert(await page.locator('#rftAmplifiedPlanner input[type=checkbox]').count()>0);
const width=await page.evaluate(()=>document.documentElement.scrollWidth);
assert(width<=430,'Mobile horizontal overflow: '+width);
assert.deepEqual(errors,[]);
console.log('PASS: Chromium mobile planner smoke test');
}finally{await browser.close()}
