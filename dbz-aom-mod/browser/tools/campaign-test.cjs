const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const fs = require('fs'), path = require('path');
const file = process.argv[2], dir = process.argv[3], only = process.argv[4];
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const browser = await chromium.launch();
  const errs = [];
  const html = fs.readFileSync(file, 'utf8');
  const tmp = path.resolve(dir, 'camp-test.html');
  fs.writeFileSync(tmp, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 860 } })).newPage();
  page.on('pageerror', e => errs.push('pageerror: ' + e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' ')));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto('file://' + tmp); await page.waitForTimeout(400);
  const E = (f, a) => page.evaluate(f, a);
  for (let i = 0; i < 9; i++) {
    if (only && String(i) !== only) continue;
    const e0 = errs.length;
    await E(i => window.__DBH.launch({ kind: 'mission', mission: i, diff: 'normal' }), i);
    await page.waitForTimeout(700);
    const title = await E(() => window.__DBH.G().scn.m.title);
    await page.screenshot({ path: `${dir}/camp-m${i + 1}-start.png` });
    // play 3 minutes without the player doing anything (dialogue pauses are skipped)
    const r = await E(() => { const D = window.__DBH, G = D.G(), dv = D.dev(); for (let k = 0; k < 18; k++) { dv.DLG.queue.length = 0; dv.DLG.cur = null; G.paused = false; D.step(10); if (G.over) break; } return { over: G.over, t: Math.round(G.scn.t), objs: G.scn.objs.map(o => o.id + ':' + o.state).join(' '), mine: G.units.filter(u => u.owner === 1).length, foes: G.units.filter(u => u.owner === 2).length }; });
    ok(!r.over || i === 1, `m${i + 1} "${title}": 3 idle minutes run ${JSON.stringify(r)}`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${dir}/camp-m${i + 1}-3min.png` });
    // force the victory conditions
    const w = await E(i => {
      const D = window.__DBH, G = D.G(), dv = D.dev(), S = G.scn;
      if (G.over) return { early: true, won: G.winTeam };
      const log = [];
      for (let k = 0; k < 40 && !G.over; k++) {
        dv.DLG.queue.length = 0; dv.DLG.cur = null; G.paused = false;
        if (S.vars.survive && S.vars.survive > S.t) S.vars.survive = S.t;
        if (S.vars.guru && S.vars.guru.balls.length < 4) {
          const carrier = G.units.find(u => u.owner === 1 && !u.dead && u.def.cls === 'hero');
          for (const b of G.balls) { if (S.vars.guru.balls.length >= 4) break; if (b.state === 'temple') continue; b.state = 'carried'; b.holder = carrier.id; carrier.carryBall = b.id; dv.depositBall(carrier, S.vars.guru); }
        }
        const ents = []; for (const v of Object.values(S.vars)) { if (Array.isArray(v)) ents.push(...v); else if (v && typeof v === 'object' && v.id && v.owner !== undefined) ents.push(v); }
        for (const e of ents) {
          if (e.dead || e.owner === 1 || !G.byId.get(e.id)) continue;
          const mh = dv.maxHp(e);
          if (e.hp > mh * .35) { e.hp = mh * .3; log.push('hurt ' + (e.key)); } else { dv.kill(e, null); log.push('kill ' + e.key); }
        }
        D.step(4);
      }
      return { over: G.over, won: G.winTeam, objs: S.objs.map(o => o.id + ':' + o.state).join(' '), log: log.join(', ').slice(0, 300) };
    }, i);
    ok(w.over && w.won === 1, `m${i + 1}: forced objectives give a win ${JSON.stringify(w)}`);
    await page.waitForTimeout(1700);
    const end = await E(() => ({ vis: !document.getElementById('scr-end').hidden, title: document.getElementById('end-title').textContent, btns: [...document.querySelectorAll('#end-btns button')].map(b => b.textContent), pr: JSON.parse(localStorage.getItem('dbh2.campaign') || 'null') }));
    ok(end.vis && /victory/i.test(end.title) && end.pr && end.pr.unlocked >= Math.min(9, i + 2), `m${i + 1}: end screen and unlock ${JSON.stringify(end)}`);
    if (i === 0) await page.screenshot({ path: `${dir}/camp-end.png` });
    ok(errs.length === e0, `m${i + 1}: no errors ${errs.slice(e0).join(' | ').slice(0, 600)}`);
  }
  // losing: m1 with no Town Center and no villagers
  await E(() => window.__DBH.launch({ kind: 'mission', mission: 0, diff: 'normal' }));
  const lose = await E(() => { const D = window.__DBH, G = D.G(), dv = D.dev(); dv.DLG.queue.length = 0; dv.DLG.cur = null; G.paused = false; for (const e of [...G.units, ...G.blds]) if (e.owner === 1 && (e.key === 'tc' || e.def.cls === 'villager')) dv.kill(e, null); D.step(3); return { over: G.over, won: G.winTeam }; });
  await page.waitForTimeout(1700);
  const lt = await E(() => ({ title: document.getElementById('end-title').textContent, sub: document.getElementById('end-sub').textContent }));
  ok(lose.over && lose.won !== 1 && /defeat/i.test(lt.title), 'm1: losing all villagers and the TC is a defeat ' + JSON.stringify([lose, lt]));
  // campaign menu shows unlocked missions
  await E(() => window.__DBH.dev().quitToMenu());
  await page.click('#m-campaign'); await page.waitForTimeout(300);
  const ml = await page.$$eval('#mission-list button', b => b.map(x => (x.disabled ? 'L ' : 'U ') + x.textContent.slice(0, 30)));
  ok(ml.length === 9, 'campaign menu lists 9 missions: ' + ml.join(' | '));
  await page.screenshot({ path: `${dir}/camp-menu.png` });
  await page.click('#c-play'); await page.waitForTimeout(400);
  ok(await page.isVisible('#scr-brief'), 'Play opens the briefing');
  await page.screenshot({ path: `${dir}/camp-brief.png` });
  await page.click('#b-go'); await page.waitForTimeout(800);
  ok(await E(() => !!window.__DBH.G().scn && !window.__DBH.G().over), 'briefing starts the mission');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${dir}/camp-dialogue.png` });
  console.log('ERRORS:', errs.length ? errs.slice(0, 12).join('\n') : 'none');
  console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
  await browser.close();
})();
