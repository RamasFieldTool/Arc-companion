import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const allItems=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
if(!Array.isArray(allItems)||!allItems.length)throw new Error('Item fixture is empty');
const fixtureItems=allItems.slice(0,Math.min(allItems.length,60));
const item=fixtureItems.find(entry=>entry?.id&&(entry?.name?.en||entry?.name?.de||entry?.en||entry?.de))||fixtureItems[0];
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/quality_gate_free_raid.json';
const quest={id:'quality_gate_free_raid',name:{de:'Raid-Test',en:'Raid test'},trader:'Test',objectives:[],requiredItemIds:[{itemId:item.id,quantity:5}],rewardItemIds:[],grantedItemIds:[]};

const other=fixtureItems.find(i=>i.id!==item.id);
const zeroQuest={...quest,id:'zero_test',name:{en:'Zero material test',de:'Test ohne Material'},requiredItemIds:[],objectives:['Test objective']};
const incompleteQuest={...quest,id:'incomplete_test',name:{en:'Already completed test',de:'Bereits erledigt Test'}};
async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{const url=new URL(route.request().url());const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);const limit=Math.max(1,Number(url.searchParams.get('limit'))||45);const pageItems=fixtureItems.slice(offset,offset+limit);const body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)})});
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([quest,zeroQuest,incompleteQuest].map(q=>({name:q.id+'.json',type:'file',download_url:questUrl.replace('quality_gate_free_raid.json',q.id+'.json')})))}));
  for(const q of [zeroQuest,incompleteQuest])await page.route(questUrl.replace('quality_gate_free_raid.json',q.id+'.json'),route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(q)}));
  await page.route('**/goals.json*',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{id:'test_bench',en:'Test bench',de:'Testwerkstatt',levels:[{level:1,requirements:[{itemId:item.id,quantity:2}],other:['100 Coins']},{level:2,requirements:[{itemId:item.id,quantity:4}]}]}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}
const read=async(page,key)=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)||'{}'),key);
const stock=async(page,id,value)=>{if((await read(page,'arcOwned'))[id]!==value)throw new Error(`Expected stock ${id}=${value}`)};
async function home(page){if(!(await page.locator('#appLauncher').isVisible()))await page.locator('#appBack').click();}
async function plan(page){await home(page);await page.locator('[data-app-target="planningSection"]').click();await page.locator('#planningTabMissing').waitFor({state:'visible'});}
async function personal(page,id,target){await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="personal"]').click();await page.locator('#planningPersonalSearch').fill('');await page.locator('#planningPersonalItem').selectOption(id);await page.locator('#planningPersonalAmount').fill(String(target));await page.locator('#planningPersonalAdd').click();}
async function raid(page,finds){await page.locator('#planningTabMissing').click();await page.locator('#planningRaidFinished').click();for(const [id,amount]of Object.entries(finds))await page.locator(`[data-raid-find="${id}"]`).fill(String(amount));await page.locator('[data-raid-apply]').click();}
async function setStock(page,id,value){await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="personal"]').click();const input=page.locator(`[data-personal="${id}"] [data-personal-stock]`);await input.fill(String(value));await input.press('Tab');}
async function questTab(page){await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="quests"]').click();await page.locator('#questDrawer [data-filter="all"]').click();}
async function confirm(page,action,accept=true){const dialogPromise=page.waitForEvent('dialog');const click=action();const dialog=await dialogPromise;const message=dialog.message();if(accept)await dialog.accept();else await dialog.dismiss();await click;return message;}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true});
  await context.addInitScript(({id})=>{if(sessionStorage.getItem('planning_seed'))return;sessionStorage.setItem('planning_seed','1');localStorage.setItem('arcUiLanguage','en');localStorage.setItem('arcLang','en');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1');localStorage.setItem('arcPlanningPersonal','{}');localStorage.setItem('arcOwned',JSON.stringify({[id]:2}));localStorage.setItem('arcQuestStatus',JSON.stringify({quality_gate_free_raid:'active'}));localStorage.setItem('arcActiveGoals','{}')},{id:item.id});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(String(error)));await installRoutes(page);await page.goto(BASE_URL);await page.waitForFunction(()=>!!window.RFTPlanningUI&&document.querySelector('#dataStatusPersistent')?.dataset.state==='live');
  await page.locator('[data-app-target="itemsSection"]').click();await page.locator('#q').fill(item.name?.en||item.en||item.id);
  const card=page.locator(`#out .card[data-item-id="${item.id}"]`);await card.locator('[data-next-raid-add]').click();await card.locator('[data-goal-editor] input').fill('5');await card.locator('[data-goal-editor] button').click();
  if((await read(page,'arcPlanningPersonal'))[item.id]?.target!==5)throw new Error('Search saved to wrong planning store');
  if(Object.keys(await read(page,'arcNextRaid')).length)throw new Error('Search created a legacy raid plan');
  if(!(await card.locator('[data-goal-editor] [role=status]').innerText()).includes('5'))throw new Error('Search confirmation lacks saved quantity');
  await card.locator('[data-goal-editor] a').click();await page.locator('#planningTabGoals').waitFor({state:'visible'});await personal(page,item.id,10);await personal(page,other.id,100);await page.locator('#planningTabMissing').click();
  const row=page.locator(`[data-plan-item="${item.id}"]`);const text=await row.innerText();for(const n of ['15','2','13'])if(!text.includes(n))throw new Error(`Combined need row incorrect: ${text}`);
  const direct=await page.evaluate(id=>({planning:window.RFTPlanning.requirementMap()[id].total,search:requirementMap()[id].total}),item.id);if(direct.planning!==15||direct.search!==15)throw new Error('Views disagree');
  console.log('PASS search creates current goal, explicit target changes and shared 15/2/13 requirement');

  await row.locator('[data-find]').fill('');await row.locator('[data-find]').pressSequentially('15');await page.locator(`[data-plan-item="${other.id}"] [data-stock]`).fill('1');await page.locator(`[data-plan-item="${other.id}"] [data-stock]`).press('Tab');
  if(await row.locator('[data-find]').inputValue()!=='15')throw new Error('Other stock edit lost open find');
  await page.locator('#planningRaidFinished').click();await page.locator(`[data-raid-find="${item.id}"]`).fill('');await page.locator(`[data-raid-find="${item.id}"]`).pressSequentially('100');
  await page.locator('#planningTabGoals').click();await page.locator('#planningTabMissing').click();await page.locator('#planningRaidFinished').click();if(await page.locator(`[data-raid-find="${item.id}"]`).inputValue()!=='100')throw new Error('Tab switch lost raid draft');
  await page.locator('[data-raid-cancel]').click();await stock(page,item.id,2);
  console.log('PASS 15 and 100 input, independent stock change, tab switch and cancel preserve data');
  await setStock(page,other.id,0);await personal(page,other.id,2);await raid(page,{[other.id]:3,[item.id]:5});await stock(page,other.id,3);if((await read(page,'arcPlanningPersonal'))[other.id]?.status!=='done')throw new Error('Overshoot target remains active');
  await raid(page,{[item.id]:3});await stock(page,item.id,10);if((await read(page,'arcPlanningPersonal'))[item.id]?.status!=='done')throw new Error('Target 10 remains active');
  await page.reload();await page.waitForFunction(()=>!!window.RFTPlanningUI);await plan(page);await setStock(page,other.id,0);if((await read(page,'arcPlanningPersonal'))[other.id]?.status!=='done')throw new Error('Downward stock correction reactivated goal');
  console.log('PASS multiple finds, overshoot, persistent completion and downward stock correction');

  await questTab(page);const done=page.locator('[data-qid="quality_gate_free_raid"][data-state="done"]');await confirm(page,()=>done.click(),false);await stock(page,item.id,10);if((await read(page,'arcQuestStatus')).quality_gate_free_raid!=='active')throw new Error('Cancel changed quest');
  await confirm(page,()=>done.click());await stock(page,item.id,5);await page.locator('[data-qid="quality_gate_free_raid"][data-state="done"]').click();await stock(page,item.id,5);
  await page.locator('[data-qid="quality_gate_free_raid"][data-state="open"]').click();await stock(page,item.id,5);
  await page.locator('[data-qid="zero_test"][data-state="active"]').click();await confirm(page,()=>page.locator('[data-qid="zero_test"][data-state="done"]').click());await stock(page,item.id,5);
  await setStock(page,item.id,0);await questTab(page);await page.locator('[data-qid="incomplete_test"][data-state="active"]').click();const message=await confirm(page,()=>page.locator('[data-qid="incomplete_test"][data-state="done"]').click());if(!message.includes('Only recorded stock'))throw new Error('Incomplete-stock confirmation is not explicit');await stock(page,item.id,0);
  console.log('PASS shared quest completion, cancellation, duplicate completion, reopening, material-free and already-in-game quests');

  await setStock(page,item.id,6);await page.locator('[data-goal-category="workshop"]').click();await page.locator('[data-key="test_bench:1"]').check();await page.locator('[data-key="test_bench:2"]').check();await page.locator('#planningTabMissing').click();if(!(await page.locator('#planningExtraCosts').innerText()).includes('100 Coins'))throw new Error('Workshop extra costs missing');
  await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="workshop"]').click();const costPrompt=await confirm(page,()=>page.locator('#goalsSection [data-complete-id="test_bench:1"]').click());if(!costPrompt.includes('100 Coins'))throw new Error('Completion omits extra costs');await stock(page,item.id,4);await confirm(page,()=>page.locator('#goalsSection [data-complete-id="test_bench:2"]').click());await stock(page,item.id,0);
  console.log('PASS several workshop levels, displayed extra costs and individual material consumption');

  await personal(page,item.id,1000);await page.locator('#planningTabMissing').click();await page.locator(`[data-plan-item="${item.id}"] [data-find]`).fill('15');await page.locator('#planningRaidFinished').click();await page.locator(`[data-raid-find="${item.id}"]`).fill('100');
  for(const language of ['de','en','fr','es','it']){await home(page);await page.locator('#arcLanguageButton').click();await page.locator(`#arcLanguageMenu [data-arc-language="${language}"]`).click();await plan(page);if(await page.locator(`[data-plan-item="${item.id}"] [data-find]`).inputValue()!=='15')throw new Error(`${language}: inline find draft lost`);await page.locator('#planningRaidFinished').click();if(await page.locator(`[data-raid-find="${item.id}"]`).inputValue()!=='100')throw new Error(`${language}: raid draft lost`);await page.locator('#planningTabGoals').click();await page.locator('[data-goal-category="quests"]').click();await home(page);await plan(page);if(await page.locator('#planningTabMissing').getAttribute('aria-selected')!=='true'||!(await page.locator('#planningMissing').isVisible()))throw new Error(`${language}: reentry selection/content mismatch`);}
  console.log('PASS all five language switches retain open finds and coherent planning reentry');
  for(const width of [360,412,1280]){await page.setViewportSize({width,height:915});for(const theme of ['dark','light']){await home(page);await page.locator('[data-app-target="paletteLab"]').click();await page.locator(`[data-palette-surface="${theme}"]`).click();await home(page);await plan(page);await page.locator(`[data-plan-item="${item.id}"] details summary`).click();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(overflow>4)throw new Error(`${width}/${theme}: overflow ${overflow}px`);}}
  if(errors.length)throw new Error(errors.join(' | '));await context.close();console.log('PASS browser-emulated 360/412/desktop layouts in dark and light without horizontal overflow');
}finally{await browser.close()}
