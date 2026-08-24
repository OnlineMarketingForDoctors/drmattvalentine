import { chromium } from 'playwright';
const [out, path, ...ids] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('response', r => { if (r.status()>=404) console.log('404:', r.url()); });
await p.goto('http://localhost:4321'+path, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
for (const id of ids) {
  const el = await p.$('#'+id);
  if (!el) { console.log('missing #'+id); continue; }
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(1000);
  await p.screenshot({ path: `${out}/${id}.png` });
}
await b.close();
