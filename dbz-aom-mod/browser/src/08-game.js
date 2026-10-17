// =====================================================================
// 8. GAME SETUP (skirmish and scenario bootstrap; no DOM here)
// =====================================================================
function gaiaPlayer() {
  return { id: 0, team: 0, name: 'Nature', faction: null, color: 0, res: { food: 0, wood: 0, gold: 0, ki: 0 }, techs: new Set(), powers: {}, buffs: [], stats: {}, heroDead: {}, minors: [], age: 4,
    mods: { gather: {}, carry: 0, build: 1, kiRate: 1, templeHeal: 0, bld: {}, unit: [], forms: {} }, statCache: {}, kiCap: 0, market: {} };
}
function resetState(opts) {
  Object.assign(G, {
    started: true, gameN: (G.gameN || 0) + 1, opts, time: 0, tickN: 0, ents: [], byId: new Map(), nextId: 1, projs: [], fx: [], texts: [], delayed: [], sel: [], balls: [], camps: [], settlements: [], bases: [],
    pings: [], corpses: [], ruins: [], treeFall: [], reveals: [], over: false, winner: 0, winTeam: 0, speed: 1, paused: false, pathBudget: 999, stoneUntil: 0, shenronOwner: 0, wishPending: 0,
    relics: [], objMarks: [], placing: null, targeting: null, fogT: 0, korin: 0, koth: null, settleHold: null, speedMul: 1, units: [], blds: [], ress: [], groups: {}, headless: !!opts.headless, revealAll: !!opts.revealAll, scn: null, me: 1, chunkDirtyAll: true,
  });
}
const START_RES = { standard: { food: 300, wood: 300, gold: 150, ki: 0 }, high: { food: 1000, wood: 1000, gold: 1000, ki: 40 }, deathmatch: { food: 5000, wood: 5000, gold: 5000, ki: 100 }, nomad: { food: 300, wood: 450, gold: 400, ki: 0 } };
// opts: { map, players: [{ faction, major, team, ai, color, name }], seed, victory, resources, dragonBalls, headless }
function startSkirmish(opts) {
  opts = Object.assign({ map: 'earth', resources: 'standard', dragonBalls: true }, opts);
  if (!MODES[opts.mode]) opts.mode = opts.victory === 'wonder' ? 'supremacy' : opts.victory === 'conquest' ? 'conquest' : 'supremacy';
  const M = MODES[opts.mode];
  opts.seed = opts.seed || ((Math.random() * 1e9) | 0);
  resetState(opts);
  G.players = [gaiaPlayer()];
  opts.players.forEach((p, i) => G.players.push(makePlayer(i + 1, Object.assign({ color: i + 1, team: i + 1 }, p))));
  const meIdx = opts.players.findIndex(p => !p.ai);
  G.me = meIdx >= 0 ? meIdx + 1 : 0;
  if (!G.me) G.revealAll = true;
  const bases = genSkirmish({ map: opts.map, players: opts.players, seed: opts.seed, koth: !!M.koth });
  pathAlloc(); gridAlloc(); computeRegions();
  G.players.forEach(P => { if (!P.id) return; Object.assign(P.res, START_RES[M.res || opts.resources] || START_RES.standard); });
  for (let i = 1; i < G.players.length; i++) {
    const P = G.players[i], b = bases[i - 1];
    const s = addSettlement(b.x - 2, b.y - 2);
    if (M.nomad) {
      // a few villagers somewhere out in the wilds, the same distance from a free Settlement for everyone
      const a = rnd() * Math.PI * 2, d = 11 + rnd() * 3;
      const p = freeTileNear(clamp(Math.round(b.x + Math.cos(a) * d), 3, MW - 4), clamp(Math.round(b.y + Math.sin(a) * d), 3, MH - 4), 8) || { x: b.x, y: b.y };
      for (let k = 0; k < 3; k++) { const f = freeTileNear(p.x + (k % 2), p.y + (k >> 1), 3) || p; spawnUnit(FACTIONS[P.faction].villager, i, f.x + .5, f.y + .5); }
      if (!opts.players[i - 1].ai) { G.reveals.push({ x: s.tx + 2, y: s.ty + 2, r: 5, until: 120 }); G.objMarks = [{ x: s.tx + 2, y: s.ty + 2 }]; }
    } else {
      const tc = placeBuilding('tc', i, s.tx, s.ty, true);
      for (let k = 0; k < 5; k++) spawnNear(tc, FACTIONS[P.faction].villager, i);
    }
    if (opts.players[i - 1].ai) initAI(P, opts.players[i - 1].ai);
  }
  if (M.koth) { const k = placeBuilding('korin', 0, Math.floor(MW / 2) - 1, Math.floor(MH / 2) - 1, true); k.invuln = 1e12; G.korin = k.id; G.koth = { team: 0, held: 0 }; }
  G.speedMul = M.speed || 1;
  refreshLists();
  setupBalls();
  if (opts.relics !== false) setupRelics(bases);
  refreshLists();
  updateFog();
  economy(0);
  return G;
}
function refreshLists() {
  G.units = G.ents.filter(e => e.kind === 'unit' && !e.dead);
  G.blds = G.ents.filter(e => e.kind === 'building' && !e.dead);
  G.ress = G.ents.filter(e => e.kind === 'res' && !e.dead);
}
