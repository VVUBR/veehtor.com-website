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
    placing: null, targeting: null, fogT: 0, units: [], blds: [], ress: [], groups: {}, headless: !!opts.headless, revealAll: !!opts.revealAll, scn: null, me: 1, chunkDirtyAll: true,
  });
}
const START_RES = { standard: { food: 300, wood: 300, gold: 150, ki: 0 }, high: { food: 1000, wood: 1000, gold: 1000, ki: 40 } };
// opts: { map, players: [{ faction, major, team, ai, color, name }], seed, victory, resources, dragonBalls, headless }
function startSkirmish(opts) {
  opts = Object.assign({ map: 'earth', victory: 'conquest', resources: 'standard', dragonBalls: true }, opts);
  opts.seed = opts.seed || ((Math.random() * 1e9) | 0);
  resetState(opts);
  G.players = [gaiaPlayer()];
  opts.players.forEach((p, i) => G.players.push(makePlayer(i + 1, Object.assign({ color: i + 1, team: i + 1 }, p))));
  const meIdx = opts.players.findIndex(p => !p.ai);
  G.me = meIdx >= 0 ? meIdx + 1 : 0;
  if (!G.me) G.revealAll = true;
  const bases = genSkirmish({ map: opts.map, players: opts.players, seed: opts.seed });
  pathAlloc(); gridAlloc(); computeRegions();
  G.players.forEach(P => { if (!P.id) return; Object.assign(P.res, START_RES[opts.resources] || START_RES.standard); });
  for (let i = 1; i < G.players.length; i++) {
    const P = G.players[i], b = bases[i - 1];
    const s = addSettlement(b.x - 2, b.y - 2);
    const tc = placeBuilding('tc', i, s.tx, s.ty, true);
    for (let k = 0; k < 5; k++) spawnNear(tc, FACTIONS[P.faction].villager, i);
    if (opts.players[i - 1].ai) initAI(P, opts.players[i - 1].ai);
  }
  refreshLists();
  setupBalls();
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
