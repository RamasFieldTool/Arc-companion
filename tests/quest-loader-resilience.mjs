import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { installItemCatalogRoute } from './helpers/item-catalog.mjs';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const INDEX_URL='https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main';
const RAW_BASE='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/';
const fixtures=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const snapshot=JSON.parse(await readFile(new URL('../catalog-data/quests-full-snapshot.json',import.meta.url),'utf8'));
const quest={id:'quest_resilience_test',name:{de:'Netzwerk-Test',en:'Network test',fr:'Test réseau',es:'Prueba de red',it:'Test rete'},trader:'Test',objectives:[{de:'Testziel',en:'Test objective',fr:'Objectif test',es:'Objetivo de prueba',it:'Obiettivo di prova'}],requiredItemIds:[{itemId:'metal_parts',quantity:3}],rewardItemIds:[],grantedItemIds:[]};
const questUrl=`${RAW_BASE}${quest.id}.json`;
const secondQuest={...quest,id:'quest_resilience_second',name:{en:'Second network test',de:'Zweiter Netzwerk-Test'},requiredItemIds:[]};
const secondQuestUrl=`${RAW_BASE}${secondQuest.id}.json`;
const snapshotUrl='**/catalog-data/quests-full-snapshot.json*';
const browser=await chromium.launch({headless:true});

async function setupPage({locale='en',width=1280,height=900,storedState='{}',beforeNavigate}={}){
 const context=await browser.newContext({viewport:{width,height},...(width<500?{screen:{width,height},isMobile:true,hasTouch:true}: {})});
 await context.addInitScript(({locale,storedState})=>{localStorage.setItem('arcLang',locale==='de'?'de':'en');localStorage.setItem('arcUiLanguage',locale);localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1');localStorage.setItem('arcOwned','{"metal_parts":1}');localStorage.setItem('arcActiveGoals','{}');localStorage.setItem('arcPlanningPersonal','{}');localStorage.setItem('arcQuestStatus',storedState)}, {locale,storedState});
 const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(String(error)));
 await installItemCatalogRoute(page,fixtures.slice(0,60));
 if(beforeNavigate)await beforeNavigate(page);
 await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof items!=='undefined'&&items.some(item=>item.id==='metal_parts'),null,{timeout:30000});
 await page.waitForFunction(()=>!!window.RFTPlanningUI,null,{timeout:30000});
 return {context,page,errors};
}
function requireNoErrors(name,errors){if(errors.length)throw new Error(`${name}: browser errors: ${errors.join(' | ')}`)}
async function routeIndex(page,handler){await page.route(INDEX_URL,handler)}
async function routeOneQuest(page,{status=200,delay=0,data=quest,abort=false}={}){
 await routeIndex(page,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:`${quest.id}.json`,type:'file',download_url:questUrl}])}));
 await page.route(questUrl,async route=>{if(abort)return route.abort('failed');if(delay)await new Promise(resolve=>setTimeout(resolve,delay));await route.fulfill({status,contentType:'application/json',body:status===200?JSON.stringify(data):'{"error":"simulated quest file failure"}'})});
}
async function routeTwoQuests(page,{failureStatus=404,abort=false,snapshotFailure=false}={}){
 await routeIndex(page,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:`${quest.id}.json`,type:'file',download_url:questUrl},{name:`${secondQuest.id}.json`,type:'file',download_url:secondQuestUrl}])}));
 await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
 await page.route(secondQuestUrl,route=>abort?route.abort('failed'):route.fulfill({status:failureStatus,contentType:'application/json',body:'{"error":"simulated missing quest file"}'}));
 if(snapshotFailure)await page.route(snapshotUrl,route=>route.fulfill({status:503,body:'simulated local snapshot failure'}));
}
async function waitQuestState(page,state){await page.waitForFunction(expected=>document.getElementById('questStatus')?.dataset.state===expected,state,{timeout:30000})}

try{
 // Complete live source.
 {
  const {context,page,errors}=await setupPage({beforeNavigate:page=>routeOneQuest(page)});await waitQuestState(page,'live');await page.locator('#questDrawer').evaluate(el=>{el.open=true});
  if(await page.locator('#questDrawer .quest-card').count()!==1)throw new Error('Live source: expected exactly one quest card');
  requireNoErrors('complete live source',errors);console.log('PASS complete live quest source');await context.close();
 }
 // Full GitHub API outage uses the checksum-validated local snapshot and preserves saved states.
 {
  const prior={legacy_done:'done',kept_open:'open'};const {context,page,errors}=await setupPage({storedState:JSON.stringify(prior),beforeNavigate:page=>routeIndex(page,route=>route.fulfill({status:503,body:'simulated outage'}))});
  await waitQuestState(page,'snapshot');await page.waitForFunction(()=>document.getElementById('dataStatusPersistent')?.dataset.state==='partial');await page.locator('#questDrawer').evaluate(el=>{el.open=true});
  if(await page.locator('#questDrawer .quest-card').count()!==100)throw new Error('Outage: complete local snapshot did not render all 100 quests');
  const snapshotNotice=await page.locator('#questStatus').innerText();if(!snapshotNotice.includes('not confirmed in-game'))throw new Error(`Outage: snapshot caveat missing: ${snapshotNotice}`);
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('arcQuestStatus')));if(JSON.stringify(state)!==JSON.stringify(prior))throw new Error(`Outage changed saved quest states: ${JSON.stringify(state)}`);
  requireNoErrors('full outage',errors);console.log('PASS full API outage, complete snapshot and unchanged saved quest states');await context.close();
 }
 // One missing quest file and a connection drop during an individual file request both select full snapshot.
 for(const [name,opts] of [['single quest file fails',{failureStatus:404}],['connection drops during file load',{abort:true}]]){
  const {context,page,errors}=await setupPage({beforeNavigate:page=>routeTwoQuests(page,opts)});await waitQuestState(page,'snapshot');await page.locator('#questDrawer').evaluate(el=>{el.open=true});
  if(await page.locator('#questDrawer .quest-card').count()!==100)throw new Error(`${name}: complete snapshot was not selected`);
  requireNoErrors(name,errors);console.log(`PASS ${name}`);await context.close();
 }
 {
  const {context,page,errors}=await setupPage({beforeNavigate:page=>routeTwoQuests(page,{snapshotFailure:true})});await waitQuestState(page,'partial');await page.locator('#questDrawer').evaluate(el=>{el.open=true});
  if(await page.locator('#questDrawer .quest-card').count()!==1)throw new Error('Unrecoverable partial source did not retain the one successful quest');
  if(!(await page.locator('#questStatus').innerText()).includes('1 of 2'))throw new Error('Unrecoverable partial source did not report its loaded/expected count');
  requireNoErrors('partial source without snapshot',errors);console.log('PASS incomplete live data is labelled and successful files remain available when snapshot cannot be read');await context.close();
 }
 // A slow quest source cannot gate the item search or planning bootstrap.
 {
  let release;
  const {context,page,errors}=await setupPage({beforeNavigate:async page=>{
   await routeIndex(page,async route=>{await new Promise(resolve=>release=resolve);await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:`${quest.id}.json`,type:'file',download_url:questUrl}])})});
   await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
  }});
  await waitQuestState(page,'loading');
  await page.locator('[data-app-target="itemsSection"]').click();await page.locator('#q').fill('metal');
  if(await page.locator('#out .card').count()<1)throw new Error('Delayed quest source blocked usable item search');
  if(!(await page.evaluate(()=>!!window.RFTPlanningUI)))throw new Error('Delayed quest source blocked planning bootstrap');
  release();await waitQuestState(page,'live');requireNoErrors('delayed source',errors);console.log('PASS delayed quest source leaves search and planning usable');await context.close();
 }
 // Reload after temporary outage retries the source; saved quest state remains stable.
 {
  const prior={quest_resilience_test:'active',old_quest:'done'};let requests=0;const {context,page,errors}=await setupPage({storedState:JSON.stringify(prior),beforeNavigate:async page=>{
   await routeIndex(page,route=>{requests++;return requests===1?route.fulfill({status:503,body:'temporary outage'}):route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:`${quest.id}.json`,type:'file',download_url:questUrl}])})});
   await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
  }});
  await waitQuestState(page,'snapshot');await page.reload({waitUntil:'domcontentloaded'});await waitQuestState(page,'live');
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('arcQuestStatus')));if(JSON.stringify(state)!==JSON.stringify(prior))throw new Error(`Reconnect changed saved quest states: ${JSON.stringify(state)}`);
  requireNoErrors('reconnect after reload',errors);console.log('PASS source recovery on later reload preserves quest state');await context.close();
 }
 // Active quest requirements remain in the shared workshop/personal material planning calculation.
 {
  const {context,page,errors}=await setupPage({storedState:JSON.stringify({[quest.id]:'active'}),beforeNavigate:page=>routeOneQuest(page)});await waitQuestState(page,'live');
  const row=await page.evaluate(id=>window.RFTPlanning.rows({all:true}).find(entry=>entry.itemId===id), 'metal_parts');
  if(!row||row.required<3||!row.goals.some(goal=>goal.kind==='quest'&&goal.id==='quest_resilience_test'))throw new Error('Active quest requirements are not connected to shared material planning');
  requireNoErrors('shared planning',errors);console.log('PASS active quest requirements remain in shared planning');await context.close();
 }
 // Personal objective checks persist locally and never change the app's quest status.
 {
  const prior={quest_resilience_test:'active'};
  const {context,page,errors}=await setupPage({storedState:JSON.stringify(prior),width:412,height:915,beforeNavigate:page=>routeOneQuest(page)});await waitQuestState(page,'live');
  await page.locator('#questDrawer').evaluate(el=>{el.classList.add('launcher-active');el.open=true});await page.evaluate(()=>drawQuests());
  const localeNotes={de:'Persönliche Checkliste',en:'Personal checklist',fr:'Liste personnelle',es:'Lista personal',it:'Elenco personale'};
  for(const [locale,fragment] of Object.entries(localeNotes)){
   await page.evaluate(value=>{localStorage.setItem('arcUiLanguage',value);drawQuests()},locale);
   await page.locator('#questsList .quest-card .quest-details summary').first().click();
   const note=await page.locator('#questsList .quest-objective-note').first().innerText();if(!note.includes(fragment))throw new Error(`${locale}: objective checklist note was not localized: ${note}`);
  }
  await page.evaluate(()=>{localStorage.setItem('arcUiLanguage','en');drawQuests()});
  await page.locator('#questsList .quest-card .quest-details summary').first().click();
  const objective=page.locator('#questsList .quest-card input[data-quest-objective]').first();await objective.waitFor({state:'visible'});
  const key=await objective.getAttribute('data-objective-key');await objective.check();
  await page.waitForFunction(expected=>JSON.parse(localStorage.getItem('arcQuestObjectiveProgress')||'{}').quest_resilience_test?.includes(expected),key);
  if(JSON.stringify(await page.evaluate(()=>JSON.parse(localStorage.getItem('arcQuestStatus')||'{}')))!==JSON.stringify(prior))throw new Error('Marking a quest objective changed the quest status');
  await page.reload({waitUntil:'domcontentloaded'});await waitQuestState(page,'live');
  await page.locator('#questDrawer').evaluate(el=>{el.classList.add('launcher-active');el.open=true});await page.evaluate(()=>drawQuests());
  await page.locator('#questsList .quest-card .quest-details summary').first().click();
  const restored=page.locator('#questsList .quest-card input[data-quest-objective]').first();await restored.waitFor({state:'visible'});
  if(!(await restored.isChecked()))throw new Error('Quest objective progress did not persist after reload');
  if(JSON.stringify(await page.evaluate(()=>JSON.parse(localStorage.getItem('arcQuestStatus')||'{}')))!==JSON.stringify(prior))throw new Error('Reloading objective progress changed the quest status');
  await restored.uncheck();
  await page.waitForFunction(()=>!JSON.parse(localStorage.getItem('arcQuestObjectiveProgress')||'{}').quest_resilience_test);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(overflow>2)throw new Error(`Objective checklist causes mobile horizontal overflow (${overflow}px)`);
  requireNoErrors('objective progress',errors);console.log('PASS quest objective checks persist locally without changing quest status');await context.close();
 }
 // Snapshot notice is translated and does not overflow at both requested mobile widths.
 const expected={de:'Lokaler Quest-Snapshot',en:'Local quest snapshot',fr:'Snapshot local',es:'Snapshot local',it:'Snapshot locale'};
 const expectedGlobal={de:'Daten nur teilweise verfügbar',en:'Data is only partially available',fr:'Données disponibles partiellement',es:'Los datos solo están disponibles parcialmente',it:'Dati disponibili solo in parte'};
 for(const width of [360,412])for(const locale of Object.keys(expected)){
  const {context,page,errors}=await setupPage({locale,width,height:900,beforeNavigate:page=>routeIndex(page,route=>route.fulfill({status:503,body:'simulated outage'}))});await waitQuestState(page,'snapshot');await page.waitForFunction(()=>document.getElementById('dataStatusPersistent')?.dataset.state==='partial');
  const globalTitle=await page.locator('#dataStatusPersistent').getAttribute('title');if(!globalTitle.includes(expectedGlobal[locale]))throw new Error(`${locale}/${width}px: global partial status not translated: ${globalTitle}`);
  const drawer=page.locator('#questDrawer');await drawer.evaluate(el=>{el.open=true});
  const text=await page.locator('#questStatus').innerText();if(!text.includes(expected[locale]))throw new Error(`${locale}/${width}px: snapshot status not translated: ${text}`);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(overflow>2)throw new Error(`${locale}/${width}px: horizontal overflow ${overflow}px`);
  requireNoErrors(`${locale}/${width}px`,errors);console.log(`PASS snapshot status ${locale} at ${width}px`);await context.close();
 }
 console.log('PASS quest loader resilience scenarios');
}finally{await browser.close()}
