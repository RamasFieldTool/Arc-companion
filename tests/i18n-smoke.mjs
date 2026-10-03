import { chromium, devices } from 'playwright';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({...devices['Pixel 7']});
const page=await context.newPage();

async function waitForText(page,selector,text){await page.locator(selector).filter({hasText:text}).first().waitFor({state:'visible',timeout:10000})}
async function waitForLanguage(page,language){await page.waitForFunction(language=>localStorage.getItem('arcUiLanguage')===language,language)}
async function assertLauncherStable(page,label){
  const visible=await page.locator('#appLauncher').isVisible();if(!visible)throw new Error(`${label}: launcher is not visible`);
  const active=await page.locator('main>.launcher-section.launcher-active').count();if(active)throw new Error(`${label}: detail view remained active`);
}
async function assertLegacyStatusCannotRewriteLauncher(page,label,legacyText){
  await page.evaluate(text=>{const el=document.getElementById('statusText');if(el)el.textContent=text},legacyText);
  await page.waitForTimeout(100);
  if((await page.locator('#launcherHeading').innerText()).includes(legacyText))throw new Error(`${label}: legacy status rewrote launcher heading`);
}

try{
  await context.clearCookies();
  await page.goto(`${BASE_URL}?firstlang=1`,{waitUntil:'load'});
  await page.evaluate(()=>{localStorage.clear();sessionStorage.clear()});
  await page.goto(`${BASE_URL}?firstlang=1&fresh=1`,{waitUntil:'load'});
  await page.locator('#arcLanguageFirstRun').waitFor({state:'visible',timeout:10000});
  await page.locator('#arcLanguageFirstRun [data-arc-language="en"]').tap();
  await waitForLanguage(page,'en');
  await waitForText(page,'#launcherHeading','Ready for your next raid?');
  await assertLauncherStable(page,'English first-run');
  await assertLegacyStatusCannotRewriteLauncher(page,'English first-run','My next raid');

  await page.locator('#arcLanguageButton').tap();await page.locator('#arcLanguageMenu [data-arc-language="fr"]').tap();await waitForLanguage(page,'fr');
  await waitForText(page,'#launcherHeading','Prêt pour votre prochain raid ?');
  await assertLauncherStable(page,'French UI');
  await assertLegacyStatusCannotRewriteLauncher(page,'French UI','Mon prochain raid');

  await page.locator('#arcLanguageButton').tap();await page.locator('#arcLanguageMenu [data-arc-language="es"]').tap();await waitForLanguage(page,'es');
  await waitForText(page,'#launcherHeading','¿Listo para tu próxima incursión?');
  await assertLauncherStable(page,'Spanish UI');
  await assertLegacyStatusCannotRewriteLauncher(page,'Spanish UI','Mi próxima incursión');

  await page.goto(BASE_URL,{waitUntil:'load'});
  await waitForLanguage(page,'es');
  await waitForText(page,'#launcherHeading','¿Listo para tu próxima incursión?');
  if(await page.locator('#arcLanguageFirstRun').count())throw new Error('First-run chooser must not reappear after a language has been chosen');
  if(!(await page.locator('#arcLanguageButton').innerText()).includes('ES'))throw new Error('Permanent language button did not retain ES');
  await assertLauncherStable(page,'Spanish UI after reload');
  await assertLegacyStatusCannotRewriteLauncher(page,'Spanish UI after reload','Mi próxima incursión');

  const items=await page.evaluate(async()=>{const response=await fetch('items.json?v=293');return response.json()});
  const planningCopy={de:['Meine Planung','Was fehlt mir?','Meine Ziele','Zielmenge','Aktiv'],en:['My planning','What am I missing?','My goals','Target quantity','Active'],fr:['Ma planification','Que me manque-t-il ?','Mes objectifs','Quantité cible','Actif'],es:['Mi planificación','¿Qué me falta?','Mis objetivos','Cantidad objetivo','Activo']};
  for(const language of ['en','de','fr','es']){
    await page.locator('#arcLanguageButton').tap();await page.locator(`#arcLanguageMenu [data-arc-language="${language}"]`).tap();await waitForLanguage(page,language);
    const [title,missing,goals,amount,state]=planningCopy[language];
    await waitForText(page,'[data-app-target="planningSection"] b',title);
    await page.locator('[data-app-target="planningSection"]').tap();await waitForText(page,'#detailTitle',title);await waitForText(page,'#planningTabMissing',missing);await waitForText(page,'#planningTabGoals',goals);
    await page.locator('#planningTabGoals').tap();
    const quantityLabel=await page.locator('.planning-personal-add label').filter({has:page.locator('#planningPersonalAmount')}).innerText();if(quantityLabel.trim()!==amount)throw new Error(`${language}: untranslated quantity label ${quantityLabel}`);
    const expectedName=language==='de'?items[0].de:items[0].en;
    await page.waitForFunction(({id,name})=>[...document.querySelector('#planningPersonalItem').options].some(o=>o.value===id&&o.textContent===name),{id:items[0].id,name:expectedName});
    await page.locator('#planningPersonalItem').selectOption(items[0].id);await page.locator('#planningPersonalAmount').fill('15');await page.locator('#planningPersonalAdd').tap();
    await waitForText(page,`[data-personal="${items[0].id}"] strong`,expectedName);await waitForText(page,`[data-personal="${items[0].id}"] small`,`15 · ${state}`);
    await page.locator('#planningTabMissing').tap();await waitForText(page,`[data-plan-item="${items[0].id}"] strong`,expectedName);
    await page.reload({waitUntil:'load'});await waitForText(page,'#detailTitle',title);await waitForText(page,`[data-plan-item="${items[0].id}"] strong`,expectedName);
    await page.locator('#appBack').tap();await waitForText(page,'[data-app-target="planningSection"] b',title);await assertLauncherStable(page,`${language} planning tile`);
  }
  console.log('PASS planning labels, tile, item names, personal status and reload in DE/EN/FR/ES (English item fallback for missing FR/ES names).');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(overflow>4)throw new Error(`Language UI causes horizontal mobile overflow (${overflow}px)`);
}finally{await browser.close()}
