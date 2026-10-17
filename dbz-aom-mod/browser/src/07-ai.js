// =====================================================================
// 7. COMPUTER OPPONENT (any faction, any number of players)
// =====================================================================
function initAI(P, diffKey, flags) {
  const D = DIFF[diffKey] || DIFF.normal;
  P.ai = { diff: D, diffKey, t: 1 + rnd(), wave: new Set(), waveTarget: D.wave, nextWaveAt: D.firstWave, hunt: null, threatAt: null, lastWaveCmd: 0, buildCd: 0, powerCd: 40, rebalT: 0, flags: flags || {}, garrisoned: false, tradeCd: 0 };
  P.res.food += D.bonus; P.res.gold += D.bonus; P.res.wood += D.bonus;
}
function findSpot(P, key, near, rmin, rmax) {
  const cx = Math.floor(near.x), cy = Math.floor(near.y), d = B[key];
  for (let r = rmin; r <= rmax; r++) {
    const cands = [];
    for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) === r) cands.push([x, y]);
    shuffle(cands);
    for (const [x, y] of cands) { const tx = x - Math.floor(d.w / 2), ty = y - Math.floor(d.h / 2); if (canPlace(key, tx, ty, P.id, { spacing: true, ignoreFog: true })) return { tx, ty }; }
  }
  return null;
}
function aiBuild(P, key, near, vills, n, rmin, rmax) {
  if (buildCheck(P, key)) return null;
  let spot;
  if (key === 'tc') { spot = near && { tx: near.tx, ty: near.ty }; if (!spot || !canPlace('tc', spot.tx, spot.ty, P.id, { ignoreFog: true })) return null; }
  else spot = findSpot(P, key, near, rmin || 4, rmax || 14);
  if (!spot) return null;
  pay(P, bcost(key, P.faction));
  const b = placeBuilding(key, P.id, spot.tx, spot.ty, false);
  const builders = vills.filter(v => v.order.type !== 'build' && v.order.type !== 'meditate' && !v.garrison).sort((a, c) => dist(a.x, a.y, b.x, b.y) - dist(c.x, c.y, b.x, b.y)).slice(0, n || 1);
  for (const v of builders) setOrder(v, { type: 'build', bid: b.id });
  return b;
}
function aiThink(P, dt) {
  const A = P.ai; A.t -= dt; if (A.t > 0) return; A.t = A.diff.think;
  A.powerCd -= A.diff.think; A.tradeCd -= A.diff.think;
  const F = A.flags, now = G.time, D = A.diff;
  const units = G.units.filter(u => u.owner === P.id), blds = G.blds.filter(b => b.owner === P.id);
  const tcs = blds.filter(b => b.key === 'tc');
  const tc = tcs.find(b => b.built) || tcs[0];
  const vills = units.filter(u => u.def.cls === 'villager' && !u.garrison);
  const army = units.filter(u => u.def.cls !== 'villager' && u.def.cls !== 'hero' && !u.garrison && !u.def.naval);
  const heroes = units.filter(u => u.def.cls === 'hero');
  const hero = heroes.find(h => h.key === FACTIONS[P.faction].mainHero) || heroes[0];
  const count = k => blds.filter(b => b.key === k).length;
  const pending = k => blds.some(b => b.key === k && !b.built);
  const temple = blds.find(b => b.key === 'temple' && b.built);
  const built = k => blds.filter(b => b.key === k && b.built);
  const vName = FACTIONS[P.faction].villager;
  const enemies = G.players.filter(Q => Q.id && !Q.defeated && isEnemy(P.id, Q.id));
  if (!enemies.length) return;
  if (!tc && !vills.length) { aiArmyOnly(P, army, heroes, enemies); return; }
  const anchor = tc || vills[0];

  // ---- threat near home
  let threat = null, threatN = 0;
  for (const e of G.units) if (isEnemy(P.id, e.owner) && e.def.cls !== 'villager' && !e.garrison) {
    for (const b of blds) if (dist(e.x, e.y, b.x, b.y) < 12) { threatN++; if (!threat) threat = e; break; }
  }

  // ---- no Town Center (Nomad start, or all lost): claim the nearest free Settlement
  if (!tcs.length && vills.length && !(G.scn && G.scn.locked && G.scn.locked.has('tc'))) {
    const s = freeSettlementNear(anchor, 999);
    if (s && !buildCheck(P, 'tc') && aiBuild(P, 'tc', s, vills, Math.min(vills.length, 6))) return;
    if (s && !canAfford(P, bcost('tc', P.faction))) { for (const r of ['wood', 'gold']) if (P.res[r] < bcost('tc', P.faction)[r]) { const v = vills.find(x => x.order.type === 'idle'); const n = v && findRes(v.x, v.y, r, 40, P.id, 0, v); if (n) setOrder(v, { type: 'gather', rid: n.id, rtype: r }); } }
  }
  // ---- economy
  const ageKey = ['', 'age2', 'age3', 'age4'][P.age];
  const maxAge = F.maxAge || 4;
  const vTarget = Math.min(D.maxVill + (P.age - 1) * 4 + (tcs.length - 1) * 5, 70);
  for (const t of tcs) if (t.built && vills.length + tcs.reduce((s, x) => s + x.queue.filter(q => q.key === vName).length, 0) < vTarget && t.queue.filter(q => q.key === vName).length < 2) queueUnit(P, t, vName);
  if (P.popCap - P.pop - P.qpop <= 4 + P.age * 2 && P.popCap < MAX_POP && !pending('house') && count('house') < 10) aiBuild(P, 'house', anchor, vills, 1, 4, 13);
  A.buildCd -= D.think;
  if (A.buildCd <= 0 && vills.length) {
    A.buildCd = 3;
    const nearFood = findRes(anchor.x, anchor.y, 'food', 16, P.id);
    if (count('granary') === 0 && now > 15 && nearFood) aiBuild(P, 'granary', nearFood, vills, 1, 2, 5);
    else if (count('storehouse') === 0 && now > 25) { const w = findRes(anchor.x, anchor.y, 'wood', 30, P.id); if (w) aiBuild(P, 'storehouse', w, vills, 1, 2, 5); }
    else if (count('barracks') === 0 && now > 80) aiBuild(P, 'barracks', anchor, vills, 2, 5, 12);
    else if (count('temple') === 0 && now > (P.faction === 'earth' ? 70 : 140)) aiBuild(P, 'temple', anchor, vills, 2, 5, 12);
    else if (P.faction === 'rr' && count('reactor') < Math.min(6, P.age + 2) && now > 60) aiBuild(P, 'reactor', anchor, vills, 1, 5, 13);
    else if (count('storehouse') < 5 && now > 120 && remoteSpot(P, vills)) aiBuild(P, 'storehouse', remoteSpot(P, vills), vills, 1, 2, 5);
    else if (count('farm') < Math.min(16, Math.floor(vills.length * .42)) && (now > 360 || !findRes(anchor.x, anchor.y, 'food', 22, P.id))) aiBuild(P, 'farm', count('granary') ? blds.find(b => b.key === 'granary') : anchor, vills, 1, 2, 9);
    else if (P.age >= 2 && count('stable') === 0) aiBuild(P, 'stable', anchor, vills, 2, 6, 14);
    else if (P.age >= 2 && count('armory') === 0) aiBuild(P, 'armory', anchor, vills, 1, 5, 13);
    else if (count('tower') < Math.min(3, P.age) && P.age >= 2) aiBuild(P, 'tower', anchor, vills, 1, 5, 10);
    else if (P.age >= 2 && !F.noExpand && tcs.length < 1 + Math.min(2, P.age - 1) && !threat) { const s = freeSettlementNear(anchor, 40); if (s) aiBuild(P, 'tc', s, vills, 3); }
    else if (P.age >= 3 && count('fortress') === 0) aiBuild(P, 'fortress', anchor, vills, 3, 6, 15);
    else if (P.age >= 3 && count('barracks') < 2) aiBuild(P, 'barracks', anchor, vills, 2, 6, 15);
    else if (P.age >= 3 && count('market') === 0) aiBuild(P, 'market', anchor, vills, 1, 6, 15);
    else if (P.age >= 4 && modeHas('wonder') && count('wonder') === 0 && A.diffKey !== 'easy') aiBuild(P, 'wonder', anchor, vills, 6, 7, 18);
  }
  aiVillagers(P, A, vills, anchor, temple);
  if (!F.noNavy) aiNavy(P, A, units, blds, vills, anchor, enemies);
  if (threat && threatN >= 4 && tc && tc.built) {
    for (const v of vills) if (!v.garrison && v.order.type !== 'garrison' && dist(v.x, v.y, tc.x, tc.y) < 10 && tc.garrisoned.length < B.tc.garrison) setOrder(v, { type: 'garrison', bid: tc.id });
    A.garrisoned = true;
  } else if (A.garrisoned && !threat) { for (const t of tcs) ungarrisonAll(t); A.garrisoned = false; }

  // ---- ages and technologies
  const saving = ageKey && P.age < maxAge && tc && !tc.research && ((P.age === 1 && vills.length >= 12) || (P.age === 2 && vills.length >= 18 && built('barracks').length) || (P.age === 3 && army.length >= 8));
  const needB = ageKey && TECH[ageKey].needB;
  if (saving && needB && !F.noAge && count(needB) === 0 && vills.length) aiBuild(P, needB, anchor, vills, 2, 5, 14);
  if (ageKey && P.age < maxAge && tc && !tc.research && saving && !F.noAge) {
    const opts = FACTIONS[P.faction].minors[P.age + 1];
    startTech(P, tc, ageKey, A.patronPref && A.patronPref[P.age + 1] || opts[Math.floor(rnd() * opts.length)]);
  }
  const reserve = {};
  const want = c => { for (const k in c) reserve[k] = (reserve[k] || 0) + c[k]; };
  if (saving && !threat) want(TECH[ageKey].cost);
  const heroKey = FACTIONS[P.faction].mainHero;
  if (!hero && (vills.length >= 12 || P.age >= 2) && !threat) want(unitCost(P, heroKey));
  const spare = c => { for (const k in c) if ((P.res[k] || 0) - (reserve[k] || 0) < c[k]) return false; return true; };
  const tryTech = (b, k) => { if (b && !b.research && !techCheck(P, b, k) && spare(TECH[k].cost)) { startTech(P, b, k); return true; } return false; };
  if (tc && vills.length >= 10) { const g = built('granary')[0], s = built('storehouse')[0]; for (const k of ['hunting', 'plow', 'hydro']) if (tryTech(g, k)) break; for (const k of ['saws', 'drills', 'lasersaws', 'deepcore', 'hovercarts']) if (tryTech(s, k)) break; }
  const arm = built('armory')[0]; if (arm && P.age >= 2) for (const k of ['wpn1', 'arm1', 'wpn2', 'arm2', 'wpn3', 'arm3']) if (tryTech(arm, k)) break;
  for (const b of built('barracks')) for (const k of ['inf2', 'rng2', 'inf3', 'rng3']) if (tryTech(b, k)) break;
  for (const b of built('stable')) for (const k of ['cav2', 'cav3']) if (tryTech(b, k)) break;
  if (temple && !temple.research) {
    const list = Object.keys(TECH).filter(k => TECH[k].at === 'temple' && techAvailable(P, k) && k !== 'buu');
    for (const k of list) if (tryTech(temple, k)) break;
    if (P.age >= 4 && !temple.research && P.res.food > 1600 && P.res.gold > 1600 && A.diffKey !== 'easy') tryTech(temple, 'buu');
  }
  if (tc && P.age >= 3) tryTech(tc, 'fortifiedtc');
  for (const t of built('tower')) tryTech(t, 'towerup');

  // ---- heroes
  if (!hero && (vills.length >= 12 || P.age >= 2)) { const hb = tc && tc.built ? tc : null; if (hb) queueUnit(P, hb, heroKey); }
  const extra = { earth: [['krillin', 'tc'], ['piccolo', 'temple'], ['gohan', 'temple']], rr: [['a18', 'fortress'], ['a17', 'fortress'], ['cell', 'temple']], ff: [['raditz', 'tc'], ['nappa', 'fortress'], ['frieza', 'temple']] }[P.faction];
  for (const [k, at] of extra) { const b = built(at)[0]; if (b && !trainCheck(P, b, k) && spare(unitCost(P, k)) && P.pop < P.popCap - 4) { queueUnit(P, b, k); break; } }

  // ---- army composition by counters
  const foe = { infantry: 0, ranged: 0, cavalry: 0, myth: 0, siege: 0 };
  for (const e of G.units) if (enemies.some(Q => Q.id === e.owner) && foe[e.def.cls] !== undefined) foe[e.def.cls]++;
  const wInf = 1 + foe.cavalry * .12, wRng = 1 + foe.infantry * .1, wCav = (P.age >= 2 ? 1 : 0) * (1 + foe.ranged * .12 + foe.siege * .2);
  const mine = { infantry: 0, ranged: 0, cavalry: 0, siege: 0, myth: 0 };
  for (const u of army) if (mine[u.def.cls] !== undefined) mine[u.def.cls]++;
  const pick = (k1, w1, k2, w2) => (mine[U[k1].cls] + 1) / w1 <= (mine[U[k2].cls] + 1) / w2 ? k1 : k2;
  const myUnits = Object.keys(U).filter(k => U[k].faction === P.faction && unitAvailable(P, k));
  const inf = myUnits.find(k => U[k].cls === 'infantry'), rng = myUnits.find(k => U[k].cls === 'ranged'), cav = myUnits.find(k => U[k].cls === 'cavalry'), sie = myUnits.find(k => U[k].cls === 'siege');
  if (P.pop < P.popCap) {
    for (const b of built('barracks')) if (b.queue.length < 2) { const k = pick(inf, wInf, rng, wRng); if (spare(unitCost(P, k))) queueUnit(P, b, k); }
    for (const b of built('stable')) if (b.queue.length < 2 && wCav > 0 && mine.cavalry < (army.length + 4) * .35 * wCav) { if (spare(unitCost(P, cav))) queueUnit(P, b, cav); }
    for (const b of built('fortress')) if (b.queue.length < 1 && sie && mine.siege < (P.age >= 4 ? 5 : 3)) { if (spare(unitCost(P, sie))) queueUnit(P, b, sie); }
    if (temple && temple.queue.length < 1) {
      const myths = myUnits.filter(k => U[k].cls === 'myth' && (U[k].age || 1) <= P.age).sort((a, b) => (U[b].age || 1) - (U[a].age || 1));
      for (const mk of myths) { const c = unitCost(P, mk); if (mine.myth < 3 + P.age * 2 && spare(c) && P.res.ki > (c.ki || 0) + 4) { queueUnit(P, temple, mk); break; } }
    }
  }

  // ---- defense
  if (threat) {
    for (const u of army) if (!A.wave.has(u.id) && u.order.type !== 'attack') setOrder(u, { type: 'move', x: threat.x, y: threat.y, amove: true });
    for (const h of heroes) if (!(A.hunt && A.hunt.hero === h.id) && h.order.type !== 'attack' && dist(h.x, h.y, anchor.x, anchor.y) < 30) setOrder(h, { type: 'move', x: threat.x, y: threat.y, amove: true });
  }
  // ---- attack waves
  for (const id of [...A.wave]) if (!byId(id)) A.wave.delete(id);
  const home = army.filter(u => !A.wave.has(u.id) && u.def.cls !== 'titan');
  const titan = army.find(u => u.def.cls === 'titan');
  if (!F.noAttack && !threat && ((now > A.nextWaveAt && home.length >= Math.min(5, A.waveTarget)) || home.length >= A.waveTarget * 2)) {
    const target = F.waveTo || aiTarget(P, anchor, enemies);
    if (target) {
      for (const u of home) { A.wave.add(u.id); setOrder(u, { type: 'move', x: target.x, y: target.y, amove: true }); }
      for (const h of heroes) if (!(A.hunt && A.hunt.hero === h.id)) setOrder(h, { type: 'move', x: target.x, y: target.y, amove: true });
      if (titan) setOrder(titan, { type: 'move', x: target.x, y: target.y, amove: true });
      A.nextWaveAt = now + D.waveGap; A.waveTarget += D.waveGrow; A.lastWaveCmd = now;
      if (G.me && isEnemy(G.me, P.id) && target.owner === G.me) toast(`An army from ${P.name} is marching on your base!`, 'warn');
      if (A.powerCd <= 0) aiPowers(P, enemies, true);
    }
  }
  if (G.koth && !threat && !F.noAttack) {
    const k = byId(G.korin), held = G.koth.team === P.team;
    if (k) {
      const near = home.filter(u => dist(u.x, u.y, k.x, k.y) < 8);
      if (!held && home.length >= Math.min(6, A.waveTarget) && now > 120) { for (const u of home) { A.wave.add(u.id); setOrder(u, { type: 'move', x: k.x + (rnd() - .5) * 4, y: k.y + (rnd() - .5) * 4, amove: true }); } A.lastWaveCmd = now; }
      else if (held && near.length < 4) for (const u of home.filter(u => u.order.type === 'idle').slice(0, 4 - near.length)) setOrder(u, { type: 'move', x: k.x + (rnd() - .5) * 5, y: k.y + (rnd() - .5) * 5, amove: true });
    }
  }
  if (now - A.lastWaveCmd > 10 && A.wave.size) {
    A.lastWaveCmd = now;
    for (const id of A.wave) { const u = byId(id); if (u && u.order.type === 'idle') { const t = F.waveTo || aiTarget(P, u, enemies); if (t) setOrder(u, { type: 'move', x: t.x, y: t.y, amove: true }); } }
  }
  // ---- Dragon Balls, powers, Shenron, market
  if (hero && !G.stoneUntil && G.balls.length && !F.noHunt) aiHunt(P, hero, home, temple);
  if (temple && G.relics.length && !F.noHunt && !threat) aiRelics(P, heroes, temple, anchor);
  if (P.powers.shenron && P.powers.shenron.state === 'ready') castPower(P, 'shenron', 0, 0);
  if (A.powerCd <= 0) aiPowers(P, enemies, false);
  if (A.tradeCd <= 0 && built('market').length) {
    A.tradeCd = 8;
    A.tradeCd = 4;
    for (const r of ['food', 'wood']) if (P.res[r] > 1300 && P.res.gold < 2500) marketTrade(P, r, false);
    if (P.res.gold > 1500) { for (const r of ['food', 'wood']) if (P.res[r] < 200) marketTrade(P, r, true); }
  }
}
// A resource many of our villagers work that has no drop site close by.
function remoteSpot(P, vills) {
  const c = new Map();
  for (const v of vills) if ((v.order.type === 'gather' || v.order.type === 'return') && v.order.rid && v.order.rtype !== 'food') c.set(v.order.rid, (c.get(v.order.rid) || 0) + 1);
  let best = null, bn = 1;
  for (const [rid, n] of c) { const r = byId(rid); if (!r || n <= bn) continue; if (nearestDropFor(P, r, resType(r), 9)) continue; bn = n; best = r; }
  return best;
}
function nearestDropFor(P, r, type, maxD) { for (const b of G.blds) if (b.owner === P.id && B[b.key].drop && B[b.key].drop.includes(type) && dist(b.x, b.y, r.x, r.y) < maxD) return b; return null; }
function freeSettlementNear(anchor, maxD) {
  let best = null, bd = maxD;
  for (const s of G.settlements) { if (s.tc) continue; if (G.units.some(u => u.owner > 0 && u.def.cls !== 'villager' && dist(u.x, u.y, s.tx + 2, s.ty + 2) < 6 && isEnemy(u.owner, anchor.owner || 0))) continue; const d = dist(s.tx + 2, s.ty + 2, anchor.x, anchor.y); if (d < bd) { bd = d; best = s; } }
  return best;
}
function aiVillagers(P, A, vills, anchor, temple) {
  const jobs = { food: 0, wood: 0, gold: 0 };
  let meditating = 0;
  for (const v of vills) { if (v.order.type === 'gather' || v.order.type === 'return') jobs[v.order.rtype] = (jobs[v.order.rtype] || 0) + 1; if (v.order.type === 'meditate') meditating++; }
  const wantMed = P.faction === 'earth' && temple ? (P.age >= 2 ? 6 : 3) + (P.age >= 3 ? 2 : 0) : 0;
  const weights = P.age === 1 ? { food: .55, wood: .3, gold: .15 } : P.age === 2 ? { food: .42, wood: .25, gold: .33 } : { food: .38, wood: .22, gold: .4 };
  for (const k in weights) if (P.res[k] > 1500) weights[k] *= .12; else if (P.res[k] > 800) weights[k] *= .4;
  if (P.res.gold < 150 && P.age >= 2) weights.gold *= 1.5;
  { const s = weights.food + weights.wood + weights.gold; for (const k in weights) weights[k] /= s; }
  A.rebalT -= A.diff.think;
  const n = vills.length - meditating;
  if (A.rebalT <= 0) {
    A.rebalT = 3;
    for (let moves = 0; moves < 2; moves++) {
      let hi = null, lo = null, hv = -1e9, lv = 1e9;
      for (const k of ['food', 'wood', 'gold']) { const diff = jobs[k] - weights[k] * n; if (diff > hv) { hv = diff; hi = k; } if (diff < lv) { lv = diff; lo = k; } }
      if (!(hv >= 1.5 && lv <= -1.5)) break;
      const v = vills.find(x => (x.order.type === 'gather' || x.order.type === 'return') && x.order.rtype === hi && x.carryAmt < 4);
      const r = v && (findRes(anchor.x, anchor.y, lo, 34, P.id, 0, v) || findRes(anchor.x, anchor.y, lo, 70, P.id, 0, v));
      if (!r) break;
      setOrder(v, { type: 'gather', rid: r.id, rtype: lo }); jobs[hi]--; jobs[lo]++;
    }
  }
  for (const v of vills) {
    if (v.order.type !== 'idle' || v.garrison) continue;
    if (meditating < wantMed) { setOrder(v, { type: 'meditate', bid: temple.id }); meditating++; continue; }
    let type = 'food', worst = -1e9;
    for (const k of ['food', 'wood', 'gold']) { const deficit = weights[k] * n - jobs[k]; if (deficit > worst) { worst = deficit; type = k; } }
    let r = findRes(anchor.x, anchor.y, type, 30, P.id, 0, v) || (type !== 'food' ? findRes(anchor.x, anchor.y, type, 70, P.id, 0, v) : null);
    if (!r && type === 'food') {
      const herd = G.units.find(h => h.def.cls === 'huntable' && dist(h.x, h.y, anchor.x, anchor.y) < 22 && reachable(v, h));
      if (herd) { setOrder(v, { type: 'attack', tid: herd.id, hunt: true }); jobs.food++; continue; }
      if (!G.blds.some(b => b.owner === P.id && b.key === 'farm' && !b.built)) aiBuild(P, 'farm', anchor, [v], 1, 3, 10);
      continue;
    }
    if (!r) r = findRes(anchor.x, anchor.y, 'wood', 70, P.id, 0, v);
    if (r) { setOrder(v, { type: 'gather', rid: r.id, rtype: resType(r) }); jobs[resType(r)]++; }
  }
}
function aiTarget(P, from, enemies) {
  let tP = null, bd = 1e9;
  for (const Q of enemies) { const b = G.blds.find(x => x.owner === Q.id && x.key === 'tc') || G.blds.find(x => x.owner === Q.id) || G.units.find(u => u.owner === Q.id); if (!b) continue; const d = dist(b.x, b.y, from.x, from.y); if (d < bd) { bd = d; tP = Q; } }
  if (!tP) return null;
  const bs = G.blds.filter(b => b.owner === tP.id && !B[b.key].wall);
  const held = bs.find(b => b.key === 'temple' && b.balls.length >= 4);
  if (held) return held;
  if (!bs.length) return G.units.find(u => u.owner === tP.id) || null;
  let best = null; bd = 1e9;
  for (const b of bs) { const d = dist(b.x, b.y, from.x, from.y) + (b.key === 'tc' ? 8 : 0) + (b.key === 'wonder' ? -30 : 0); if (d < bd) { bd = d; best = b; } }
  return best;
}
function aiArmyOnly(P, army, heroes, enemies) {
  const t = aiTarget(P, army[0] || heroes[0] || { x: MW / 2, y: MH / 2 }, enemies);
  if (!t) return;
  for (const u of [...army, ...heroes]) if (u.order.type === 'idle') setOrder(u, { type: 'move', x: t.x, y: t.y, amove: true });
}
function aiHunt(P, hero, army, temple) {
  const A = P.ai;
  if (!temple || hero.carryRelic) return;
  if (hero.carryBall) { if (hero.order.type !== 'deposit') setOrder(hero, { type: 'deposit', bid: temple.id }); A.hunt = null; return; }
  if (A.hunt) {
    const ball = G.balls.find(b => b.id === A.hunt.ball);
    if (!ball || ball.state !== 'ground' || hero.hp < maxHp(hero) * .3) { A.hunt = null; if (hero.hp < maxHp(hero) * .3) setOrder(hero, { type: 'move', x: temple.x, y: temple.y }); return; }
    const d = dist(hero.x, hero.y, ball.x, ball.y);
    let guards = 0; forUnitsNear(ball.x, ball.y, 6, e => { if (e.owner === 0 && e.def.cls === 'guard') guards++; });
    if (d < 5 && guards === 0) { if (hero.order.type !== 'pickup') setOrder(hero, { type: 'pickup', ball: ball.id }); }
    else if (hero.order.type === 'idle' || (hero.order.type === 'move' && !hero.order.hunt)) {
      if (guards && d < 6) { const g = G.units.find(e => e.owner === 0 && e.def.cls === 'guard' && dist(e.x, e.y, ball.x, ball.y) < 6); if (g) { setOrder(hero, { type: 'attack', tid: g.id, forced: true }); return; } }
      setOrder(hero, { type: 'move', x: ball.x, y: ball.y, amove: true, hunt: true });
    }
    for (const id of A.hunt.escorts) { const e = byId(id); if (e && e.order.type === 'idle') setOrder(e, { type: 'move', x: ball.x + (rnd() - .5) * 2, y: ball.y + (rnd() - .5) * 2, amove: true }); }
    return;
  }
  if (hero.hp < maxHp(hero) * .65 || hero.order.type === 'attack' || A.wave.has(hero.id)) return;
  let best = null, bd = 1e9;
  for (const b of G.balls) if (b.state === 'ground') { const d = dist(b.x, b.y, hero.x, hero.y); if (d < bd) { bd = d; best = b; } }
  if (!best) return;
  const escorts = army.filter(u => !A.wave.has(u.id)).slice(0, 5).map(u => u.id);
  A.hunt = { ball: best.id, escorts, hero: hero.id };
  setOrder(hero, { type: 'move', x: best.x, y: best.y, amove: true, hunt: true });
}
// ---- navy: a Dock on the nearest real sea, fishing boats, and warships picked by counters
function aiNavy(P, A, units, blds, vills, anchor, enemies) {
  const now = G.time;
  if (!A.sea || now - A.sea.t > 90) {
    let best = null, bd = 34;
    const cx = Math.floor(anchor.x), cy = Math.floor(anchor.y);
    for (let y = cy - 34; y <= cy + 34; y += 1) for (let x = cx - 34; x <= cx + 34; x += 1) {
      if (!inMap(x, y)) continue; const i = idx(x, y);
      if (G.map.terr[i] !== T_WATER || !G.nregion[i] || G.nregionSize[G.nregion[i]] < 120) continue;
      const d = dist(x, y, anchor.x, anchor.y); if (d < bd) { bd = d; best = { x, y, reg: G.nregion[i] }; }
    }
    A.sea = Object.assign({ t: now, reg: 0 }, best || {});
  }
  const reg = A.sea.reg; if (!reg) return;
  const inSea = e => e.kind === 'unit' ? regionAt(e.x, e.y, true) === reg : regionsOf(e, true).includes(reg);
  const fishN = G.ress.filter(r => r.key === 'fish' && G.nregion[idx(r.tx, r.ty)] === reg).length;
  const docks = blds.filter(b => b.key === 'dock'), dock = docks.find(b => b.built);
  const foeShips = G.units.filter(u => u.def.naval && !u.def.fisher && enemies.some(Q => Q.id === u.owner) && inSea(u));
  const foeNaval = foeShips.length || G.units.some(u => u.def.fisher && enemies.some(Q => Q.id === u.owner) && inSea(u)) || G.blds.some(b => b.key === 'dock' && enemies.some(Q => Q.id === b.owner) && inSea(b));
  if (!docks.length && vills.length >= 8 && now > 100 && (fishN >= 3 || foeNaval) && !buildCheck(P, 'dock')) {
    // shore tile nearest home, next to this sea
    let shore = null, bd = 1e9;
    for (let y = A.sea.y - 10; y <= A.sea.y + 10; y++) for (let x = A.sea.x - 10; x <= A.sea.x + 10; x++) {
      if (!inMap(x, y) || G.map.terr[idx(x, y)] === T_WATER || G.map.block[idx(x, y)]) continue;
      if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => inMap(x + dx, y + dy) && G.nregion[idx(x + dx, y + dy)] === reg)) continue;
      const d = dist(x, y, anchor.x, anchor.y); if (d < bd) { bd = d; shore = { x, y }; }
    }
    if (shore) aiBuild(P, 'dock', shore, vills, 2, 0, 6);
  }
  if (!dock) return;
  const myShips = units.filter(u => u.def.naval);
  const fishers = myShips.filter(u => u.def.fisher), war = myShips.filter(u => !u.def.fisher);
  const kinds = {}; for (const k in U) if (U[k].faction === P.faction && U[k].ship) kinds[U[k].ship] = k;
  const qn = k => dock.queue.filter(q => q.key === k).length;
  if (fishers.length + qn(kinds.fish) < Math.min(fishN, 3 + P.age * 2, 10) && dock.queue.length < 2 && P.res.wood > 120 && P.pop < P.popCap) queueUnit(P, dock, kinds.fish);
  for (const f of fishers) if (f.order.type === 'idle') { const r = findRes(f.x, f.y, 'food', 60, P.id, 0, f); if (r) setOrder(f, { type: 'gather', rid: r.id, rtype: 'food' }); }
  if (!dock.research) for (const k of ['nets', 'hulls', 'navalguns']) if (!techCheck(P, dock, k) && P.res.wood > TECH[k].cost.wood + 150) { startTech(P, dock, k); break; }
  // warships: answer enemy ships with their counter, otherwise keep a small fleet
  const fc = { arrow: 0, hammer: 0, siege: 0 }; for (const s of foeShips) fc[s.def.ship]++;
  const mc = { arrow: 0, hammer: 0, siege: 0 }; for (const s of war) mc[s.def.ship]++;
  const want = Math.min(14, foeShips.length ? foeShips.length + 3 : foeNaval && P.age >= 2 ? 3 + P.age : 0);
  if (war.length < want && dock.queue.length < 2 && P.pop < P.popCap - 2) {
    const counter = { arrow: 'hammer', hammer: P.age >= 3 ? 'siege' : 'arrow', siege: 'arrow' };
    let pick = 'arrow', score = -1e9;
    for (const k of ['arrow', 'hammer', 'siege']) { if (k === 'siege' && P.age < 3) continue; let sc = -mc[k]; for (const e in fc) if (counter[e] === k) sc += fc[e] * 1.5; if (sc > score) { score = sc; pick = k; } }
    if (kinds[pick] && !trainCheck(P, dock, kinds[pick]) && P.res.wood > U[kinds[pick]].cost.wood + 80) queueUnit(P, dock, kinds[pick]);
  }
  // fleet orders
  const threat = foeShips.find(s => dist(s.x, s.y, dock.x, dock.y) < 26 || fishers.some(f => dist(f.x, f.y, s.x, s.y) < 10));
  if (threat) { for (const s of war) if (s.order.type !== 'attack') setOrder(s, { type: 'move', x: threat.x, y: threat.y, amove: true }); return; }
  if (war.length >= 4 && now - (A.fleetT || 0) > 70) {
    A.fleetT = now;
    let tgt = null, td = 1e9;
    for (const e of [...G.blds.filter(b => enemies.some(Q => Q.id === b.owner) && inSea(b)), ...G.units.filter(u => u.def.naval && enemies.some(Q => Q.id === u.owner) && inSea(u))]) { const d = dist(e.x, e.y, dock.x, dock.y) + (e.kind === 'building' && e.key === 'dock' ? -10 : 0); if (d < td) { td = d; tgt = e; } }
    if (tgt) for (const s of war) setOrder(s, { type: 'move', x: tgt.x, y: tgt.y, amove: true });
  } else for (const s of war) if (s.order.type === 'idle' && dist(s.x, s.y, dock.x, dock.y) > 14) setOrder(s, { type: 'move', x: dock.x + (rnd() - .5) * 8, y: dock.y + (rnd() - .5) * 8 });
}
// A free hero fetches relics to the Temple, AoM style.
function aiRelics(P, heroes, temple, anchor) {
  const A = P.ai;
  for (const h of heroes) if (h.carryRelic && h.order.type !== 'deposit') setOrder(h, { type: 'deposit', bid: temple.id });
  if (heroes.some(h => h.order.type === 'pickup' && h.order.relic) || heroes.some(h => h.carryRelic)) return;
  if (temple.relics.length >= RELIC_CAP) return;
  const h = heroes.find(x => !(A.hunt && A.hunt.hero === x.id) && !A.wave.has(x.id) && x.order.type !== 'attack' && !x.carryBall && x.hp > maxHp(x) * .6);
  if (!h) return;
  let best = null, bd = 55;
  for (const r of G.relics) if (r.state === 'ground') { const d = dist(r.x, r.y, anchor.x, anchor.y); if (d < bd && reachablePt(h, r.x, r.y)) { bd = d; best = r; } }
  if (best) setOrder(h, { type: 'pickup', relic: best.id });
}
function aiPowers(P, enemies, attacking) {
  const A = P.ai;
  if (rnd() > A.diff.powers) { A.powerCd = 20; return; }
  const ready = Object.keys(P.powers).filter(k => P.powers[k].state === 'ready' && k !== 'shenron');
  if (!ready.length) return;
  const foes = G.units.filter(u => enemies.some(Q => Q.id === u.owner) && !u.garrison);
  let best = null, bc = 0;
  for (const f of foes) { let c = 0; for (const g of foes) if (dist(g.x, g.y, f.x, f.y) < 5) c += g.def.cls === 'villager' ? .4 : g.def.cls === 'myth' ? 2 : 1; if (c > bc) { bc = c; best = f; } }
  const own = G.units.filter(u => u.owner === P.id && u.def.cls !== 'villager');
  const nearOwn = p => p && (G.blds.some(b => b.owner === P.id && dist(b.x, b.y, p.x, p.y) < 20) || own.some(u => dist(u.x, u.y, p.x, p.y) < 10));
  const wounded = own.filter(u => u.hp < maxHp(u) * .5);
  for (const k of ready) {
    const pw = POW[k];
    let cast = false;
    if (['strike', 'line', 'bombs', 'stun', 'drain'].includes(pw.type)) {
      const titan = foes.find(u => u.def.cls === 'titan');
      if (titan && pw.titanKill) cast = castPower(P, k, titan.x, titan.y);
      else if (best && bc >= (pw.type === 'stun' ? 5 : 6) && nearOwn(best)) cast = castPower(P, k, best.x, best.y);
    } else if (pw.type === 'bolt' || pw.type === 'convert') {
      const t = foes.filter(u => pw.type === 'convert' ? u.def.cls === 'myth' || u.def.cls === 'siege' : u.def.cls === 'hero' || u.def.cls === 'myth').sort((a, b) => maxHp(b) - maxHp(a))[0];
      if (t && nearOwn(t)) cast = castPower(P, k, t.x, t.y);
    } else if (pw.type === 'heal' || pw.type === 'repair') {
      if (wounded.length >= 5) { const w = wounded[0]; cast = castPower(P, k, w.x, w.y); }
    } else if (pw.type === 'globalHeal') { if (wounded.length >= 10) cast = castPower(P, k, 0, 0); }
    else if (pw.type === 'buff' || pw.type === 'apes') { if (attacking || (best && nearOwn(best) && bc >= 5)) { const c = own.filter(u => u.order.type === 'attack' || A.wave.has(u.id))[0]; if (c) cast = castPower(P, k, c.x, c.y); } }
    else if (pw.type === 'heroBuff') { if (G.units.some(u => u.owner === P.id && u.def.cls === 'hero' && u.order.type === 'attack')) cast = castPower(P, k, 0, 0); }
    else if (pw.type === 'summon') { if (best && nearOwn(best) && bc >= 4) cast = castPower(P, k, best.x + 2, best.y + 2); }
    else if (pw.type === 'grant') { if (P.res.food + P.res.wood + P.res.gold < 400 && G.time > 300) cast = castPower(P, k, 0, 0); }
    if (cast) { A.powerCd = 25; return; }
  }
}
