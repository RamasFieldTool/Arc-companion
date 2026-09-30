import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const allItems=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const goals=JSON.parse(await readFile(new URL('../goals.json',import.meta.url),'utf8'));
const itemIds=new Set(allItems.map(item=>item?.id).filter(Boolean));
let fixture=null;
for(const goal of goals){
  for(const level of goal?.levels||[]){
    const req=(level?.requirements||[]).find(entry=>entry?.itemId&&itemIds.has(entry.itemId)&&Number(entry.quantity)>0);
    if(req){fixture={goal,level,req};break}
  }
  if(fixture)break;
}
if(!fixture)throw new Error('No goal requirement fixture found');

const requiredItem=allItems.find(item=>item.id===fixture.req.itemId);
const otherItems=allItems.filter(item=>item.id!==requiredItem.id).slice(0,59);
const fixtureItems=[requiredItem,...otherItems];
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/quality_gate_owned_stepper.json';
const quest={id:'quality_gate_owned_stepper',name:{de:'Stepper-Test',en:'Stepper test'},trader:'Test',objectives:[],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]};

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
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'quality_gate_owned_stepper.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:360,height:800},screen:{width:360,height:800},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 16; RamasFieldToolOwnedStepperTest) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'});
  const activeKey=`${fixture.goal.id}:${fixture.level.level}`;
  const itemId=fixture.req.itemId;
  await context.addInitScript(({activeKey,itemId})=>{
    localStorage.setItem('arcLang','en');
    localStorage.setItem('arcUiLanguage','en');
    localStorage.setItem('arcLanguageOnboardingPending','0');
    localStorage.setItem('arcOwned',JSON.stringify({[itemId]:2}));
    localStorage.setItem('arcActiveGoals',JSON.stringify({[activeKey]:true}));
    localStorage.setItem('arcQuestStatus','{}');
  },{activeKey,itemId});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error)));
  await installRoutes(page);
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#dataStatusPersistent')?.dataset.state==='live',{timeout:30000});
  await page.locator('[data-app-target="supplySection"]').tap();
  await page.waitForFunction(()=>document.getElementById('supplySection')?.classList.contains('launcher-active'));

  const row=page.locator(`#summary article.summary-item[data-item-id="${itemId}"]`);
  await row.waitFor({state:'visible',timeout:30000});
  const controls=row.locator('.summary-owned-step');
  if(await controls.count()!==2)throw new Error('Expected exactly two owned quantity step buttons');
  const plus=row.locator('.summary-owned-step[data-step="1"]');
  const minusButton=row.locator('.summary-owned-step[data-step="-1"]');
  const input=row.locator('.qty');

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error(`Owned stepper causes horizontal overflow on 360px viewport (${overflow}px)`);
  const buttonBoxes=await Promise.all([minusButton.boundingBox(),plus.boundingBox()]);
  for(const box of buttonBoxes){
    if(!box||box.width<44||box.height<44)throw new Error(`Stepper touch target too small: ${JSON.stringify(box)}`);
  }

  await plus.tap();
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('arcOwned')||'{}')[id]===3,itemId);
  if(await input.inputValue()!=='3')throw new Error('Plus button did not update the visible owned quantity to 3');
  console.log('PASS plus button increments owned quantity');

  await minusButton.tap();
  await minusButton.tap();
  await minusButton.tap();
  await minusButton.tap();
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('arcOwned')||'{}')[id]===0,itemId);
  if(await input.inputValue()!=='0')throw new Error('Minus button did not stop at zero');
  console.log('PASS minus button decrements and never goes below zero');

  await input.fill('12');
  await input.press('Tab');
  await page.waitForFunction(id=>JSON.parse(localStorage.getItem('arcOwned')||'{}')[id]===12,itemId);
  if(await input.inputValue()!=='12')throw new Error('Direct multi-digit entry was not preserved');
  console.log('PASS direct multi-digit owned entry remains supported');

  if(pageErrors.length)throw new Error(`Uncaught browser errors: ${pageErrors.join(' | ')}`);
  await context.close();
}finally{
  await browser.close();
}
