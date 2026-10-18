// Age of Mythology fidelity features: stances, empower, trade, supply pods, tribute, patron gifts and upgrades, score breakdown.
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const file = process.argv[2], dir = process.argv[3];
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const browser = await chromium.launch(); const errs = [];
  const html = require('fs').readFileSync(file, 'utf8');
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 860 } })).newPage();
  page.on('pageerror', e => errs.push('pageerror: ' + e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' ')));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>'); await page.waitForTimeout(400);
  const E = (f, a) => page.evaluate(f, a);
  const sky = (faction, major, ally) => E(([faction, major, ally]) => window.__DBH.launch({ kind: 'skirmish', opts: { map: 'earth', mode: 'supremacy', resources: 'standard', seed: 777, players: [{ faction, major, team: 1, name: 'You' }, ...(ally ? [{ faction: 'earth', major: 'kami', team: 1, ai: 'normal', name: 'Ally' }] : []), { faction: 'ff', major: 'frieza', team: 2, ai: 'easy', name: 'Foe' }] } }), [faction, major, ally]);

  // ---- stances: select fighters, cycle the stance button
  await sky('earth', 'kami');
  await E(() => { const D = window.__DBH, G = D.G(), dv = D.dev(), tc = G.blds.find(b => b.owner === 1 && b.key === 'tc'); const us = [dv.spawnNear(tc, 'fighter', 1), dv.spawnNear(tc, 'fighter', 1)]; dv.refreshLists(); G.sel = us; dv.centerOn(tc.x, tc.y); });
  await page.waitForTimeout(250);
  const seen = [];
  for (let k = 0; k < 4; k++) { const b = await page.$('#cmds .cmd[aria-label^="Stance:"]'); if (!b) break; seen.push(await b.getAttribute('aria-label')); await b.click(); await page.waitForTimeout(120); }
  const st = await E(() => window.__DBH.G().sel.map(u => u.stance || 'aggressive'));
  ok(seen.length === 4 && new Set(seen).size === 4 && st.every(s => s === 'aggressive'), 'stance button cycles through 4 stances and back ' + JSON.stringify([seen, st]));

  // ---- the age-up choice shows the patron's gift and upgrades; aging up delivers the gift
  const ag = await E(() => {
    const D = window.__DBH, G = D.G(), dv = D.dev(), P = G.players[1], tc = G.blds.find(b => b.owner === 1 && b.key === 'tc');
    const t = dv.placeBuilding('temple', 1, Math.floor(tc.x) + 5, Math.floor(tc.y) - 6, true); dv.refreshLists();
    const before = G.units.filter(u => u.owner === 1 && u.key === 'namekwarrior').length;
    dv.applyTech(P, 'age2', tc, 'piccolo'); dv.refreshLists();
    const after = G.units.filter(u => u.owner === 1 && u.key === 'namekwarrior');
    const near = after.every(u => Math.hypot(u.x - t.x, u.y - t.y) < 6);
    const techs = Object.keys(D.TECH).filter(k => D.TECH[k].patron === 'piccolo');
    return { before, after: after.length, near, techs, minors: P.minors };
  });
  ok(ag.before === 0 && ag.after === 2 && ag.near && ag.techs.length === 3, 'Piccolo sends 2 free Namekian Warriors to the Temple, and has 3 upgrades ' + JSON.stringify(ag));
  await E(() => { const G = window.__DBH.G(); G.sel = [G.blds.find(b => b.owner === 1 && b.key === 'temple')]; });
  await page.waitForTimeout(250);
  const tl = await page.$$eval('#cmds .cmd', b => b.map(x => x.getAttribute('aria-label')));
  ok(['Weighted Clothing', 'Demon Clan Warriors', 'Namekian Regeneration'].every(n => tl.includes(n)), 'the Temple offers all three Piccolo upgrades: ' + tl.join(', '));
  const ageDesc = await E(() => { const G = window.__DBH.G(); G.sel = [G.blds.find(b => b.owner === 1 && b.key === 'tc')]; return true; });
  await page.waitForTimeout(250);
  const ab = await page.$('#cmds .cmd[aria-label*="Dende"], #cmds .cmd[aria-label*="King Kai"]');
  if (ab) { await ab.hover(); await page.waitForTimeout(300); }
  const tip = await E(() => document.getElementById('tooltip').textContent || '');
  ok(!!ab && /Gift:/.test(tip) && /Upgrades:/.test(tip), 'the next age choice tooltip lists the gift and upgrades ' + tip.slice(0, 260));
  await page.screenshot({ path: dir + '/ui4-age-tip.png' });

  // ---- empower: Officer Black (Red Ribbon) speeds a building and boosts drop-offs by 20%
  await sky('rr', 'gero');
  const em = await E(() => {
    const D = window.__DBH, G = D.G(), dv = D.dev(), P = G.players[1], tc = G.blds.find(b => b.owner === 1 && b.key === 'tc');
    const black = G.units.find(u => u.owner === 1 && u.key === 'black');
    if (!black) return { black: false };
    dv.setOrder(black, { type: 'empower', bid: tc.id }); D.step(8);
    const emp = !!(tc.empowered && tc.empowered.until > G.time);
    const v = G.units.find(u => u.owner === 1 && u.def.cls === 'villager'); v.x = tc.x + 1.6; v.y = tc.y; v.carry = 'food'; v.carryAmt = 10; dv.setOrder(v, { type: 'return', rtype: 'food' });
    const f0 = P.res.food; D.step(2); return { black: true, emp, gained: Math.round((P.res.food - f0) * 10) / 10 };
  });
  ok(em.black && em.emp && em.gained === 12, 'Officer Black empowers the Town Center and drop-offs there count 20% more ' + JSON.stringify(em));

  // ---- supply pods (Frieza Force): a mobile drop site
  await sky('ff', 'frieza');
  const pod = await E(() => {
    const D = window.__DBH, G = D.G(), dv = D.dev(), P = G.players[1], tc = G.blds.find(b => b.owner === 1 && b.key === 'tc');
    const pd = dv.spawnUnit('supplypod', 1, tc.x + 14, tc.y + 2); dv.refreshLists(); D.step(.2);
    const v = G.units.find(u => u.owner === 1 && u.def.cls === 'villager'); v.x = pd.x + 1; v.y = pd.y; v.carry = 'wood'; v.carryAmt = 10; dv.setOrder(v, { type: 'return', rtype: 'wood' });
    const w0 = P.res.wood; D.step(2.5);
    return { gained: Math.round(P.res.wood - w0), tcDist: Math.round(Math.hypot(pd.x - tc.x, pd.y - tc.y)) };
  });
  ok(pod.gained === 10 && pod.tcDist >= 12, 'a villager drops resources at a nearby Supply Pod instead of the far Town Center ' + JSON.stringify(pod));

  // ---- trade: a caravan between your Market and an allied Town Center earns gold
  await sky('earth', 'kami', true);
  const tr = await E(() => {
    const D = window.__DBH, G = D.G(), dv = D.dev(), P = G.players[1], tc = G.blds.find(b => b.owner === 1 && b.key === 'tc');
    const allyTc = G.blds.find(b => b.owner === 2 && b.key === 'tc');
    const m = dv.placeBuilding('market', 1, Math.floor(tc.x) - 8, Math.floor(tc.y) + 4, true); dv.refreshLists();
    const c = dv.spawnNear(m, 'capsuletruck', 1); dv.refreshLists();
    dv.setOrder(c, { type: 'trade', home: m.id, dest: allyTc.id });
    const g0 = P.res.gold; D.step(150);
    return { gained: Math.round(P.res.gold - g0), trade: Math.round(P.stats.trade || 0), dist: Math.round(Math.hypot(m.x - allyTc.x, m.y - allyTc.y)) };
  });
  ok(tr.gained > 0 && tr.trade > 0, 'a caravan on a trade route to an ally earns Zeni ' + JSON.stringify(tr));
  // a caravan trained at a Market: without a rally point it waits; rallied to an allied Town Center it starts trading
  const tr2 = await E(() => {
    const D = window.__DBH, G = D.G(), dv = D.dev(), P = G.players[1], m = G.blds.find(b => b.owner === 1 && b.key === 'market'), allyTc = G.blds.find(b => b.owner === 2 && b.key === 'tc');
    P.res.food += 1000; P.res.gold += 1000; P.age = Math.max(P.age, 3);
    const w1 = dv.queueUnit(P, m, 'capsuletruck'); D.step(40);
    const idle = G.units.filter(u => u.owner === 1 && u.key === 'capsuletruck' && u.order.type !== 'trade').length;
    m.rally = { x: allyTc.x, y: allyTc.y, eid: allyTc.id };
    const w2 = dv.queueUnit(P, m, 'capsuletruck'); D.step(40);
    const trading = G.units.filter(u => u.owner === 1 && u.key === 'capsuletruck' && u.order.type === 'trade').length;
    return { w1: w1 || null, w2: w2 || null, idle, trading };
  });
  ok(!tr2.w1 && !tr2.w2 && tr2.idle >= 1 && tr2.trading >= 2, 'trained caravans: idle without a rally point, trading when rallied to an allied Town Center ' + JSON.stringify(tr2));

  // ---- tribute: only in team games, 10% fee, refuses when you cannot pay
  await sky('earth', 'kami', true);
  await page.waitForTimeout(200);
  ok(await page.isVisible('#btn-trib'), 'the Tribute button shows in a team game');
  await page.click('#btn-trib'); await page.waitForTimeout(150);
  const t0 = await E(() => { const G = window.__DBH.G(); return { me: G.players[1].res.food, ally: G.players[2].res.food }; });
  await page.click('#tribute button[data-to="2"][data-r="food"]'); await page.waitForTimeout(100);
  const t1 = await E(() => { const G = window.__DBH.G(); return { me: G.players[1].res.food, ally: G.players[2].res.food }; });
  ok(Math.round(t0.me - t1.me) === 110 && Math.round(t1.ally - t0.ally) === 100, 'tribute of 100 Rations costs 110 and the ally gets 100 ' + JSON.stringify([t0, t1]));
  await page.screenshot({ path: dir + '/ui4-tribute.png' });
  const t2 = await E(() => { const G = window.__DBH.G(); G.players[1].res.gold = 50; return true; });
  await page.click('#tribute button[data-to="2"][data-r="gold"]'); await page.waitForTimeout(100);
  const t3 = await E(() => window.__DBH.G().players[1].res.gold);
  ok(t3 === 50, 'tribute is refused when you cannot pay the amount plus the fee');
  await sky('earth', 'kami');
  ok(!(await page.isVisible('#btn-trib')), 'no Tribute button without allies');

  // ---- end screen: four-part score and graph tabs
  await sky('earth', 'kami', true);
  await E(() => { const D = window.__DBH, G = D.G(); D.step(45); for (const e of [...G.units, ...G.blds]) if (e.owner === 3) D.dev().kill(e, null); D.step(3); });
  await page.waitForTimeout(1900);
  const end = await E(() => ({ vis: !document.getElementById('scr-end').hidden, head: [...document.querySelectorAll('#end-table th')].map(t => t.textContent), tabs: [...document.querySelectorAll('.etab')].map(t => t.textContent) }));
  ok(end.vis && ['Economy', 'Military', 'Technology', 'Mythology'].every(h => end.head.includes(h)) && end.tabs.length === 3, 'end screen shows the four-part score and graph tabs ' + JSON.stringify(end));
  await page.click('.etab[data-g="p"]'); await page.waitForTimeout(150);
  ok(await E(() => document.querySelector('.etab[data-g="p"]').classList.contains('on')), 'Population tab switches the graph');
  await page.screenshot({ path: dir + '/ui4-end.png', fullPage: true });

  console.log('ERRORS:', errs.length ? errs.slice(0, 10).join('\n') : 'none');
  if (errs.length) fails++;
  console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
  await browser.close();
})();
