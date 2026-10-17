const S = require('../dist/sim.cjs');
const configs = process.argv[2] ? JSON.parse(process.argv[2]) : [
  { map: 'earth', players: [{ faction: 'earth', ai: 'normal' }, { faction: 'rr', ai: 'normal' }], seed: 11 },
  { map: 'namek', players: [{ faction: 'ff', ai: 'normal' }, { faction: 'earth', ai: 'normal' }], seed: 22 },
  { map: 'wasteland', players: [{ faction: 'rr', ai: 'normal' }, { faction: 'ff', ai: 'normal' }], seed: 33 },
  { map: 'highlands', players: [{ faction: 'earth', ai: 'hard', team: 1 }, { faction: 'ff', ai: 'normal', team: 1 }, { faction: 'rr', ai: 'normal', team: 2 }, { faction: 'rr', ai: 'hard', team: 2 }], seed: 44, victory: 'wonder' },
];
const minutes = +(process.argv[3] || 40);
for (const cfg of configs) {
  const t0 = Date.now();
  S.startSkirmish(Object.assign({ headless: true }, cfg));
  const G = S.G;
  let err = null;
  try {
    for (let m = 1; m <= minutes && !G.over; m++) {
      for (let t = 0; t < 60; t += S.STEP) S.tick(S.STEP);
      if (m % 5 === 0 || G.over) {
        console.log(`  t=${Math.round(G.time / 60)}m over=${G.over} winTeam=${G.winTeam} ents=${G.ents.length} balls=${G.balls.map(b => b.state[0]).join('')}`);
        for (const P of G.players) {
          if (!P.id) continue;
          const units = G.units.filter(u => u.owner === P.id);
          const cls = {}; for (const u of units) cls[u.def.cls] = (cls[u.def.cls] || 0) + 1;
          const bl = {}; for (const b of G.blds) if (b.owner === P.id) bl[b.key] = (bl[b.key] || 0) + 1;
          const heroes = units.filter(u => u.def.cls === 'hero').map(u => u.form || u.key).join(',');
          console.log(`    P${P.id} ${P.faction}/${P.major} t${P.team} age${P.age} [${P.minors.join(',')}] res=${['food','wood','gold','ki'].map(k => Math.round(P.res[k])).join('/')} pop ${P.pop}/${P.popCap} ${JSON.stringify(cls)} heroes=${heroes} techs=${P.techs.size} held=${S.ballsHeld(P.id)} k/l=${P.stats.kills}/${P.stats.lost}${P.defeated ? ' DEFEATED' : ''}`);
          console.log(`       blds ${JSON.stringify(bl)} powers ${Object.entries(P.powers).map(([k, v]) => k + ':' + v.state[0]).join(' ')}`);
        }
      }
    }
  } catch (e) { err = e; }
  console.log(`== ${cfg.map} ${cfg.players.map(p => p.faction).join(' vs ')}: ${((Date.now() - t0) / 1000).toFixed(1)}s, over=${G.over}, winTeam=${G.winTeam}, time=${Math.round(G.time)}s`);
  if (err) { console.log('ERROR', err.stack); process.exitCode = 1; }
}
