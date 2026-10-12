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
await p.waitForFunction(()=>document.querySelector('#spawnViewport').dataset.map==='pendola-pass'&&document.querySelector('#spawnMapImage').src.includes('pendola-pass')&&document.querySelector('#spawnMapImage').naturalWidth===1448);
await p.waitForTimeout(600);
if(await p.locator('#spawnBadge').textContent()!=='REKONSTRUKTION')throw Error('Missing draft status');
if(await p.locator('#spawnCanvas button:visible').count())throw Error('Unexpected spawn/case markers');
if(await p.locator('#pendolaOverlay .pendola-extraction').count()!==4)throw Error('Missing reference extractions');
if(await p.locator('#pendolaOverlay .pendola-area').count()!==4)throw Error('Missing area labels');
if(await p.locator('#pendolaOverlay .pendola-place').count()!==13)throw Error('Missing identifiable landmarks');
if(await p.locator('#pendolaReferenceSelect').count())throw Error('Obsolete photo picker');
if(!(await p.locator('#spawnMapImage').getAttribute('src')).includes('pendola-pass-rft-base.jpg'))throw Error('Illustration not loaded');
const styles=await p.locator('#spawnMapImage').evaluate(x=>({fit:getComputedStyle(x).objectFit,filter:getComputedStyle(x).filter}));if(styles.fit!=='contain'||styles.filter!=='none')throw Error('Illustration cropped or filtered');
await p.locator('#spawnExpand').click();await p.locator('#spawnZoomIn').click();await p.locator('#spawnZoomIn').click();
const before=await p.locator('#spawnCanvas').getAttribute('style');const box=await p.locator('#spawnViewport').boundingBox();
await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2+45,box.y+box.height/2+40,{steps:8});await p.mouse.up();
const after=await p.locator('#spawnCanvas').getAttribute('style');if(after===before)throw Error('Pan had no effect');
await p.screenshot({path:`test-artifacts/pendola/${mobile?'mobile':'desktop'}.png`});
await p.locator('#spawnReset').click();if(!(await p.locator('#spawnCanvas').getAttribute('style')).includes('scale(1)'))throw Error('Reset failed');
await p.locator('#spawnCloseExpanded').click();
await p.locator('#spawnMapSelect').waitFor({state:'visible',timeout:5000});
for(const map of ['spaceport','buried-city','dam-battlegrounds','the-blue-gate','stella-montis-upper','stella-montis-lower','riven-tides','pendola-pass']){
await p.locator('#spawnMapSelect').selectOption(map);await p.waitForTimeout(500);
const src=await p.locator('#spawnMapImage').getAttribute('src');if(map!=='pendola-pass'&&src.includes('pendola'))throw Error('Map stuck on Pendola');
if(map!=='pendola-pass'&&await p.locator('#pendolaOverlay').isVisible())throw Error('Pendola overlay leaked to another map');
if(map==='pendola-pass'&&!src.includes('pendola'))throw Error('Pendola did not return');
}
if(await p.evaluate(()=>localStorage.getItem('pendolaSafetyProbe'))!=='unchanged')throw Error('Storage changed');
await p.reload();await p.waitForFunction(()=>document.querySelector('#spawnViewport').dataset.map==='pendola-pass');
for(const [code,title] of [['en','Pendola Pass – work in progress'],['fr','Pendola Pass – en construction'],['es','Pendola Pass – en desarrollo'],['it','Pendola Pass – in sviluppo'],['de','Pendola Pass – im Ausbau']]){
 console.log('Checking draft language',code);await p.locator('#appBack').click();await p.locator('#arcLanguageButton').click();await p.locator(`#arcLanguageMenu [data-arc-language="${code}"]`).click();
 await p.locator('[data-app-target="spawnPanel"]').click();
 await p.waitForFunction(([code,title])=>document.documentElement.dataset.uiLanguage===code&&document.querySelector('#pendolaDraftNotice strong')?.textContent===title,[code,title]);
 await p.waitForTimeout(350);if(await p.locator('#pendolaDraftNotice strong').textContent()!==title)throw Error('Draft translation was overwritten');
}
await p.screenshot({path:`test-artifacts/pendola/${mobile?'mobile':'desktop'}-panel.png`});
if(errors.length)throw Error(errors.join('\n'));
console.log(`${mobile?'Android emulation':'Desktop'} PASS: load, selection, four extraction symbols, four area labels, thirteen landmarks, no spawn/case markers, zoom, pan, reset, all map switches, persisted selection, five draft translations, storage probe, no page errors`);
await context.close();
}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
