import { chromium } from 'playwright';

const out = process.argv[2] || '/tmp/shots';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);

// full page
await page.screenshot({ path: `${out}/full.png`, fullPage: true });

// section by section
const ids = ['hero','volume','about','why','experience','watch','research','reviews','refer'];
for (const id of ids) {
  const el = await page.$(`#${id}`);
  if (!el) { console.log('missing', id); continue; }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${id}.png` });
}

// mobile
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await m.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await m.waitForTimeout(1500);
await m.screenshot({ path: `${out}/mobile-full.png`, fullPage: true });

await browser.close();
console.log('done');
