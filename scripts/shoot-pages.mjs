import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const problems = [];

for (const [slug, path] of [['home','/'],['about','/about'],['vasectomy','/vasectomy'],['research','/research'],['contact','/contact']]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', e => problems.push(`${slug} pageerror: ${e.message}`));
  p.on('console', m => { if (m.type()==='error') problems.push(`${slug} console: ${m.text().slice(0,90)}`); });
  p.on('response', r => { if (r.status()>=400) problems.push(`${slug} ${r.status()} ${r.url().slice(0,80)}`); });
  await p.goto('http://localhost:4321'+path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1400);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}});
  await p.waitForTimeout(700);
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/${slug}-full.png`, fullPage: true });
  const a = await p.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    noAlt: [...document.querySelectorAll('img')].filter(i=>!i.hasAttribute('alt')).length,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    title: document.title.slice(0,60),
  }));
  console.log(slug.padEnd(11), JSON.stringify(a));
  await p.close();
}
console.log('\nproblems:', problems.length ? problems : 'none');
await b.close();
