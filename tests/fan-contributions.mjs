import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const items=JSON.parse(await readFile(new URL('../items.json',import.meta.url),'utf8'));
const fixtureItems=items.slice(0,Math.min(items.length,60));
const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/fan_contribution_test.json';
const quest={id:'fan_contribution_test',name:{de:'Community-Test',en:'Community test'},trader:'Test',objectives:[],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]};

async function installRoutes(page){
  await page.route('https://arcdata.mahcks.com/v1/items**',async route=>{
    const url=new URL(route.request().url()),offset=Math.max(0,Number(url.searchParams.get('offset'))||0),limit=Math.max(1,Number(url.searchParams.get('limit'))||45);
    const pageItems=fixtureItems.slice(offset,offset+limit),body={type:'items',total:fixtureItems.length,count:pageItems.length,offset,limit,items:pageItems};
    if(offset+limit<fixtureItems.length)body.next=`/v1/items?full=true&offset=${offset+limit}&limit=${limit}`;
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:quest.id+'.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(quest)}));
}

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:360,height:820},isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{localStorage.setItem('arcUiLanguage','en');localStorage.setItem('arcLang','en');localStorage.setItem('arcLanguageOnboardingPending','0')});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(String(error)));await installRoutes(page);await page.goto(BASE_URL);await page.waitForFunction(()=>['live','partial','fallback'].includes(document.getElementById('dataStatusPersistent')?.dataset.state));
  await page.locator('[data-app-target="raiderRadio"]').click();
  const guide=page.locator('#raiderRadio .fan-contribute');await guide.waitFor({state:'visible'});await guide.locator('summary').click();
  const email=guide.locator('.fan-submit-email'),checks=guide.locator('input[data-contribution-consent]');
  if(await email.isVisible())throw new Error('Email draft appeared before explicit consent');
  const before=await page.evaluate(()=>({submissions:localStorage.getItem('arcCommunitySubmissions'),raid:localStorage.getItem('arcNextRaid'),goals:localStorage.getItem('arcPlanningPersonal')}));
  await checks.nth(0).check();await checks.nth(1).check();if(await email.isVisible())throw new Error('Email draft appeared before privacy confirmation');await checks.nth(2).check();if(!(await email.isVisible()))throw new Error('Email draft did not appear after all consent checks');
  const href=await email.getAttribute('href'),mail=new URL(href);if(mail.protocol!=='mailto:'||mail.pathname!=='ramasfieldtool@proton.me')throw new Error(`Unexpected contribution destination: ${href}`);
  const body=mail.searchParams.get('body')||'';if(!body.includes('publication is not guaranteed')||!body.includes('Translations or edits require separate permission'))throw new Error('Email draft omitted review or separate translation permission terms');
  const after=await page.evaluate(()=>({submissions:localStorage.getItem('arcCommunitySubmissions'),raid:localStorage.getItem('arcNextRaid'),goals:localStorage.getItem('arcPlanningPersonal')}));if(JSON.stringify(before)!==JSON.stringify(after))throw new Error('Contribution consent changed local player data or stored submission data');
  console.log('PASS email draft requires explicit authorship, display and privacy confirmations and stores no submission data');
  const labels={de:'Dein Werk in Fan Creations',en:'Share your work in Fan Creations',fr:'Partagez votre création dans Fan Creations',es:'Comparte tu creación en Fan Creations',it:'Condividi la tua creazione in Fan Creations'};
  for(const [language,label]of Object.entries(labels)){
    await page.evaluate(value=>{document.documentElement.lang=value;window.dispatchEvent(new CustomEvent('arc-language-change',{detail:{language:value}}))},language);
    await page.waitForFunction(expected=>document.querySelector('.fan-contribute>summary')?.textContent===expected,label);
    if(!(await email.isVisible()))throw new Error(`${language}: selected consent did not persist across language change`);
  }
  console.log('PASS contribution guide labels in de/en/fr/es/it with consent state retained');
  await page.goto(BASE_URL);await page.waitForFunction(()=>['live','partial','fallback'].includes(document.getElementById('dataStatusPersistent')?.dataset.state));await page.locator('[data-app-target="raiderRadio"]').click();
  const reloaded=page.locator('#raiderRadio .fan-contribute');await reloaded.locator('summary').click();if(await reloaded.locator('.fan-submit-email').isVisible())throw new Error('Consent was persisted after reload');if(await reloaded.locator('input[data-contribution-consent]:checked').count())throw new Error('Consent checklist was persisted locally');
  for(const width of [320,360,412,1280]){await page.setViewportSize({width,height:820});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(overflow>4)throw new Error(`Contribution guide overflows at ${width}px (${overflow}px)`)}
  if(errors.length)throw new Error(errors.join(' | '));await context.close();console.log('PASS contribution guide remains mobile-friendly; consent is transient and no email is sent automatically');
}finally{await browser.close()}
