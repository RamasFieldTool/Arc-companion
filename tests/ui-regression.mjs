import { chromium } from 'playwright';
import { mkdir,readFile,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const OUTPUT=new URL('../test-artifacts/ui/',import.meta.url);
const shot=name=>fileURLToPath(new URL(name,OUTPUT));
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!items.length)throw new Error('items.json fixture missing');
const fixtureItems=items.slice(0,Math.min(items.length,60));
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/quality_gate_ui.json';
const quest={id:'quality_gate_ui',name:{de:'UI-Test',en:'UI test'},trader:'Test',objectives:[{de:'Layout prüfen',en:'Check layout'}],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]};

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    const url=new URL(route.request().url());
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0),limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
    const pageItems=fixtureItems.slice(offset,offset+limit);
    const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};
    if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'quality_gate_ui.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}
async function waitReady(page){await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});}
async function metrics(page){return page.evaluate(()=>{
  const rect=el=>{const r=el?.getBoundingClientRect();return r?{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}:null};
  return {viewport:{width:innerWidth,height:innerHeight},document:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth},masthead:rect(document.querySelector('.masthead')),launcher:rect(document.querySelector('#appLauncher')),tiles:[...document.querySelectorAll('#appLauncher .app-tile')].map(el=>({target:el.dataset.appTarget,...rect(el)})),version:document.querySelector('#dataStatusDock [data-app-version]')?.textContent?.trim()||''};
});}
function assertHome(m,label){
  const overflow=m.document.scrollWidth-m.document.clientWidth;if(overflow>4)throw new Error(`${label}: horizontal overflow ${overflow}px`);
  if(!m.masthead||m.masthead.width<100||m.masthead.height<40)throw new Error(`${label}: masthead collapsed`);
  if(!m.launcher||m.launcher.width<100)throw new Error(`${label}: launcher collapsed`);
  if(m.tiles.length<8)throw new Error(`${label}: expected at least 8 launcher tiles, got ${m.tiles.length}`);
  for(const tile of m.tiles){if(tile.width<44||tile.height<44)throw new Error(`${label}: touch target ${tile.target} is ${tile.width}x${tile.height}`);if(tile.x<-4||tile.x+tile.width>m.viewport.width+4)throw new Error(`${label}: tile ${tile.target} exceeds viewport`);}
  if(m.version!=='V13.0.17')throw new Error(`${label}: expected V13.0.17, got ${m.version}`);
}
async function openTarget(page,target){
  if(!(await page.locator('#appLauncher').isVisible())){await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});}
  await page.locator(`[data-app-target="${target}"]`).click();const section=page.locator(`#${target}`);await section.waitFor({state:'visible'});
  const state=await section.evaluate(el=>{const r=el.getBoundingClientRect();return {active:el.classList.contains('launcher-active'),open:el.tagName==='DETAILS'?el.open:true,width:r.width,right:r.right,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
  if(!state.active||!state.open)throw new Error(`${target}: target was not activated/opened`);
  const width=await page.evaluate(()=>innerWidth);if(state.width<100||state.right>width+4||state.overflow>4)throw new Error(`${target}: opened view exceeds viewport`);
}

await mkdir(OUTPUT,{recursive:true});
const browser=await chromium.launch({headless:true});
const configs=[
  {name:'android-small',width:360,height:800,isMobile:true,hasTouch:true,views:['itemsSection']},
  {name:'android-standard',width:412,height:915,isMobile:true,hasTouch:true,views:['backupPanel','questDrawer']},
  {name:'desktop',width:1280,height:900,isMobile:false,hasTouch:false,views:['goalsSection','itemsSection']}
];
const report=[];
try{
  for(const cfg of configs){
    const context=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},screen:{width:cfg.width,height:cfg.height},isMobile:cfg.isMobile,hasTouch:cfg.hasTouch,userAgent:cfg.isMobile?'Mozilla/5.0 (Linux; Android 16; RamasFieldToolVisualTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36':undefined});
    await context.addInitScript(()=>{
      localStorage.setItem('arcLang','en');
      localStorage.setItem('arcUiLanguage','en');
      localStorage.setItem('arcLanguageOnboardingPending','0');
    });
    const page=await context.newPage(),pageErrors=[],consoleErrors=[];
    page.on('pageerror',e=>pageErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
    await installRoutes(page);await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});await waitReady(page);
    const home=await metrics(page);assertHome(home,cfg.name);await page.screenshot({path:shot(`${cfg.name}-home.png`),fullPage:true});
    const opened=[];
    for(const target of cfg.views){await openTarget(page,target);await page.screenshot({path:shot(`${cfg.name}-${target}.png`),fullPage:true});opened.push(target);await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'});}
    if(pageErrors.length)throw new Error(`${cfg.name}: uncaught browser errors: ${pageErrors.join(' | ')}`);if(consoleErrors.length)throw new Error(`${cfg.name}: console errors: ${consoleErrors.join(' | ')}`);
    report.push({config:cfg,home,opened});console.log(`PASS ${cfg.name}: responsive layout and ${cfg.views.length} opened view(s)`);await context.close();
  }
  await writeFile(new URL('layout-report.json',OUTPUT),JSON.stringify(report,null,2));console.log('All responsive UI regression checks passed; screenshots captured.');
}finally{await browser.close();}
