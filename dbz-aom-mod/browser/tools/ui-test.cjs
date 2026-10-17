const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const file = process.argv[2], dir = process.argv[3];
let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const browser = await chromium.launch();
  const errs = [];
  const html = require('fs').readFileSync(file, 'utf8');
  const doc = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + html + '</body></html>';
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 860 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.setContent(doc, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const E = (f, a) => page.evaluate(f, a);
  const scr = (x, y) => E(([x, y]) => window.__DBH.toScreen(x, y), [x, y]);
  // ---- skirmish setup
  await page.click('#m-skirmish');
  ok(await page.isVisible('#scr-skirmish'), 'skirmish setup opens');
  await page.selectOption('#slots .slot:nth-child(3) select[data-k="who"]', 'ai');
  await page.selectOption('#slots .slot:nth-child(3) select[data-k="faction"]', 'ff');
  ok((await page.$$eval('#slots .slot:nth-child(3) select[data-k="major"] option', o => o.map(x => x.value))).join() === 'frieza,kingvegeta', 'faction change updates patron list');
  await page.selectOption('#slots .slot:nth-child(3) select[data-k="who"]', 'closed');
  await page.click('#s-start');
  await page.waitForTimeout(900);
  ok(await E(() => window.__DBH.G().started && !document.getElementById('hud').hidden), 'game starts with HUD');
  // ---- click a villager
  const v = await E(() => { const G = window.__DBH.G(); const u = G.units.find(u => u.owner === 1 && u.def.cls === 'villager'); window.__DBH.dev().centerOn(u.x, u.y); return { id: u.id, x: u.x, y: u.y }; });
  await page.waitForTimeout(150);
  let p = await scr(v.x, v.y);
  await page.mouse.click(p.x, p.y - 14);
  ok(await E(id => { const s = window.__DBH.G().sel; return s.length === 1 && s[0].id === id; }, v.id), 'left-click selects a villager');
  // ---- right-click tree
  const tree = await E(([x, y]) => { const G = window.__DBH.G(); let b = null, bd = 1e9; for (const r of G.ress) if (r.key === 'tree') { const d = Math.hypot(r.x - x, r.y - y); if (d < bd) { bd = d; b = r; } } window.__DBH.dev().centerOn(b.x, b.y); return { id: b.id, x: b.x, y: b.y }; }, [v.x, v.y]);
  await page.waitForTimeout(150);
  p = await scr(tree.x, tree.y);
  await page.mouse.click(p.x, p.y - 16, { button: 'right' });
  let ord = await E(id => window.__DBH.G().byId.get(id).order, v.id);
  ok(ord.type === 'gather' && ord.rtype === 'wood', 'right-click tree gathers ' + JSON.stringify(ord).slice(0, 80));
  // ---- box select
  const tc = await E(() => { const G = window.__DBH.G(); const b = G.blds.find(b => b.owner === 1 && b.key === 'tc'); window.__DBH.dev().centerOn(b.x, b.y); return { id: b.id, x: b.x, y: b.y }; });
  await page.waitForTimeout(150);
  const pts = await E(() => { const G = window.__DBH.G(); return G.units.filter(u => u.owner === 1).map(u => window.__DBH.toScreen(u.x, u.y)); });
  const xs = pts.map(q => q.x), ys = pts.map(q => q.y);
  await page.mouse.move(Math.min(...xs) - 30, Math.min(...ys) - 50); await page.mouse.down(); await page.mouse.move(Math.max(...xs) + 30, Math.max(...ys) + 20, { steps: 6 }); await page.mouse.up();
  const nsel = await E(() => window.__DBH.G().sel.length);
  ok(nsel >= 4, 'box select picks villagers: ' + nsel);
  // ---- build a house with Q
  await page.waitForTimeout(250);
  await page.keyboard.press('q');
  ok(await E(() => window.__DBH.G().placing) === 'house', 'Q starts house placement');
  const spot = await E(([x, y]) => { const G = window.__DBH.G(); for (let r = 5; r < 12; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const X = Math.floor(x) + dx, Y = Math.floor(y) + dy; let ok = true; for (let yy = Y - 1; yy <= Y + 2; yy++) for (let xx = X - 1; xx <= X + 2; xx++) { const i = yy * G.map.w + xx; if (G.map.block[i] || G.map.occ[i] || G.vis[i] !== 2 || G.map.settle[i] || G.map.terr[i] === 3) ok = false; } if (ok) return { x: X + .5, y: Y + .5 }; } return null; }, [tc.x, tc.y]);
  p = await scr(spot.x, spot.y);
  await page.mouse.move(p.x, p.y); await page.waitForTimeout(80); await page.mouse.click(p.x, p.y); await page.waitForTimeout(120);
  const house = await E(() => { const G = window.__DBH.G(); const h = G.blds.find(b => b.owner === 1 && b.key === 'house'); return h && { id: h.id, builders: G.units.filter(u => u.order.type === 'build' && u.order.bid === h.id).length }; });
  ok(house && house.builders >= 1, 'house placed and villagers build it ' + JSON.stringify(house));
  if (!house) { console.log('spot', spot, p, await E(() => ({ placing: window.__DBH.G().placing, mw: window.__DBH.G().mouseWorld, sel: window.__DBH.G().sel.length })), await page.$$eval('#toasts > *', t => t.map(x => x.textContent)), await E(([x, y]) => { const el = document.elementFromPoint(x, y); return el && (el.id || el.className || el.tagName); }, [p.x, p.y])); await page.screenshot({ path: dir + '/ui-fail.png' }); process.exit(1); }
  // ---- train a villager from the TC
  p = await scr(tc.x, tc.y);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(300);
  await page.click('#cmds .cmd[aria-label="Capsule Colonist"]');
  ok((await E(id => window.__DBH.G().byId.get(id).queue.map(q => q.key), tc.id)).join() === 'colonist', 'TC trains a colonist');
  await E(() => window.__DBH.step(40));
  const st = await E(id => { const G = window.__DBH.G(); return { built: G.byId.get(id) && G.byId.get(id).built, vills: G.units.filter(u => u.owner === 1 && u.def.cls === 'villager').length }; }, house.id);
  ok(st.built && st.vills === 6, 'after 40 s: house built, 6 villagers ' + JSON.stringify(st));
  // ---- cheat via Enter
  await page.keyboard.press('Enter'); await page.keyboard.type('capsule corp'); await page.keyboard.press('Enter');
  ok(await E(() => window.__DBH.G().players[1].res.wood > 1000), 'cheat CAPSULE CORP works');
  // ---- age up with a patron choice
  await page.mouse.click(p.x, p.y); await page.waitForTimeout(300);
  const ageBtns = await page.$$eval('#cmds .cmd.age', b => b.map(x => x.getAttribute('aria-label')));
  ok(ageBtns.length === 2, 'two age-up patron choices: ' + ageBtns.join(' | '));
  await page.click('#cmds .cmd.age >> nth=0');
  await E(() => window.__DBH.step(50));
  const P1 = await E(() => { const P = window.__DBH.G().players[1]; return { age: P.age, minors: P.minors, powers: Object.keys(P.powers) }; });
  ok(P1.age === 2 && P1.minors.length === 1 && P1.powers.length === 2, 'age 2 with minor patron and new power ' + JSON.stringify(P1));
  // ---- hero: train Goku, fly
  await page.mouse.click(p.x, p.y); await page.waitForTimeout(300);
  await page.click('#cmds .cmd[aria-label="★ Goku"]');
  await E(() => window.__DBH.step(30));
  await page.keyboard.press('h'); await page.waitForTimeout(250);
  const hero = await E(() => { const s = window.__DBH.G().sel[0]; return s && { key: s.key, id: s.id, x: s.x, y: s.y }; });
  ok(hero && hero.key === 'goku', 'H selects Goku');
  await page.keyboard.press('Enter'); await page.keyboard.type("kami's blessing"); await page.keyboard.press('Enter');
  ok(await E(() => window.__DBH.G().players[1].res.ki >= 99), "cheat KAMI'S BLESSING fills Ki");
  await page.waitForTimeout(250);
  await page.click('#cmds .cmd[aria-label^="Take flight"]');
  ok(await E(id => window.__DBH.G().byId.get(id).flying, hero.id), 'Take flight works');
  // ---- Dragon Ball pickup
  const ball = await E(([id]) => { const G = window.__DBH.G(), h = G.byId.get(id); let b = null, bd = 1e9; for (const q of G.balls) { const d = Math.hypot(q.x - h.x, q.y - h.y); if (d < bd) { bd = d; b = q; } } for (const u of G.units) if (u.def.cls === 'guard') window.__DBH.dev().kill(u, null); h.x = b.x - 3; h.y = b.y; h.px = h.x; h.py = h.y; window.__DBH.step(.5); window.__DBH.dev().centerOn(b.x, b.y); return { id: b.id, x: b.x, y: b.y }; }, [hero.id]);
  await page.waitForTimeout(200);
  p = await scr(ball.x, ball.y);
  await page.mouse.click(p.x, p.y - 6, { button: 'right' });
  ok((await E(id => window.__DBH.G().byId.get(id).order.type, hero.id)) === 'pickup', 'right-click Dragon Ball gives pickup');
  await E(() => window.__DBH.step(6));
  ok(await E(id => !!window.__DBH.G().byId.get(id).carryBall, hero.id), 'hero carries the ball');
  await page.screenshot({ path: dir + '/ui-carry.png' });
  // ---- god power (Sacred Water: targeted heal)
  await page.click('#powers .pow >> nth=0');
  ok((await E(() => window.__DBH.G().targeting && window.__DBH.G().targeting.key)) === 'sacredwater', 'power button arms targeting');
  await page.mouse.click(700, 400);
  ok((await E(() => window.__DBH.G().players[1].powers.sacredwater.state)) === 'used', 'power cast on click');
  // ---- control group
  await page.keyboard.press('Control+1');
  await page.keyboard.press('Escape');
  ok((await E(() => window.__DBH.G().sel.length)) === 0, 'Escape clears selection');
  await page.keyboard.press('1');
  ok((await E(() => window.__DBH.G().sel.length)) === 1, 'group 1 recalls the hero');
  // ---- wall drag
  const vill = await E(() => { const G = window.__DBH.G(); const u = G.units.find(u => u.owner === 1 && u.def.cls === 'villager'); G.sel = [u]; window.__DBH.dev().centerOn(u.x, u.y); return { x: u.x, y: u.y }; });
  await page.waitForTimeout(300);
  const wallIdx = await page.$$eval('#cmds .cmd', b => b.findIndex(x => /Wall/.test(x.getAttribute('aria-label'))));
  await page.click(`#cmds .cmd >> nth=${wallIdx}`);
  ok((await E(() => window.__DBH.G().placing)) === 'wall', 'wall placement armed');
  const a = await scr(vill.x + 3, vill.y - 4), bpt = await scr(vill.x + 3, vill.y + 2);
  await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(bpt.x, bpt.y, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(120);
  const walls = await E(() => window.__DBH.G().blds.filter(b => b.owner === 1 && b.key === 'wall').length);
  ok(walls >= 4, 'drag builds a wall line: ' + walls + ' segments');
  // ---- garrison
  await E(() => { const G = window.__DBH.G(); G.sel = G.units.filter(u => u.owner === 1 && u.def.cls === 'villager').slice(0, 3); });
  await page.waitForTimeout(300);
  await page.click('#cmds .cmd[aria-label^="Garrison"]');
  await E(() => window.__DBH.step(12));
  const gar = await E(() => window.__DBH.G().blds.find(b => b.owner === 1 && b.key === 'tc').garrisoned.length);
  ok(gar === 3, 'villagers garrison in the TC: ' + gar);
  // ---- pause and minimap
  await page.keyboard.press('p');
  ok(await page.isVisible('#scr-pause'), 'P opens the pause menu');
  await page.click('#p-resume');
  const camBefore = await E(() => ({ ...window.__DBH.cam }));
  const mm = await page.$('#minimap'); const box = await mm.boundingBox();
  await page.mouse.click(box.x + box.width * .7, box.y + box.height * .5);
  const camAfter = await E(() => ({ ...window.__DBH.cam }));
  ok(Math.abs(camAfter.x - camBefore.x) + Math.abs(camAfter.y - camBefore.y) > 50, 'minimap click moves camera');
  await page.screenshot({ path: dir + '/ui-desk.png' });
  await ctx.close();

  // ---- phone
  {
    const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const pg = await c2.newPage();
    pg.on('pageerror', e => errs.push('phone pageerror: ' + e.message));
    await pg.setContent(doc, { waitUntil: 'load' }); await pg.waitForTimeout(400);
    await pg.tap('#m-skirmish'); await pg.tap('#s-start'); await pg.waitForTimeout(700);
    const u = await pg.evaluate(() => { const G = window.__DBH.G(); const u = G.units.find(u => u.owner === 1 && u.def.cls === 'villager'); window.__DBH.dev().centerOn(u.x, u.y); return { id: u.id, x: u.x, y: u.y }; });
    await pg.waitForTimeout(150);
    let q = await pg.evaluate(([x, y]) => window.__DBH.toScreen(x, y), [u.x, u.y]);
    await pg.touchscreen.tap(q.x, q.y - 12); await pg.waitForTimeout(400);
    ok(await pg.evaluate(id => window.__DBH.G().sel.length === 1 && window.__DBH.G().sel[0].id === id, u.id), 'phone: tap selects villager');
    const g = await pg.evaluate(([x, y]) => { const G = window.__DBH.G(); let b = null, bd = 1e9; for (const r of G.ress) if (r.key === 'gold') { const d = Math.hypot(r.x - x, r.y - y); if (d < bd) { bd = d; b = r; } } window.__DBH.dev().centerOn(b.x, b.y); return { x: b.x, y: b.y }; }, [u.x, u.y]);
    await pg.waitForTimeout(150);
    q = await pg.evaluate(([x, y]) => window.__DBH.toScreen(x, y), [g.x, g.y]);
    await pg.touchscreen.tap(q.x, q.y - 8); await pg.waitForTimeout(150);
    const o = await pg.evaluate(id => window.__DBH.G().byId.get(id).order, u.id);
    ok(o.type === 'gather' && o.rtype === 'gold', 'phone: tap gold gathers ' + JSON.stringify(o).slice(0, 60));
    await pg.screenshot({ path: dir + '/ui-phone.png' });
    await c2.close();
  }
  console.log('ERRORS:', errs.length ? errs.slice(0, 10).join('\n') : 'none');
  console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
  await browser.close();
})();
