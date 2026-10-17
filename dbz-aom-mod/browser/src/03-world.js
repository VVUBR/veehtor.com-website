// =====================================================================
// 3. WORLD: state, players, stat modifiers, entities, map generation
// =====================================================================
const T_GRASS = 0, T_DIRT = 1, T_SAND = 2, T_SHALLOW = 3, T_WATER = 4, T_ROCK = 5, T_SNOW = 6, T_ROAD = 7;
const G = { started: false };
let MW = 96, MH = 96;
const inMap = (x, y) => x >= 0 && y >= 0 && x < MW && y < MH;
const idx = (x, y) => y * MW + x;
const tOf = Math.floor;

// ---------- players ----------
function makePlayer(id, o) {
  const F = FACTIONS[o.faction];
  const P = {
    id, name: o.name || (o.ai ? 'Computer' : 'You'), team: o.team || id, faction: o.faction, color: o.color || id, isAI: !!o.ai, human: !o.ai && id === 1,
    major: o.major || F.majors[0], minors: [], res: { food: 300, wood: 300, gold: 150, ki: 0 }, age: 1, techs: new Set(), pop: 0, qpop: 0, popCap: 0,
    powers: {}, heroDead: {}, immortal: false, buffs: [], stats: { kills: 0, lost: 0, balls: 0, wishes: 0, built: 0, gathered: 0, killedB: 0 },
    defeated: false, ai: null, lastAlert: -99, mods: null, statCache: {}, market: { food: 100, wood: 100 }, kiGainT: 0, cellStage: 0, wonderSince: 0,
  };
  P.kiCap = F.kiCap;
  P.powers[PATRONS[P.major].power] = { state: 'ready' };
  recomputeMods(P);
  return P;
}
const PL = id => G.players[id];
const teamOf = id => id > 0 ? G.players[id].team : -1;
const isEnemy = (a, b) => a > 0 && b > 0 && a !== b && G.players[a].team !== G.players[b].team;
const isAlly = (a, b) => a > 0 && b > 0 && G.players[a].team === G.players[b].team;
const humanP = () => G.players[G.me];

function whoMatches(def, who) {
  if (who === 'all') return true;
  if (who === 'human') return def.tagset.has('Human') && def.cls !== 'villager' && def.cls !== 'hero';
  if (who === 'villager') return def.cls === 'villager';
  if (who === 'hero') return def.cls === 'hero';
  if (who === 'myth') return def.cls === 'myth';
  if (who.startsWith('cls:')) return def.cls === who.slice(4);
  if (who.startsWith('tag:')) return def.tagset.has(who.slice(4));
  if (who.startsWith('unit:')) return def.key === who.slice(5);
  return false;
}
function recomputeMods(P) {
  const m = { gather: { food: 1, hunt: 1, farm: 1, berry: 1, fish: 1, wood: 1, gold: 1, all: 1 }, carry: 0, build: 1, kiRate: 1, templeHeal: 0, bld: {}, unit: [], forms: {} };
  const apply = list => {
    for (const f of list || []) {
      if (f.t === 'gather') m.gather[f.res] *= f.mul;
      else if (f.t === 'carry') m.carry += f.add;
      else if (f.t === 'build') m.build *= f.mul;
      else if (f.t === 'kiRate') m.kiRate *= f.mul;
      else if (f.t === 'templeHeal') m.templeHeal += f.add;
      else if (f.t === 'bld') { const b = m.bld[f.who] = m.bld[f.who] || {}; if (f.mul) b[f.stat] = (b[f.stat] || 1) * f.mul; else b[f.stat + '+'] = (b[f.stat + '+'] || 0) + f.add; }
      else if (f.t === 'stat') m.unit.push(f);
      else if (f.t === 'form') m.forms[f.unit] = f.form;
    }
  };
  apply(PATRONS[P.major].fx);
  for (const k of P.techs) apply(TECH[k] && TECH[k].fx);
  for (const r of relicsOf(P.id)) apply(RELICS[r.key].fx);
  P.mods = m; P.statCache = {};
}
const bmod = (P, key, stat, base) => { const b = P && P.mods.bld[key]; if (!b) return base; return base * (b[stat] || 1) + (b[stat + '+'] || 0); };

function scaleAtk(a, mul, rangeAdd) {
  if (!a) return null;
  const o = Object.assign({}, a);
  for (const k of ['hack', 'pierce', 'crush', 'divine']) if (o[k]) o[k] *= mul;
  if (rangeAdd) o.range += rangeAdd;
  return o;
}
// Effective stats for a unit type (and form) under a player's upgrades. Cached per player.
function unitStats(owner, def, form) {
  const P = G.players[owner];
  const key = def.key + '|' + (form || '');
  if (P && P.statCache[key]) return P.statCache[key];
  const base = form ? Object.assign({}, def, FORMS[form]) : def;
  let hp = base.hp, atk = 1, armorAdd = 0, speed = 1, regen = base.regen || 0, rangeAdd = 0, cost = 1, train = 1, heal = 1, los = 0;
  if (P && P.mods) for (const f of P.mods.unit) {
    if (!whoMatches(def, f.who)) continue;
    const mul = f.mul || 1, add = f.add || 0;
    if (f.stat === 'hp') hp *= mul;
    else if (f.stat === 'atk') atk *= mul;
    else if (f.stat === 'armor') armorAdd += add;
    else if (f.stat === 'speed') speed *= mul;
    else if (f.stat === 'regen') regen += add;
    else if (f.stat === 'range') rangeAdd += add;
    else if (f.stat === 'cost') cost *= mul;
    else if (f.stat === 'train') train *= mul;
    else if (f.stat === 'heal') heal *= mul;
    else if (f.stat === 'los') los += add;
  }
  const arm = base.armor || [0, 0, 0];
  const s = {
    name: base.name, hp, armor: [Math.min(.9, arm[0] + armorAdd), Math.min(.9, arm[1] + armorAdd), arm[2]],
    melee: scaleAtk(base.melee, atk, 0), ranged: scaleAtk(base.ranged, atk, rangeAdd), speed: (base.speed || 0) * speed * MT, los: ((base.los || 10) + los) * MT,
    regen, special: base.special || null, look: base.look || {}, kiDrain: base.kiDrain || 0, absorb: !!base.absorb, kaioken: !!base.kaioken,
    costMul: cost, trainMul: train, heal: base.heal ? { rate: base.heal.rate * heal, radius: base.heal.radius } : null, leap: base.leap || null,
  };
  if (P) P.statCache[key] = s;
  return s;
}
const stats = u => unitStats(u.owner, u.def, u.form);
function maxHp(e) {
  if (e.kind === 'building') return bmod(G.players[e.owner], e.key, 'hp', B[e.key].hp);
  let hp = stats(e).hp;
  if (e.ape) hp *= 2;
  return hp;
}
function unitCost(P, key) {
  const d = U[key], s = unitStats(P.id, d, d.forms ? d.forms.base : null), c = {};
  for (const k in d.cost || {}) c[k] = Math.round(d.cost[k] * (k === 'ki' ? 1 : s.costMul));
  return c;
}

// ---------- entities ----------
function addEnt(e) { e.id = G.nextId++; e.dead = false; G.ents.push(e); G.byId.set(e.id, e); return e; }
const byId = id => { const e = G.byId.get(id); return e && !e.dead ? e : null; };

function addRes(key, tx, ty, amount) {
  const d = RES_DEF[key], w = d.big ? 2 : 1;
  const e = addEnt({ kind: 'res', key, owner: -1, tx, ty, w, h: w, x: tx + w / 2, y: ty + w / 2, r: w * .5, amount: amount || d.amount, max: amount || d.amount, v: rnd() });
  if (d.block) for (let y = ty; y < ty + w; y++) for (let x = tx; x < tx + w; x++) { G.map.block[idx(x, y)] = 3; G.map.occ[idx(x, y)] = e.id; }
  return e;
}
function removeRes(e) {
  if (e.dead) return;
  e.dead = true;
  if (RES_DEF[e.key].block) for (let y = e.ty; y < e.ty + e.h; y++) for (let x = e.tx; x < e.tx + e.w; x++) { const i = idx(x, y); if (G.map.occ[i] === e.id) { G.map.block[i] = 0; G.map.occ[i] = 0; } }
  if (e.key === 'tree') G.treeFall.push({ x: e.x, y: e.y, t: 0, v: e.v });
  if (RES_DEF[e.key].block) G.regionDirty = true;
}
const resType = r => r.kind === 'building' ? 'food' : RES_DEF[r.key].type;
const resSub = r => r.kind === 'building' ? 'farm' : RES_DEF[r.key].sub;

function spawnUnit(key, owner, x, y, form) {
  const def = U[key];
  if (!form && def.forms) {
    const P = G.players[owner];
    form = (P && P.mods.forms[key]) || FORMS[def.forms.base] && def.forms.base;
    if (key === 'cell' && P) form = CELL_FORMS[P.cellStage];
  }
  const u = addEnt({
    kind: 'unit', key, def, owner, x, y, px: x, py: y, r: (def.size || .5) * MT, form: form || null, face: rnd() * 6.28, dir: rnd() < .5 ? 1 : -1,
    order: { type: 'idle' }, queue: [], path: null, pi: 0, wantPath: false, lastRepath: -9, cdM: rnd() * .5, cdR: rnd() * .5, spCd: 4, scanT: rnd() * .5,
    carry: null, carryAmt: 0, carryBall: 0, stun: 0, buffs: [], flying: !!def.alwaysFly, lift: def.alwaysFly ? 1 : 0, kaio: false, biomass: 0,
    home: { x, y }, hitFlash: 0, lastHitBy: 0, lastHitAt: -99, stuckT: 0, lastPos: { x, y }, anim: 'idle', animT: rnd() * 10, atkT: 0, absCd: 0, leap: null, wanderT: rnd() * 5,
    garrison: 0, ape: 0, stance: 'aggressive',
  });
  u.hp = maxHp(u);
  return u;
}

function footprintFree(tx, ty, w, h, opts) {
  opts = opts || {};
  for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) {
    if (!inMap(x, y) || x < 1 || y < 1 || x > MW - 2 || y > MH - 2) return false;
    const i = idx(x, y), t = G.map.terr[i];
    if (G.map.block[i] || t === T_WATER || t === T_ROCK || (t === T_SHALLOW && !opts.shallow)) return false;
    if (G.map.occ[i] && !(opts.allowSettle && G.map.settle[i])) return false;
    if (G.map.settle[i] && !opts.allowSettle) return false;
  }
  return true;
}
function placeBuilding(key, owner, tx, ty, built) {
  const d = B[key], P = G.players[owner];
  const fac = P ? P.faction : 'earth';
  const b = addEnt({
    kind: 'building', key, owner, tx, ty, w: d.w, h: d.h, x: tx + d.w / 2, y: ty + d.h / 2, r: Math.max(d.w, d.h) * .5,
    built: !!built, progress: built ? 1 : 0, queue: [], research: null, rally: null, balls: [], relics: [], cdA: 0, farmer: 0, hitFlash: 0,
    name: bname(key, fac), garrisoned: [], fac, smokeT: rnd() * 3,
  });
  b.hp = built ? maxHp(b) : maxHp(b) * .08;
  if (key === 'tc') { const s = G.settlements.find(s => s.tx === tx && s.ty === ty); if (s) { s.tc = b.id; b.settlement = s.id; } }
  for (let y = ty; y < ty + d.h; y++) for (let x = tx; x < tx + d.w; x++) {
    const i = idx(x, y);
    if (!d.walk) G.map.block[i] = d.gate ? 5 : 4;
    G.map.occ[i] = b.id;
    if (d.gate) G.map.gate[i] = P ? P.team : 0;
  }
  G.regionDirty = true;
  if (!d.walk) for (const u of G.ents) if (u.kind === 'unit' && !u.dead && !u.flying && !u.garrison && u.x >= tx - .2 && u.x <= tx + d.w + .2 && u.y >= ty - .2 && u.y <= ty + d.h + .2) {
    if (d.gate && P && isAlly(owner, u.owner)) continue;
    const f = freeTileNear(tOf(u.x), tOf(u.y), 8, false, moveTeam(u)); if (f) { u.x = f.x + .5; u.y = f.y + .5; u.path = null; u.wantPath = true; }
  }
  return b;
}
function freeBuildingTiles(b) {
  for (let y = b.ty; y < b.ty + b.h; y++) for (let x = b.tx; x < b.tx + b.w; x++) {
    const i = idx(x, y);
    if (G.map.occ[i] === b.id) { G.map.occ[i] = G.map.settle[i] || 0; if (G.map.block[i] === 4 || G.map.block[i] === 5) G.map.block[i] = 0; G.map.gate[i] = -1; }
  }
  if (b.key === 'tc' && b.settlement) { const s = G.settlements.find(s => s.id === b.settlement); if (s) s.tc = 0; }
  G.regionDirty = true;
}
function canPlace(key, tx, ty, owner, opts) {
  opts = opts || {};
  const d = B[key];
  if (d.settlement) {
    const s = G.settlements.find(s => s.tx === tx && s.ty === ty && !s.tc);
    if (!s) return false;
    if (!footprintFree(tx, ty, d.w, d.h, { allowSettle: true })) return false;
  } else if (!footprintFree(tx, ty, d.w, d.h, { shallow: !!d.dock })) return false;
  if (d.dock && !dockShore(tx, ty, d.w, d.h)) return false;
  const P = G.players[owner];
  if (P && P.human && !opts.ignoreFog) for (let y = ty; y < ty + d.h; y++) for (let x = tx; x < tx + d.w; x++) if (!G.vis[idx(x, y)]) return false;
  if (opts.spacing && !d.wall && !d.gate) {
    for (let y = ty - 1; y <= ty + d.h; y++) for (let x = tx - 1; x <= tx + d.w; x++) {
      if (!inMap(x, y)) continue; const i = idx(x, y), o = G.map.occ[i] && G.byId.get(G.map.occ[i]);
      if (o && o.kind === 'building') return false;
      if (G.map.block[i] === 3 && key !== 'storehouse' && key !== 'granary') return false;
    }
  }
  return true;
}
// A Dock needs open deep water along its edge, part of a real sea (not a pond).
function dockShore(tx, ty, w, h) {
  if (!G.nregion) return false;
  let n = 0, reg = 0;
  for (let y = ty - 1; y <= ty + h; y++) for (let x = tx - 1; x <= tx + w; x++) {
    if (!inMap(x, y) || (x >= tx && x < tx + w && y >= ty && y < ty + h)) continue;
    const i = idx(x, y);
    if (G.map.terr[i] === T_WATER && !navBlocked(i)) { n++; reg = G.nregion[i] || reg; }
  }
  return n >= 3 && reg && G.nregionSize[reg] >= 40;
}
// Snap a TC placement to the nearest free settlement.
function snapSettlement(wx, wy) {
  let best = null, bd = 6;
  for (const s of G.settlements) { if (s.tc) continue; const d = dist(s.tx + 2, s.ty + 2, wx, wy); if (d < bd) { bd = d; best = s; } }
  return best;
}
function freeTileNear(tx, ty, maxR, flyingOk, team) {
  for (let r = 0; r <= maxR; r++) {
    for (let y = ty - r; y <= ty + r; y++) for (let x = tx - r; x <= tx + r; x++) {
      if (Math.max(Math.abs(x - tx), Math.abs(y - ty)) !== r) continue;
      if (inMap(x, y) && (flyingOk || (team === NAVAL ? !navBlocked(idx(x, y)) : !G.map.block[idx(x, y)]))) return { x, y };
    }
  }
  return null;
}
function spawnNear(b, key, owner, form) {
  const target = b.rally ? { x: b.rally.x, y: b.rally.y } : { x: b.tx + b.w + 1, y: b.ty + b.h + 1 };
  const nav = !!U[key].naval;
  let best = null, bd = 1e9;
  for (let y = b.ty - 1; y <= b.ty + b.h; y++) for (let x = b.tx - 1; x <= b.tx + b.w; x++) {
    if (!inMap(x, y) || (nav ? navBlocked(idx(x, y)) : G.map.block[idx(x, y)])) continue;
    if (x >= b.tx && x < b.tx + b.w && y >= b.ty && y < b.ty + b.h) continue;
    const d = dist(x + .5, y + .5, target.x, target.y); if (d < bd) { bd = d; best = { x, y }; }
  }
  if (!best) best = freeTileNear(b.tx, b.ty, 10, false, nav ? NAVAL : undefined) || { x: b.tx, y: b.ty };
  return spawnUnit(key, owner, best.x + .5 + (rnd() - .5) * .4, best.y + .5 + (rnd() - .5) * .4, form);
}

// ---------- map generation ----------
function initMap(w, h, biome, seed) {
  MW = w; MH = h;
  const n = w * h;
  G.map = { w, h, biome, terr: new Uint8Array(n), hgt: new Float32Array(n), block: new Uint8Array(n), occ: new Int32Array(n), gate: new Int8Array(n).fill(-1), settle: new Int32Array(n), deco: new Uint8Array(n), seed };
  G.vis = new Uint8Array(n);
  G.chunkVer = (G.chunkVer || 0) + 1;
  const nz = makeNoise(seed);
  G.noise = nz;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) G.map.hgt[idx(x, y)] = nz(x / 18, y / 18, 4);
  const base = { earth: T_GRASS, namek: T_GRASS, wasteland: T_SAND, highlands: T_GRASS }[biome];
  G.map.terr.fill(base);
}
function paintCircle(t, cx, cy, r, jitter) {
  for (let y = Math.floor(cy - r - 2); y <= cy + r + 2; y++) for (let x = Math.floor(cx - r - 2); x <= cx + r + 2; x++) {
    if (!inMap(x, y)) continue;
    const rr = r * (jitter ? (0.8 + G.noise(x / 4, y / 4, 2) * .45) : 1);
    if (dist(x + .5, y + .5, cx, cy) <= rr) G.map.terr[idx(x, y)] = t;
  }
}
function isLand(x, y) { if (!inMap(x, y)) return false; const t = G.map.terr[idx(x, y)]; return t !== T_WATER && t !== T_ROCK; }
function finalizeBlocks() {
  for (let i = 0; i < MW * MH; i++) { const t = G.map.terr[i]; if ((t === T_WATER || t === T_ROCK) && !G.map.block[i]) G.map.block[i] = 1; }
}
function clearTileForPath(x, y) {
  if (!inMap(x, y)) return;
  const i = idx(x, y), t = G.map.terr[i];
  if (t === T_WATER) G.map.terr[i] = T_SHALLOW;
  else if (t === T_ROCK) G.map.terr[i] = G.map.biome === 'wasteland' ? T_SAND : T_DIRT;
  const e = G.map.occ[i] ? G.byId.get(G.map.occ[i]) : null;
  if (e && e.kind === 'res') removeRes(e);
  if (G.map.block[i] === 1 || G.map.block[i] === 3) G.map.block[i] = 0;
}
function bfsFrom(sx0, sy0) {
  const seen = new Uint8Array(MW * MH), q = [idx(sx0, sy0)]; seen[q[0]] = 1;
  while (q.length) {
    const c = q.pop(), cx = c % MW, cy = (c / MW) | 0;
    for (let k = 0; k < 4; k++) { const nx = cx + [1, -1, 0, 0][k], ny = cy + [0, 0, 1, -1][k]; if (!inMap(nx, ny)) continue; const ni = idx(nx, ny); if (seen[ni] || G.map.block[ni]) continue; seen[ni] = 1; q.push(ni); }
  }
  return seen;
}
function ensureConnected(from, targets) {
  for (let pass = 0; pass < 12; pass++) {
    const seen = bfsFrom(from.x, from.y);
    const bad = targets.find(t => !seen[idx(Math.floor(t.x), Math.floor(t.y))]);
    if (!bad) return;
    // carve toward the nearest reachable tile on the way to the target
    const steps = Math.ceil(dist(from.x, from.y, bad.x, bad.y));
    for (let s = 0; s <= steps; s++) {
      const x = Math.round(from.x + (bad.x - from.x) * s / steps), y = Math.round(from.y + (bad.y - from.y) * s / steps);
      for (const [px, py] of [[x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]]) clearTileForPath(px, py);
    }
  }
}

// Skirmish map: bases on a circle, everything else laid out per base with rotation so every start is fair.
function genSkirmish(opts) {
  const n = opts.players.length;
  const size = n <= 2 ? 100 : n === 3 ? 116 : 124;
  const seed = opts.seed;
  rand = mulberry32(seed);
  initMap(size, size, MAPS[opts.map].biome, seed);
  const biome = G.map.biome, C = { x: size / 2, y: size / 2 }, sea = MAPS[opts.map].layout === 'sea', seaR = size * .25;
  const R = size * .36, a0 = n === 2 ? Math.PI * .75 : rnd() * Math.PI * 2;
  const bases = [];
  for (let i = 0; i < n; i++) { const a = a0 + i * Math.PI * 2 / n; bases.push({ x: Math.round(C.x + Math.cos(a) * R), y: Math.round(C.y + Math.sin(a) * R), a }); }
  G.bases = bases;
  const reserved = [];
  const resv = (x, y, r) => reserved.push({ x, y, r });
  const isRes = (x, y, pad) => reserved.some(c => dist(c.x, c.y, x, y) < c.r + (pad || 0));
  for (const b of bases) resv(b.x, b.y, 11);
  if (opts.koth) resv(C.x, C.y, 7);
  // settlements: one near each base, plus central ones
  const settles = [];
  for (const b of bases) { const a = b.a + Math.PI + (sea ? 1.75 : .9); settles.push({ x: Math.round(b.x + Math.cos(a) * 17), y: Math.round(b.y + Math.sin(a) * 17) }); }
  for (let i = 0; i < Math.max(2, n); i++) { const a = a0 + (i + .5) * Math.PI * 2 / Math.max(2, n), r = size * (sea ? .38 : .16); settles.push({ x: Math.round(C.x + Math.cos(a) * r - 2), y: Math.round(C.y + Math.sin(a) * r - 2) }); }
  for (const s of settles) resv(s.x, s.y, 4);
  // Dragon Ball camps
  const camps = [];
  let tries = 0;
  while (camps.length < 7 && tries++ < 6000) {
    const x = rint(8, size - 9), y = rint(8, size - 9);
    if (bases.some(b => dist(b.x, b.y, x, y) < 24) || (sea && dist(x, y, C.x, C.y) < seaR * 1.25 + 3)) continue;
    if (camps.some(c => dist(c.x, c.y, x, y) < 14) || settles.some(s => dist(s.x, s.y, x, y) < 8) || isRes(x, y, 2)) continue;
    camps.push({ x, y });
  }
  while (camps.length < 7) camps.push({ x: C.x + rint(-10, 10), y: C.y + rint(-10, 10) });
  for (const c of camps) resv(c.x, c.y, 3.5);
  G.camps = camps;

  // ---- terrain by biome
  const hg = G.map.hgt;
  if (sea) {
    // a great inland sea with shallow beaches
    for (let i = 0; i < size * size; i++) {
      const x = i % size, y = (i / size) | 0, r = seaR * (.86 + G.noise(x / 7 + 3, y / 7 - 5, 2) * .32), d = dist(x + .5, y + .5, C.x, C.y);
      if (d < r) G.map.terr[i] = T_WATER; else if (d < r + 1.3) G.map.terr[i] = T_SHALLOW; else if (d < r + 2.6) G.map.terr[i] = T_SAND; else if (G.noise(x / 9 + 50, y / 9, 2) > .62) G.map.terr[i] = T_DIRT;
    }
    for (let k = 0; k < 3 + n; k++) cliffRidge(rint(6, size - 7), rint(6, size - 7), (x, y, pad) => isRes(x, y, pad) || dist(x, y, C.x, C.y) < seaR * 1.25 + 2);
  } else if (biome === 'earth') {
    for (let i = 0; i < size * size; i++) { const x = i % size, y = (i / size) | 0; if (G.noise(x / 9 + 50, y / 9, 2) > .62) G.map.terr[i] = T_DIRT; }
    for (let k = 0; k < 4 + n; k++) { const x = rint(10, size - 11), y = rint(10, size - 11); if (isRes(x, y, 7)) continue; paintCircle(T_WATER, x, y, 2.5 + rnd() * 3, true); }
    for (let k = 0; k < 6 + n; k++) cliffRidge(rint(6, size - 7), rint(6, size - 7), isRes);
  } else if (biome === 'namek') {
    for (let i = 0; i < size * size; i++) { const x = i % size, y = (i / size) | 0; const v = G.noise(x / 14 + 9, y / 14 - 4, 3); if (v < .38) G.map.terr[i] = T_WATER; else if (v < .43) G.map.terr[i] = T_SHALLOW; else if (v < .47) G.map.terr[i] = T_SAND; }
    for (let k = 0; k < 10 + n * 2; k++) { const x = rint(5, size - 6), y = rint(5, size - 6); if (!isRes(x, y, 4)) { paintCircle(T_ROCK, x, y, .6 + rnd() * .9, false); } }
  } else if (biome === 'wasteland') {
    for (let i = 0; i < size * size; i++) { const x = i % size, y = (i / size) | 0; if (G.noise(x / 8 + 20, y / 8, 2) > .58) G.map.terr[i] = T_DIRT; }
    for (let k = 0; k < 10 + n * 2; k++) { const x = rint(6, size - 7), y = rint(6, size - 7); if (isRes(x, y, 5)) continue; paintCircle(T_ROCK, x, y, 2 + rnd() * 3.5, true); }
    for (let k = 0; k < 2; k++) { const x = rint(12, size - 13), y = rint(12, size - 13); if (!isRes(x, y, 6)) paintCircle(T_WATER, x, y, 2 + rnd() * 1.5, true); }
  } else if (biome === 'highlands') {
    for (let i = 0; i < size * size; i++) { const x = i % size, y = (i / size) | 0; if (hg[i] > .6) G.map.terr[i] = T_SNOW; else if (G.noise(x / 7, y / 7 + 30, 2) > .66) G.map.terr[i] = T_DIRT; }
    for (let k = 0; k < 8 + n * 2; k++) cliffRidge(rint(6, size - 7), rint(6, size - 7), isRes);
    for (let k = 0; k < 3; k++) { const x = rint(10, size - 11), y = rint(10, size - 11); if (!isRes(x, y, 7)) paintCircle(T_WATER, x, y, 2 + rnd() * 2, true); }
  }
  // clearings
  const ground = biome === 'wasteland' ? T_DIRT : biome === 'highlands' ? T_DIRT : T_DIRT;
  for (const b of bases) paintCircle(T_ROAD, b.x, b.y, 7.5, true);
  for (const s of settles) paintCircle(ground, s.x + 2, s.y + 2, 4.2, true);
  for (const c of camps) paintCircle(ground, c.x, c.y, 2.8, true);
  if (opts.koth && sea) for (const b of bases) { const L = dist(b.x, b.y, C.x, C.y); for (let s = 0; s <= L; s += .5) { const x = C.x + (b.x - C.x) * s / L, y = C.y + (b.y - C.y) * s / L; for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 0], [0, -1]]) { const tx = Math.floor(x) + dx, ty = Math.floor(y) + dy; if (inMap(tx, ty) && G.map.terr[idx(tx, ty)] === T_WATER) G.map.terr[idx(tx, ty)] = T_SHALLOW; } } }
  if (opts.koth) { paintCircle(T_ROAD, C.x, C.y, 4.5, true); for (let y = C.y - 6; y <= C.y + 6; y++) for (let x = C.x - 6; x <= C.x + 6; x++) if (inMap(x, y) && dist(x, y, C.x, C.y) < 6) { const t = G.map.terr[idx(x, y)]; if (t === T_WATER || t === T_ROCK || t === T_SHALLOW) G.map.terr[idx(x, y)] = ground; } }
  for (const b of bases) for (let y = b.y - 10; y <= b.y + 10; y++) for (let x = b.x - 10; x <= b.x + 10; x++) if (inMap(x, y) && dist(x, y, b.x, b.y) < 10) { const t = G.map.terr[idx(x, y)]; if (t === T_WATER || t === T_ROCK || t === T_SHALLOW) G.map.terr[idx(x, y)] = ground; }
  for (const s of settles) for (let y = s.y - 1; y <= s.y + 5; y++) for (let x = s.x - 1; x <= s.x + 5; x++) if (inMap(x, y)) { const t = G.map.terr[idx(x, y)]; if (t === T_WATER || t === T_ROCK || t === T_SHALLOW) G.map.terr[idx(x, y)] = ground; }
  for (const c of camps) for (let y = c.y - 2; y <= c.y + 2; y++) for (let x = c.x - 2; x <= c.x + 2; x++) if (inMap(x, y)) { const t = G.map.terr[idx(x, y)]; if (t === T_WATER || t === T_ROCK) G.map.terr[idx(x, y)] = ground; }
  finalizeBlocks();
  // settlements
  G.settlements = [];
  for (const s of settles) addSettlement(s.x, s.y);

  // ---- resources around each base (same layout, rotated)
  const rot = (b, dx, dy) => { const c = Math.cos(b.a), s = Math.sin(b.a); return { x: Math.round(b.x + dx * c - dy * s), y: Math.round(b.y + dx * s + dy * c) }; };
  const free = (x, y) => inMap(x, y) && !G.map.block[idx(x, y)] && isLand(x, y) && G.map.terr[idx(x, y)] !== T_SHALLOW && !G.map.settle[idx(x, y)];
  const freeArea = (x, y, w) => { for (let yy = y; yy < y + w; yy++) for (let xx = x; xx < x + w; xx++) if (!free(xx, yy)) return false; return true; };
  const nearFree = (p, w) => { for (let r = 0; r < 5; r++) for (let y = p.y - r; y <= p.y + r; y++) for (let x = p.x - r; x <= p.x + r; x++) if (freeArea(x, y, w)) return { x, y }; return null; };
  const goldMul = biome === 'wasteland' || biome === 'namek' ? 1.25 : 1;
  for (const b of bases) {
    let p = nearFree(rot(b, 8, 4), 2); if (p) addRes('gold', p.x, p.y, 2500 * goldMul);
    p = nearFree(rot(b, -2, 11), 2); if (p) addRes('gold', p.x, p.y, 2500 * goldMul);
    p = nearFree(rot(b, 6, -6), 1); if (p) for (let k = 0; k < 6; k++) { const q = { x: p.x + (k % 3), y: p.y + Math.floor(k / 3) }; if (free(q.x, q.y)) addRes('berry', q.x, q.y); }
    const hunt = biome === 'namek' ? 'frog' : biome === 'wasteland' ? 'boar' : biome === 'highlands' ? 'boar' : 'stego';
    p = nearFree(rot(b, -9, -4), 1); if (p) for (let k = 0; k < 4; k++) if (free(p.x + (k % 2), p.y + (k >> 1))) spawnUnit(hunt, 0, p.x + (k % 2) + .5, p.y + (k >> 1) + .5);
    p = nearFree(rot(b, 12, -10), 1); if (p) for (let k = 0; k < 3; k++) if (free(p.x + k, p.y)) spawnUnit(hunt === 'boar' ? 'stego' : hunt, 0, p.x + k + .5, p.y + .5);
    // two forests close to home
    for (const [dx, dy, r] of [[-11, 6, 3.2], [3, -12, 3]]) {
      const c = rot(b, dx, dy);
      for (let y = c.y - 4; y <= c.y + 4; y++) for (let x = c.x - 4; x <= c.x + 4; x++) if (dist(x, y, c.x, c.y) <= r * (biome === 'wasteland' ? .8 : 1) && rnd() < .88 && free(x, y) && dist(x, y, b.x, b.y) > 7) addRes('tree', x, y);
    }
  }
  // world forests, extra gold and herds
  const forestN = { earth: 26, namek: 12, wasteland: 9, highlands: 28 }[biome] + n * 4;
  for (let k = 0; k < forestN; k++) {
    const cx = rint(3, size - 4), cy = rint(3, size - 4);
    if (isRes(cx, cy, 3)) continue;
    const r = (biome === 'namek' || biome === 'wasteland' ? 1.5 : 2.3) + rnd() * 2.6;
    for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) if (dist(x, y, cx, cy) <= r && rnd() < .8 && free(x, y) && !isRes(x, y, 1)) addRes('tree', x, y);
  }
  for (let x = 0; x < size; x++) for (const y of [0, 1, size - 1, size - 2]) if (rnd() < .6 && free(x, y)) addRes('tree', x, y);
  for (let y = 0; y < size; y++) for (const x of [0, 1, size - 1, size - 2]) if (rnd() < .6 && free(x, y)) addRes('tree', x, y);
  for (let k = 0; k < 4 + n * 2; k++) for (let t = 0; t < 60; t++) { const x = rint(8, size - 9), y = rint(8, size - 9); if (!isRes(x, y, 4) && freeArea(x, y, 2)) { addRes('gold', x, y, 3000 * goldMul); break; } }
  for (let k = 0; k < 3 + n; k++) for (let t = 0; t < 60; t++) { const x = rint(8, size - 9), y = rint(8, size - 9); if (!isRes(x, y, 5) && free(x, y) && free(x + 1, y)) { const ht = biome === 'namek' ? 'frog' : rnd() < .5 ? 'stego' : 'boar'; for (let j = 0; j < 3; j++) if (free(x + j, y)) spawnUnit(ht, 0, x + j + .5, y + .5); break; } }
  placeFish(bases, size);
  if (biome === 'earth' && !opts.koth && !sea) { const cx = Math.round(C.x - 1), cy = Math.round(C.y - 1); if (free(cx, cy) && free(cx + 1, cy + 1)) addDeco('sealedball', cx, cy, 2); }

  ensureConnected(bases[0], [...bases.slice(1), ...camps, ...settles.map(s => ({ x: s.x + 2, y: s.y + 2 })), ...(opts.koth ? [{ x: C.x + 3, y: C.y + 3 }] : [])]);
  scatterDecor();
  return bases;
}
// Giant fish in every real body of water, plus a fair group off each base's shore.
function placeFish(bases, size) {
  const n = MW * MH, comp = new Int32Array(n), sizes = [0], st = [];
  const water = i => { const t = G.map.terr[i]; return (t === T_WATER || t === T_SHALLOW) && (G.map.block[i] === 0 || G.map.block[i] === 1); };
  let id = 0;
  for (let i = 0; i < n; i++) { if (comp[i] || !water(i)) continue; id++; comp[i] = id; st.push(i); let c = 0; while (st.length) { const k = st.pop(), x = k % MW, y = (k / MW) | 0; c++; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!inMap(nx, ny)) continue; const j = idx(nx, ny); if (!comp[j] && water(j)) { comp[j] = id; st.push(j); } } } sizes[id] = c; }
  const deep = (x, y) => { if (!inMap(x, y)) return false; for (let yy = y - 1; yy <= y + 1; yy++) for (let xx = x - 1; xx <= x + 1; xx++) if (!inMap(xx, yy) || G.map.terr[idx(xx, yy)] !== T_WATER) return false; return true; };
  const fish = [], ok = (x, y) => deep(x, y) && sizes[comp[idx(x, y)]] >= 80 && !fish.some(f => dist(f.x, f.y, x, y) < 3);
  const put = (x, y) => { fish.push({ x, y }); addRes('fish', x, y); };
  for (const b of bases) {
    let got = 0;
    for (let r = 10; r <= 26 && got < 4; r++) for (let k = 0; k < 40 && got < 4; k++) { const a = rnd() * Math.PI * 2, x = Math.round(b.x + Math.cos(a) * r), y = Math.round(b.y + Math.sin(a) * r); if (ok(x, y)) { put(x, y); got++; } }
  }
  for (let c = 1; c <= id; c++) {
    if (sizes[c] < 80) continue;
    const want = Math.min(28, Math.floor(sizes[c] / 50));
    for (let t = 0, got = 0; t < 3000 && got < want; t++) { const x = rint(2, MW - 3), y = rint(2, MH - 3); if (comp[idx(x, y)] === c && ok(x, y) && !bases.some(b => dist(b.x, b.y, x, y) < 9)) { put(x, y); got++; } }
  }
}
function cliffRidge(x, y, isRes) {
  if (isRes(x, y, 5)) return;
  const dir = rnd() * Math.PI * 2, len = rint(4, 10);
  for (let s = 0; s < len; s++) {
    const px = Math.round(x + Math.cos(dir) * s + (rnd() - .5)), py = Math.round(y + Math.sin(dir) * s + (rnd() - .5));
    if (!inMap(px, py) || isRes(px, py, 2)) continue;
    G.map.terr[idx(px, py)] = T_ROCK;
    if (rnd() < .55 && inMap(px + 1, py) && !isRes(px + 1, py, 2)) G.map.terr[idx(px + 1, py)] = T_ROCK;
    if (rnd() < .35 && inMap(px, py + 1) && !isRes(px, py + 1, 2)) G.map.terr[idx(px, py + 1)] = T_ROCK;
  }
}
function addSettlement(tx, ty) {
  const s = { id: G.nextId++, tx, ty, tc: 0 };
  for (let y = ty; y < ty + 4; y++) for (let x = tx; x < tx + 4; x++) if (inMap(x, y)) { G.map.settle[idx(x, y)] = s.id; if (G.map.block[idx(x, y)] === 1) { G.map.block[idx(x, y)] = 0; G.map.terr[idx(x, y)] = T_DIRT; } }
  G.settlements.push(s);
  return s;
}
function addDeco(key, tx, ty, w) {
  const e = addEnt({ kind: 'deco', key, owner: -1, tx, ty, w, h: w, x: tx + w / 2, y: ty + w / 2, r: w / 2 });
  for (let y = ty; y < ty + w; y++) for (let x = tx; x < tx + w; x++) { G.map.block[idx(x, y)] = 2; G.map.occ[idx(x, y)] = e.id; }
  return e;
}
// Purely visual ground clutter (flowers, rocks, crystals) baked into terrain chunks.
function scatterDecor() {
  for (let i = 0; i < MW * MH; i++) {
    const t = G.map.terr[i];
    if (G.map.block[i] || G.map.settle[i]) continue;
    const r = hash2(i % MW, (i / MW) | 0, G.map.seed);
    if (t === T_GRASS && r < .05) G.map.deco[i] = 1 + (r * 1000 | 0) % 3;
    else if ((t === T_DIRT || t === T_SAND) && r < .03) G.map.deco[i] = 4;
    else if (t === T_SNOW && r < .02) G.map.deco[i] = 4;
  }
}
