// =====================================================================
// 6. ORDERS, BUILDINGS, ECONOMY, RESEARCH, VICTORY, MAIN TICK
// =====================================================================
function setOrder(u, o, queued) {
  if (queued && u.order.type !== 'idle') { u.queue.push(o); return; }
  if (!queued) u.queue = [];
  if (u.order.type === 'gather') { const r = byId(u.order.rid); if (r && r.kind === 'building' && r.farmer === u.id) r.farmer = 0; }
  u.order = o; u.path = null; u.wantPath = true; u.meditating = false; u.stuckT = 0;
}
function idleOrder(u) {
  if (u.order.type === 'gather') { const r = byId(u.order.rid); if (r && r.kind === 'building' && r.farmer === u.id) r.farmer = 0; }
  u.order = { type: 'idle' }; u.path = null; u.wantPath = false; u.meditating = false;
}
function nextOrder(u) { const o = u.order; if (o.then) setOrder(u, o.then); else if (u.queue.length) { const q = u.queue.shift(); u.order = q; u.path = null; u.wantPath = true; } else idleOrder(u); }
const isCombat = u => u.def.cls !== 'villager' && u.def.cls !== 'huntable';

function findEnemy(u, withBuildings, range) {
  const r = range || stats(u).los; let best = null, bd = 1e9;
  forUnitsNear(u.x, u.y, r, e => {
    if (e.leap) return;
    if (!isEnemy(u.owner, e.owner)) {
      if (e.owner !== 0 || e.def.cls !== 'guard') return;
      const hb = e.lastHitBy && byId(e.lastHitBy);
      if (!(hb && hb.owner === u.owner && G.time - e.lastHitAt < 8) && !(e.order.type === 'attack' && byId(e.order.tid) && byId(e.order.tid).owner === u.owner)) return;
    }
    let d = Math.hypot(e.x - u.x, e.y - u.y);
    if (e.def.cls === 'villager') d += 2;
    if (d < bd) { bd = d; best = e; }
  });
  if (!best && withBuildings) for (const b of G.blds) if (!b.dead && isEnemy(u.owner, b.owner)) { const d = edgeDist(u, b) + (B[b.key].wall ? 6 : 0); if (d < r && d < bd) { bd = d; best = b; } }
  return best;
}
function retaliateTarget(u) {
  if (!u.lastHitBy || G.time - u.lastHitAt > 3) return null;
  const a = byId(u.lastHitBy);
  return a && a.kind !== 'building' && (isEnemy(u.owner, a.owner) || a.owner === 0) && Math.hypot(a.x - u.x, a.y - u.y) < stats(u).los * 1.4 ? a : null;
}
function nearestDrop(u, type) {
  let best = null, bd = 1e9;
  for (const b of G.blds) if (!b.dead && b.owner === u.owner && b.built && B[b.key].drop && B[b.key].drop.includes(type)) { const d = edgeDist(u, b); if (d < bd) { bd = d; best = b; } }
  return best;
}
// Nearest resource of a type, avoiding crowded spots.
function findRes(x, y, type, maxD, owner, skip, fromU) {
  const reg = fromU && !fromU.flying ? regionAt(fromU.x, fromU.y) : regionAt(x, y);
  const crowd = new Map();
  for (const u of G.units) if (u.owner === owner && (u.order.type === 'gather' || u.order.type === 'return') && u.order.rid) crowd.set(u.order.rid, (crowd.get(u.order.rid) || 0) + 1);
  let best = null, bd = maxD;
  for (const r of G.ress) {
    if (r.dead || RES_DEF[r.key].type !== type || r.amount <= 0 || r.id === skip) continue;
    const c = crowd.get(r.id) || 0, cap = r.key === 'gold' ? 8 : r.key === 'tree' ? 2 : r.key === 'carcass' ? 5 : 3;
    const d = Math.hypot(r.x - x, r.y - y) + (c >= cap ? 60 : c * .8);
    if (d < bd && (!reg || regionsOf(r).includes(reg))) { bd = d; best = r; }
  }
  if (type === 'food') for (const b of G.blds) if (!b.dead && b.owner === owner && b.key === 'farm' && b.built && b.id !== skip && !(byId(b.farmer) && byId(b.farmer).order.rid === b.id)) { const d = Math.hypot(b.x - x, b.y - y); if (d < bd) { bd = d; best = b; } }
  return best;
}
// Walk until within `reach` tiles of an entity's edge: path when far, steer straight in when close.
function approach(u, e, dt, reach) {
  const d = edgeDist(u, e);
  if (d <= reach) { u.path = null; return true; }
  if (u.path) { stepMove(u, dt); return false; }
  if (u.flying || d < 1.2) { steerTo(u, e.x, e.y, dt); return false; }
  if (u.wantPath || G.time - u.lastRepath > .6) goToEnt(u, e);
  if (u.path) stepMove(u, dt);
  return false;
}

function updateUnit(u, dt) {
  const st = stats(u), P = G.players[u.owner];
  u.cdM -= dt; u.cdR -= dt; u.spCd -= dt; if (u.hitFlash > 0) u.hitFlash -= dt; if (u.atkT > 0) u.atkT -= dt;
  u.moving = false;
  let regen = st.regen;
  if (u.def.cls === 'hero' && P && P.immortal) regen += 5;
  if (u.def.cls === 'guard' && u.order.type === 'idle' && Math.hypot(u.x - u.home.x, u.y - u.home.y) < 1.5) regen += 15;
  if (regen && u.hp < maxHp(u)) u.hp = Math.min(maxHp(u), u.hp + regen * dt);
  if (u.kaio) { u.hp -= 5 * dt; if (u.hp <= maxHp(u) * .1) { u.kaio = false; if (P && P.human) toast(`${st.name}'s body gave out. Kaio-ken released.`, 'warn'); } }
  if (u.ape && G.time > u.ape) { const ratio = u.hp / maxHp(u); u.ape = 0; u.r = u.def.size * MT; u.hp = maxHp(u) * ratio; }
  if (u.leap) { updateLeap(u, dt); return; }
  if (u.stun > 0) { u.stun -= dt; return; }
  if (st.absorb) { cellAbsorb(u, dt); if (u.dead) return; }
  if (st.heal) { u.healT = (u.healT || 0) - dt; if (u.healT <= 0) { u.healT = .5; let did = false; forUnitsNear(u.x, u.y, st.heal.radius * MT, a => { if (a !== u && isAlly(a.owner, u.owner) && a.hp < maxHp(a) && !a.def.tagset.has('Mech')) { a.hp = Math.min(maxHp(a), a.hp + st.heal.rate * .5); did = true; } }); if (did) { u.atkT = .4; u.anim = 'cast'; } } }
  const o = u.order;
  switch (o.type) {
    case 'idle': {
      if (u.def.cls === 'huntable') { wander(u, dt); break; }
      if (u.def.cls === 'guard') { guardThink(u, dt); break; }
      if (!isCombat(u)) break;
      u.scanT -= dt;
      if (u.scanT <= 0) {
        u.scanT = .5;
        const e = retaliateTarget(u) || findEnemy(u, u.def.cls === 'titan' || u.def.cls === 'siege');
        if (e) { u.order = { type: 'attack', tid: e.id, auto: true, home: { x: u.x, y: u.y } }; u.path = null; u.wantPath = true; }
      }
      break;
    }
    case 'move': {
      if (o.amove && isCombat(u)) {
        u.scanT -= dt;
        if (u.scanT <= 0) { u.scanT = .4; const e = retaliateTarget(u) || findEnemy(u, true); if (e) { u.order = { type: 'attack', tid: e.id, then: o }; u.path = null; u.wantPath = true; break; } }
      }
      if (u.wantPath) { goTo(u, o.x, o.y); if (!u.path) break; }
      if (stepMove(u, dt)) {
        if (Math.hypot(u.x - o.x, u.y - o.y) > 1.5 && !o.retry) { o.retry = true; u.wantPath = true; }
        else if (u.pathPartial && o.amove && isCombat(u)) { const w = blockingEnemyNear(u); if (w) { u.order = { type: 'attack', tid: w.id, then: o }; u.path = null; u.wantPath = true; } else nextOrder(u); }
        else nextOrder(u);
      }
      break;
    }
    case 'attack': {
      const t = byId(o.tid);
      if (!t || (t.kind === 'unit' && (t.leap || t.garrison)) || (t.kind === 'unit' && t.owner === u.owner)) {
        if (o.hunt) { const c = findRes(u.x, u.y, 'food', 3, u.owner); if (c) { setOrder(u, { type: 'gather', rid: c.id, rtype: 'food' }); break; } }
        nextOrder(u); break;
      }
      if (o.auto && Math.hypot(u.x - o.home.x, u.y - o.home.y) > st.los * 1.6) { setOrder(u, { type: 'move', x: o.home.x, y: o.home.y }); break; }
      if (u.def.cls === 'guard' && Math.hypot(u.x - u.home.x, u.y - u.home.y) > 12) { setOrder(u, { type: 'move', x: u.home.x, y: u.home.y }); break; }
      if (u.def.cls === 'villager' && t.kind === 'unit' && t.def.cls !== 'huntable' && t.owner !== 0 && !o.forced) { nextOrder(u); break; }
      engage(u, t, dt);
      break;
    }
    case 'gather': gatherThink(u, o, dt, P); break;
    case 'return': {
      const drop = nearestDrop(u, u.carry);
      if (!drop) { idleOrder(u); break; }
      if (approach(u, drop, dt, .35)) {
        P.res[u.carry] += u.carryAmt; P.stats.gathered += u.carryAmt; u.carryAmt = 0;
        const r = byId(o.rid);
        if (r && (r.kind === 'building' || r.amount > 0)) setOrder(u, { type: 'gather', rid: r.id, rtype: o.rtype });
        else { const n = findRes(u.x, u.y, o.rtype, 14, u.owner); if (n) setOrder(u, { type: 'gather', rid: n.id, rtype: o.rtype }); else idleOrder(u); }
      }
      break;
    }
    case 'build': {
      const b = byId(o.bid);
      if (!b || b.owner !== u.owner || (b.built && b.hp >= maxHp(b))) {
        if (b && b.built && b.key === 'farm' && !(byId(b.farmer) && byId(b.farmer).order.rid === b.id)) { setOrder(u, { type: 'gather', rid: b.id, rtype: 'food' }); break; }
        if (u.queue.length) { nextOrder(u); break; }
        const next = G.blds.find(x => !x.dead && !x.built && x.owner === u.owner && Math.hypot(x.x - u.x, x.y - u.y) < 10);
        if (next) { setOrder(u, { type: 'build', bid: next.id }); break; }
        if (b && b.built && B[b.key].drop) { const type = B[b.key].drop.length === 1 ? 'food' : null; const r = findRes(b.x, b.y, type || (rnd() < .5 ? 'wood' : 'gold'), 10, u.owner); if (r) { setOrder(u, { type: 'gather', rid: r.id, rtype: resType(r) }); break; } }
        idleOrder(u); break;
      }
      if (approach(u, b, dt, .35)) {
        u.anim = 'build'; u.face = Math.atan2(b.y - u.y, b.x - u.x); faceTo(u, b.x - u.x, b.y - u.y);
        const d = B[b.key];
        if (!b.built) {
          const dp = dt / d.time * (u.def.build || 1) * P.mods.build;
          b.progress += dp; b.hp = Math.min(maxHp(b), b.hp + maxHp(b) * .92 * dp);
          if (b.progress >= 1) completeBuilding(b);
        } else b.hp = Math.min(maxHp(b), b.hp + maxHp(b) * dt / (d.time * 3) * (u.def.build || 1));
        if (rnd() < dt * 3) fxPush({ type: 'dust', x: u.x + (rnd() - .5) * .4, y: u.y + (rnd() - .5) * .4, z: 4, t: 0, dur: .5, color: '#d8c9a8', r: .25 });
      }
      break;
    }
    case 'garrison': {
      const b = byId(o.bid);
      if (!b || !b.built || !B[b.key].garrison || b.garrisoned.length >= B[b.key].garrison || !isAlly(b.owner, u.owner)) { nextOrder(u); break; }
      if (approach(u, b, dt, .4)) { u.garrison = b.id; b.garrisoned.push(u.id); u.path = null; idleOrder(u); G.sel = G.sel.filter(s => s !== u); }
      break;
    }
    case 'meditate': {
      const t = byId(o.bid);
      if (!t || !t.built) { idleOrder(u); break; }
      if (approach(u, t, dt, .6)) { u.meditating = true; u.anim = 'cast'; }
      break;
    }
    case 'pickup': {
      const ball = G.balls.find(b => b.id === o.ball);
      if (!ball || ball.state !== 'ground' || u.carryBall) { nextOrder(u); break; }
      if (Math.hypot(u.x - ball.x, u.y - ball.y) <= u.r + .5) { pickUpBall(u, ball); nextOrder(u); break; }
      if (u.wantPath) { goTo(u, ball.x, ball.y); if (!u.path) break; }
      if (stepMove(u, dt) && Math.hypot(u.x - ball.x, u.y - ball.y) > u.r + .5) { if (Math.hypot(u.x - ball.x, u.y - ball.y) < 1.5) steerTo(u, ball.x, ball.y, dt); else u.wantPath = true; }
      break;
    }
    case 'deposit': {
      const t = byId(o.bid);
      if (!t || !t.built || !u.carryBall) { nextOrder(u); break; }
      if (approach(u, t, dt, .6)) { depositBall(u, t); nextOrder(u); }
      break;
    }
  }
  if (u.atkT > 0) { /* attack/cast pose holds */ }
  else if (u.moving) u.anim = u.flying ? 'fly' : 'walk';
  else if (u.order.type === 'gather' && u.anim === 'work') { /* set by gatherThink */ }
  else if (u.order.type !== 'build' && u.order.type !== 'meditate') u.anim = u.flying ? 'fly' : 'idle';
  u.animT += dt;
}
// An enemy wall, gate or building sits between us and where we wanted to go: attack it.
function blockingEnemyNear(u) {
  let best = null, bd = 4;
  for (const b of G.blds) if (!b.dead && isEnemy(u.owner, b.owner)) { const d = edgeDist(u, b); if (d < bd) { bd = d; best = b; } }
  return best;
}
function gatherThink(u, o, dt, P) {
  const cap = 10 + P.mods.carry;
  const r = byId(o.rid);
  if (u.carryAmt >= cap) { setOrder(u, { type: 'return', rid: o.rid, rtype: u.carry }); return; }
  if (!r || (r.kind === 'res' && r.amount <= 0) || (r.kind === 'building' && (!r.built || r.owner !== u.owner || (r.farmer && r.farmer !== u.id && byId(r.farmer) && byId(r.farmer).order.rid === r.id)))) {
    const n = findRes(u.x, u.y, o.rtype, 8, u.owner, 0, u);
    if (n) { o.rid = n.id; u.path = null; u.wantPath = true; return; }
    if (u.carryAmt > 0) setOrder(u, { type: 'return', rtype: u.carry });
    else idleOrder(u);
    return;
  }
  if (r.kind === 'building') {
    const fx = r.x + Math.cos(u.id) * .8, fy = r.y + Math.sin(u.id) * .8;
    if (Math.hypot(u.x - fx, u.y - fy) > .35) { if (Math.hypot(u.x - fx, u.y - fy) < 2) steerTo(u, fx, fy, dt); else { if (u.wantPath || (!u.path && G.time - u.lastRepath > .6)) goTo(u, fx, fy); if (u.path) stepMove(u, dt); else if (!u.wantPath) u.wantPath = true; } return; }
    r.farmer = u.id;
  } else if (!approach(u, r, dt, .3)) {
    o.wait = (o.wait || 0) + dt;
    if (o.wait > 9 || (u.pathPartial && !u.path && u.unreachT)) { const n = findRes(u.x, u.y, o.rtype, 10, u.owner, r.id, u); o.wait = 0; u.unreachT = 0; if (n) { o.rid = n.id; u.path = null; u.wantPath = true; } else idleOrder(u); }
    return;
  }
  o.wait = 0;
  u.path = null;
  faceTo(u, r.x - u.x, r.y - u.y);
  const type = resType(r), sub = resSub(r);
  if (u.carry !== type) { u.carry = type; u.carryAmt = 0; }
  const aiMult = P.ai ? P.ai.diff.gather : 1, g = P.mods.gather;
  const base = { hunt: .95, berry: .65, farm: .55, wood: .6, gold: .6 }[sub] || .6;
  const rate = base * (g[sub] || 1) * (sub === 'hunt' || sub === 'berry' || sub === 'farm' ? g.food : 1) * g.all * aiMult;
  let amt = Math.min(rate * dt, cap - u.carryAmt);
  if (r.kind === 'res') { amt = Math.min(amt, r.amount); r.amount -= amt; if (r.amount <= 0) removeRes(r); }
  u.carryAmt += amt; u.anim = 'work';
  u.workKind = sub;
}
function engage(u, t, dt) {
  const st = stats(u), d = edgeDist(u, t), mel = st.melee, rg = st.ranged;
  const sp = st.special;
  if (sp && u.spCd <= 0 && t.kind === 'unit' && isEnemy(u.owner, t.owner) && d <= sp.range * MT + .5 && (sp.type === 'nova' ? d < sp.radius * MT : d > .4)) { doSpecial(u, t, sp); return; }
  if (st.leap && t.kind === 'unit' && d <= st.leap.range * MT && d > .7) {
    let near = 0; forUnitsNear(t.x, t.y, st.leap.aoe * MT, e => { if (isEnemy(u.owner, e.owner)) near++; });
    if (near >= 2 || t.hp >= 300 || u.hp < maxHp(u) * .4) { startLeap(u, t); return; }
  }
  const useMelee = mel && (!rg || d <= mel.range * MT + .25 || (rg.minRange && d < rg.minRange * MT));
  if (useMelee && d <= mel.range * MT + .25) { u.path = null; faceTo(u, t.x - u.x, t.y - u.y); if (u.cdM <= 0) { u.cdM = mel.rof / buffMul(u, 'spd'); u.atkT = .35; u.anim = 'atk'; meleeStrike(u, t, mel); } return; }
  if (rg && d <= rg.range * MT && !(rg.minRange && d < rg.minRange * MT && !mel)) { u.path = null; faceTo(u, t.x - u.x, t.y - u.y); if (u.cdR <= 0) { u.cdR = rg.rof / buffMul(u, 'spd'); u.atkT = .35; u.anim = 'shoot'; fire(u, t, rg); } return; }
  if (rg && rg.minRange && d < rg.minRange * MT && !mel) { const a = Math.atan2(u.y - t.y, u.x - t.x); steerTo(u, u.x + Math.cos(a), u.y + Math.sin(a), dt); return; }
  if (u.flying || d < 1.2) { u.path = null; steerTo(u, t.x, t.y, dt); return; }
  if (!u.path && u.unreachT && G.time - u.unreachT < 5 && !reachable(u, t)) {
    if (t.kind === 'unit' && (t.owner === 0 || u.order.auto || u.order.hunt)) { u.unreachT = 0; nextOrder(u); return; }
    const w = blockingEnemyNear(u); if (w && w !== t) { u.order = { type: 'attack', tid: w.id, then: u.order }; u.wantPath = true; return; }
  }
  if (u.wantPath || (!u.path && G.time - u.lastRepath > .4) || (t.kind === 'unit' && G.time - u.lastRepath > 1.5)) goToEnt(u, t);
  if (u.path) stepMove(u, dt);
  if (!u.path && u.pathPartial && t.kind !== 'building') { const w = blockingEnemyNear(u); if (w && w !== t) { u.order = { type: 'attack', tid: w.id, then: u.order }; u.wantPath = true; } }
}
function wander(u, dt) {
  u.wanderT -= dt;
  if (u.lastHitAt > G.time - 3 && !u.path) { const a = rnd() * 6.28; goTo(u, u.x + Math.cos(a) * 3, u.y + Math.sin(a) * 3); }
  if (u.wanderT <= 0) { u.wanderT = 5 + rnd() * 7; goTo(u, u.home.x + (rnd() - .5) * 4, u.home.y + (rnd() - .5) * 4); }
  if (u.path) stepMove(u, dt);
}
function guardThink(u, dt) {
  u.scanT -= dt;
  if (u.scanT <= 0) {
    u.scanT = .5;
    let best = null, bd = 6;
    forUnitsNear(u.home.x, u.home.y, 6, e => { if (e.owner > 0 && !e.leap) { const d = Math.hypot(e.x - u.home.x, e.y - u.home.y); if (d < bd) { bd = d; best = e; } } });
    const r = retaliateTarget(u); if (r) best = r;
    if (best) { setOrder(u, { type: 'attack', tid: best.id }); return; }
    if (Math.hypot(u.x - u.home.x, u.y - u.home.y) > 1 && !u.path) goTo(u, u.home.x, u.home.y);
  }
  if (u.path) stepMove(u, dt);
}
function ejectUnit(u, b) {
  u.garrison = 0;
  const f = freeTileNear(b.tx + b.w, b.ty + b.h, 6) || { x: b.tx + b.w, y: b.ty + b.h };
  u.x = f.x + .5 + (rnd() - .5) * .3; u.y = f.y + .5 + (rnd() - .5) * .3; u.px = u.x; u.py = u.y;
  idleOrder(u);
}
function ungarrisonAll(b) { for (const id of b.garrisoned) { const u = G.byId.get(id); if (u && !u.dead) ejectUnit(u, b); } b.garrisoned = []; }

// ---------- buildings ----------
function completeBuilding(b) {
  b.built = true; b.progress = 1; b.hp = Math.min(b.hp, maxHp(b));
  const P = G.players[b.owner]; P.stats.built++;
  if (P.human && !B[b.key].wall) { toast(`${b.name} complete.`, 'good'); SFX.play('build', b.x, b.y); }
  if (b.key === 'wonder') { P.wonderSince = G.time; toast(`${P.human ? 'Your' : P.name + "'s"} Wonder stands! ${G.opts.victory === 'wonder' ? 'Defend it for 5 minutes to win.' : ''}`, P.human ? 'gold' : 'warn'); }
  if (G.scn && G.scn.onBuilt) G.scn.onBuilt(b);
}
function updateBuilding(b, dt) {
  if (b.hitFlash > 0) b.hitFlash -= dt;
  if (!b.built) return;
  const d = B[b.key], P = G.players[b.owner];
  if (d.attack) {
    b.cdA -= dt;
    if (b.cdA <= 0) {
      const range = bmod(P, b.key, 'range', d.attack.range) * MT;
      const targets = [];
      forUnitsNear(b.x, b.y, range + b.r, e => { if (isEnemy(b.owner, e.owner) && !e.leap) targets.push(e); });
      if (targets.length) {
        targets.sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y));
        const arrows = Math.round(bmod(P, b.key, 'arrows', d.attack.arrows || 1)) + Math.min(10, b.garrisoned.length);
        for (let i = 0; i < arrows; i++) fireFrom(b, targets[i % Math.min(3, targets.length)], d.attack);
        b.cdA = d.attack.rof;
      } else b.cdA = .3;
    }
  }
  if (d.ki && P) addKi(P, bmod(P, b.key, 'ki', d.ki) * dt * (P.ai ? P.ai.diff.gather : 1));
  if (b.garrisoned.length) for (const id of b.garrisoned) { const u = G.byId.get(id); if (u && !u.dead && u.hp < maxHp(u)) u.hp = Math.min(maxHp(u), u.hp + 2 * dt); }
  if (b.queue.length) {
    const q = b.queue[0], def = U[q.key];
    if (q.progress === 0 && P.pop + (def.pop || 0) > P.popCap && (def.pop || 0) > 0) q.blocked = true;
    else {
      q.blocked = false;
      q.progress += dt / def.time * unitStats(P.id, def, null).trainMul;
      if (q.progress >= 1) {
        b.queue.shift();
        P.pop += def.pop || 0;
        const u = spawnNear(b, q.key, b.owner);
        if (q.key === 'cell') u.biomass = P.cellStage * 8;
        if (def.cls === 'hero') { delete P.heroDead[q.key]; if (P.human) { announce(stats(u).name + ' joins the fight!'); } }
        if (P.human) SFX.play('train', b.x, b.y);
        if (b.rally) issueRally(u, b.rally);
        if (G.scn && G.scn.onTrain) G.scn.onTrain(u, b);
      }
    }
  }
  if (b.research) {
    const T = TECH[b.research.key];
    b.research.progress += dt / T.time;
    if (b.research.progress >= 1) { const r = b.research; b.research = null; applyTech(P, r.key, b, r.patron); }
  }
}
function issueRally(u, rally) {
  const t = rally.eid ? G.byId.get(rally.eid) : null;
  if (t && !t.dead && (t.kind === 'res' || (t.kind === 'building' && t.key === 'farm')) && u.def.cls === 'villager') setOrder(u, { type: 'gather', rid: t.id, rtype: resType(t) });
  else if (t && !t.dead && t.kind === 'building' && t.key === 'temple' && u.def.cls === 'villager' && G.players[u.owner].faction === 'earth') setOrder(u, { type: 'meditate', bid: t.id });
  else setOrder(u, { type: 'move', x: rally.x + (rnd() - .5) * .8, y: rally.y + (rnd() - .5) * .8, amove: isCombat(u) });
}
function applyTech(P, key, b, patron) {
  const T = TECH[key];
  P.techs.add(key);
  if (T.ageUp) {
    P.age = T.ageUp;
    if (patron) { P.minors.push(patron); P.powers[PATRONS[patron].power] = { state: 'ready' }; }
    if (P.human) { announce(AGES[P.age]); SFX.play('age'); toast(`${PATRONS[patron].name} now watches over you: ${PATRONS[patron].desc}`, 'gold'); }
    else if (G.me && isEnemy(G.me, P.id)) toast(`${P.name} entered the ${AGES[P.age]}.`, 'warn');
  }
  recomputeMods(P);
  if (T.fx) for (const f of T.fx) if (f.t === 'form') for (const u of G.units) if (u.owner === P.id && u.key === f.unit) setForm(u, f.form, false);
  if (T.fx && T.fx.some(f => f.t === 'stat' && f.stat === 'hp')) for (const u of G.units) if (u.owner === P.id) u.hp = Math.min(maxHp(u), u.hp * 1.15);
  if (key === 'buu') {
    const u = spawnNear(b, 'kidbuu', P.id);
    announce(P.human ? 'Kid Buu awakens!' : 'Kid Buu has been unsealed!');
    fxPush({ type: 'boom', x: u.x, y: u.y, z: 0, t: 0, dur: 1.4, color: '#ff8fd0', r: 3 });
  }
  if (P.human && !T.ageUp) { toast(`${T.name} researched.`, 'good'); SFX.play('research'); }
  if (G.scn && G.scn.onTech) G.scn.onTech(P, key);
}

// ---------- training and research rules (shared by the HUD and the AI) ----------
const canAfford = (P, c) => { for (const k in c) if ((P.res[k] || 0) < c[k]) return false; return true; };
const pay = (P, c) => { for (const k in c) P.res[k] -= c[k]; };
const refund = (P, c, f) => { for (const k in c) P.res[k] += c[k] * (f || 1); };
function mythPatron(key) { for (const k in PATRONS) if (PATRONS[k].myth === key) return k; return null; }
function unitAvailable(P, key) {
  const def = U[key];
  if (def.faction && def.faction !== P.faction) return false;
  if (def.cls === 'myth') { const p = mythPatron(key); if (p && !P.minors.includes(p)) return false; }
  if (G.scn && G.scn.locked && G.scn.locked.has(key)) return false;
  return true;
}
function trainCheck(P, b, key) {
  const def = U[key];
  if (!b.built) return 'Under construction';
  if (!unitAvailable(P, key)) return 'Not available';
  if ((def.age || 1) > P.age) return `Needs the ${AGES[def.age]}`;
  if (def.req && !P.techs.has(def.req)) return `Research ${TECH[def.req].name} first`;
  if (def.cls === 'hero') {
    if (G.ents.some(u => u.kind === 'unit' && !u.dead && u.owner === P.id && u.key === key)) return 'Already on the field';
    if (G.blds.some(x => x.owner === P.id && x.queue.some(q => q.key === key))) return 'Already training';
  }
  if (b.queue.length >= 5) return 'Queue full';
  if (!canAfford(P, unitCost(P, key))) return 'Not enough resources';
  return null;
}
function queueUnit(P, b, key) {
  const why = trainCheck(P, b, key);
  if (why) return why;
  pay(P, unitCost(P, key));
  b.queue.push({ key, progress: 0 });
  return null;
}
function cancelQueue(P, b, i) { const q = b.queue[i]; if (!q) return; b.queue.splice(i, 1); refund(P, unitCost(P, q.key)); }
function techAvailable(P, key) {
  const T = TECH[key];
  if (T.faction && T.faction !== P.faction) return false;
  if (T.patron && !P.minors.includes(T.patron)) return false;
  if (G.scn && G.scn.locked && G.scn.locked.has(key)) return false;
  if (G.scn && G.scn.maxAge && T.ageUp && T.ageUp > G.scn.maxAge) return false;
  return true;
}
function techCheck(P, b, key) {
  const T = TECH[key];
  if (!b.built) return 'Under construction';
  if (!techAvailable(P, key)) return 'Not available';
  if (P.techs.has(key)) return 'Done';
  if (G.blds.some(x => x.owner === P.id && x.research && x.research.key === key)) return 'Researching';
  if (b.research) return 'Busy researching';
  if (T.ageUp && T.age !== P.age) return 'Not available';
  if (!T.ageUp && T.age > P.age) return `Needs the ${AGES[T.age]}`;
  if (T.req && !P.techs.has(T.req)) return `Needs ${TECH[T.req].name}`;
  if (!canAfford(P, T.cost)) return 'Not enough resources';
  return null;
}
function startTech(P, b, key, patron) {
  const why = techCheck(P, b, key); if (why) return why;
  if (TECH[key].ageUp && !patron) return 'Choose a patron';
  pay(P, TECH[key].cost); b.research = { key, progress: 0, patron };
  return null;
}
function cancelResearch(P, b) { if (!b.research) return; refund(P, TECH[b.research.key].cost); b.research = null; }
function buildCheck(P, key) {
  const d = B[key];
  if (d.special) return 'Not available';
  if (d.faction && d.faction !== P.faction) return 'Not available';
  if (G.scn && G.scn.locked && G.scn.locked.has(key)) return 'Not available';
  if (d.age > P.age) return `Needs the ${AGES[d.age]}`;
  if (key === 'tc' && P.age < 2 && G.blds.some(b => b.owner === P.id && b.key === 'tc')) return 'Needs the Namek Saga';
  if (d.limit && G.blds.filter(b => b.owner === P.id && b.key === key).length >= d.limit) return 'Limit reached';
  if (!canAfford(P, bcost(key, P.faction))) return 'Not enough resources';
  return null;
}
// Market: 100 units per trade; prices drift with use.
function marketTrade(P, res, buy) {
  const price = P.market[res];
  if (buy) { if (P.res.gold < price) return 'Not enough Zeni'; P.res.gold -= price; P.res[res] += 100; P.market[res] = Math.min(300, price + 6); }
  else { if (P.res[res] < 100) return `Not enough ${RES_NAME[res]}`; P.res[res] -= 100; P.res.gold += Math.round(price * .8); P.market[res] = Math.max(25, price - 6); }
  return null;
}

// ---------- economy: population, Ki, upkeep, temple healing ----------
function economy(dt) {
  for (const P of G.players) {
    if (!P.id) continue;
    let cap = 0, pop = 0, qpop = 0, fliers = 0, drainers = 0, med = 0, temples = [];
    for (const b of G.blds) if (b.owner === P.id) {
      if (b.built) { cap += bmod(P, b.key, 'pop', B[b.key].pop || 0); if (b.key === 'temple') temples.push(b); }
      for (const q of b.queue) qpop += U[q.key].pop || 0;
    }
    for (const u of G.units) if (u.owner === P.id) {
      pop += u.def.pop || 0;
      if (u.flying && !u.def.alwaysFly) fliers++;
      const k = stats(u).kiDrain; if (k) drainers += k;
      if (u.meditating && u.order.type === 'meditate') med++;
    }
    P.popCap = Math.min(MAX_POP, cap); P.pop = pop; P.qpop = qpop;
    if (P.faction === 'earth') addKi(P, Math.min(med, 10 * Math.max(1, temples.length)) * .18 * P.mods.kiRate * (P.ai ? P.ai.diff.gather : 1) * dt);
    const drain = (fliers * .4 + drainers) * dt;
    if (drain > 0) {
      P.res.ki -= drain;
      if (P.res.ki <= 0) {
        P.res.ki = 0;
        if (fliers) { for (const u of G.units) if (u.owner === P.id && u.flying) land(u, true); if (P.human) toast('Out of Ki! Your fighters drop out of the sky.', 'warn'); }
        for (const u of G.units) if (u.owner === P.id && stats(u).kiDrain && u.hp > maxHp(u) * .1) u.hp -= 5 * dt;
      }
    }
    const heal = 1 + P.mods.templeHeal;
    if (temples.length && heal > 0) for (const t of temples) forUnitsNear(t.x, t.y, 8, u => { if (u.owner === P.id && u.hp < maxHp(u)) u.hp = Math.min(maxHp(u), u.hp + heal * dt); });
    P.buffs = P.buffs.filter(b => b.until > G.time);
  }
  for (const u of G.units) if (u.buffs.length) u.buffs = u.buffs.filter(b => b.until > G.time);
}

// ---------- victory ----------
const PRODUCTION = new Set(['tc', 'barracks', 'stable', 'temple', 'fortress']);
function checkVictory() {
  if (G.time < 3 || G.over) return;
  if (G.scn && G.scn.noConquest) return;
  for (const P of G.players) {
    if (!P.id || P.defeated) continue;
    const hasUnit = G.units.some(u => u.owner === P.id);
    const hasProd = G.blds.some(b => b.owner === P.id && PRODUCTION.has(b.key) && b.built);
    if (!hasUnit && !hasProd) defeatPlayer(P);
  }
  if (G.opts.victory === 'wonder') for (const P of G.players) if (P.id && !P.defeated && P.wonderSince && G.time - P.wonderSince >= 300) { endGame(P.team, 'wonder'); return; }
  const teams = new Set(G.players.filter(P => P.id && !P.defeated).map(P => P.team));
  if (teams.size <= 1) endGame([...teams][0] || 0, 'conquest');
  else if (humanP() && humanP().defeated && !G.over) endGame(-1, 'defeat');
}
function defeatPlayer(P) {
  if (P.defeated) return;
  P.defeated = true;
  for (const u of G.units) if (u.owner === P.id) kill(u, null, { silent: true });
  for (const b of G.blds) if (b.owner === P.id) kill(b, null);
  if (!P.human) toast(`${P.name} has been defeated.`, G.me && isEnemy(G.me, P.id) ? 'good' : 'warn');
}
function endGame(team, reason) {
  if (G.over) return;
  G.over = true; G.winTeam = team; G.endReason = reason;
  const won = humanP() && humanP().team === team;
  G.winner = won ? G.me : 0;
  if (G.scn && G.scn.onEnd) G.scn.onEnd(won);
  const n = G.gameN;
  if (!G.headless) setTimeout(() => { if (G.gameN === n && G.started) showEnd(won, reason); }, 1400);
}

// ---------- visibility (human team) ----------
function updateFog() {
  const vis = G.vis;
  if (G.revealAll) { vis.fill(2); G.fogDirty = true; return; }
  for (let i = 0; i < vis.length; i++) if (vis[i] === 2) vis[i] = 1;
  if (!G.me) { vis.fill(2); return; }
  const team = humanP().team;
  const reveal = (x, y, r) => {
    const tx = Math.floor(x), ty = Math.floor(y), rt = Math.ceil(r), r2 = r * r;
    for (let yy = ty - rt; yy <= ty + rt; yy++) { if (yy < 0 || yy >= MH) continue; for (let xx = tx - rt; xx <= tx + rt; xx++) if (xx >= 0 && xx < MW && (xx - tx) * (xx - tx) + (yy - ty) * (yy - ty) <= r2) vis[yy * MW + xx] = 2; }
  };
  for (const u of G.units) if (u.owner > 0 && G.players[u.owner].team === team && !u.garrison) reveal(u.x, u.y, stats(u).los + (u.flying ? 2 : 0));
  for (const b of G.blds) if (b.owner > 0 && G.players[b.owner].team === team) reveal(b.x, b.y, B[b.key].los * MT + b.r);
  for (const r of G.reveals) if (r.until > G.time) reveal(r.x, r.y, r.r);
  G.fogDirty = true;
}
const visibleAt = (x, y) => { const tx = Math.floor(x), ty = Math.floor(y); return tx >= 0 && ty >= 0 && tx < MW && ty < MH && G.vis[ty * MW + tx] === 2; };
const exploredAt = (x, y) => { const tx = Math.floor(x), ty = Math.floor(y); return tx >= 0 && ty >= 0 && tx < MW && ty < MH && G.vis[ty * MW + tx] > 0; };

// ---------- main tick ----------
function tick(dt) {
  if (G.over) return;
  G.time += dt;
  G.pathBudget = 50;
  G.units = []; G.blds = []; G.ress = [];
  for (const e of G.ents) if (!e.dead) { if (e.kind === 'unit') { G.units.push(e); e.px = e.x; e.py = e.y; } else if (e.kind === 'building') G.blds.push(e); else if (e.kind === 'res') G.ress.push(e); }
  if (G.regionDirty && G.time - (G.regionT || 0) > 1) computeRegions();
  rebuildGrid();
  economy(dt);
  for (const u of G.units) if (!u.dead && !u.garrison) updateUnit(u, dt);
  for (const b of G.blds) if (!b.dead) updateBuilding(b, dt);
  separate(dt);
  updateProjectiles(dt);
  for (let i = G.delayed.length - 1; i >= 0; i--) if (G.time >= G.delayed[i].at) { const d = G.delayed.splice(i, 1)[0]; d.fn(); }
  updateBalls(dt);
  for (const P of G.players) if (P.ai && !P.defeated) aiThink(P, dt);
  if (G.scn && G.scn.tick) G.scn.tick(dt);
  G.fogT -= dt; if (G.fogT <= 0) { G.fogT = .25; updateFog(); }
  for (let i = G.fx.length - 1; i >= 0; i--) { G.fx[i].t += dt; if (G.fx[i].t >= G.fx[i].dur) G.fx.splice(i, 1); }
  for (let i = G.texts.length - 1; i >= 0; i--) { const t = G.texts[i]; t.t += dt; if (t.t > 1.5) G.texts.splice(i, 1); }
  for (let i = G.corpses.length - 1; i >= 0; i--) { G.corpses[i].t += dt; if (G.corpses[i].t > 12) G.corpses.splice(i, 1); }
  for (let i = G.ruins.length - 1; i >= 0; i--) { G.ruins[i].t += dt; if (G.ruins[i].t > 60) G.ruins.splice(i, 1); }
  for (let i = G.treeFall.length - 1; i >= 0; i--) { G.treeFall[i].t += dt; if (G.treeFall[i].t > 20) G.treeFall.splice(i, 1); }
  if (G.ents.length > G.units.length + G.blds.length + G.ress.length + 50 || (G.tickN++ % 40) === 0) { G.ents = G.ents.filter(e => { if (e.dead) { G.byId.delete(e.id); return false; } return true; }); }
  checkVictory();
}
function separate(dt) {
  for (const u of G.units) {
    if (u.dead || u.leap || u.garrison) continue;
    const ox = u.x, oy = u.y, team = teamOf(u.owner);
    forUnitsNear(u.x, u.y, u.r + .5, o => {
      if (o === u || o.dead || o.flying !== u.flying || o.leap) return;
      const dx = u.x - o.x, dy = u.y - o.y, d = Math.hypot(dx, dy) || .01, overlap = u.r + o.r - d;
      if (overlap > 0) { const push = Math.min(overlap * .5, .09) * (u.moving && !o.moving ? .35 : 1); u.x += dx / d * push; u.y += dy / d * push; }
    });
    if (!u.flying && !walkableAt(u.x, u.y, team)) { u.x = ox; u.y = oy; if (!walkableAt(u.x, u.y, team)) { const f = freeTileNear(clamp(Math.floor(u.x), 0, MW - 1), clamp(Math.floor(u.y), 0, MH - 1), 5); if (f) { u.x = f.x + .5; u.y = f.y + .5; } } }
    u.x = clamp(u.x, .2, MW - .2); u.y = clamp(u.y, .2, MH - .2);
    if (u.flying && !u.def.alwaysFly) u.lift = Math.min(1, u.lift + dt * 2); else if (!u.def.alwaysFly && !u.leap) u.lift = Math.max(0, u.lift - dt * 3);
    if (u.path && u.order.type !== 'idle') {
      if (Math.hypot(u.x - u.lastPos.x, u.y - u.lastPos.y) < .01) { u.stuckT += dt; if (u.stuckT > 1.2) { u.stuckT = 0; u.path = null; u.wantPath = true; } }
      else u.stuckT = 0;
    }
    u.lastPos.x = u.x; u.lastPos.y = u.y;
  }
}
