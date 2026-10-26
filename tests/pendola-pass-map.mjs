import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';
import {readFile} from 'node:fs/promises';
const evidence=JSON.parse(await readFile(new URL('../catalog-data/pendola-pass-location-evidence.json',import.meta.url),'utf8'));
if(evidence.playerSpawns.records.length!==21||new Set(evidence.playerSpawns.records.map(p=>p.id)).size!==21)throw Error('Player source IDs');
if(evidence.playerSpawns.records.some(p=>p.mapID!=='pendola-pass'||p.category!=='locations'||p.subcategory!=='player_spawn'||!Number.isFinite(p.lat)||!Number.isFinite(p.lng)))throw Error('Invalid player source data');
const matrix=evidence.coordinateSystem.mappingToRftIllustration.matrix;
const counts={cases:0,arcs:0,areas:0,outside:0};
for(const layer of evidence.layers){
 if(layer.records.length!==layer.count)throw Error('Evidence count mismatch');
 for(const r of layer.records){const x=r[0]*matrix[0][0]+r[1]*matrix[1][0]+matrix[2][0],y=r[0]*matrix[0][1]+r[1]*matrix[1][1]+matrix[2][1];
 if(!Number.isFinite(x)||!Number.isFinite(y))throw Error('Invalid transfer');
 const group=layer.category.startsWith('weapon-case')?'cases':layer.category.startsWith('arc-spawn-areas')?'areas':'arcs';
 if(x<0||x>100||y<0||y>100)counts.outside++;else counts[group]++;
 }
}
if(JSON.stringify(counts)!==JSON.stringify({cases:58,arcs:30,areas:123,outside:7}))throw Error('Unexpected overlay counts');
const fixture=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8')).slice(0,60);
await mkdir('test-artifacts/pendola',{recursive:true});
(async()=>{
const browser=await chromium.launch({headless:true});
for(const mobile of [false,true]){
const context=await browser.newContext(mobile?{viewport:{width:412,height:915},isMobile:true,hasTouch:true}:{viewport:{width:1280,height:900}});
await context.addInitScript(()=>{localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('pendolaSafetyProbe','unchanged')});
const p=await context.newPage();const errors=[],mapAssetRequests=[];p.on('pageerror',e=>errors.push(String(e)));p.on('request',r=>{if(/\/(?:maps\.json|raider-spawns\.json|spaceport-approved-base\.jpg)$/.test(new URL(r.url()).pathname))mapAssetRequests.push(r.url())});
await installItemCatalogRoute(p,fixture,'live');
// Keep map regression independent of external quest availability.
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/pendola_fixture.json';
await p.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',r=>r.fulfill({json:[{type:'file',name:'pendola_fixture.json',download_url:questUrl}]}));
await p.route(questUrl,r=>r.fulfill({json:{id:'pendola_fixture',name:{de:'Kartentest',en:'Map test'},objectives:[],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]}}));
await p.goto(process.env.BASE_URL||'http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
await p.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live');
if(mapAssetRequests.length)throw Error('Map catalog or spawn data loaded before opening the map view');
await p.locator('[data-app-target="spawnPanel"]').click();
await p.waitForFunction(()=>typeof mapCatalog!=='undefined'&&mapCatalog?.maps?.length);
if(!mapAssetRequests.some(url=>url.includes('maps.json')))throw Error('Map catalog was not loaded when opening the map view');
await p.waitForFunction(()=>Array.from(document.querySelector('#spawnMapSelect')?.options||[]).some(option=>option.value==='pendola-pass'));
await p.locator('#spawnMapSelect').selectOption('pendola-pass');
await p.waitForFunction(()=>document.querySelector('#spawnViewport').dataset.map==='pendola-pass'&&document.querySelector('#spawnMapImage').src.includes('pendola-pass')&&document.querySelector('#spawnMapImage').naturalWidth===1448);
await p.waitForTimeout(600);
if(!(await p.locator('#pendolaLayerPicker').isVisible()))throw Error('Missing standard layer picker');
if(await p.locator('#pendolaLootSources a').count()!==3)throw Error('Missing source links');
if(await p.locator('#spawnBadge').textContent()!=='REKONSTRUKTION')throw Error('Missing draft status');
await p.waitForSelector('#pendolaLayerPicker');
if(await p.locator('#pendolaLocationMarkers button').count())throw Error('Pendola must start with no active layers');
if(await p.locator('#pendolaLayerPicker').getAttribute('open')!==null)throw Error('Picker must start collapsed');
await p.locator('#pendolaLayerPicker summary').click();
for(const group of ['cases','arcs','players'])await p.locator(`[data-pendola-layer=${group}]`).click();
await p.waitForFunction(()=>document.querySelectorAll('#pendolaLocationMarkers .pendola-loot-marker').length===102);
if(await p.locator('.pendola-players').first().textContent()!=='S1'||await p.locator('.pendola-cases').first().textContent()!=='W1')throw Error('Standard marker labels');
if(!await p.locator('.pendola-players').first().evaluate(e=>e.classList.contains('spaceport-spawn-marker')))throw Error('Shared spawn style');
if(!await p.locator('.pendola-cases').first().evaluate(e=>e.classList.contains('spaceport-case-marker')))throw Error('Shared case style');
if(await p.locator('#layerRaiders').isVisible()||await p.locator('#layerWeaponCases').isVisible())throw Error('Legacy Pendola controls visible');
if(await p.locator('#pendolaLocationMarkers .pendola-players').count()!==14)throw Error('Player spawn count');
await p.locator('[data-pendola-layer=players]').click();if(await p.locator('.pendola-players').count())throw Error('Player toggle');
await p.locator('[data-pendola-layer=players]').click();
if(await p.locator('#pendolaLocationMarkers .pendola-cases').count()!==58)throw Error('Weapon case count');
if(await p.locator('#pendolaLocationMarkers .pendola-arcs').count()!==30)throw Error('ARC point count');
await p.locator('[data-pendola-layer=cases]').click();if(await p.locator('.pendola-cases').count())throw Error('Case toggle');
await p.locator('[data-pendola-layer=cases]').click();
await p.locator('[data-pendola-layer=areas]').click();if(await p.locator('.pendola-areas').count()!==123)throw Error('ARC area count');
await p.locator('[data-pendola-layer=areas]').click();
await p.locator('#pendolaLocationMarkers .pendola-cases').first().press('Enter');
if(!await p.locator('.pendola-selection').isVisible())throw Error('Marker selection');
await p.locator('[data-pendola-layer=extractions]').click();
if(await p.locator('#pendolaLocationMarkers .pendola-extractions').count()!==4)throw Error('Missing reference extractions');
await p.locator('[data-pendola-layer=extractions]').click();
if(await p.locator('#pendolaOverlay .pendola-area').count()!==4)throw Error('Missing area labels');
if(await p.locator('#pendolaOverlay .pendola-place').count()!==13)throw Error('Missing identifiable landmarks');
if(await p.locator('#pendolaReferenceSelect').count())throw Error('Obsolete photo picker');
if(!(await p.locator('#spawnMapImage').getAttribute('src')).includes('pendola-pass-rft-base.jpg'))throw Error('Illustration not loaded');
const styles=await p.locator('#spawnMapImage').evaluate(x=>({fit:getComputedStyle(x).objectFit,filter:getComputedStyle(x).filter}));if(styles.fit!=='contain'||styles.filter!=='none')throw Error('Illustration cropped or filtered');
await p.locator('#spawnExpand').click();
if(await p.locator('#spawnMapStage [data-pendola-layer=cases]').count()!==1)throw Error('Expanded controls not inside stage');
if(!await p.locator('[data-pendola-layer=cases]').isVisible())throw Error('Expanded layer controls unavailable');
await p.locator('#spawnZoomIn').click();await p.locator('#spawnZoomIn').click();
const before=await p.locator('#spawnCanvas').getAttribute('style');const box=await p.locator('#spawnViewport').boundingBox();
// Drag blank viewport space rather than the enlarged marker hit targets.
await p.mouse.move(box.x+12,box.y+12);await p.mouse.down();await p.mouse.move(box.x+57,box.y+52,{steps:8});await p.mouse.up();
const after=await p.locator('#spawnCanvas').getAttribute('style');if(after===before)throw Error('Pan had no effect');
// Start a real touch/mouse gesture on a visible marker, not just blank space.
const marker=await p.locator('.pendola-cases').evaluateAll(nodes=>{const v=document.getElementById('spawnViewport').getBoundingClientRect();const n=nodes.find(n=>{const r=n.getBoundingClientRect();return r.x>v.x+30&&r.y>v.y+30&&r.right<v.right-70&&r.bottom<v.bottom-70});if(!n)return null;const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
if(!marker)throw Error('No marker available for drag test');
const markerBefore=await p.locator('#spawnCanvas').getAttribute('style');
if(mobile){
 const touch=await context.newCDPSession(p);
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:marker.x,y:marker.y}]});
 await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:marker.x+36,y:marker.y+28}]});
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await touch.detach();
}else{await p.mouse.move(marker.x,marker.y);await p.mouse.down();await p.mouse.move(marker.x+36,marker.y+28,{steps:8});await p.mouse.up();}
if(await p.locator('#spawnCanvas').getAttribute('style')===markerBefore)throw Error('Dragging from marker had no effect');
if(await p.locator('#pendolaLocationDetails').isVisible())throw Error('Drag opened marker details');
if(mobile){const tap=await context.newCDPSession(p);await tap.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:marker.x+36,y:marker.y+28}]});await tap.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await tap.detach();}else await p.mouse.click(marker.x+36,marker.y+28);
if(!await p.locator('#pendolaLocationDetails').isVisible())throw Error('Marker tap lost after drag');
await p.screenshot({path:`test-artifacts/pendola/${mobile?'mobile':'desktop'}.png`});
await p.locator('#spawnReset').click();if(!(await p.locator('#spawnCanvas').getAttribute('style')).includes('scale(1)'))throw Error('Reset failed');
await p.locator('#spawnCloseExpanded').click();
await p.locator('#spawnMapSelect').waitFor({state:'visible',timeout:5000});
for(const map of ['spaceport','buried-city','dam-battlegrounds','the-blue-gate','stella-montis-upper','stella-montis-lower','riven-tides','pendola-pass']){
await p.locator('#spawnMapSelect').selectOption(map);await p.waitForTimeout(500);
const src=await p.locator('#spawnMapImage').getAttribute('src');if(map!=='pendola-pass'&&src.includes('pendola'))throw Error('Map stuck on Pendola');
if(map!=='pendola-pass'&&await p.locator('#pendolaLootSources').isVisible())throw Error('Loot sources leaked');
if(map!=='pendola-pass'&&await p.locator('#pendolaLayerPicker').isVisible())throw Error('Location controls leaked');
if(map!=='pendola-pass'&&await p.locator('#pendolaOverlay').isVisible())throw Error('Pendola overlay leaked to another map');
if(map==='pendola-pass'&&!src.includes('pendola'))throw Error('Pendola did not return');
}
if(await p.evaluate(()=>localStorage.getItem('pendolaSafetyProbe'))!=='unchanged')throw Error('Storage changed');
await p.locator('#appBack').click();mapAssetRequests.length=0;await p.reload();if(mapAssetRequests.length)throw Error('Map data loaded during reload before opening the map view');await p.locator('[data-app-target="spawnPanel"]').click();await p.waitForFunction(()=>document.querySelector('#spawnViewport').dataset.map==='pendola-pass');
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
