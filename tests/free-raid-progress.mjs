import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const allItems=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!Array.isArray(allItems)||!allItems.length)throw new Error('Item fixture is empty');
const fixtureItems=allItems.slice(0,Math.min(allItems.length,60));
const item=fixtureItems.find(entry=>entry?.id&&(entry?.name?.en||entry?.name?.de||entry?.en||entry?.de))||fixtureItems[0];
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/quality_gate_free_raid.json';
const quest={id:'quality_gate_free_raid',name:{de:'Raid-Test',en:'Raid test'},trader:'Test',objectives:[],requiredItemIds:[{itemId:item.id,quantity:3}],rewardItemIds:[],grantedItemIds:[]};

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{const url=new URL(route.request().url());const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);const limit=Math.max(1,Number(url.searchParams.get('limit'))||45);const pageItems=fixtureItems.slice(offset,offset+limit);const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)})});
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'quality_gate_free_raid.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}
async function planningRow(page){return page.locator(`#planningMissing [data-plan-item="${item.id}"]`)}
async function assertPlanning(page,{required,owned,missing}){const row=await planningRow(page);await row.waitFor({state:'visible'});await page.waitForFunction(({id,missing})=>{const row=document.querySelector(`#planningMissing [data-plan-item="${CSS.escape(id)}"]`);return row&&row.querySelector('.planning-item-head b')?.textContent?.startsWith(String(missing))},{id:item.id,missing});const text=await row.innerText();for(const value of [String(required),String(owned),String(missing)])if(!text.includes(value))throw new Error(`Planning row does not show expected ${value}: ${text}`)}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:412,height:915},screen:{width:412,height:915},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 16; RamasFieldToolRaidProgressTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'});
  await context.addInitScript(()=>{localStorage.setItem('arcLang','en');localStorage.setItem('arcUiLanguage','en');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcOwned','{}');localStorage.setItem('arcActiveGoals','{}');localStorage.setItem('arcQuestStatus',JSON.stringify({quality_gate_free_raid:'active'}));localStorage.setItem('arcPlanningPersonal','{}');localStorage.setItem('arcPlanningMigrationV1','1');localStorage.removeItem('arcNextRaid')});
  const page=await context.newPage(),pageErrors=[];page.on('pageerror',error=>pageErrors.push(String(error)));await installRoutes(page);await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});

  await page.locator('[data-app-target="planningSection"]').first().tap();
  await page.waitForFunction(()=>document.getElementById('planningSection')?.classList.contains('launcher-active'));
  await assertPlanning(page,{required:3,owned:0,missing:3});

  await page.locator('#planningTabGoals').tap();
  await page.locator('[data-goal-category="personal"]').tap();
  await page.locator('#planningPersonalItem').selectOption(item.id);
  await page.locator('#planningPersonalAmount').fill('10');
  await page.locator('#planningPersonalAdd').tap();
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('arcPlanningPersonal')||'{}')[id]?.target===10,item.id);
  const personal=page.locator(`#planningPersonalList [data-personal="${item.id}"]`);await personal.waitFor({state:'visible'});
  if(!(await personal.innerText()).includes('10'))throw new Error('Visible personal goal does not show target 10');
  console.log('PASS visible planning controls create personal target 10');

  await page.locator('#planningTabMissing').tap();
  await assertPlanning(page,{required:13,owned:0,missing:13});
  console.log('PASS quest need 3 + personal target 10 = combined requirement 13');

  await page.locator('#planningRaidFinished').tap();
  const found=page.locator(`#planningRaidFinds [data-raid-find="${item.id}"]`);await found.waitFor({state:'visible'});await found.fill('5');await page.locator('#planningRaidPanel [data-raid-apply]').tap();
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('arcOwned')||'{}')[id]===5,item.id);
  await assertPlanning(page,{required:13,owned:5,missing:8});
  console.log('PASS first raid find updates stock once and leaves combined missing need 8');

  await page.locator('#planningRaidFinished').tap();await page.locator(`#planningRaidFinds [data-raid-find="${item.id}"]`).fill('5');await page.locator('#planningRaidPanel [data-raid-apply]').tap();
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('arcOwned')||'{}')[id]===10,item.id);
  await page.waitForTimeout(100);
  const goal=await page.evaluate(id=>JSON.parse(localStorage.getItem('arcPlanningPersonal')||'{}')[id],item.id);
  if(goal?.status!=='done')throw new Error(`Personal target reached in visible raid flow but status is ${goal?.status||'missing'}, expected done`);
  await assertPlanning(page,{required:3,owned:10,missing:0}).catch(async()=>{const rows=await page.locator('#planningMissing [data-plan-item]').count();if(rows!==0)throw new Error('Completed personal target still contributes active requirement')});
  console.log('PASS reached personal target completes and leaves independent quest requirement only');

  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});
  const persisted=await page.evaluate(id=>({goal:JSON.parse(localStorage.getItem('arcPlanningPersonal')||'{}')[id],owned:JSON.parse(localStorage.getItem('arcOwned')||'{}')[id]}),item.id);
  if(persisted.goal?.status!=='done'||persisted.owned!==10)throw new Error(`Reload lost completion/stock: ${JSON.stringify(persisted)}`);
  console.log('PASS personal completion and stock survive reload');

  if(pageErrors.length)throw new Error(`Uncaught browser errors: ${pageErrors.join(' | ')}`);await context.close();
}finally{await browser.close()}
