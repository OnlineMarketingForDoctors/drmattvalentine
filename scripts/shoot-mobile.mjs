import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${out}/m-hero.png` });
for (const id of ['about','why','experience','reviews','refer']) {
  await p.evaluate((i) => document.getElementById(i)?.scrollIntoView({block:'start'}), id);
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/m-${id}.png` });
}
await b.close(); console.log('ok');
