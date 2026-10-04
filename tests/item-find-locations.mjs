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
  // The app starts on its launcher. Find the real launcher control whose target
  // contains #q and use it, rather than making the hidden search UI visible in
  // the test. This keeps the check on the actual user navigation path.
  if(!await input.isVisible()){
    const opened=await page.evaluate(()=>{
      const q=document.querySelector('#q');
      if(!q) return false;
      const section=q.closest('.launcher-section');
      if(!section?.id) return false;
      const candidates=[...document.querySelectorAll('.app-tile,[data-target],[data-section],[data-view]')];
      const trigger=candidates.find(el=>[el.dataset.target,el.dataset.section,el.dataset.view].some(v=>v===section.id||v===`#${section.id}`));
      if(!trigger) return false;
      trigger.click();
      return true;
    });
    assert.equal(opened,true,'item search launcher control must be discoverable');
  }
  await input.waitFor({state:'visible',timeout:5000});

  async function search(term){
    await input.fill(term);
    await input.dispatchEvent('input');
    await page.waitForTimeout(250);
    const card=page.locator('#out .card[data-item-id]').first();
    await card.waitFor({state:'visible',timeout:5000});
    return card;
  }

  const currentLang=await page.evaluate(()=>localStorage.getItem('arcLang')||'de');
  const initialTerm=currentLang==='de'?'Kabel':'Wires';

  let card=await search(initialTerm);
  let details=card.locator('.item-find-locations');
  await details.waitFor({state:'attached',timeout:5000});
  assert.equal(await details.evaluate(el=>el.open),false,'location disclosure must start closed');
  await details.locator('summary').click();
  assert.equal(await details.evaluate(el=>el.open),true,'location disclosure must open');

  await input.fill('');
  await input.dispatchEvent('input');
  await page.waitForTimeout(100);
  card=await search(initialTerm);
  details=card.locator('.item-find-locations');
  assert.equal(await details.evaluate(el=>el.open),true,'open state must survive redraw');

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
