// Balance probe: a simple "player" sends its whole army at the nearest enemy hero every few seconds.
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const fs = require('fs'), path = require('path');
const file = process.argv[2], dir = process.argv[3], ids = (process.argv[4] || 'm4b,m5b,m6b,m8b').split(','), diffs = (process.argv[5] || 'normal').split(',');
(async () => {
  const browser = await chromium.launch();
  const html = fs.readFileSync(file, 'utf8'), tmp = path.resolve(dir, 'campsim.html');
  fs.writeFileSync(tmp, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  const page = await (await browser.newContext({ viewport: { width: 1200, height: 800 } })).newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(() => { window.__DBH_NOSTORY = true; });
  await page.goto('file://' + tmp); await page.waitForTimeout(300);
  for (const diff of diffs) for (const id of ids) {
    const r = await page.evaluate(([id, diff]) => {
      const D = window.__DBH, dv = D.dev(), idx = dv.CAMPAIGN.findIndex(m => m.id === id);
      D.launch({ kind: 'mission', mission: idx, diff });
      const G = D.G(), S = G.scn, log = [];
      for (let t = 0; t < 900 && !G.over; t += 3) {
        dv.DLG.queue.length = 0; dv.DLG.cur = null; G.paused = false;
        const foes = G.units.filter(u => u.owner === 2 && !u.dead);
        const target = foes.find(u => u.def.cls === 'hero') || foes[0] || G.blds.find(b => b.owner === 2 && !b.dead && !b.invuln);
        if (target) for (const u of G.units) if (u.owner === 1 && !u.dead && u.def.cls !== 'villager' && !u.def.civilian && u.stance !== 'passive' && (u.order.type === 'idle' || u.order.amove)) dv.setOrder(u, { type: 'move', x: target.x, y: target.y, amove: true });
        D.step(3);
        if (t % 60 === 0) log.push(`${t}s mine=${G.units.filter(u => u.owner === 1).length} foes=${foes.length} ko=${G.kos.length} ${S.objs.map(o => o.id[0] + o.state[0]).join('')}${S.vars.absorbed !== undefined ? ' abs=' + S.vars.absorbed : ''}`);
      }
      return { id, diff, over: G.over, won: G.winTeam === 1, t: Math.round(S.t), objs: S.objs.map(o => o.id + ':' + o.state).join(' '), reason: S.loseReason || '', people: S.vars.people ? S.vars.people.filter(v => !v.dead).length : undefined, log };
    }, [id, diff]);
    console.log(JSON.stringify(r));
  }
  console.log('ERRORS', errs.slice(0, 5));
  await browser.close();
})();
