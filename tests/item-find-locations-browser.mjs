import { chromium, expect } from 'playwright/test';
import { readFile } from 'node:fs/promises';
import { installItemCatalogRoute } from './helpers/item-catalog.mjs';
const base=process.env.BASE_URL||'http://127.0.0.1:4173/';
const fixture=JSON.parse(await readFile(new URL('./fixtures/item-find-locations.json',import.meta.url),'utf8'));
const local=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const items=[...fixture.items,local.find(item=>item.id==='wires')];
const browser=await chromium.launch({headless:true});
try {
 for(const viewport of [{width:1280,height:900},{width:360,height:800}]) {
  const context=await browser.newContext({viewport,hasTouch:viewport.width===360});
  await context.addInitScript(()=>{
   localStorage.setItem('arcLang','en');localStorage.setItem('arcUiLanguage','en');localStorage.setItem('arcLanguageOnboardingPending','0');
  });
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  await installItemCatalogRoute(page,items);
  await page.route('https://raw.githubusercontent.com/RaidTheory/arcraiders-data/*/bots.json',route=>route.fulfill({json:fixture.bots}));
  const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/location_test.json';
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({json:[{name:'location_test.json',type:'file',download_url:questUrl}]}));
  await page.route(questUrl,route=>route.fulfill({json:{id:'location_test',name:{en:'Location regression'},objectives:[],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]}}));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>(typeof items!=='undefined'&&items.some(i=>i.id==='magnetic_accelerator'))&&document.querySelector('#dataStatusPersistent')?.dataset.state==='live');
  await page.locator('[data-app-target="itemsSection"]').click();
  await page.locator('#itemsSection').waitFor({state:'visible'});
  const q=page.locator('#q'),card=page.locator('#out .card[data-item-id="magnetic_accelerator"]').first();
  const details=card.locator('details.find-locations');
  await q.fill('Magnetic Accelerator');await expect(card).toBeVisible();await expect(details).toHaveCount(1);
  await expect(details).not.toHaveAttribute('open','');
  await details.locator('summary').click();await expect(details.locator('.find-locations-body')).toBeVisible();
  for(const expected of ['Exodus','MATRIARCH','THE QUEEN','Dam Battlegrounds','Spaceport','The Blue Gate'])await expect(details).toContainText(expected);
  await details.locator('summary').click();await expect(details.locator('.find-locations-body')).toBeHidden();
  await details.locator('summary').click();
  for(const [language,label,title,map] of [
   ['de','Magnetischer Beschleuniger','Mögliche Fundorte','Damm-Schlachtfelder'],
   ['en','Magnetic Accelerator','Possible find locations','Dam Battlegrounds'],
   ['fr','Magnetic Accelerator','Lieux possibles','Champ de bataille du barrage'],
   ['es','Magnetic Accelerator','Posibles lugares','Campos de batalla de la presa']
  ]) {
   await page.locator('#appBack').click();
   await page.locator('#arcLanguageButton').click();await page.locator(`#arcLanguageMenu [data-arc-language="${language}"]`).click();
   await page.waitForFunction(expected=>document.documentElement.dataset.uiLanguage===expected,language);
   await page.locator('[data-app-target="itemsSection"]').click();
   await q.fill(label);await expect(card).toBeVisible();await expect(details.locator('summary')).toHaveText(title);
   await expect(details.locator('.find-locations-body')).toBeVisible();await expect(details).toContainText(map);
   await expect(card.locator('h3')).toHaveText(label);
  }
  await q.fill('');await expect(page.locator('#out .card')).toHaveCount(0);
  await q.fill('Wires');const plain=page.locator('#out .card[data-item-id="wires"]');await expect(plain).toBeVisible();
  // Existing UX deliberately shows a localized no-data message rather than hiding the section.
  await plain.locator('summary').click();await expect(plain.locator('.find-locations-body')).toContainText('No hay información');
  await expect(plain).not.toContainText(/undefined|null|\[object Object\]/);
  await q.fill('Magnetic Accelerator');await expect(card).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error(`Horizontal overflow: ${overflow}px`);
  const box=await details.locator('summary').boundingBox();if(!box||box.height<44)throw new Error('Location toggle touch area below 44px');
  if(errors.length)throw new Error(errors.join('\n'));
  console.log(`PASS find locations ${viewport.width}px: fixture, content, toggle, DE/EN/FR/ES, no-data, runtime`);
  await context.close();
 }
} finally {await browser.close()}
