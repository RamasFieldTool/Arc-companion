import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
import {readFile} from 'node:fs/promises';
const fixture=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8')).slice(0,60);
await mkdir('test-artifacts/pendola',{recursive:true});
(async()=>{
const browser=await chromium.launch({headless:true});
for(const mobile of [false,true]){
const context=await browser.newContext(mobile?{viewport:{width:412,height:915},isMobile:true,hasTouch:true}:{viewport:{width:1280,height:900}});
await context.addInitScript(()=>{localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('pendolaSafetyProbe','unchanged')});
const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));
await installItemCatalogRoute(p,fixture,'live');
await p.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
await p.waitForFunction(()=>typeof mapCatalog!=='undefined'&&mapCatalog?.maps?.length);
await p.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live');
await p.locator('[data-app-target="spawnPanel"]').click();
await p.locator('#spawnMapSelect').selectOption('pendola-pass');
await p.waitForFunction(()=>document.querySelector('#spawnViewport').dataset.map==='pendola-pass'&&document.querySelector('#spawnMapImage').src.includes('pendola-pass')&&document.querySelector('#spawnMapImage').naturalWidth===3072);
await p.waitForTimeout(600);
if(await p.locator('#spawnBadge').textContent()!=='KARTENENTWURF')throw Error('Missing draft status');
if(await p.locator('#spawnCanvas button:visible').count())throw Error('Unexpected gameplay markers');
await p.locator('#spawnExpand').click();await p.locator('#spawnZoomIn').click();await p.locator('#spawnZoomIn').click();
const before=await p.locator('#spawnCanvas').getAttribute('style');const box=await p.locator('#spawnViewport').boundingBox();
await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2+45,box.y+box.height/2+40,{steps:8});await p.mouse.up();
const after=await p.locator('#spawnCanvas').getAttribute('style');if(after===before)throw Error('Pan had no effect');
await p.screenshot({path:`test-artifacts/pendola/${mobile?'mobile':'desktop'}.png`});
await p.locator('#spawnReset').click();if(!(await p.locator('#spawnCanvas').getAttribute('style')).includes('scale(1)'))throw Error('Reset failed');
await p.locator('#spawnCloseExpanded').click();
console.log('After close',JSON.stringify(await p.evaluate(()=>({hash:location.hash,body:document.body.className,stage:document.getElementById('spawnMapStage').className,panel:document.getElementById('spawnPanel').className,select:getComputedStyle(document.getElementById('spawnMapSelect')).display}))));
await p.locator('#spawnMapSelect').waitFor({state:'visible',timeout:5000});
for(const map of ['spaceport','buried-city','dam-battlegrounds','the-blue-gate','stella-montis-upper','stella-montis-lower','riven-tides','pendola-pass']){
console.log('Switching',map);await p.locator('#spawnMapSelect').selectOption(map);await p.waitForTimeout(500);
const src=await p.locator('#spawnMapImage').getAttribute('src');if(map!=='pendola-pass'&&src.includes('pendola'))throw Error('Map stuck on Pendola');
if(map==='pendola-pass'&&!src.includes('pendola'))throw Error('Pendola did not return');
}
if(await p.evaluate(()=>localStorage.getItem('pendolaSafetyProbe'))!=='unchanged')throw Error('Storage changed');
await p.reload();await p.waitForFunction(()=>document.querySelector('#spawnViewport').dataset.map==='pendola-pass');
if(errors.length)throw Error(errors.join('\n'));
console.log(`${mobile?'Android emulation':'Desktop'} PASS: load, selection, no markers, zoom, pan, reset, all map switches, persisted selection, storage probe, no page errors`);
await context.close();
}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
