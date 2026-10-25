import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
const data=JSON.parse(fs.readFileSync('catalog-data/amplified-variants.json','utf8'));
const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>')});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true});
try{
const page=await browser.newPage({viewport:{width:430,height:932},isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:'+server.address().port+'/');
await page.evaluate(data=>{
document.body.innerHTML='<div id="outpostAmplifiedHost"></div>';
window.RFTAmplified={data,familyName:id=>id,materialName:id=>id,ready:Promise.resolve(data)};
},data);
await page.addScriptTag({path:'amplified-planner-v15.js'});
await page.waitForSelector('#rftAmplifiedPlanner select');
assert.equal(await page.locator('#rftAmplifiedPlanner select option').count(),15);
await page.locator('#rftAmplifiedPlanner select').selectOption('hairpin');
assert(await page.locator('#rftAmplifiedPlanner input[type=checkbox]').count()>0);

// Choose a valid first-step upgrade and verify persistence and research UI.
const first=page.locator('#rftAmplifiedPlanner input[type=checkbox]:not([disabled])').first();
if(await first.count()){
  await first.check();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('rftAmplifiedPlansV1')||'{}'));
  assert(Array.isArray(saved.hairpin));
  assert(saved.hairpin.length>0);
}
await page.evaluate(()=>{localStorage.setItem('arcUiLanguage','fr');window.dispatchEvent(new Event('arc-language-change'))});
assert.equal(await page.locator('#rftAmplifiedPlanner h3').textContent(),'Améliorer les armes');
assert.equal(await page.locator('#rftAmplifiedPlanner select').inputValue(),'hairpin');
await page.evaluate(()=>{window.RFTNextRaidGoals={addMissingItems:rows=>({saved:true,added:rows.length,alreadySaved:0})}});
const raid=page.locator('#rftAmplifiedPlanner button').last();
await raid.click();
assert((await raid.textContent()).includes('Ajouté')||(await raid.textContent()).includes('Déjà ajouté'));


// Exercise every newly corroborated upgrade, research cost, persistence and raid handoff.
for(const [family,perk,material] of [
  ['osprey','ergonomicbolt','fluted_rotor_core'],
  ['jupiter','ergonomicbolt','fluted_rotor_core'],
  ['rascal','incendiarygrenades','fossilized_lightning'],
  ['hullcracker','incendiarygrenades','fossilized_lightning']
]){
  await page.locator('#rftAmplifiedPlanner select').selectOption(family);
  const selector='#rftAmplifiedPlanner fieldset label';
  const choice=page.locator(selector).filter({hasText:family==='osprey'||family==='jupiter'?'Ergonomic Bolt':'Incendiary Rounds'});
  assert.equal(await choice.count(),1, family+' perk missing');
  const checkbox=choice.locator('input');
  assert.equal(await checkbox.isDisabled(),false, family+' perk unexpectedly locked');
  await checkbox.check();
  const selected=await page.evaluate(key=>JSON.parse(localStorage.getItem('rftAmplifiedPlansV1')||'{}')[key],family);
  assert(selected.includes(family+':'+perk));
  assert((await page.locator('#rftAmplifiedPlanner ul').first().textContent()).includes(material));
}
await page.locator('#rftAmplifiedPlanner select').selectOption('equalizer');
assert.equal(await page.locator('#rftAmplifiedPlanner fieldset').getByText('Anti Shield').count(),0);
assert((await page.locator('#rftAmplifiedPlanner').textContent()).includes('Anti Shield'));

const width=await page.evaluate(()=>document.documentElement.scrollWidth);
assert(width<=430,'Mobile horizontal overflow: '+width);
assert.deepEqual(errors,[]);
console.log('PASS: Chromium mobile planner smoke test');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
