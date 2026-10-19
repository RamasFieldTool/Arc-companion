import { chromium } from 'playwright';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const copy={
  de:{collection:'Sammelziel anlegen',workshop:'Werkstatt auswählen',quests:'Quest ansehen'},
  en:{collection:'Add collection goal',workshop:'Choose workshop level',quests:'View quests'},
  fr:{collection:'Ajouter un objectif',workshop:'Choisir un niveau d’atelier',quests:'Voir les quêtes'},
  es:{collection:'Añadir objetivo de colección',workshop:'Elegir nivel de taller',quests:'Ver misiones'},
  it:{collection:'Aggiungi obiettivo di raccolta',workshop:'Scegli livello del banco',quests:'Vedi missioni'}
};
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:360,height:800},isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{localStorage.clear();localStorage.setItem('arcLang','de');localStorage.setItem('arcUiLanguage','de');localStorage.setItem('arcLanguageOnboardingPending','0');localStorage.setItem('arcPlanningMigrationV1','1')});
  const page=await context.newPage(),errors=[];page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(String(e)));
  await page.route('https://arcdata.mahcks.com/v1/items**',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json',route=>route.fulfill({status:503,body:'{}'}));
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main',route=>route.fulfill({status:503,body:'{}'}));
  const questUrl='https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main/quests/v15-empty-goal-test.json';
  await page.route('https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{name:'v15-empty-goal-test.json',type:'file',download_url:questUrl}])}));
  await page.route(questUrl,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({id:'v15_empty_goal_test',name:{de:'Test-Quest',en:'Test quest'},trader:'Test',objectives:[],requiredItemIds:[],rewardItemIds:[],grantedItemIds:[]})}));
  await page.goto(BASE_URL);
  await page.locator('[data-app-target="planningSection"]').click();
  await page.locator('#planningTabMissing').waitFor({state:'visible'});
  await page.locator('.planning-empty-actions').waitFor({state:'visible'});
  const keys=['arcOwned','arcActiveGoals','arcPlanningPersonal','arcQuestStatus'];
  const baseline=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),keys);
  const noMutation=async()=>{const after=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),keys);if(JSON.stringify(after)!==JSON.stringify(baseline))throw new Error('Opening an empty-state action changed saved player progress')};
  const openHome=async()=>{await page.locator('#appBack').click();await page.locator('#appLauncher').waitFor({state:'visible'})};
  const openPlan=async()=>{await page.locator('[data-app-target="planningSection"]').click();await page.locator('.planning-empty-actions').waitFor({state:'visible'})};
  const assertRoute=async category=>{
    await page.locator('.planning-empty-actions [data-empty-goal="'+category+'"]').click();
    if(await page.locator('#planningTabGoals').getAttribute('aria-selected')!=='true')throw new Error(category+' action did not open My goals');
    if(await page.locator('[data-goal-category="'+category+'"]').getAttribute('aria-pressed')!=='true')throw new Error(category+' action selected the wrong category');
    if(category==='personal'&&!await page.locator('#planningPersonalGroup').isVisible())throw new Error('Collection action did not show collection form');
    if(category==='workshop'&&!await page.locator('#goalsSection').evaluate(el=>el.open&&el.classList.contains('planning-integrated-visible')))throw new Error('Workshop action did not show workshop goals');
    if(category==='quests'){
      const openFilter=page.locator('#questDrawer .quest-filter[data-filter="open"]');
      if(!await openFilter.evaluate(el=>el.classList.contains('active')))throw new Error('Quest action did not show open quests');
      await page.locator('#questsList .quest-card').waitFor({state:'visible'});
    }
    await noMutation();
  };
  for(const language of ['de','en','fr','es','it']){
    if(language!=='de'){
      await openHome();await page.locator('#arcLanguageButton').click();await page.locator('#arcLanguageMenu [data-arc-language="'+language+'"]').click();
      await openPlan();
    }
    for(const category of ['personal','workshop','quests']){
      const button=page.locator('.planning-empty-actions [data-empty-goal="'+category+'"]');
      if(await button.innerText()!==copy[language][category])throw new Error(language+' '+category+' label is incorrect: '+await button.innerText());
      await assertRoute(category);await openHome();await openPlan();
    }
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error('Horizontal overflow at 360px: '+overflow);
  if(errors.length)throw new Error(errors.join(' | '));
  await context.close();console.log('PASS: empty planning actions, five languages, three destinations, no saved-data changes, 360px mobile layout');
}finally{await browser.close()}
