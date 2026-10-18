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
  await page.addInitScript(() => { window.__DBH_NOSTORY = true; });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' ')));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto('file://' + tmp); await page.waitForTimeout(400);
  const E = (f, a) => page.evaluate(f, a);
  const N = await E(() => window.__DBH.dev().CAMPAIGN.length);
  ok(N === 13, `campaign has 13 missions (got ${N})`);
  for (let i = 0; i < N; i++) {
    if (only && String(i) !== only) continue;
    const e0 = errs.length;
    await E(i => window.__DBH.launch({ kind: 'mission', mission: i, diff: 'normal' }), i);
    await page.waitForTimeout(700);
    const title = await E(() => window.__DBH.G().scn.m.title), mid = await E(() => window.__DBH.G().scn.m.id);
    await page.screenshot({ path: `${dir}/camp-${mid}-start.png` });
    // play 3 minutes without the player doing anything (dialogue pauses are skipped)
    const r = await E(() => { const D = window.__DBH, G = D.G(), dv = D.dev(); for (let k = 0; k < 18; k++) { dv.DLG.queue.length = 0; dv.DLG.cur = null; G.paused = false; D.step(10); if (G.over) break; } return { over: G.over, t: Math.round(G.scn.t), objs: G.scn.objs.map(o => o.id + ':' + o.state).join(' '), mine: G.units.filter(u => u.owner === 1).length, foes: G.units.filter(u => u.owner === 2).length }; });
    // m2 and m6b are races against the clock: doing nothing for 3 minutes may already end them
    ok(!r.over || mid === 'm2' || mid === 'm6b', `${mid} "${title}": 3 idle minutes run ${JSON.stringify(r)}`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${dir}/camp-${mid}-3min.png` });
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
    ok(w.over && w.won === 1 || (w.early && (mid === 'm2' || mid === 'm6b')), `${mid}: forced objectives give a win ${JSON.stringify(w)}`);
    if (w.early && w.won !== 1) { await page.waitForTimeout(1700); continue; }
    await page.waitForTimeout(1700);
    const end = await E(() => ({ vis: !document.getElementById('scr-end').hidden, title: document.getElementById('end-title').textContent, btns: [...document.querySelectorAll('#end-btns button')].map(b => b.textContent), pr: JSON.parse(localStorage.getItem('dbh2.campaign') || 'null') }));
    ok(end.vis && /victory/i.test(end.title) && end.pr && end.pr.unlocked >= Math.min(N, i + 2), `${mid}: end screen and unlock ${JSON.stringify(end)}`);
    if (i === 0) await page.screenshot({ path: `${dir}/camp-end.png` });
    ok(errs.length === e0, `${mid}: no errors ${errs.slice(e0).join(' | ').slice(0, 600)}`);
  }
  // losing: m1 with no Town Center and no villagers
  await E(() => window.__DBH.launch({ kind: 'mission', mission: 0, diff: 'normal' }));
  const lose = await E(() => { const D = window.__DBH, G = D.G(), dv = D.dev(); dv.DLG.queue.length = 0; dv.DLG.cur = null; G.paused = false; for (const e of [...G.units, ...G.blds]) if (e.owner === 1 && (e.key === 'tc' || e.def.cls === 'villager')) dv.kill(e, null); D.step(3); return { over: G.over, won: G.winTeam }; });
  await page.waitForTimeout(1700);
  const lt = await E(() => ({ title: document.getElementById('end-title').textContent, sub: document.getElementById('end-sub').textContent }));
  ok(lose.over && lose.won !== 1 && /defeat/i.test(lt.title), 'm1: losing all villagers and the TC is a defeat ' + JSON.stringify([lose, lt]));
  // campaign heroes are knocked out, not killed, and a friendly unit next to them revives them
  await E(() => window.__DBH.launch({ kind: 'mission', mission: 0, diff: 'normal' }));
  const ko = await E(() => {
    const D = window.__DBH, G = D.G(), dv = D.dev(); dv.DLG.queue.length = 0; dv.DLG.cur = null; G.paused = false;
    const g = G.units.find(u => u.owner === 1 && u.key === 'goku');
    dv.kill(g, null);
    const down = { ko: !!g.ko, dead: g.dead, listed: G.kos.includes(g), heroDead: !!G.players[1].heroDead.goku };
    D.step(1);
    const mid = { ko: !!g.ko, inUnits: G.units.includes(g) };
    D.step(6);
    return { down, mid, after: { ko: !!g.ko, dead: g.dead, hp: Math.round(g.hp), inUnits: G.units.includes(g) } };
  });
  ok(ko.down.ko && ko.down.dead && ko.down.listed && !ko.down.heroDead && ko.mid.ko && !ko.mid.inUnits && !ko.after.ko && !ko.after.dead && ko.after.hp > 0 && ko.after.inUnits, 'a knocked-out campaign hero gets back up next to a friend ' + JSON.stringify(ko));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${dir}/camp-revive.png` });
  // campaign menu shows unlocked missions
  await E(() => window.__DBH.dev().quitToMenu());
  await page.click('#m-campaign'); await page.waitForTimeout(300);
  const ml = await page.$$eval('#mission-list button', b => b.map(x => (x.disabled ? 'L ' : 'U ') + x.textContent.slice(0, 30)));
  ok(ml.length === N, `campaign menu lists ${N} missions: ` + ml.join(' | '));
  await page.screenshot({ path: `${dir}/camp-menu.png` });
  await page.click('#c-play'); await page.waitForTimeout(400);
  ok(await page.isVisible('#scr-brief'), 'Play opens the briefing');
  await page.screenshot({ path: `${dir}/camp-brief.png` });
  await page.click('#b-go'); await page.waitForTimeout(800);
  ok(await E(() => !!window.__DBH.G().scn && !window.__DBH.G().over), 'briefing starts the mission');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${dir}/camp-dialogue.png` });
  // ---------- story scenes ----------
  await E(() => { window.__DBH_NOSTORY = false; window.__DBH.dev().quitToMenu(); });
  const e1 = errs.length;
  const scn = await E(() => {
    const dv = window.__DBH.dev(), out = [];
    for (const m of dv.CAMPAIGN) for (const k of ['intro', 'outro']) {
      const sc = m[k]; if (!sc) { out.push(m.id + ' ' + k + ' MISSING'); continue; }
      const bad = (Array.isArray(sc) ? sc : [sc]).flatMap(x => x.lines).filter(([s]) => !dv.SPEAKERS[s]).map(([s]) => s);
      if (bad.length) out.push(m.id + ' ' + k + ' unknown speakers ' + bad.join(','));
      dv.playScene(sc);
      if (document.getElementById('story').hidden) out.push(m.id + ' ' + k + ' not shown');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      if (!document.getElementById('story').hidden) out.push(m.id + ' ' + k + ' did not close');
    }
    return out;
  });
  ok(scn.length === 0 && errs.length === e1, 'every mission has an intro and outro scene with known speakers ' + scn.join(' | ') + errs.slice(e1).join(' | '));
  // a real launch plays the intro, pauses the game, and resumes after it
  await E(() => window.__DBH.launch({ kind: 'mission', mission: 4, diff: 'normal' }));
  await page.waitForTimeout(900);
  const st = await E(() => ({ vis: !document.getElementById('story').hidden, name: document.getElementById('story-name').textContent, paused: window.__DBH.G().paused, place: document.getElementById('story-place').textContent }));
  ok(st.vis && st.paused && st.name.length > 0, 'mission start plays its story scene and pauses the game ' + JSON.stringify(st));
  await page.screenshot({ path: `${dir}/story-intro.png` });
  for (let k = 0; k < 5; k++) { await page.keyboard.press('Space'); await page.waitForTimeout(120); }
  const st2 = await E(() => document.getElementById('story-name').textContent);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${dir}/story-intro2.png` });
  await page.click('#story-skip'); await page.waitForTimeout(200);
  const st3 = await E(() => ({ vis: !document.getElementById('story').hidden, paused: window.__DBH.G().paused, dlg: !document.getElementById('dialogue').hidden }));
  // the mission's own first line may pause the game again, as mission dialogue always did
  ok(!st3.vis && (!st3.paused || st3.dlg), 'skipping the scene hands control back to the mission ' + JSON.stringify([st2, st3]));
  // the outro plays after a win, before the end screen
  await E(() => { const D = window.__DBH, G = D.G(), dv = D.dev(); dv.DLG.queue.length = 0; dv.DLG.cur = null; G.paused = false; G.scn.setObj('force', 'done'); D.step(1); });
  await page.waitForTimeout(1900);
  const o1 = await E(() => ({ story: !document.getElementById('story').hidden, end: !document.getElementById('scr-end').hidden, name: document.getElementById('story-name').textContent }));
  await page.screenshot({ path: `${dir}/story-outro.png` });
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  const o2 = await E(() => ({ story: !document.getElementById('story').hidden, end: !document.getElementById('scr-end').hidden }));
  ok(o1.story && !o1.end && !o2.story && o2.end, 'a win plays the outro scene, then shows the end screen ' + JSON.stringify([o1, o2]));
  // mission 1 opens with the Bardock prologue, then Kame House; Escape skips the whole chain
  await E(() => window.__DBH.launch({ kind: 'mission', mission: 0, diff: 'normal' }));
  await page.waitForTimeout(700);
  const pr1 = await E(() => ({ vis: !document.getElementById('story').hidden, name: document.getElementById('story-name').textContent, place: document.getElementById('story-place').textContent }));
  await page.screenshot({ path: `${dir}/story-prologue.png` });
  for (let k = 0; k < 6; k++) { await page.keyboard.press('Space'); await page.waitForTimeout(80); }
  await page.waitForTimeout(300);
  const pr2 = await E(() => ({ vis: !document.getElementById('story').hidden, place: document.getElementById('story-place').textContent }));
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  const pr3 = await E(() => ({ vis: !document.getElementById('story').hidden }));
  ok(pr1.vis && pr1.name === 'Bardock' && pr2.vis && pr2.place === 'Kame House' && !pr3.vis, 'the Bardock prologue plays first, then Kame House; Escape skips the rest ' + JSON.stringify([pr1, pr2, pr3]));
  // a few scene backdrops for review
  for (const [mi, k] of [[0, 'intro'], [8, 'intro'], [11, 'outro'], [12, 'outro']]) {
    await E(([mi, k]) => window.__DBH.dev().playScene(window.__DBH.dev().CAMPAIGN[mi][k]), [mi, k]);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${dir}/story-${mi}-${k}.png` });
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
  }
  console.log('ERRORS:', errs.length ? errs.slice(0, 12).join('\n') : 'none');
  console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
  await browser.close();
})();
