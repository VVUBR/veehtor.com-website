// =====================================================================
// 5. COMBAT, HERO ABILITIES, GOD POWERS, DRAGON BALLS
// =====================================================================
function edgeDist(u, e) {
  if (e.kind === 'building' || e.kind === 'res' || e.kind === 'deco') {
    const x0 = e.tx, y0 = e.ty, x1 = x0 + (e.w || 1), y1 = y0 + (e.h || 1);
    const dx = Math.max(x0 - u.x, 0, u.x - x1), dy = Math.max(y0 - u.y, 0, u.y - y1);
    return Math.hypot(dx, dy) - u.r;
  }
  return Math.hypot(e.x - u.x, e.y - u.y) - u.r - (e.r || 0);
}
function buffMul(u, key) {
  let m = 1;
  for (const b of u.buffs) if (b.until > G.time) m *= b[key] || 1;
  const P = G.players[u.owner];
  if (P) for (const b of P.buffs) if (b.until > G.time && (!b.who || whoMatches(u.def, b.who))) m *= b[key] || 1;
  return m;
}
function atkMult(u) { let m = buffMul(u, 'atk'); if (u.kaio) m *= 2; if (u.ape) m *= 2; return m; }
function moveSpeed(u) {
  let s = stats(u).speed * buffMul(u, 'spd');
  if (u.kaio) s *= 2;
  if (u.flying && !u.def.alwaysFly) s *= 1.25;
  if (!u.flying && !u.def.naval) { const tx = Math.floor(u.x), ty = Math.floor(u.y); if (inMap(tx, ty) && G.map.terr[idx(tx, ty)] === T_SHALLOW) s *= .8; }
  return s;
}
function armorOf(e) {
  if (e.kind === 'building') return B[e.key].armor;
  const a = stats(e).armor;
  return e.flying && !e.def.alwaysFly ? [Math.max(0, a[0] - .15), a[1], a[2]] : a;
}
const tagHas = (e, t) => e.kind === 'unit' && e.def.tagset.has(t);
// Global class rules from the design brief, then each attack's own counter bonuses.
function classMult(att, t, atk) {
  let m = 1;
  if (t.kind === 'building') { if (atk && atk.bonus && atk.bonus.building) m *= atk.bonus.building; return m; }
  if (!att || att.kind !== 'unit') return m;
  const ad = att.def, td = t.def;
  if (ad.cls === 'hero') { if (td.cls === 'titan') m *= 2.5; else if (td.cls === 'myth') m *= 4; }
  if (ad.cls === 'myth') { if (td.tagset.has('Human') && td.cls !== 'hero' && td.cls !== 'villager') m *= 2.5; if (td.cls === 'hero') m *= .5; }
  if (ad.tagset.has('Human') && ad.cls !== 'hero' && ad.cls !== 'villager' && td.cls === 'hero') m *= 1.25;
  if (ad.cls === 'villager' && td.cls === 'huntable') m *= 5;
  if (atk && atk.bonus) for (const k in atk.bonus) if (k !== 'building' && (td.cls === k || td.tagset.has(k))) m *= atk.bonus[k];
  return m;
}
function damageAmount(att, t, d, atk) {
  const A = armorOf(t);
  const raw = (d.hack || 0) * (1 - A[0]) + (d.pierce || 0) * (1 - A[1]) + (d.crush || 0) * (1 - A[2]) + (d.divine || 0);
  return raw * classMult(att, t, atk);
}
const scaleDmg = (d, m) => ({ hack: (d.hack || 0) * m, pierce: (d.pierce || 0) * m, crush: (d.crush || 0) * m, divine: (d.divine || 0) * m });
function applyHit(att, t, d, o) {
  o = o || {};
  if (!t || t.dead || t.kind === 'res' || t.kind === 'deco') return 0;
  if (t.kind === 'unit' && (t.leap || t.garrison)) return 0;
  if (t.invuln && t.invuln > G.time) return 0;
  let amt = damageAmount(att, t, d, o.atk) * (o.mult || 1);
  if (amt <= 0) return 0;
  if (t.kind === 'unit' && t.def.cls === 'titan' && t.hp - amt < 1 && !o.ultimate) { amt = Math.max(0, t.hp - 1); t.hp = 1; t.hitFlash = .12; return amt; }
  if (t.kind === 'building' && t.def === undefined && !t.built) amt *= 1.5;
  t.hp -= amt; t.hitFlash = .12;
  if (att && att.owner !== undefined) {
    t.lastHitBy = att.id; t.lastHitAt = G.time;
    if (t.owner > 0) {
      const TP = G.players[t.owner];
      if (TP.human && isEnemy(att.owner, t.owner)) alertAttack(t);
      if (TP.ai) TP.ai.threatAt = { x: att.x, y: att.y, t: G.time };
    }
    const AP = att.owner > 0 && G.players[att.owner];
    if (AP && AP.faction === 'ff' && isEnemy(att.owner, t.owner)) addKi(AP, amt * .006 * (att.kind === 'unit' && att.def.cls === 'hero' ? 2 : 1) * AP.mods.kiRate);
    if (o.lifesteal && att.kind === 'unit' && !att.dead) att.hp = Math.min(maxHp(att), att.hp + amt * o.lifesteal);
  }
  if (t.kind === 'unit' && att && att.kind === 'unit') {
    if ((att.def.cls === 'myth' && t.def.tagset.has('Human') && t.def.cls !== 'hero') || o.knock) knockback(t, att.x, att.y, o.knock ? .9 : .45);
    if (att.def.abilities && att.def.abilities.includes('grab') && t.flying && !t.def.alwaysFly) { land(t, true); t.stun = Math.max(t.stun, 1); floatText(t.x, t.y, 30, 'Grabbed!', '#a6ff8f'); }
    if (t.def.fights && t.order.type === 'idle' || (t.def.cls === 'huntable' && t.def.fights && t.order.type !== 'attack')) setOrder(t, { type: 'attack', tid: att.id });
  }
  if (t.hp <= 0) kill(t, att, o);
  return amt;
}
function addKi(P, n) { P.res.ki = Math.min(P.kiCap, P.res.ki + n); }
function knockback(t, fx, fy, d) {
  if (t.def.cls === 'titan' || t.def.cls === 'hero' || t.def.cls === 'building' || t.def.naval) return;
  const dx = t.x - fx, dy = t.y - fy, l = Math.hypot(dx, dy) || 1;
  const nx = t.x + dx / l * d, ny = t.y + dy / l * d;
  if (t.flying || walkableAt(nx, ny, teamOf(t.owner))) { t.x = nx; t.y = ny; t.path = null; t.wantPath = true; }
}
function aoeHit(att, owner, x, y, radius, d, o) {
  o = o || {};
  let n = 0;
  forUnitsNear(x, y, radius, u => {
    const enemy = isEnemy(owner, u.owner) || (u.owner === 0 && u.def.cls !== 'huntable' && o.gaia !== false) || (o.all && u.owner !== owner);
    if (enemy) { applyHit(att, u, d, o); n++; }
  });
  for (const b of G.blds) if (!b.dead && isEnemy(owner, b.owner) && !o.noBuildings) {
    const dx = Math.max(b.tx - x, 0, x - (b.tx + b.w)), dy = Math.max(b.ty - y, 0, y - (b.ty + b.h));
    if (Math.hypot(dx, dy) <= radius) applyHit(att, b, d, o);
  }
  return n;
}
function lineHit(att, owner, ax, ay, bx, by, width, d, o) {
  const len = Math.hypot(bx - ax, by - ay) || 1;
  forUnitsNear((ax + bx) / 2, (ay + by) / 2, len / 2 + width, u => {
    if (!isEnemy(owner, u.owner) && !(u.owner === 0 && u.def.cls !== 'huntable')) return;
    const t = clamp(((u.x - ax) * (bx - ax) + (u.y - ay) * (by - ay)) / (len * len), 0, 1);
    if (Math.hypot(ax + (bx - ax) * t - u.x, ay + (by - ay) * t - u.y) <= width + u.r) applyHit(att, u, d, o);
  });
  for (const b of G.blds) if (!b.dead && isEnemy(owner, b.owner)) {
    const t = clamp(((b.x - ax) * (bx - ax) + (b.y - ay) * (by - ay)) / (len * len), 0, 1);
    if (Math.hypot(ax + (bx - ax) * t - b.x, ay + (by - ay) * t - b.y) <= width + b.r) applyHit(att, b, d, o);
  }
}
function kill(e, killer, o) {
  if (e.dead) return;
  o = o || {};
  e.dead = true;
  const P = G.players[e.owner];
  const KP = killer && killer.owner > 0 ? G.players[killer.owner] : null;
  if (KP && e.owner !== killer.owner) { KP.stats.kills++; if (e.kind === 'building') KP.stats.killedB++; if (KP.faction === 'ff' && e.kind === 'unit') addKi(KP, (e.def.cls === 'myth' || e.def.cls === 'hero' ? 3 : .5) * KP.mods.kiRate); }
  if (G.scn && G.scn.onKill) G.scn.onKill(e, killer);
  if (e.kind === 'unit') {
    if (e.carryBall) dropBall(e);
    if (e.carryRelic) dropRelic(e);
    if (P && e.owner > 0) P.stats.lost++;
    if (e.def.cls === 'hero' && P) {
      P.heroDead[e.key] = e.form || true;
      if (P.human) toast(`${stats(e).name} has fallen. You can train ${e.def.name} again.`, 'warn');
      else if (G.me && isEnemy(G.me, e.owner)) toast(`Enemy hero ${stats(e).name} has fallen!`, 'good');
    }
    if (e.def.cls === 'titan') announce(P && P.human ? 'Kid Buu is gone' : 'Kid Buu destroyed!');
    if (e.def.carcass && !o.absorbed) addCarcass(e.x, e.y, e.def.carcass);
    if (!o.absorbed && !o.silent) G.corpses.push({ x: e.x, y: e.y, key: e.key, form: e.form, owner: e.owner, dir: e.dir, t: 0, ape: e.ape });
    fxPush({ type: 'puff', x: e.x, y: e.y, z: 0, t: 0, dur: .6, color: o.absorbed ? '#9cff57' : '#ffffff', r: e.r * 3 });
    SFX.play('death', e.x, e.y);
    G.sel = G.sel.filter(s => s !== e);
  } else if (e.kind === 'building') {
    freeBuildingTiles(e);
    for (const uid of e.garrisoned) { const u = G.byId.get(uid); if (u && !u.dead) ejectUnit(u, e); }
    e.garrisoned = [];
    for (const bid of e.balls) { const b = G.balls.find(x => x.id === bid); if (b) { b.state = 'ground'; b.temple = 0; b.x = e.x + (rnd() - .5) * 2; b.y = e.y + (rnd() - .5) * 2; } }
    if (e.balls.length && P && P.human) toast('Your Temple fell. Its Dragon Balls spilled onto the ground!', 'warn');
    e.balls = [];
    if (e.relics.length) {
      for (const rid of e.relics) { const r = G.relics.find(x => x.id === rid); if (r) Object.assign(r, { state: 'ground', temple: 0, x: e.x + (rnd() - .5) * 2.4, y: e.y + (rnd() - .5) * 2.4 }); }
      e.relics = [];
      if (P) recomputeMods(P);
      if (P && P.human) toast('Your Temple fell. Its relics lie in the rubble!', 'warn');
    }
    if (e.farmer) { const f = byId(e.farmer); if (f) idleOrder(f); }
    G.ruins.push({ key: e.key, tx: e.tx, ty: e.ty, w: e.w, h: e.h, x: e.x, y: e.y, t: 0, fac: e.fac });
    fxPush({ type: 'boom', x: e.x, y: e.y, z: 0, t: 0, dur: 1, color: '#ffb347', r: e.w * .9 });
    for (let i = 0; i < 6; i++) fxPush({ type: 'boom', x: e.tx + rnd() * e.w, y: e.ty + rnd() * e.h, z: 0, t: -i * .12, dur: .7, color: '#ffcf8a', r: .9 });
    SFX.play('collapse', e.x, e.y);
    G.sel = G.sel.filter(s => s !== e);
    if (P && P.human && !B[e.key].wall) toast(`${e.name} destroyed.`, 'warn');
    if (e.key === 'wonder' && P) P.wonderSince = 0;
    G.chunkDirtyAll = true;
  }
}
function addCarcass(x, y, amount) {
  return addEnt({ kind: 'res', key: 'carcass', owner: -1, tx: Math.floor(x), ty: Math.floor(y), w: 1, h: 1, x, y, r: .4, amount, max: amount, v: rnd() });
}

// ---------- projectiles ----------
const PROJ_SPEED = { ki: 16, bullet: 22, shell: 11, pod: 10, acid: 12, kame: 14, cellki: 15, beam: 30, arrow: 18 };
function fire(u, t, rg) {
  const d = scaleDmg({ pierce: rg.pierce || 0, crush: rg.crush || 0, hack: rg.hack || 0 }, atkMult(u));
  const kind = rg.proj || 'ki', arc = kind === 'shell' || kind === 'pod';
  const z0 = u.flying ? 46 : 18 * (u.def.look && u.def.look.scale || 1);
  const tx = t.x, ty = t.y, dd = Math.hypot(tx - u.x, ty - u.y);
  G.projs.push({ x: u.x, y: u.y, z: z0, sx: u.x, sy: u.y, sz: z0, tx, ty, tid: t.id, t: 0, dur: Math.max(.08, dd / PROJ_SPEED[kind]), d, aoe: (rg.aoe || 0) * MT, att: u.id, owner: u.owner, kind, arc, atk: rg, lifesteal: rg.lifesteal });
  SFX.play(kind === 'bullet' ? 'shot' : kind === 'shell' || kind === 'pod' ? 'boom' : 'blast', u.x, u.y);
}
function fireFrom(b, t, atk) {
  const tx = t.x, ty = t.y, dd = Math.hypot(tx - b.x, ty - b.y), P = G.players[b.owner];
  const kind = P && P.faction === 'rr' ? 'bullet' : 'ki';
  G.projs.push({ x: b.x, y: b.y, z: 50, sx: b.x, sy: b.y, sz: 50 + b.w * 6, tx, ty, tid: t.id, t: 0, dur: Math.max(.08, dd / PROJ_SPEED[kind]), d: { pierce: atk.pierce }, aoe: 0, att: b.id, owner: b.owner, kind });
}
function updateProjectiles(dt) {
  for (let i = G.projs.length - 1; i >= 0; i--) {
    const p = G.projs[i];
    const t = byId(p.tid);
    if (t && !p.arc) { p.tx = t.x; p.ty = t.y; }
    p.t += dt;
    const k = Math.min(1, p.t / p.dur);
    p.x = lerp(p.sx, p.tx, k); p.y = lerp(p.sy, p.ty, k);
    const tz = t && t.flying ? 46 : 14;
    p.z = p.arc ? lerp(p.sz, 6, k) + Math.sin(k * Math.PI) * (40 + p.dur * 30) : lerp(p.sz, tz, k);
    if (k >= 1) {
      const att = byId(p.att) || { kind: 'ghost', owner: p.owner, id: p.att, x: p.sx, y: p.sy };
      if (p.aoe) { aoeHit(att.kind === 'ghost' ? null : att, p.owner, p.tx, p.ty, p.aoe, p.d, { atk: p.atk, ultimate: p.ult }); fxPush({ type: 'boom', x: p.tx, y: p.ty, z: 0, t: 0, dur: .5, color: p.kind === 'kame' ? '#9fe8ff' : p.kind === 'shell' || p.kind === 'pod' ? '#ffb347' : '#e6ff8a', r: Math.max(.8, p.aoe) }); if (p.arc) SFX.play('boom', p.tx, p.ty); }
      else if (t && Math.hypot(t.x - p.tx, t.y - p.ty) < 1.5 + (t.r || 0)) applyHit(att.kind === 'ghost' ? null : att, t, p.d, { atk: p.atk, ultimate: p.ult, lifesteal: p.lifesteal });
      if (!p.aoe) fxPush({ type: 'spark', x: p.tx, y: p.ty, z: p.z, t: 0, dur: .25, color: p.kind === 'bullet' ? '#ffd166' : '#bff2ff', r: .4 });
      G.projs.splice(i, 1);
    }
  }
}

// ---------- melee and specials ----------
function meleeStrike(u, t, mel) {
  const d = scaleDmg({ hack: mel.hack || 0, crush: mel.crush || 0, pierce: mel.pierce || 0 }, atkMult(u));
  if (mel.aoe) { aoeHit(u, u.owner, t.x, t.y, mel.aoe * MT, d, { atk: mel, gaia: t.owner === 0 }); fxPush({ type: 'shock', x: t.x, y: t.y, z: 0, t: 0, dur: .35, color: '#ffd6f5', r: mel.aoe * MT }); }
  else applyHit(u, t, d, { atk: mel });
  fxPush({ type: 'spark', x: (u.x + t.x) / 2, y: (u.y + t.y) / 2, z: 18, t: 0, dur: .2, color: '#ffffff', r: .35 });
  SFX.play('punch', u.x, u.y);
}
function doSpecial(u, t, sp) {
  u.spCd = sp.cd * (u.def.cls === 'hero' ? 1 : 1);
  u.atkT = .6; u.anim = 'cast';
  const d = scaleDmg(sp.dmg || {}, atkMult(u));
  floatText(u.x, u.y, 44, sp.name + '!', '#ffe066');
  SFX.play('power', u.x, u.y);
  const col = sp.color || '#7fe0ff', o = { ultimate: true, knock: true };
  if (sp.warp) {
    const a = Math.atan2(t.y - u.y, t.x - u.x), nx = t.x + Math.cos(a) * (t.r + u.r + .3), ny = t.y + Math.sin(a) * (t.r + u.r + .3);
    fxPush({ type: 'flash', x: u.x, y: u.y, z: 20, t: 0, dur: .25, color: '#ffffff', r: 1 });
    if (u.flying || walkableAt(nx, ny, teamOf(u.owner))) { u.x = nx; u.y = ny; }
  }
  if (sp.type === 'strike') {
    fxPush({ type: 'beam', x1: u.x, y1: u.y, z1: u.flying ? 46 : 22, x2: t.x, y2: t.y, z2: 10, t: 0, dur: .45, color: col, w: 14 });
    aoeHit(u, u.owner, t.x, t.y, sp.radius * MT * 2, d, o);
    fxPush({ type: 'boom', x: t.x, y: t.y, z: 0, t: 0, dur: .7, color: col, r: sp.radius * MT * 2 });
  } else if (sp.type === 'line') {
    const a = Math.atan2(t.y - u.y, t.x - u.x), L = sp.range * MT, ex = u.x + Math.cos(a) * L, ey = u.y + Math.sin(a) * L;
    fxPush({ type: sp.dash ? 'dragon' : 'beam', x1: u.x, y1: u.y, z1: u.flying ? 46 : 22, x2: ex, y2: ey, z2: 16, t: 0, dur: .8, color: col, w: 10 + sp.width * 8 });
    lineHit(u, u.owner, u.x, u.y, ex, ey, sp.width * MT * 2, d, o);
    if (sp.dash) { const fx = u.x + Math.cos(a) * L * .9, fy = u.y + Math.sin(a) * L * .9; if (u.flying || walkableAt(fx, fy, teamOf(u.owner))) { u.x = fx; u.y = fy; } }
  } else if (sp.type === 'bolt') {
    fxPush({ type: 'beam', x1: u.x, y1: u.y, z1: u.flying ? 46 : 24, x2: t.x, y2: t.y, z2: 16, t: 0, dur: .5, color: col, w: 6, spiral: sp.key === 'sbc' });
    applyHit(u, t, d, o);
  } else if (sp.type === 'stun') {
    fxPush({ type: 'flash', x: t.x, y: t.y, z: 10, t: 0, dur: .6, color: col, r: sp.radius * MT * 2 });
    forUnitsNear(t.x, t.y, sp.radius * MT * 2, e => { if (isEnemy(u.owner, e.owner) && e.def.cls !== 'titan') e.stun = Math.max(e.stun, sp.dur); });
  } else if (sp.type === 'nova') {
    fxPush({ type: 'shock', x: u.x, y: u.y, z: 0, t: 0, dur: .6, color: col, r: sp.radius * MT * 2 });
    aoeHit(u, u.owner, u.x, u.y, sp.radius * MT * 2, d, o);
  }
}
function startLeap(u, t) { u.leap = { t: 0, dur: .6, sx: u.x, sy: u.y, tx: t.x, ty: t.y }; u.path = null; }
function updateLeap(u, dt) {
  const L = u.leap; L.t += dt;
  const k = Math.min(1, L.t / L.dur);
  u.x = lerp(L.sx, L.tx, k); u.y = lerp(L.sy, L.ty, k); u.lift = Math.sin(k * Math.PI);
  if (k >= 1) {
    const lp = stats(u).leap;
    u.leap = null;
    aoeHit(u, u.owner, u.x, u.y, lp.aoe * MT, scaleDmg({ hack: lp.hack, crush: lp.crush }, atkMult(u)), {});
    fxPush({ type: 'boom', x: u.x, y: u.y, z: 0, t: 0, dur: .7, color: '#b6ff5c', r: lp.aoe * MT });
    SFX.play('boom', u.x, u.y);
    kill(u, null, { absorbed: true });
  }
}

// ---------- flight, Kaio-ken, forms, absorption ----------
const canFly = u => u.kind === 'unit' && u.def.flyer && !u.def.alwaysFly;
function toggleFlight(u) {
  if (!canFly(u)) return;
  if (u.flying) { land(u, false); return; }
  if (G.players[u.owner].res.ki < 1) { if (G.players[u.owner].human) toast('Not enough Ki to fly.', 'warn'); return; }
  u.kaio = false; u.flying = true; u.path = null; u.wantPath = true;
}
function land(u, forced) {
  if (!u.flying || u.def.alwaysFly) return;
  u.flying = false;
  const team = teamOf(u.owner);
  if (!walkableAt(u.x, u.y, team)) { const f = freeTileNear(clamp(Math.floor(u.x), 0, MW - 1), clamp(Math.floor(u.y), 0, MH - 1), 12); if (f) { u.x = f.x + .5; u.y = f.y + .5; } }
  u.path = null; u.wantPath = true;
  if (forced) fxPush({ type: 'shock', x: u.x, y: u.y, z: 0, t: 0, dur: .4, color: '#ffffff', r: .8 });
}
function toggleKaioken(u) {
  if (!stats(u).kaioken) return;
  if (u.kaio) { u.kaio = false; return; }
  const P = G.players[u.owner];
  if (u.flying) { if (P.human) toast('Land first: Kaio-ken works on the ground.', 'warn'); return; }
  if (u.hp < maxHp(u) * .2) { if (P.human) toast(`${stats(u).name} is too hurt for Kaio-ken.`, 'warn'); return; }
  u.kaio = true; floatText(u.x, u.y, 44, 'Kaio-ken!', '#ff6b6b');
}
function setForm(u, form, full) {
  const ratio = u.hp / maxHp(u);
  u.form = form; u.kaio = false;
  u.hp = full ? maxHp(u) : maxHp(u) * ratio;
  fxPush({ type: 'aura', uid: u.id, x: u.x, y: u.y, z: 0, t: 0, dur: 1.6, color: form.startsWith('cell') ? '#9cff57' : form.startsWith('frieza') ? '#ff6bd5' : '#ffd84a' });
  SFX.play('power', u.x, u.y);
}
function cellAbsorb(u, dt) {
  u.absCd -= dt; if (u.absCd > 0) return;
  u.absCd = .5;
  let victim = null, best = 1e9;
  forUnitsNear(u.x, u.y, u.r + 1.6, e => {
    if (!isEnemy(u.owner, e.owner) || e.def.cls === 'hero' || e.def.cls === 'titan' || !e.def.tagset.has('Biological') || e.leap) return;
    if (e.hp > maxHp(e) * .35) return;
    const d = Math.hypot(e.x - u.x, e.y - u.y); if (d < best) { best = d; victim = e; }
  });
  if (!victim) return;
  const heal = maxHp(victim) * .25;
  fxPush({ type: 'tail', x1: u.x, y1: u.y, x2: victim.x, y2: victim.y, t: 0, dur: .5 });
  kill(victim, u, { absorbed: true });
  u.hp = Math.min(maxHp(u), u.hp + heal);
  u.biomass++; u.absCd = 4;
  floatText(u.x, u.y, 40, '+1 Biomass', '#b8ff6b');
  const stage = CELL_FORMS.indexOf(u.form);
  if (stage === 0 && u.biomass >= 8) evolveCell(u, 1);
  else if (stage === 1 && u.biomass >= 16) evolveCell(u, 2);
}
function evolveCell(u, stage) {
  setForm(u, CELL_FORMS[stage], true);
  const P = G.players[u.owner]; P.cellStage = Math.max(P.cellStage, stage);
  if (P.human) announce(stage === 2 ? 'Perfect Cell!' : 'Semi-Perfect Cell!');
  else if (G.me && isEnemy(G.me, u.owner)) toast(`Enemy Cell evolved into ${FORMS[CELL_FORMS[stage]].name}!`, 'warn');
}

// ---------- god powers ----------
function powerReady(P, key) { const p = P.powers[key]; return p && p.state === 'ready'; }
function nearestOwnAnchor(P, x, y) {
  let best = null, bd = 1e9;
  for (const b of G.blds) if (!b.dead && b.owner === P.id && b.key === 'tc') { const d = dist(b.x, b.y, x, y); if (d < bd) { bd = d; best = b; } }
  if (!best) for (const u of G.units) if (u.owner === P.id) { const d = dist(u.x, u.y, x, y); if (d < bd) { bd = d; best = u; } }
  return best || { x: x - 10, y: y - 10 };
}
function castPower(P, key, x, y) {
  if (!powerReady(P, key)) return false;
  const pw = POW[key];
  if (key === 'shenron') { summonShenron(P); return true; }
  if (pw.type === 'bolt' || pw.type === 'convert') {
    let tgt = null, bd = 1.6;
    forUnitsNear(x, y, 2, e => { if (!isEnemy(P.id, e.owner)) return; if (pw.type === 'convert' && (e.def.cls === 'hero' || e.def.cls === 'titan')) return; const d = dist(e.x, e.y, x, y); if (d < bd) { bd = d; tgt = e; } });
    if (!tgt) { if (P.human) { toast(pw.type === 'convert' ? 'Choose an enemy unit (not a hero or Titan).' : 'Choose an enemy unit.', 'warn'); SFX.play('error'); } return false; }
    P.powers[key].state = 'used';
    if (pw.type === 'bolt') {
      const strong = tgt.def.cls === 'hero' || tgt.def.cls === 'titan';
      fxPush({ type: 'skybolt', x: tgt.x, y: tgt.y, t: 0, dur: .6, color: pw.color });
      applyHit({ kind: 'power', owner: P.id, id: 0, x: tgt.x, y: tgt.y }, tgt, { divine: strong && pw.heroDmg ? pw.heroDmg : pw.dmg }, { ultimate: true });
    } else {
      fxPush({ type: 'aura', uid: tgt.id, x: tgt.x, y: tgt.y, t: 0, dur: 1.4, color: pw.color });
      if (tgt.carryBall) dropBall(tgt);
      tgt.owner = P.id; idleOrder(tgt); tgt.queue = [];
      G.sel = G.sel.filter(s => s !== tgt);
    }
  } else {
    P.powers[key].state = 'used';
    const r = (pw.radius || 0) * MT * 2;
    const ownIn = fn => forUnitsNear(x, y, r, u => { if (u.owner === P.id) fn(u); });
    switch (pw.type) {
      case 'heal': fxPush({ type: 'rain', x, y, t: 0, dur: 1.4, color: pw.color, r }); ownIn(u => { u.hp = maxHp(u); }); break;
      case 'globalHeal': for (const u of G.units) if (u.owner === P.id) u.hp = maxHp(u); for (const b of G.blds) if (b.owner === P.id && b.built) b.hp = maxHp(b); fxPush({ type: 'screen', t: 0, dur: 1, color: 'rgba(160,255,140,.25)' }); break;
      case 'buff': ownIn(u => { u.buffs.push({ until: G.time + pw.dur, atk: pw.atk, spd: pw.spd }); }); fxPush({ type: 'shock', x, y, z: 0, t: 0, dur: .8, color: pw.color, r }); break;
      case 'heroBuff': for (const u of G.units) if (u.owner === P.id && u.def.cls === 'hero') { u.hp = maxHp(u); u.buffs.push({ until: G.time + pw.dur, atk: pw.atk }); fxPush({ type: 'aura', uid: u.id, x: u.x, y: u.y, t: 0, dur: 1.5, color: pw.color }); } break;
      case 'repair': ownIn(u => { if (u.def.tagset.has('Mech')) u.hp = maxHp(u); }); for (const b of G.blds) if (b.owner === P.id && b.built && dist(b.x, b.y, x, y) < r + b.r) b.hp = maxHp(b); fxPush({ type: 'shock', x, y, z: 0, t: 0, dur: .8, color: pw.color, r }); break;
      case 'stun': fxPush({ type: 'flash', x, y, z: 10, t: 0, dur: .9, color: pw.color, r: r * 1.2 }); forUnitsNear(x, y, r, u => { if (isEnemy(P.id, u.owner) && u.def.cls !== 'titan') { u.stun = Math.max(u.stun, pw.dur); } }); break;
      case 'grant': for (const k in pw.res) P.res[k] += pw.res[k]; fxPush({ type: 'screen', t: 0, dur: .8, color: 'rgba(255,211,77,.18)' }); break;
      case 'drain': { let n = 0; forUnitsNear(x, y, r, u => { if (isEnemy(P.id, u.owner) && u.def.cls !== 'titan') { u.hp -= u.hp * pw.frac; n++; u.hitFlash = .3; } }); addKi(P, n * .5); fxPush({ type: 'shock', x, y, z: 0, t: 0, dur: 1, color: pw.color, r }); break; }
      case 'apes': ownIn(u => { if (u.def.tagset.has('Saiyan') && u.def.cls !== 'hero' && u.def.cls !== 'myth' && !u.ape) { const ratio = u.hp / maxHp(u); u.ape = G.time + pw.dur; u.r *= 2.2; u.hp = maxHp(u) * ratio; fxPush({ type: 'aura', uid: u.id, x: u.x, y: u.y, t: 0, dur: 1.2, color: '#fff3c4' }); } }); fxPush({ type: 'moon', t: 0, dur: 3 }); break;
      case 'summon': {
        let i = 0;
        for (const [k, n] of pw.units) for (let j = 0; j < n; j++, i++) {
          const a = i * 2.4, rr = .6 + i * .18; let ux = x + Math.cos(a) * rr, uy = y + Math.sin(a) * rr;
          if (!walkableAt(ux, uy, P.team)) { const f = freeTileNear(clamp(Math.floor(ux), 0, MW - 1), clamp(Math.floor(uy), 0, MH - 1), 6); if (f) { ux = f.x + .5; uy = f.y + .5; } }
          const s = spawnUnit(k, P.id, ux, uy); s.lift = 0;
          fxPush({ type: key === 'saibaharvest' ? 'sprout' : 'capsule', x: ux, y: uy, z: 0, t: -i * .06, dur: .7, color: pw.color });
        }
        break;
      }
      case 'strike': fxPush({ type: pw.visual || 'skyball', x, y, t: 0, dur: pw.delay + .6, r, color: pw.color });
        G.delayed.push({ at: G.time + pw.delay, fn: () => {
          forUnitsNear(x, y, r, u => { if (isEnemy(P.id, u.owner) || (u.owner === 0 && u.def.cls === 'guard')) applyHit({ kind: 'power', owner: P.id, id: 0, x, y }, u, u.def.cls === 'titan' && pw.titanKill ? { divine: 99999 } : pw.dmg, { ultimate: true }); });
          for (const b of G.blds) if (!b.dead && isEnemy(P.id, b.owner) && dist(b.x, b.y, x, y) < r + b.r) applyHit(null, b, pw.dmg, {});
          fxPush({ type: 'boom', x, y, z: 0, t: 0, dur: 1.3, color: pw.color, r: r * 1.1 }); SFX.play('boom', x, y);
        } });
        break;
      case 'line': case 'bombs': {
        const A = nearestOwnAnchor(P, x, y), a = Math.atan2(y - A.y, x - A.x), L = pw.length * MT;
        const ax = x - Math.cos(a) * L / 2, ay = y - Math.sin(a) * L / 2, bx = x + Math.cos(a) * L / 2, by = y + Math.sin(a) * L / 2;
        if (pw.type === 'line') {
          fxPush({ type: 'beam', x1: ax, y1: ay, z1: 30, x2: bx, y2: by, z2: 10, t: -pw.delay, dur: pw.delay + .9, color: pw.color, w: 34, charge: true });
          G.delayed.push({ at: G.time + pw.delay, fn: () => { lineHit({ kind: 'power', owner: P.id, id: 0, x, y }, P.id, ax, ay, bx, by, pw.width * MT * 2, pw.dmg, { ultimate: true, knock: true }); SFX.play('boom', x, y); } });
        } else {
          fxPush({ type: 'bombers', x1: ax, y1: ay, x2: bx, y2: by, t: 0, dur: 2.4 });
          for (let i = 0; i < pw.count; i++) {
            const k = (i + .5) / pw.count, px = lerp(ax, bx, k), py = lerp(ay, by, k);
            G.delayed.push({ at: G.time + .6 + i * .22, fn: () => { aoeHit({ kind: 'power', owner: P.id, id: 0, x: px, y: py }, P.id, px, py, pw.aoe * MT * 2, pw.dmg, {}); fxPush({ type: 'boom', x: px, y: py, z: 0, t: 0, dur: .7, color: '#ffb347', r: pw.aoe * MT * 2 }); SFX.play('boom', px, py); } });
          }
        }
        break;
      }
    }
  }
  SFX.play('power', x, y);
  if (P.human) announce(pw.name + '!');
  else if (G.me) toast(`${isEnemy(G.me, P.id) ? 'An enemy' : 'An ally'} used ${pw.name}!`, isEnemy(G.me, P.id) ? 'warn' : '');
  return true;
}

// ---------- relics ----------
const relicsOf = pid => (G.relics || []).filter(r => r.state === 'temple' && byId(r.temple) && byId(r.temple).owner === pid);
function setupRelics(bases) {
  G.relics = [];
  const keys = shuffle(Object.keys(RELICS)), n = Math.min(keys.length, 4 + 2 * (G.players.length - 1));
  const home = bases && bases[0] ? regionAt(bases[0].x, bases[0].y) : 0;
  const spots = [];
  for (let t = 0; t < 4000 && spots.length < n; t++) {
    const x = rint(4, MW - 5), y = rint(4, MH - 5);
    if (G.map.block[idx(x, y)] || G.map.terr[idx(x, y)] === T_SHALLOW || G.map.settle[idx(x, y)]) continue;
    if (home && G.region[idx(x, y)] !== home) continue;
    if ((bases || []).some(b => dist(b.x, b.y, x, y) < 20) || G.camps.some(c => dist(c.x, c.y, x, y) < 6) || G.settlements.some(s => dist(s.tx + 2, s.ty + 2, x, y) < 6) || spots.some(s => dist(s.x, s.y, x, y) < 12)) continue;
    if (G.korin && dist(x, y, MW / 2, MH / 2) < 8) continue;
    spots.push({ x, y });
  }
  spots.forEach((s, i) => G.relics.push({ id: 910000 + i, key: keys[i], state: 'ground', x: s.x + .5, y: s.y + .5, holder: 0, temple: 0 }));
}
function pickUpRelic(u, r) {
  r.state = 'carried'; r.holder = u.id; u.carryRelic = r.id;
  if (G.players[u.owner].human) toast(`${stats(u).name} picked up the ${RELICS[r.key].name}. Bring it to a Temple: ${RELICS[r.key].desc}`, 'gold');
  SFX.play('select', u.x, u.y);
}
function dropRelic(u) {
  const r = G.relics.find(q => q.id === u.carryRelic);
  u.carryRelic = 0;
  if (!r) return;
  let x = u.x, y = u.y;
  if (!walkableAt(x, y, -2)) { const f = freeTileNear(clamp(Math.floor(x), 0, MW - 1), clamp(Math.floor(y), 0, MH - 1), 8); if (f) { x = f.x + .5; y = f.y + .5; } }
  Object.assign(r, { state: 'ground', holder: 0, x, y });
}
function depositRelic(u, t) {
  const r = G.relics.find(q => q.id === u.carryRelic);
  if (!r) { u.carryRelic = 0; return; }
  if (t.relics.length >= RELIC_CAP) { if (G.players[u.owner].human) toast(`${t.name} already holds ${RELIC_CAP} relics.`, 'warn'); return; }
  u.carryRelic = 0;
  Object.assign(r, { state: 'temple', temple: t.id, holder: 0 }); t.relics.push(r.id);
  const P = G.players[t.owner];
  recomputeMods(P);
  if (P.human) toast(`${RELICS[r.key].name} placed in ${t.name}: ${RELICS[r.key].desc}`, 'good');
  else if (G.me && isEnemy(G.me, P.id)) toast(`The enemy placed the ${RELICS[r.key].name} in a Temple.`, 'warn');
  SFX.play('research', u.x, u.y);
}
function updateRelics() {
  for (const r of G.relics) if (r.state === 'carried') { const h = byId(r.holder); if (h) { r.x = h.x; r.y = h.y; } else r.state = 'ground'; }
}

// ---------- Dragon Balls and Shenron ----------
function setupBalls() {
  G.balls = [];
  if (!G.opts.dragonBalls) return;
  const order = shuffle([0, 1, 2, 3, 4, 5, 6]);
  for (let i = 0; i < 7; i++) { const c = G.camps[order[i]]; G.balls.push({ id: 900000 + i, star: i + 1, state: 'ground', x: c.x + .5, y: c.y + .5, holder: 0, temple: 0, camp: order[i] }); }
  spawnGuards();
}
function spawnGuards() {
  G.camps.forEach((c, i) => {
    const alive = G.ents.filter(u => u.kind === 'unit' && !u.dead && u.def.cls === 'guard' && u.campIdx === i).length;
    const spots = [[2, 1], [-2, -1], [1, -2]], keys = ['trex', 'sentry', 'trex'];
    const n = dist(c.x, c.y, MW / 2, MH / 2) < MW * .18 ? 3 : 2;
    for (let k = alive; k < n; k++) {
      const f = freeTileNear(c.x + spots[k][0], c.y + spots[k][1], 3);
      if (!f) continue;
      const g = spawnUnit(keys[k], 0, f.x + .5, f.y + .5); g.campIdx = i;
    }
  });
}
function pickUpBall(u, ball) {
  if (u.carryRelic) return;
  ball.state = 'carried'; ball.holder = u.id; u.carryBall = ball.id;
  const P = G.players[u.owner];
  if (P.human) toast(`${stats(u).name} picked up the ${ball.star}-Star Dragon Ball. Bring it to your Temple.`, 'gold');
  SFX.play('select', u.x, u.y);
}
function dropBall(u) {
  const ball = G.balls.find(b => b.id === u.carryBall);
  u.carryBall = 0;
  if (!ball) return;
  ball.state = 'ground'; ball.holder = 0;
  let x = u.x, y = u.y;
  if (!walkableAt(x, y, -2)) { const f = freeTileNear(clamp(Math.floor(x), 0, MW - 1), clamp(Math.floor(y), 0, MH - 1), 8); if (f) { x = f.x + .5; y = f.y + .5; } }
  ball.x = x; ball.y = y;
}
function depositBall(u, t) {
  const ball = G.balls.find(b => b.id === u.carryBall);
  u.carryBall = 0;
  if (!ball) return;
  ball.state = 'temple'; ball.temple = t.id; ball.holder = 0; t.balls.push(ball.id);
  const P = G.players[u.owner];
  P.stats.balls++;
  if (G.scn && G.scn.onDeposit) G.scn.onDeposit(u, t, ball);
  if (P.human) toast(`The ${ball.star}-Star Dragon Ball is safe in ${t.name}.`, 'good');
  else if (G.me && isEnemy(G.me, P.id)) toast(`The enemy secured the ${ball.star}-Star Dragon Ball.`, 'warn');
  SFX.play('build', u.x, u.y);
}
function ballsHeld(pid) { let n = 0; for (const b of G.balls) if (b.state === 'temple') { const t = byId(b.temple); if (t && t.owner === pid) n++; } return n; }
function updateBalls(dt) {
  for (const b of G.balls) if (b.state === 'carried') { const h = byId(b.holder); if (h) { b.x = h.x; b.y = h.y; } else { b.state = 'ground'; b.holder = 0; } }
  if (!G.balls.length) return;
  if (G.stoneUntil) {
    if (G.time >= G.stoneUntil) {
      G.stoneUntil = 0;
      const camps = shuffle([0, 1, 2, 3, 4, 5, 6]);
      G.balls.forEach((b, i) => { const c = G.camps[camps[i]]; Object.assign(b, { state: 'ground', x: c.x + .5, y: c.y + .5, camp: camps[i], temple: 0, holder: 0 }); });
      spawnGuards();
      toast('The Dragon Balls have turned back from stone. The hunt is on again!', 'gold');
    }
    return;
  }
  for (const P of G.players) {
    if (!P.id || P.defeated) continue;
    const n = ballsHeld(P.id); if (!n) continue;
    addKi(P, n * .12 * dt); P.res.gold += n * .4 * dt;
  }
  if (G.wishPending) return;
  const owner = G.shenronOwner;
  if (!owner) {
    for (const P of G.players) if (P.id && ballsHeld(P.id) >= 7) {
      G.shenronOwner = P.id; P.powers.shenron = { state: 'ready' };
      announce('The sky grows dark…');
      if (P.human) toast('All seven Dragon Balls are yours! Use "Summon Shenron".', 'gold');
      else if (G.me && isEnemy(G.me, P.id)) toast('The enemy has all seven Dragon Balls! Destroy their Temple before they wish!', 'warn');
    }
  } else if (ballsHeld(owner) < 7) {
    delete G.players[owner].powers.shenron; G.shenronOwner = 0;
    toast('A Dragon Ball was lost. The sky clears.', 'gold');
  }
}
function summonShenron(P) {
  if (G.shenronOwner !== P.id || !powerReady(P, 'shenron')) return;
  P.powers.shenron.state = 'used';
  G.wishPending = P.id;
  fxPush({ type: 'shenron', t: 0, dur: 6 });
  SFX.play('wish');
  if (P.isAI) grantWish(P, Object.keys(P.heroDead).length ? 'immortal' : (P.res.gold < 600 ? 'wealth' : (Object.values(P.powers).some(p => p.state === 'used') ? 'youth' : 'wealth')));
  else if (P.human) openWish();
}
function grantWish(P, w) {
  P.stats.wishes++;
  if (w === 'immortal') {
    P.immortal = true;
    const home = G.blds.find(b => !b.dead && b.owner === P.id && b.key === 'temple' && b.built) || G.blds.find(b => !b.dead && b.owner === P.id && b.key === 'tc');
    if (home) for (const key in P.heroDead) {
      if (G.units.some(u => u.owner === P.id && u.key === key)) continue;
      for (const b of G.blds) if (b.owner === P.id) b.queue = b.queue.filter(q => q.key !== key);
      spawnNear(home, key, P.id);
    }
    P.heroDead = {};
  } else if (w === 'wealth') { P.res.food += 1500; P.res.wood += 1500; P.res.gold += 1500; addKi(P, 100); }
  else if (w === 'youth') { for (const k in P.powers) if (P.powers[k].state === 'used' && k !== 'shenron') P.powers[k].state = 'ready'; }
  const label = { immortal: 'Immortality', wealth: 'Ultimate Wealth', youth: 'Restored Youth' }[w];
  announce(P.human ? 'Your wish is granted!' : 'A wish was granted!');
  toast(`${P.human ? 'You' : P.name} wished for ${label}. The Dragon Balls turn to stone for 3 minutes.`, P.human ? 'good' : 'warn');
  for (const b of G.balls) { if (b.state === 'temple') { const t = byId(b.temple); if (t) t.balls = t.balls.filter(x => x !== b.id); } if (b.state === 'carried') { const h = byId(b.holder); if (h) h.carryBall = 0; } b.state = 'stone'; b.holder = 0; b.temple = 0; }
  G.stoneUntil = G.time + 180;
  G.shenronOwner = 0; G.wishPending = 0;
  delete P.powers.shenron;
}
