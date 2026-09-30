import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!Array.isArray(items)||!items.length)throw new Error('items.json fixture missing');
const fixtureItems=items.slice(0,Math.min(items.length,60));
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/logo_home_quality.json';
const quest={id:'logo_home_quality',name:{de:'Home-Test',en:'Home test'},trader:'Test',objectives:[{de:'Home testen',en:'Test home'}],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]};

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    const url=new URL(route.request().url());
    const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
    const limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
    const pageItems=fixtureItems.slice(offset,offset+limit);
    const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};
    if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'logo_home_quality.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}

async function waitReady(page){
  await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});
}
async function openTarget(page,target){
  await page.locator(`[data-app-target="${target}"]`).first().tap();
  await page.waitForFunction(id=>document.getElementById(id)?.classList.contains('launcher-active'),target);
}
async function assertHome(page,label){
  await page.locator('#appLauncher').waitFor({state:'visible'});
  const state=await page.evaluate(()=>({
    viewOpen:document.body.classList.contains('view-open'),
    mapExpanded:document.body.classList.contains('map-expanded')||document.getElementById('spawnMapStage')?.classList.contains('is-expanded'),
    active:document.querySelectorAll('.launcher-section.launcher-active').length,
    scrollY:window.scrollY,
    sentinel:localStorage.getItem('rftLogoHomeSentinel')
  }));
  if(state.viewOpen)throw new Error(`${label}: body still in view-open mode`);
  if(state.mapExpanded)throw new Error(`${label}: map fullscreen still active`);
  if(state.active)throw new Error(`${label}: launcher section still active`);
  if(state.scrollY>2)throw new Error(`${label}: page did not return to top (${state.scrollY}px)`);
  if(state.sentinel!=='keep-user-data')throw new Error(`${label}: local user data was changed or cleared`);
}

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({
  viewport:{width:412,height:915},screen:{width:412,height:915},isMobile:true,hasTouch:true,
  userAgent:'Mozilla/5.0 (Linux; Android 16; RamasFieldToolLogoHomeTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'
});
await context.addInitScript(()=>{
  localStorage.setItem('arcLang','en');
  localStorage.setItem('arcUiLanguage','en');
  localStorage.setItem('arcLanguageOnboardingPending','0');
});
const page=await context.newPage();
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(String(error)));
try{
  await installRoutes(page);
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await waitReady(page);
  const version=(await page.locator('#dataStatusDock [data-app-version]').innerText()).trim();
  if(version!=='V13.0.20')throw new Error(`expected V13.0.20, got ${version}`);

  await page.evaluate(()=>localStorage.setItem('rftLogoHomeSentinel','keep-user-data'));
  await openTarget(page,'itemsSection');
  const logo=page.locator('.official-app-logo');
  if(!(await logo.isVisible()))throw new Error('logo home button is not visible in an opened feature');
  if((await logo.getAttribute('role'))!=='button')throw new Error('logo is missing button semantics');
  if((await logo.getAttribute('tabindex'))!=='0')throw new Error('logo is not keyboard-focusable');
  const logoBox=await logo.boundingBox();
  if(!logoBox||logoBox.width<44||logoBox.height<44)throw new Error(`logo home touch target is too small: ${logoBox?.width}x${logoBox?.height}`);
  await page.evaluate(()=>{document.body.style.minHeight='2200px';window.scrollTo(0,800)});
  await logo.tap();
  await assertHome(page,'feature home');

  await openTarget(page,'spawnPanel');
  await page.locator('#spawnExpand').tap();
  await page.waitForFunction(()=>document.body.classList.contains('map-expanded')&&document.getElementById('spawnMapStage')?.classList.contains('is-expanded'));
  if(!(await logo.isVisible()))throw new Error('logo home button is not visible above map fullscreen');
  const mapLogoBox=await logo.boundingBox();
  if(!mapLogoBox||mapLogoBox.width<44||mapLogoBox.height<44)throw new Error('map fullscreen logo home target is too small');
  await logo.tap();
  await assertHome(page,'map fullscreen home');

  await openTarget(page,'backupPanel');
  await logo.focus();
  await page.keyboard.press('Enter');
  await assertHome(page,'keyboard home');

  if(pageErrors.length)throw new Error(`uncaught browser errors: ${pageErrors.join(' | ')}`);
  console.log('PASS logo home button: feature, map fullscreen, keyboard and user-data safety.');
}finally{
  await context.close();
  await browser.close();
}
