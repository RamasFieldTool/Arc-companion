import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const viewport of [{ width: 360, height: 800, mobile: true }, { width: 1280, height: 900, mobile: false }]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.mobile,
      hasTouch: viewport.mobile
    });
    await context.addInitScript(() => {
      localStorage.setItem('arcLang', 'en');
      localStorage.setItem('arcUiLanguage', 'en');
      localStorage.setItem('arcLanguageOnboardingPending', '0');
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.locator('#appLauncher [data-app-target="blueprintDrawer"]').click();
    await page.locator('#blueprintDrawer[open]').waitFor({ state: 'visible' });
    await page.waitForFunction(() => /91/.test(document.querySelector('#blueprintSummary')?.textContent || ''));
    assert.match(await page.locator('#blueprintSummary').innerText(), /91/);
    await page.locator('#blueprintQ').fill('Emperor Gateway Conduit');
    const row = page.locator('.blueprint-row[data-id="emperor-gateway-conduit"]');
    await row.waitFor({ state: 'visible' });
    const info = page.locator('.blueprint-entry').filter({ has: row }).locator('details.blueprint-info');
    await info.locator('summary').click();
    const details = await info.locator('.blueprint-info-grid').innerText();
    assert.match(details, /Acquisition \/ source/i);
    assert.match(details, /Redirection/);
    assert.match(details, /Harvester Payload/);
    const box = await info.boundingBox();
    assert(box && box.x >= 0 && box.x + box.width <= viewport.width + 1, 'blueprint detail must fit viewport');
    await context.close();
  }
  assert.deepEqual(errors, [], 'blueprint page should not throw browser errors');
  console.log('Blueprint browser check OK at 360px and 1280px: 91 entries, search and acquisition details.');
} finally {
  await browser.close();
}
