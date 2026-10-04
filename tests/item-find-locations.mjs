import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL=process.env.BASE_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function run(width){
  const context=await browser.newContext({viewport:{width,height:800}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(BASE_URL,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(500);

  const input=page.locator('#q');
  await input.waitFor({state:'visible',timeout:5000});

  async function search(term){
    await input.fill(term);
    await input.dispatchEvent('input');
    await page.waitForTimeout(250);
    const card=page.locator('#out .card[data-item-id]').first();
    await card.waitFor({state:'visible',timeout:5000});
    return card;
  }

  // Use the current UI language instead of assuming German. The application
  // deliberately persists arcLang in localStorage between sessions.
  const currentLang=await page.evaluate(()=>localStorage.getItem('arcLang')||'de');
  const initialTerm=currentLang==='de'?'Kabel':'Wires';

  let card=await search(initialTerm);
  let details=card.locator('.item-find-locations');
  await details.waitFor({state:'attached',timeout:5000});
  assert.equal(await details.evaluate(el=>el.open),false,'location disclosure must start closed');
  await details.locator('summary').click();
  assert.equal(await details.evaluate(el=>el.open),true,'location disclosure must open');

  // Re-render/search must not lose the remembered open state for the same item.
  await input.fill('');
  await input.dispatchEvent('input');
  await page.waitForTimeout(100);
  card=await search(initialTerm);
  details=card.locator('.item-find-locations');
  assert.equal(await details.evaluate(el=>el.open),true,'open state must survive redraw');

  // Language switching in this app uses buttons. Set English through the real
  // control and verify the newly injected location UI follows the app language.
  const enBtn=page.locator('#enBtn');
  if(await enBtn.count()){
    await enBtn.click();
    await page.waitForTimeout(250);
    card=await search('Wires');
    const summary=(await card.locator('.item-find-locations summary').innerText()).trim();
    assert.match(summary,/Possible find locations/i,'English location heading expected');
  }

  assert.equal(errors.length,0,`page errors at ${width}px: ${errors.join(' | ')}`);
  await context.close();
}

try{
  await run(360);
  await run(412);
  console.log('Item find-location regression passed at 360px and 412px.');
}finally{
  await browser.close();
}
