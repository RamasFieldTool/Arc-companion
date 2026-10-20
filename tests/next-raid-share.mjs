import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import {installItemCatalogRoute} from './helpers/item-catalog.mjs';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8')).slice(0,60);
const [openItem,doneItem]=items.filter(item=>item?.id&&item?.en).slice(0,2);
if(!openItem||!doneItem)throw new Error('No item fixtures for My Next Raid sharing');
const raidSeed={[openItem.id]:{target:4,done:false},[doneItem.id]:{target:1,done:true}};

async function startPage(context,withoutClipboard=false){
  await context.addInitScript(({raid,withoutClipboard})=>{
    localStorage.setItem('arcLang','en');localStorage.setItem('arcUiLanguage','en');localStorage.setItem('arcLanguageOnboardingPending','0');
    localStorage.setItem('arcPlanningMigrationV1','1');localStorage.setItem('arcPlanningPersonal','{}');localStorage.setItem('arcOwned','{}');localStorage.setItem('arcQuestStatus','{}');localStorage.setItem('arcActiveGoals','{}');
    localStorage.setItem('arcNextRaid',JSON.stringify(raid));
    if(withoutClipboard)Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});
  },{raid:raidSeed,withoutClipboard});
  const page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',error=>errors.push(String(error)));page.on('request',request=>requests.push(request.url()));
  await installItemCatalogRoute(page,items);
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
  await page.goto(`${BASE_URL}#nextRaidDrawer`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>['live','partial','fallback'].includes(document.querySelector('#dataStatusPersistent')?.dataset.state));
  await page.locator('#nextRaidDrawer').waitFor({state:'visible'});
  if(!(await page.locator('#nextRaidDrawer').evaluate(el=>el.open)))await page.locator('#nextRaidDrawer > summary').click();
  await page.locator('#nextRaidShare').waitFor({state:'visible'});
  return {page,errors,requests};
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:360,height:800},isMobile:true,hasTouch:true});
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:new URL(BASE_URL).origin});
  const {page,errors,requests}=await startPage(context);
  const before=await page.evaluate(()=>({raid:localStorage.getItem('arcNextRaid'),owned:localStorage.getItem('arcOwned'),planning:localStorage.getItem('arcPlanningPersonal')}));
  await page.locator('#nextRaidShare').click();
  await page.locator('#nextRaidShareStatus').waitFor({state:'visible'});
  const copied=await page.evaluate(()=>navigator.clipboard.readText());
  if(!copied.includes('My next raid checklist')||!copied.includes(openItem.en)||!copied.includes('× 4 (OPEN)')||!copied.includes(doneItem.en)||!copied.includes('✓')||!copied.includes('(DONE)'))throw new Error(`Copied checklist does not preserve item quantities and status: ${copied}`);
  if(!(await page.locator('#nextRaidShareStatus').innerText()).includes('Raid list copied'))throw new Error('Missing copy success status');
  const after=await page.evaluate(()=>({raid:localStorage.getItem('arcNextRaid'),owned:localStorage.getItem('arcOwned'),planning:localStorage.getItem('arcPlanningPersonal')}));
  if(JSON.stringify(before)!==JSON.stringify(after))throw new Error('Copying the list changed saved raid or player data');
  const requestCount=requests.length;
  for(const [language,label] of [['de','Raid-Liste kopieren'],['fr','Copier la liste de raid'],['es','Copiar lista de incursión'],['it','Copia la lista del raid'],['en','Copy raid list']]){
    await page.evaluate(language=>{localStorage.setItem('arcUiLanguage',language);document.documentElement.lang=language;document.documentElement.dataset.uiLanguage=language;window.dispatchEvent(new CustomEvent('arc-language-change',{detail:{language}}))},language);
    await page.locator('#nextRaidShare').waitFor({state:'visible'});
    if(await page.locator('#nextRaidShare').innerText()!==label)throw new Error(`Share label not localized to ${language}`);
  }
  if(requests.length!==requestCount)throw new Error('Sharing sent a network request');
  if(errors.length)throw new Error(errors.join('\n'));
  console.log('PASS My Next Raid share: local clipboard only, quantities/status, saved-data integrity, no network requests, five languages and 360px mobile');
  await context.close();

  const fallbackContext=await browser.newContext({viewport:{width:360,height:800},isMobile:true,hasTouch:true});
  const fallback=await startPage(fallbackContext,true);
  const fallbackBefore=await fallback.page.evaluate(()=>localStorage.getItem('arcNextRaid'));
  await fallback.page.locator('#nextRaidShare').click();
  await fallback.page.locator('.next-raid-share-fallback').waitFor({state:'visible'});
  const manual=await fallback.page.locator('.next-raid-share-fallback textarea').inputValue();
  if(!manual.includes(openItem.en)||!manual.includes('× 4 (OPEN)'))throw new Error('Manual copy fallback omitted checklist content');
  if(await fallback.page.evaluate(()=>localStorage.getItem('arcNextRaid'))!==fallbackBefore)throw new Error('Manual copy fallback changed saved raid data');
  if(fallback.errors.length)throw new Error(fallback.errors.join('\n'));
  console.log('PASS My Next Raid share fallback: selectable text appears when clipboard is unavailable; no data mutation');
  await fallbackContext.close();
}finally{await browser.close()}
