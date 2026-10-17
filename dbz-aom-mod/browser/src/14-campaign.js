// =====================================================================
// 14. CAMPAIGN: scenario engine, dialogue, objectives, seven missions
// =====================================================================
const SPEAKERS = {
  goku: ['Goku', () => FORMS.goku_base.look], gokussj: ['Goku', () => FORMS.goku_ssj1.look], piccolo: ['Piccolo', () => U.piccolo.look], krillin: ['Krillin', () => U.krillin.look],
  gohan: ['Gohan', () => FORMS.gohan_base.look], gohanssj2: ['Gohan', () => FORMS.gohan_ssj2.look], raditz: ['Raditz', () => U.raditz.look], nappa: ['Nappa', () => U.nappa.look],
  vegeta: ['Vegeta', () => FORMS.vegeta_base.look], frieza: ['Frieza', () => FORMS.frieza_base.look], friezaf: ['Frieza', () => FORMS.frieza_final.look], kami: ['Kami', () => PATRON_LOOKS.kami],
  bulma: ['Bulma', () => PATRON_LOOKS.bulma], kingkai: ['King Kai', () => PATRON_LOOKS.kingkai], guru: ['Grand Elder Guru', () => ({ r: 'human', skin: '#6fbf4a', hair: 'none', antenna: true, top: '#f4f4f4', pants: '#f4f4f4', belt: '#ffcc33', build: 'bulky', keepColors: true })],
  dende: ['Dende', () => PATRON_LOOKS.dende], gero: ['Dr. Gero', () => PATRON_LOOKS.gero], a17: ['Android 17', () => U.a17.look], a18: ['Android 18', () => U.a18.look],
  cell: ['Cell', () => FORMS.cell_perfect.look], dodoria: ['Dodoria', () => ({ r: 'brute' })], zarbon: ['Zarbon', () => PATRON_LOOKS.zarbon], blue: ['General Blue', () => U.blue.look],
};
// ---------- dialogue ----------
const DLG = { queue: [], cur: null, t: 0 };
function say(spk, text, o) { if (G.headless) return; DLG.queue.push({ spk, text, dur: (o && o.dur) || clamp(2.6 + text.length / 26, 3.5, 10), pause: o && o.pause }); }
function tickDialogue(real) {
  if (!DLG.cur && DLG.queue.length && !G.over) showLine(DLG.queue.shift());
  if (DLG.cur) { DLG.t += real; if (DLG.t >= DLG.cur.dur) nextLine(); }
}
function showLine(l) {
  DLG.cur = l; DLG.t = 0;
  const sp = SPEAKERS[l.spk] || [l.spk, () => ({ r: 'human' })];
  $('dlg-name').textContent = sp[0]; $('dlg-text').textContent = l.text; $('dialogue').hidden = false;
  const c = $('dlg-portrait').getContext('2d'), L = sp[1]();
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 152, 152);
  const g = c.createRadialGradient(76, 50, 6, 76, 76, 110); g.addColorStop(0, '#3a4a7a'); g.addColorStop(1, '#0b1124'); c.fillStyle = g; c.fillRect(0, 0, 152, 152);
  const zoom = L.r === 'brute' ? 2.6 : 4.6;
  c.save(); c.translate(68, L.r === 'brute' ? 160 : 214); c.scale(zoom, zoom); drawFigure(c, L, 'idle', 0, null); c.restore();
  if (l.pause) { DLG.paused = true; G.paused = true; }
}
function nextLine() {
  if (DLG.cur && DLG.cur.pause && DLG.paused) { DLG.paused = false; if ($('scr-pause').hidden && $('cheatbox').hidden && $('scr-wish').hidden) G.paused = false; }
  DLG.cur = null;
  if (!DLG.queue.length) $('dialogue').hidden = true;
}
$('dialogue').addEventListener('click', nextLine);

// ---------- objectives ----------
function renderObjectives() {
  const el = $('objectives'); const S = G.scn; if (!S) return;
  const sig = S.objs.map(o => o.id + o.state + (o.counter ? o.counter() : '')).join('|');
  if (sig === S.objSig) return; S.objSig = sig;
  el.innerHTML = `<h4>${esc(S.m.title)}</h4><ul>${S.objs.filter(o => !o.hidden).map(o => `<li class="${o.state}${o.optional ? ' opt' : ''}">${esc(o.text)}${o.optional ? ' (optional)' : ''}${o.counter && o.state === 'active' ? `<span class="counter">${esc(o.counter())}</span>` : ''}</li>`).join('')}</ul>`;
}

// ---------- scenario API ----------
function makeScenario(m, diffKey) {
  const d = { easy: .7, normal: 1, hard: 1.35 }[diffKey];
  const S = {
    m, diffKey, d, objs: [], triggers: [], timers: [], vars: {}, locked: new Set(), maxAge: 4, noConquest: true, t: 0,
    // terrain helpers
    circle: (t, x, y, r, jit) => paintCircle(t, x, y, r, jit !== false),
    ridge(pts, w) { for (let i = 0; i < pts.length - 1; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], n = Math.ceil(dist(ax, ay, bx, by)); for (let s = 0; s <= n; s++) paintCircle(T_ROCK, lerp(ax, bx, s / n), lerp(ay, by, s / n), w || 1, false); } },
    river(pts, w, fords) { for (let i = 0; i < pts.length - 1; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], n = Math.ceil(dist(ax, ay, bx, by)); for (let s = 0; s <= n; s++) paintCircle(T_WATER, lerp(ax, bx, s / n), lerp(ay, by, s / n), w || 1.5, false); } for (const [fx, fy, fr] of fords || []) paintCircle(T_SHALLOW, fx, fy, fr || 2.2, false); },
    nature(o) {
      const keep = o.keep || [];
      const ok = (x, y, pad) => !keep.some(k => dist(k[0], k[1], x, y) < k[2] + (pad || 0));
      for (let i = 0; i < (o.lakes || 0); i++) { const x = rint(8, MW - 9), y = rint(8, MH - 9); if (ok(x, y, 6)) paintCircle(T_WATER, x, y, 2 + rnd() * 2.5, true); }
      for (let i = 0; i < (o.ridges || 0); i++) { const x = rint(6, MW - 7), y = rint(6, MH - 7); if (ok(x, y, 4)) cliffRidge(x, y, (px, py, p) => !ok(px, py, p)); }
      if (o.dirt) for (let i = 0; i < MW * MH; i++) { const x = i % MW, y = (i / MW) | 0; if (G.map.terr[i] === T_GRASS && G.noise(x / 9 + 50, y / 9, 2) > .64) G.map.terr[i] = T_DIRT; }
      if (o.snow) for (let i = 0; i < MW * MH; i++) if (G.map.terr[i] === T_GRASS && G.map.hgt[i] > .62) G.map.terr[i] = T_SNOW;
      S._forests = o.forests || 0; S._keep = keep;
    },
    plantForests() {
      const keep = S._keep || [], ok = (x, y, pad) => !keep.some(k => dist(k[0], k[1], x, y) < k[2] + (pad || 0));
      const free = (x, y) => inMap(x, y) && !G.map.block[idx(x, y)] && isLand(x, y) && G.map.terr[idx(x, y)] !== T_SHALLOW && !G.map.settle[idx(x, y)];
      for (let i = 0; i < S._forests; i++) { const cx = rint(3, MW - 4), cy = rint(3, MH - 4); if (!ok(cx, cy, 2)) continue; const r = 1.8 + rnd() * 2.8; for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) if (dist(x, y, cx, cy) <= r && rnd() < .8 && free(x, y) && ok(x, y, 0)) addRes('tree', x, y); }
      for (let x = 0; x < MW; x++) for (const y of [0, 1, MH - 1, MH - 2]) if (rnd() < .6 && free(x, y)) addRes('tree', x, y);
      for (let y = 0; y < MH; y++) for (const x of [0, 1, MW - 1, MW - 2]) if (rnd() < .6 && free(x, y)) addRes('tree', x, y);
    },
    clear(x, y, r, t) { for (let yy = Math.floor(y - r); yy <= y + r; yy++) for (let xx = Math.floor(x - r); xx <= x + r; xx++) if (inMap(xx, yy) && dist(xx + .5, yy + .5, x, y) <= r) { const i = idx(xx, yy), tt = G.map.terr[i]; if (tt === T_WATER || tt === T_ROCK || tt === T_SHALLOW || t !== undefined) G.map.terr[i] = t !== undefined ? t : T_DIRT; } },
    // resources
    gold: (x, y, amt) => { if (footprintFree(x, y, 2, 2)) addRes('gold', x, y, amt || 3000); },
    berries(x, y, n) { for (let k = 0; k < (n || 6); k++) { const q = [x + (k % 3), y + Math.floor(k / 3)]; if (footprintFree(q[0], q[1], 1, 1)) addRes('berry', q[0], q[1]); } },
    herd(key, x, y, n) { for (let k = 0; k < n; k++) { const f = freeTileNear(x + (k % 2), y + (k >> 1), 4); if (f) spawnUnit(key, 0, f.x + .5, f.y + .5); } },
    grove(x, y, r) { for (let yy = Math.floor(y - r); yy <= y + r; yy++) for (let xx = Math.floor(x - r); xx <= x + r; xx++) if (dist(xx, yy, x, y) <= r && rnd() < .85 && footprintFree(xx, yy, 1, 1)) addRes('tree', xx, yy); },
    resAround(x, y, o) { o = o || {}; S.gold(x + 7, y + 3); S.gold(x - 2, y + 10); S.berries(x + 5, y - 6); S.herd(o.hunt || 'stego', x - 9, y - 4, 4); S.grove(x - 10, y + 6, 3); S.grove(x + 2, y - 11, 3); },
    // units and buildings
    player(id) { return G.players[id]; },
    tc(pid, x, y) { const s = addSettlement(x - 2, y - 2); return placeBuilding('tc', pid, s.tx, s.ty, true); },
    bld(key, pid, tx, ty, built) { return placeBuilding(key, pid, tx, ty, built !== false); },
    bldNear(key, pid, near, rmin, rmax) { const sp = findSpot(G.players[pid], key, near, rmin || 4, rmax || 12); return sp ? placeBuilding(key, pid, sp.tx, sp.ty, true) : null; },
    units(key, pid, x, y, n, form) { const out = []; for (let k = 0; k < (n || 1); k++) { const a = k * 2.4, r = k ? .7 + k * .12 : 0; let ux = x + Math.cos(a) * r, uy = y + Math.sin(a) * r; if (!walkableAt(ux, uy, teamOf(pid))) { const f = freeTileNear(clamp(Math.floor(ux), 0, MW - 1), clamp(Math.floor(uy), 0, MH - 1), 6); if (f) { ux = f.x + .5; uy = f.y + .5; } } out.push(spawnUnit(key, pid, ux, uy, form)); } return out; },
    hero(key, pid, x, y, form, nick) { const u = S.units(key, pid, x, y, 1, form)[0]; if (nick) u.nick = nick; return u; },
    attack(list, x, y) { for (const u of list) if (u && !u.dead) setOrder(u, { type: 'move', x: x + (rnd() - .5) * 2, y: y + (rnd() - .5) * 2, amove: true }); },
    wave(pid, comp, x, y, tx, ty) { const out = []; for (const [k, n] of comp) out.push(...S.units(k, pid, x, y, Math.max(1, Math.round(n)))); S.attack(out, tx, ty); return out; },
    ai(pid, diffKey, flags) { initAI(G.players[pid], diffKey, flags); },
    reveal(x, y, r, secs) { G.reveals.push({ x, y, r, until: G.time + (secs || 30) }); },
    lock(...k) { for (const x of k) S.locked.add(x); },
    // objectives and flow
    obj(id, text, o) { S.objs.push(Object.assign({ id, text, state: 'active' }, o || {})); S.objSig = ''; },
    setObj(id, state, text) { const o = S.objs.find(q => q.id === id); if (!o || o.state === state) return; o.state = state; if (text) o.text = text; S.objSig = ''; if (state === 'done' && !G.headless) { SFX.play('research'); toast(`Objective complete: ${o.text}`, 'good'); } if (state === 'failed' && !G.headless) toast(`Objective failed: ${o.text}`, 'warn'); },
    showObj(id) { const o = S.objs.find(q => q.id === id); if (o) { o.hidden = false; S.objSig = ''; } },
    done: id => { const o = S.objs.find(q => q.id === id); return o && o.state === 'done'; },
    after(t, fn) { S.timers.push({ at: S.t + t, fn }); },
    when(cond, fn) { S.triggers.push({ cond, fn, once: true }); },
    every(t, fn) { S.triggers.push({ every: t, next: S.t + t, fn }); },
    say: (spk, text, o) => say(spk, text, o),
    win() { if (G.over) return; endGame(humanP().team, 'scenario'); },
    lose(reason) { if (G.over) return; S.loseReason = reason; endGame(-1, 'scenario'); },
    alive: e => e && !e.dead,
    count: (pid, fn) => G.units.filter(u => u.owner === pid && !u.dead && (!fn || fn(u))).length,
    tcLost: pid => !G.blds.some(b => b.owner === pid && b.key === 'tc') && !G.units.some(u => u.owner === pid && u.def.cls === 'villager'),
    mark(x, y) { G.objMarks = G.objMarks || []; G.objMarks.push({ x, y }); },
    unmark() { G.objMarks = []; },
  };
  S.onEnd = won => { if (won) missionWon(m); };
  S.tick = dt => {
    S.t += dt;
    S.acc = (S.acc || 0) + dt;
    if (S.acc < .25) return;
    S.acc = 0;
    for (let i = S.timers.length - 1; i >= 0; i--) if (S.t >= S.timers[i].at) { const tm = S.timers.splice(i, 1)[0]; tm.fn(); }
    for (let i = S.triggers.length - 1; i >= 0; i--) {
      const tr = S.triggers[i];
      if (tr.every) { if (S.t >= tr.next) { tr.next = S.t + tr.every; if (tr.fn() === false) S.triggers.splice(i, 1); } continue; }
      if (tr.cond()) { S.triggers.splice(i, 1); tr.fn(); }
    }
    if (m.check) m.check(S);
  };
  return S;
}
function startMission(idx, diffKey) {
  const m = CAMPAIGN[idx];
  const opts = { map: m.biome, victory: 'conquest', resources: 'standard', dragonBalls: !!m.dragonBalls, players: m.players, seed: m.seed, campaign: idx };
  resetState(opts);
  G.players = [gaiaPlayer()];
  m.players.forEach((p, i) => G.players.push(makePlayer(i + 1, Object.assign({ color: p.color || i + 1, team: p.team || i + 1 }, p))));
  G.me = 1;
  rand = mulberry32(m.seed);
  initMap(m.size, m.size, m.biome, m.seed);
  G.settlements = []; G.camps = [];
  const S = makeScenario(m, diffKey);
  G.scn = S;
  m.terrain(S);
  finalizeBlocks();
  pathAlloc(); gridAlloc();
  m.setup(S);
  if (S._forests !== undefined) S.plantForests();
  if (m.connect) ensureConnected(m.connect[0], m.connect.slice(1));
  scatterDecor();
  computeRegions();
  refreshLists();
  for (const P of G.players) if (P.id && P.ai) { P.ai.nextWaveAt = Math.max(P.ai.nextWaveAt, (P.ai.flags.firstWave || P.ai.diff.firstWave)); }
  if (m.dragonBalls) setupBalls();
  refreshLists();
  updateFog(); economy(0);
  DLG.queue.length = 0; DLG.cur = null; DLG.paused = false;
  if (m.start) m.start(S);
  return G;
}

// ---------- campaign menu and briefing ----------
function progress() { return store.get('campaign', { unlocked: 1, won: {} }); }
let selMission = 0, campDiff = store.get('campDiff', 'normal');
function openCampaignMenu() {
  const pr = progress(), el = $('mission-list'); el.innerHTML = '';
  selMission = Math.min(selMission, pr.unlocked - 1);
  CAMPAIGN.forEach((m, i) => {
    const b = document.createElement('button'); const locked = i >= pr.unlocked;
    b.className = 'mission frame' + (locked ? ' locked' : '') + (i === selMission ? ' sel' : '');
    b.innerHTML = `<span class="saga">${i + 1}. ${esc(m.saga)}</span><h3>${esc(m.title)}</h3><p>${esc(m.blurb)}</p>${pr.won[m.id] ? `<span class="badge">✓ ${cap1(pr.won[m.id])}</span>` : locked ? '<span class="badge" style="color:var(--dim)">Locked</span>' : ''}`;
    b.disabled = locked;
    b.addEventListener('click', () => { selMission = i; openCampaignMenu(); });
    b.addEventListener('dblclick', () => openBriefing(i));
    el.appendChild(b);
  });
  segSet('c-diff', 'd', campDiff);
  showScreen('scr-campaign');
}
for (const b of $('c-diff').querySelectorAll('button')) b.addEventListener('click', () => { campDiff = b.dataset.d; store.set('campDiff', campDiff); segSet('c-diff', 'd', campDiff); });
$('c-back').addEventListener('click', () => showScreen('scr-menu'));
$('c-play').addEventListener('click', () => openBriefing(selMission));
function openBriefing(i) {
  selMission = i;
  const m = CAMPAIGN[i];
  $('b-saga').textContent = `Mission ${i + 1} · ${m.saga}`;
  $('b-title').textContent = m.title;
  $('b-story').innerHTML = m.story.map(p => `<p>${esc(p)}</p>`).join('');
  $('b-goals').innerHTML = m.goals.map(g => `<li>${esc(g)}</li>`).join('');
  const c = $('b-map').getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 440, 220);
  const g = c.createLinearGradient(0, 0, 440, 0); g.addColorStop(0, '#173a7a'); g.addColorStop(.5, '#0b1124'); g.addColorStop(1, '#6a1a1a'); c.fillStyle = g; c.fillRect(0, 0, 440, 220);
  const side = (list, x0, dir) => list.forEach((k, j) => { const sp = SPEAKERS[k]; if (!sp) return; const L = sp[1](); c.save(); c.translate(x0 + dir * j * 52, 236); const z = L.r === 'brute' ? 2.4 : 3.6; c.scale(dir * z, z); drawFigure(c, L, 'idle', 0, null); c.restore(); });
  side(m.cast[0], 70, 1); side(m.cast[1], 370, -1);
  c.font = '400 54px Bangers, Impact'; c.textAlign = 'center'; c.lineWidth = 6; c.strokeStyle = '#3a1200'; c.strokeText('VS', 220, 128); c.fillStyle = '#ffd34d'; c.fillText('VS', 220, 128);
  showScreen('scr-brief');
}
$('b-back').addEventListener('click', openCampaignMenu);
$('b-go').addEventListener('click', () => launch({ kind: 'mission', mission: selMission, diff: campDiff }));
function missionWon(m) {
  const pr = progress(), i = CAMPAIGN.indexOf(m);
  pr.won[m.id] = G.scn.diffKey; pr.unlocked = Math.max(pr.unlocked, Math.min(CAMPAIGN.length, i + 2));
  store.set('campaign', pr);
}

// ---------- the missions ----------
const EARTH = { faction: 'earth', major: 'kami', name: 'Earth Defenders', team: 1, color: 1 };
const lostCheck = S => { if (S.tcLost(1) && !G.over) S.lose('The Earth Defenders have no Town Center and no villagers left.'); };
const CAMPAIGN = [
  { id: 'm1', saga: 'Saiyan Saga', title: 'A Saiyan Falls from the Sky', biome: 'earth', size: 72, seed: 101,
    blurb: 'Learn the basics: gather, build a Dojo, train fighters, and stop Raditz.',
    story: ['A space pod has crashed in the mountains north-east of the village. Inside was Raditz, a Saiyan warrior who claims Goku is his brother, sent to Earth to conquer it.', 'Goku and his old rival Piccolo must team up. But two fighters are not enough: the village needs a Dojo and an army of Turtle School fighters.'],
    goals: ['Stockpile 250 Capsule Alloy', 'Build a Turtle & Crane Dojo', 'Train 5 Turtle School Fighters', "Defeat Raditz and destroy his Attack Pod", 'Keep your Town Center standing'],
    cast: [['goku', 'piccolo'], ['raditz']],
    players: [EARTH, { faction: 'ff', major: 'kingvegeta', name: 'Raditz', team: 2, ai: null }],
    terrain(S) { S.nature({ lakes: 3, ridges: 4, forests: 18, dirt: true, keep: [[14, 58, 12], [56, 14, 9], [36, 36, 6]] }); S.clear(14, 58, 9, T_ROAD); S.clear(56, 14, 6, T_DIRT); },
    setup(S) {
      const tc = S.tc(1, 14, 58); S.units('colonist', 1, 17, 61, 4); S.resAround(14, 58);
      S.hero('goku', 1, 19, 57); S.hero('piccolo', 1, 20, 58);
      G.players[1].res = { food: 200, wood: 100, gold: 120, ki: 20 };
      S.vars.pod = S.bld('attackpod', 2, 56, 13);
      S.vars.raditz = S.hero('raditz', 2, 57, 16);
      S.vars.squad = [...S.units('soldier', 2, 54, 17, 3), ...S.units('saiyan', 2, 59, 15, 3)];
      S.gold(40, 30); S.herd('stego', 34, 46, 3); S.gold(46, 50);
      S.maxAge = 1; S.lock('tc', 'stable', 'armory', 'market', 'fortress', 'wonder', 'wall', 'gate');
      G.connectFrom = { x: 14, y: 58 };
      ensureConnected({ x: 14, y: 58 }, [{ x: 56, y: 14 }, { x: 36, y: 36 }]);
      S.obj('wood', 'Stockpile 250 Capsule Alloy', { counter: () => `${Math.min(250, Math.floor(G.players[1].res.wood))}/250` });
      S.obj('dojo', 'Build a Turtle & Crane Dojo');
      S.obj('army', 'Train 5 Turtle School Fighters', { counter: () => `${S.count(1, u => u.key === 'fighter')}/5` });
      S.obj('raditz', 'Defeat Raditz');
      S.obj('pod', "Destroy Raditz's Attack Pod");
    },
    start(S) {
      S.say('goku', 'Piccolo, did you feel that? Something huge just landed past the mountains.', { pause: true });
      S.say('piccolo', 'A Saiyan. His power is beyond either of us. We need an army, Goku.', { pause: true });
      S.say('kami', 'Select your villagers and right-click the trees to gather Capsule Alloy. Right-click Senzu bushes and dinosaurs for Rations.');
      S.mark(56, 14);
      S.when(() => G.players[1].res.wood >= 250 || G.blds.some(b => b.owner === 1 && b.key === 'barracks'), () => { S.setObj('wood', 'done'); S.say('kami', 'Now select a villager, open "Military buildings" in the command panel and place a Turtle & Crane Dojo.'); });
      S.when(() => G.blds.some(b => b.owner === 1 && b.key === 'barracks' && b.built), () => { S.setObj('wood', 'done'); S.setObj('dojo', 'done'); S.say('kami', 'Select the Dojo and train Turtle School Fighters. Infantry are strong against cavalry. Houses raise your population limit.'); });
      S.when(() => S.count(1, u => u.key === 'fighter') >= 5, () => { S.setObj('army', 'done'); S.say('goku', "That's a team! Let's pay my so-called brother a visit."); S.say('kami', 'Select your army (press M), then press A and click near the Attack Pod in the north-east to attack-move.'); S.reveal(56, 14, 8, 20); });
      S.after(60 * (S.diffKey === 'easy' ? 11 : S.diffKey === 'hard' ? 6 : 8), () => { if (S.alive(S.vars.raditz)) { S.say('raditz', 'Kakarot! Join me, or watch this pathetic village burn!'); S.attack([S.vars.raditz, ...S.vars.squad], 14, 58); } });
      S.when(() => !S.alive(S.vars.raditz), () => { S.setObj('raditz', 'done'); S.say('raditz', 'Fools… my comrades heard everything. They will come… and they are far stronger than me…'); });
      S.when(() => !S.alive(S.vars.pod), () => S.setObj('pod', 'done'));
    },
    check(S) { if (S.done('raditz') && S.done('pod')) S.win(); lostCheck(S); },
    win: 'Raditz is defeated, but his comrades are already on their way. Earth has one year to prepare.' },

  { id: 'm2', saga: 'Saiyan Saga', title: 'The Saibamen Harvest', biome: 'wasteland', size: 80, seed: 202,
    blurb: 'Hold the base against waves of Saibamen until Goku arrives, then defeat Nappa.',
    story: ['One year later, two Saiyan pods land in the wasteland: Nappa and the Saiyan prince, Vegeta. Goku is still racing back from King Kai\'s planet along Snake Way.', 'Krillin, Piccolo and young Gohan must hold the line. Nappa plants Saibamen in the soil, and they hatch hungry.'],
    goals: ['Survive until Goku arrives', 'Defeat Nappa', 'Keep your Town Center standing', 'Optional: advance to the Namek Saga and choose a patron'],
    cast: [['krillin', 'piccolo', 'gohan'], ['nappa', 'vegeta']],
    players: [EARTH, { faction: 'ff', major: 'kingvegeta', name: 'Nappa', team: 2, ai: null }],
    terrain(S) {
      S.nature({ ridges: 5, forests: 10, keep: [[40, 62, 12], [40, 10, 8]] });
      S.ridge([[10, 40], [30, 44]], 1.2); S.ridge([[50, 44], [70, 40]], 1.2); S.ridge([[24, 24], [32, 30]], 1); S.ridge([[56, 24], [48, 30]], 1);
      S.circle(T_WATER, 18, 64, 3); S.circle(T_WATER, 64, 66, 3);
      S.clear(40, 62, 9, T_ROAD); S.clear(40, 10, 6, T_DIRT);
    },
    setup(S) {
      const P = G.players[1];
      const tc = S.tc(1, 40, 64);
      S.bld('house', 1, 34, 66); S.bld('house', 1, 46, 67); S.bld('barracks', 1, 44, 58); S.bld('temple', 1, 32, 58); S.bld('granary', 1, 35, 70); S.bld('tower', 1, 38, 54);
      S.units('colonist', 1, 42, 69, 10);
      S.resAround(40, 64, { hunt: 'boar' });
      S.hero('krillin', 1, 40, 58); S.hero('piccolo', 1, 42, 57); S.hero('gohan', 1, 38, 57, 'gohan_base');
      S.units('fighter', 1, 41, 56, 4); S.units('gunner', 1, 39, 56, 3);
      P.res = { food: 500, wood: 400, gold: 300, ki: 30 };
      S.vars.pods = [S.bld('attackpod', 2, 36, 9), S.bld('attackpod', 2, 44, 9)];
      S.vars.nappa = S.hero('nappa', 2, 40, 12); S.vars.vegeta = S.hero('vegeta', 2, 42, 11, 'vegeta_base');
      S.vars.vegeta.invuln = 1e9; S.vars.nappa.invuln = 1e9;
      S.gold(24, 50); S.gold(56, 52); S.herd('boar', 60, 70, 3);
      S.maxAge = 2; S.lock('fortress', 'market', 'wonder', 'tc');
      ensureConnected({ x: 40, y: 64 }, [{ x: 40, y: 10 }]);
      S.vars.survive = { easy: 480, normal: 600, hard: 720 }[S.diffKey];
      S.obj('survive', 'Survive until Goku arrives', { counter: () => fmtTime(Math.max(0, S.vars.survive - S.t)) });
      S.obj('nappa', 'Defeat Nappa', { hidden: true });
      S.obj('age', 'Advance to the Namek Saga', { optional: true });
    },
    start(S) {
      S.say('piccolo', "They've planted something in the ground. Saibamen. Get ready!", { pause: true });
      S.say('kingkai', "Hold on! Goku is still on Snake Way. Build towers and walls, and keep everyone alive until he gets there.");
      S.say('kami', 'Tip: advancing to the Namek Saga at your Town Center lets you choose a patron, who grants a god power you cast from the left column.');
      S.mark(40, 10);
      let wave = 0;
      S.every(70, () => {
        if (S.done('survive')) return false;
        wave++;
        const n = (3 + wave * 1.4) * S.d;
        S.wave(2, [['saibaman', n], ...(wave >= 4 ? [['saiyan', (wave - 2) * S.d]] : [])], 40, 13, 40, 62);
        if (wave === 1) S.say('nappa', 'Go, my Saibamen! Tear them apart!');
      });
      S.when(() => G.players[1].age >= 2, () => S.setObj('age', 'done'));
      S.when(() => S.t >= S.vars.survive, () => {
        S.setObj('survive', 'done'); S.showObj('nappa');
        const g = S.hero('goku', 1, 40, 74); g.flying = true; g.lift = 1;
        S.say('goku', 'Sorry I took so long. Leave Nappa to me.');
        S.say('vegeta', "Nappa, stop playing. Finish them, or I'll finish you.");
        S.vars.nappa.invuln = 0;
        S.wave(2, [['saibaman', 4 * S.d], ['saiyan', 4 * S.d]], 40, 13, 40, 62);
        S.attack([S.vars.nappa], 40, 62);
      });
      S.when(() => S.done('survive') && !S.alive(S.vars.nappa), () => { S.setObj('nappa', 'done'); S.say('vegeta', 'Useless. I will deal with you myself, Kakarot… another day.'); if (S.alive(S.vars.vegeta)) { S.vars.vegeta.dead = true; } S.after(3, () => S.win()); });
    },
    check: lostCheck,
    win: 'Nappa is defeated and Vegeta has retreated to lick his wounds. But the prince of the Saiyans will be back.' },

  { id: 'm3', saga: 'Saiyan Saga', title: 'Prince of All Saiyans', biome: 'earth', size: 88, seed: 303, dragonBalls: true,
    blurb: "Assault Vegeta's camp. Beware the full moon.",
    story: ["Vegeta has built a Frieza Force camp in the hills and is gathering the Dragon Balls to wish for immortality.", "Destroy his Command Pod and defeat the prince. Saiyans have one more trick: under a full moon they become Great Apes."],
    goals: ["Destroy the Frieza Force Command Pod", 'Defeat Vegeta', 'Optional: bring 2 Dragon Balls to your Temple', 'Keep at least one Town Center or villager'],
    cast: [['goku', 'krillin', 'gohan'], ['vegeta']],
    players: [EARTH, { faction: 'ff', major: 'kingvegeta', name: 'Vegeta', team: 2, ai: 'normal' }],
    terrain(S) { S.nature({ lakes: 4, ridges: 7, forests: 26, dirt: true, keep: [[16, 72, 12], [72, 16, 13]] }); S.clear(16, 72, 9, T_ROAD); S.clear(72, 16, 9, T_ROAD); },
    setup(S) {
      S.tc(1, 16, 72); S.units('colonist', 1, 19, 75, 7); S.resAround(16, 72);
      S.hero('goku', 1, 21, 70); S.hero('krillin', 1, 22, 71); S.hero('gohan', 1, 20, 69, 'gohan_base'); S.units('fighter', 1, 22, 68, 4);
      G.players[1].res = { food: 400, wood: 400, gold: 300, ki: 30 };
      const P2 = G.players[2];
      S.vars.tc2 = S.tc(2, 72, 16); S.units('worker', 2, 70, 19, 9); S.resAround(72, 16, { hunt: 'boar' });
      for (const k of ['house', 'house', 'house', 'barracks', 'temple', 'granary', 'storehouse', 'tower']) S.bldNear(k, 2, S.vars.tc2, 4, 11);
      S.vars.vegeta = S.hero('vegeta', 2, 68, 22, 'vegeta_base'); S.units('saiyan', 2, 66, 22, 5); S.units('soldier', 2, 67, 24, 4);
      P2.res = { food: 400, wood: 400, gold: 300, ki: 20 };
      S.ai(2, S.diffKey, { maxAge: 2, noExpand: true, firstWave: { easy: 720, normal: 540, hard: 400 }[S.diffKey] });
      G.camps = [{ x: 44, y: 44 }, { x: 30, y: 30 }, { x: 58, y: 58 }, { x: 22, y: 50 }, { x: 50, y: 22 }, { x: 64, y: 40 }, { x: 40, y: 66 }];
      for (const c of G.camps) S.clear(c.x, c.y, 2.5, T_DIRT);
      S.maxAge = 2; S.lock('wonder', 'fortress', 'market');
      ensureConnected({ x: 16, y: 72 }, [{ x: 72, y: 16 }, ...G.camps]);
      S.obj('tc', 'Destroy the Frieza Force Command Pod');
      S.obj('vegeta', 'Defeat Vegeta');
      S.obj('balls', 'Bring 2 Dragon Balls to your Temple', { optional: true, counter: () => `${ballsHeld(1)}/2` });
    },
    start(S) {
      S.say('goku', "Vegeta's camp is in the north-east. Krillin, Gohan, let's end this.", { pause: true });
      S.say('kami', 'Build a Temple (Kami\'s Lookout) so your heroes can store Dragon Balls. Two of them would fund the war.');
      S.mark(72, 16);
      S.when(() => S.alive(S.vars.vegeta) && S.vars.vegeta.hp < maxHp(S.vars.vegeta) * .4, () => {
        const v = S.vars.vegeta;
        S.say('vegeta', 'Enough! Behold the true power of a Saiyan under the full moon!');
        fxPush({ type: 'moon', t: 0, dur: 3 });
        const ape = spawnUnit('ape', 2, v.x, v.y); ape.nick = 'Great Ape Vegeta';
        S.vars.ape = ape; v.dead = true; G.sel = G.sel.filter(s => s !== v);
        S.setObj('vegeta', 'active', 'Defeat Great Ape Vegeta');
        S.attack([ape], 16, 72);
      });
      S.when(() => S.vars.ape && !S.alive(S.vars.ape), () => { S.setObj('vegeta', 'done'); S.say('vegeta', 'My tail… This is not over, Kakarot!'); });
      S.when(() => !S.alive(S.vars.tc2), () => S.setObj('tc', 'done'));
      S.when(() => ballsHeld(1) >= 2, () => { S.setObj('balls', 'done'); G.players[1].res.gold += 400; toast('Kami rewards you with 400 Zeni.', 'gold'); });
    },
    check(S) { if (S.done('tc') && S.done('vegeta')) S.win(); lostCheck(S); },
    win: "Vegeta flees Earth in his pod. Far away, on Planet Namek, a new hunt for the Dragon Balls begins." },

  { id: 'm4', saga: 'Namek Saga', title: "Namek's Dragon Balls", biome: 'namek', size: 84, seed: 404, dragonBalls: true,
    blurb: 'A hero mission: race Vegeta for the Namekian Dragon Balls.',
    story: ["Gohan and Krillin have reached Planet Namek, home of the original Dragon Balls. Frieza's soldiers are tearing the planet apart looking for them, and Vegeta is hunting them too.", "Grand Elder Guru has offered his house as a safe place. His Namekian followers will gather Zeni and meditate for Ki so you can call more Namekian warriors."],
    goals: ["Bring 4 Dragon Balls to Guru's House", 'Keep Gohan or Krillin alive', "Don't let Vegeta gather 4 Dragon Balls"],
    cast: [['gohan', 'krillin', 'guru'], ['vegeta', 'dodoria']],
    players: [Object.assign({}, EARTH, { major: 'kami' }), { faction: 'ff', major: 'frieza', name: 'Frieza Force', team: 2, ai: 'normal' }],
    terrain(S) {
      for (let i = 0; i < MW * MH; i++) { const x = i % MW, y = (i / MW) | 0; const v = G.noise(x / 13 + 9, y / 13 - 4, 3); if (v < .36) G.map.terr[i] = T_WATER; else if (v < .42) G.map.terr[i] = T_SHALLOW; else if (v < .46) G.map.terr[i] = T_SAND; }
      S.nature({ forests: 10, keep: [[14, 42, 10], [70, 42, 11]] }); S.clear(14, 42, 8, T_GRASS); S.clear(70, 42, 9, T_ROAD);
    },
    setup(S) {
      const P = G.players[1];
      P.minors = ['piccolo', 'dende']; P.age = 2; recomputeMods(P);
      S.vars.guru = S.bld('guru', 1, 10, 40);
      S.units('namekNPC', 1, 15, 46, 5);
      S.gold(18, 36); S.gold(8, 50); S.berries(16, 50);
      S.vars.gohan = S.hero('gohan', 1, 18, 42, 'gohan_base'); S.vars.krillin = S.hero('krillin', 1, 18, 44); S.units('namekwarrior', 1, 20, 43, 3);
      P.res = { food: 200, wood: 0, gold: 450, ki: 60 };
      S.vars.tc2 = S.tc(2, 70, 42); S.units('worker', 2, 68, 46, 7); S.resAround(70, 42, { hunt: 'frog' });
      for (const k of ['house', 'house', 'temple', 'barracks', 'granary']) S.bldNear(k, 2, S.vars.tc2, 4, 10);
      S.vars.vegeta = S.hero('vegeta', 2, 66, 40, 'vegeta_base');
      S.vars.dodoria = S.hero('brute', 2, 60, 30, null, 'Dodoria'); S.units('soldier', 2, 60, 32, 3);
      S.vars.zarbon = S.hero('ginyu', 2, 56, 58, null, 'Zarbon'); S.units('soldier', 2, 56, 56, 3);
      G.players[2].res = { food: 300, wood: 300, gold: 300, ki: 30 };
      S.ai(2, S.diffKey, { maxAge: 2, noExpand: true, noAttack: S.diffKey === 'easy', firstWave: 600 });
      G.camps = [{ x: 30, y: 20 }, { x: 34, y: 62 }, { x: 44, y: 40 }, { x: 52, y: 16 }, { x: 52, y: 68 }, { x: 26, y: 40 }, { x: 60, y: 46 }];
      for (const c of G.camps) S.clear(c.x, c.y, 2.5, T_GRASS);
      S.lock('tc', 'house', 'granary', 'storehouse', 'farm', 'barracks', 'stable', 'armory', 'market', 'fortress', 'wonder', 'wall', 'gate', 'tower', 'temple');
      S.maxAge = 1;
      ensureConnected({ x: 14, y: 42 }, [{ x: 70, y: 42 }, ...G.camps]);
      S.obj('balls', "Bring 4 Dragon Balls to Guru's House", { counter: () => `${S.vars.guru.balls.length}/4` });
      S.obj('heroes', 'Keep Gohan or Krillin alive');
    },
    start(S) {
      S.say('guru', 'Welcome, children of Earth. Bring the Dragon Balls here, to my house, before the tyrant finds them.', { pause: true });
      S.say('krillin', "Gohan, our heroes are the only ones who can carry them. Let's stay together and let the Namekians cover us.");
      S.say('kami', "Guru's House trains Namekian Warriors and Healers with Zeni and Ki. Namekian villagers can mine Zeni or meditate there.");
      S.every(55, () => { const pts = [[40, 30], [44, 52], [30, 40]]; const p = pick(pts); S.wave(2, [['soldier', 3 * S.d], ['saiyan', 2 * S.d]], 70, 42, p[0], p[1]); });
      S.when(() => S.alive(S.vars.dodoria) && S.vars.dodoria.hp < maxHp(S.vars.dodoria) * .5, () => S.say('dodoria', 'You little brats! Lord Frieza will hear about this!'));
    },
    check(S) {
      if (S.vars.guru.balls.length >= 4) { S.setObj('balls', 'done'); S.win(); }
      if (!S.alive(S.vars.gohan) && !S.alive(S.vars.krillin) && !G.units.some(u => u.owner === 1 && (u.key === 'gohan' || u.key === 'krillin'))) { S.setObj('heroes', 'failed'); S.lose('Gohan and Krillin have both fallen.'); }
      if (ballsHeld(2) >= 4) S.lose('Vegeta gathered four Dragon Balls.');
      if (!S.alive(S.vars.guru)) S.lose("Guru's House was destroyed.");
    },
    win: "The Dragon Balls are safe with Guru, for now. But Frieza himself is coming." },

  { id: 'm5', saga: 'Namek Saga', title: "Frieza's Final Form", biome: 'namek', size: 96, seed: 505,
    blurb: "Destroy Frieza's spaceship and defeat the tyrant, through every transformation.",
    story: ["Goku has arrived on Namek, healed and stronger than ever. Frieza's forces have fortified a base around his personal spaceship.", "Frieza has transformations he has never shown anyone. And if he hurts Goku's friends, something legendary may awaken."],
    goals: ['Defeat Frieza', "Destroy Frieza's Spaceship", 'Keep at least one Town Center or villager'],
    cast: [['goku', 'krillin', 'piccolo'], ['frieza']],
    players: [EARTH, { faction: 'ff', major: 'frieza', name: 'Frieza', team: 2, ai: 'normal' }],
    terrain(S) {
      for (let i = 0; i < MW * MH; i++) { const x = i % MW, y = (i / MW) | 0; const v = G.noise(x / 15 + 2, y / 15 + 7, 3); if (v < .34) G.map.terr[i] = T_WATER; else if (v < .39) G.map.terr[i] = T_SHALLOW; else if (v < .43) G.map.terr[i] = T_SAND; }
      S.nature({ ridges: 4, forests: 16, keep: [[18, 78, 13], [76, 18, 15]] }); S.clear(18, 78, 10, T_ROAD); S.clear(76, 18, 12, T_ROAD);
    },
    setup(S) {
      S.tc(1, 18, 78); S.units('colonist', 1, 21, 81, 8); S.resAround(18, 78, { hunt: 'frog' }); S.bld('house', 1, 12, 74); S.bld('house', 1, 24, 72);
      S.vars.goku = S.hero('goku', 1, 23, 76); S.vars.krillin = S.hero('krillin', 1, 24, 77); S.hero('piccolo', 1, 22, 74); S.hero('gohan', 1, 25, 75, 'gohan_base');
      const P = G.players[1]; P.res = { food: 500, wood: 500, gold: 450, ki: 40 }; P.age = 2; P.minors = ['piccolo']; P.powers.beamcannon = { state: 'ready' }; recomputeMods(P);
      const P2 = G.players[2];
      S.vars.ship = S.bld('ship', 2, 82, 6);
      S.vars.tc2 = S.tc(2, 74, 20); S.units('worker', 2, 72, 24, 10); S.resAround(74, 20, { hunt: 'frog' });
      for (const k of ['house', 'house', 'house', 'house', 'barracks', 'barracks', 'temple', 'granary', 'storehouse', 'tower', 'tower']) S.bldNear(k, 2, S.vars.tc2, 4, 12);
      S.vars.frieza = S.hero('frieza', 2, 80, 14, 'frieza_base'); S.units('ginyu', 2, 74, 28, 2); S.units('soldier', 2, 70, 26, 6); S.units('saiyan', 2, 72, 27, 4);
      P2.age = 2; P2.minors = ['dodoria']; recomputeMods(P2); P2.res = { food: 600, wood: 600, gold: 500, ki: 40 };
      S.ai(2, S.diffKey, { maxAge: 3, noExpand: true, firstWave: { easy: 720, normal: 520, hard: 380 }[S.diffKey] });
      S.maxAge = 3; S.lock('wonder');
      ensureConnected({ x: 18, y: 78 }, [{ x: 74, y: 20 }, { x: 84, y: 12 }]);
      S.obj('frieza', 'Defeat Frieza');
      S.obj('ship', "Destroy Frieza's Spaceship");
    },
    start(S) {
      S.say('frieza', 'So, you are the Saiyan who defeated Vegeta. How amusing. I will enjoy this.', { pause: true });
      S.say('goku', "Everyone, we hit his base together. Gohan, stay close to Piccolo.");
      S.mark(84, 8);
      S.when(() => S.alive(S.vars.frieza) && S.vars.frieza.hp < maxHp(S.vars.frieza) * .5, () => { S.say('friezaf', 'You should feel honored. You are about to see my final form!'); setForm(S.vars.frieza, 'frieza_final', true); });
      S.when(() => !S.alive(S.vars.krillin), () => {
        if (!S.alive(S.vars.goku) || S.vars.goku.form !== 'goku_base') return;
        S.say('goku', 'KRILLIN!!! … I am the hope of the universe. I am the answer to all living things that cry out for peace. I am… a Super Saiyan!', { pause: true });
        G.players[1].techs.add('ssj1'); recomputeMods(G.players[1]); setForm(S.vars.goku, 'goku_ssj1', true); announce('Super Saiyan!');
      });
      S.when(() => S.vars.frieza.dead, () => { S.setObj('frieza', 'done'); S.say('friezaf', 'Impossible… beaten by a monkey…'); });
      S.when(() => !S.alive(S.vars.ship), () => S.setObj('ship', 'done'));
    },
    check(S) { if (S.done('frieza') && S.done('ship')) S.win(); lostCheck(S); },
    win: 'Frieza is defeated and Namek is saved. Goku returns to Earth a legend… but a warning arrives from the future.' },

  { id: 'm6', saga: 'Android Saga', title: "Dr. Gero's Laboratory", biome: 'highlands', size: 96, seed: 606,
    blurb: 'Storm the Red Ribbon mountain fortress and destroy the lab before the androids wake.',
    story: ["A boy from the future has warned of androids built by Dr. Gero of the Red Ribbon Army. The remnants of the Red Ribbon have fortified the northern mountains around Gero's hidden laboratory.", 'Destroy the laboratory. If the androids inside wake up, you will have to defeat them too.'],
    goals: ["Destroy Dr. Gero's Laboratory", 'Defeat any androids that awaken', 'Keep at least one Town Center or villager'],
    cast: [['gokussj', 'piccolo', 'gohan'], ['gero', 'a17', 'a18']],
    players: [EARTH, { faction: 'rr', major: 'gero', name: 'Red Ribbon Army', team: 2, ai: 'normal' }],
    terrain(S) {
      S.nature({ lakes: 3, ridges: 6, forests: 28, snow: true, keep: [[48, 82, 13], [48, 22, 16]] });
      S.ridge([[20, 40], [42, 38]], 1.3); S.ridge([[54, 38], [78, 40]], 1.3); S.ridge([[20, 40], [16, 20]], 1.2); S.ridge([[78, 40], [82, 18]], 1.2);
      S.clear(48, 82, 10, T_ROAD); S.clear(48, 22, 12, T_ROAD); S.clear(48, 38, 3, T_DIRT);
    },
    setup(S) {
      S.tc(1, 48, 82); S.units('colonist', 1, 51, 85, 9); S.resAround(48, 82, { hunt: 'boar' }); S.bld('house', 1, 42, 86); S.bld('house', 1, 54, 86); S.bld('barracks', 1, 40, 78); S.bld('temple', 1, 56, 77);
      S.vars.goku = S.hero('goku', 1, 48, 74, 'goku_ssj1'); S.hero('piccolo', 1, 46, 74); S.hero('gohan', 1, 50, 74, 'gohan_base'); S.hero('krillin', 1, 47, 72); S.units('fighter', 1, 48, 71, 5); S.units('gunner', 1, 49, 70, 4);
      const P = G.players[1]; P.res = { food: 700, wood: 700, gold: 600, ki: 50 }; P.age = 2; P.minors = ['piccolo']; P.techs.add('ssj1'); P.powers.beamcannon = { state: 'ready' }; recomputeMods(P);
      const P2 = G.players[2];
      S.vars.lab = S.bld('lab', 2, 46, 6);
      S.vars.tc2 = S.tc(2, 48, 24); S.units('drone', 2, 46, 28, 12); S.resAround(48, 24, { hunt: 'boar' });
      for (const k of ['house', 'house', 'house', 'house', 'barracks', 'barracks', 'temple', 'reactor', 'reactor', 'reactor', 'granary', 'storehouse', 'tower', 'tower', 'tower', 'stable']) S.bldNear(k, 2, S.vars.tc2, 4, 13);
      S.hero('blue', 2, 50, 30); S.units('rifleman', 2, 46, 32, 5); S.units('shocktrooper', 2, 50, 32, 5); S.units('jacket', 2, 48, 34, 2);
      S.vars.a19 = S.hero('eighter', 2, 48, 12, null, 'Android 19');
      P2.age = 2; P2.minors = ['silver']; recomputeMods(P2); P2.res = { food: 700, wood: 700, gold: 600, ki: 40 };
      S.ai(2, S.diffKey, { maxAge: 3, noExpand: true, firstWave: { easy: 720, normal: 500, hard: 360 }[S.diffKey] });
      S.maxAge = 3; S.lock('wonder');
      ensureConnected({ x: 48, y: 82 }, [{ x: 48, y: 24 }, { x: 48, y: 11 }]);
      S.obj('lab', "Destroy Dr. Gero's Laboratory");
      S.obj('androids', 'Defeat Android 17 and Android 18', { hidden: true });
    },
    start(S) {
      S.say('gero', 'Son Goku. The Red Ribbon Army never forgets. My androids will finish what my soldiers could not.', { pause: true });
      S.say('piccolo', 'The lab is past their base, at the top of the mountain. Two passes lead up there.');
      S.mark(48, 8);
      S.when(() => S.alive(S.vars.lab) && S.vars.lab.hp < maxHp(S.vars.lab) * .6, () => {
        S.say('a18', 'Ugh, finally awake. Is this Son Goku? He looks weaker than the data said.');
        S.say('a17', "Let's have some fun, 18.");
        S.vars.a17 = S.hero('a17', 2, 50, 12); S.vars.a18 = S.hero('a18', 2, 46, 12);
        S.showObj('androids'); S.attack([S.vars.a17, S.vars.a18], 48, 30);
      });
      S.when(() => !S.alive(S.vars.lab), () => S.setObj('lab', 'done'));
      S.when(() => S.vars.a17 && S.vars.a17.dead && S.vars.a18.dead, () => S.setObj('androids', 'done'));
    },
    check(S) { if (S.done('lab') && (!S.vars.a17 || S.done('androids'))) S.win(); lostCheck(S); },
    win: "The laboratory is rubble. But deep beneath it, something green and patient has already hatched…" },

  { id: 'm7', saga: 'Cell Saga', title: 'The Cell Games', biome: 'wasteland', size: 96, seed: 707, dragonBalls: true,
    blurb: 'The finale: defeat Perfect Cell and tear down his arena.',
    story: ['Cell has absorbed the androids and reached his Perfect form. He built an arena in the desert and challenged the world to the Cell Games.', 'His army of Cell Juniors will pour out of the arena. Gohan carries a hidden power that even Goku cannot match. Use the Dragon Balls if you must.'],
    goals: ['Defeat Perfect Cell', 'Destroy the Cell Games Arena', 'Optional: summon Shenron', 'Keep at least one Town Center or villager'],
    cast: [['gokussj', 'gohanssj2', 'piccolo'], ['cell']],
    players: [EARTH, { faction: 'rr', major: 'gero', name: 'Cell', team: 2, ai: 'normal' }],
    terrain(S) { S.nature({ ridges: 9, forests: 8, keep: [[48, 84, 13], [48, 18, 16]] }); S.clear(48, 84, 10, T_ROAD); S.clear(48, 18, 12, T_ROAD); for (let i = 0; i < MW * MH; i++) { const x = i % MW, y = (i / MW) | 0; if (G.map.terr[i] === T_SAND && G.noise(x / 8 + 20, y / 8, 2) > .6) G.map.terr[i] = T_DIRT; } },
    setup(S) {
      S.tc(1, 48, 84); S.units('colonist', 1, 51, 87, 12); S.resAround(48, 84, { hunt: 'boar' });
      for (const [k, x, y] of [['house', 42, 88], ['house', 54, 88], ['house', 40, 82], ['barracks', 40, 78], ['temple', 56, 78], ['stable', 58, 84], ['armory', 36, 86]]) S.bld(k, 1, x, y);
      S.vars.goku = S.hero('goku', 1, 48, 76, 'goku_ssj1'); S.vars.gohan = S.hero('gohan', 1, 50, 76, 'gohan_base'); S.hero('piccolo', 1, 46, 76); S.hero('krillin', 1, 47, 74);
      S.units('fighter', 1, 48, 73, 6); S.units('gunner', 1, 50, 72, 5); S.units('rider', 1, 46, 72, 3);
      const P = G.players[1]; P.res = { food: 900, wood: 900, gold: 900, ki: 60 }; P.age = 3; P.minors = ['piccolo', 'dende']; P.techs.add('ssj1'); P.powers.beamcannon = { state: 'ready' }; P.powers.restoration = { state: 'ready' }; recomputeMods(P);
      const P2 = G.players[2];
      S.vars.arena = S.bld('temple', 2, 46, 8);
      S.vars.tc2 = S.tc(2, 48, 24); S.units('drone', 2, 46, 28, 14); S.resAround(48, 24, { hunt: 'boar' });
      for (const k of ['house', 'house', 'house', 'house', 'house', 'barracks', 'barracks', 'reactor', 'reactor', 'reactor', 'reactor', 'granary', 'storehouse', 'tower', 'tower', 'stable', 'fortress', 'armory']) S.bldNear(k, 2, S.vars.tc2, 4, 14);
      P2.age = 3; P2.minors = ['genblue', 'a16']; P2.cellStage = 2; P2.techs.add('incubation'); recomputeMods(P2); P2.res = { food: 900, wood: 900, gold: 900, ki: 60 };
      S.vars.cell = S.hero('cell', 2, 48, 14, 'cell_perfect');
      S.units('pirate', 2, 46, 32, 2); S.units('rifleman', 2, 50, 32, 6); S.units('shocktrooper', 2, 47, 33, 6);
      S.ai(2, S.diffKey, { maxAge: 4, noExpand: true, firstWave: { easy: 700, normal: 480, hard: 340 }[S.diffKey] });
      G.camps = [{ x: 20, y: 60 }, { x: 76, y: 60 }, { x: 24, y: 36 }, { x: 72, y: 36 }, { x: 48, y: 52 }, { x: 14, y: 14 }, { x: 82, y: 82 }];
      for (const c of G.camps) S.clear(c.x, c.y, 2.5, T_DIRT);
      S.maxAge = 4; S.lock('wonder');
      ensureConnected({ x: 48, y: 84 }, [{ x: 48, y: 24 }, { x: 48, y: 12 }, ...G.camps]);
      S.obj('cell', 'Defeat Perfect Cell');
      S.obj('arena', 'Destroy the Cell Games Arena');
      S.obj('shenron', 'Summon Shenron', { optional: true });
    },
    start(S) {
      S.say('cell', 'Welcome to the Cell Games! Show me how strong the Earth\'s defenders really are.', { pause: true });
      S.say('goku', "Gohan… I think you're stronger than all of us. When the time comes, don't hold back.");
      S.mark(48, 10);
      let jr = 0;
      S.after({ easy: 600, normal: 480, hard: 360 }[S.diffKey], () => {
        S.say('cell', 'Let me introduce my children. Go, Cell Juniors!');
        S.every({ easy: 150, normal: 120, hard: 95 }[S.diffKey], () => { if (!S.alive(S.vars.arena)) return false; jr += Math.round(3 * S.d); S.wave(2, [['celljr', 3 * S.d]], 48, 12, 48, 80); });
      });
      const awaken = () => { if (S.vars.awake || !S.alive(S.vars.gohan)) return; S.vars.awake = true; S.say('gohanssj2', "I won't let you hurt anyone else… I'm done holding back!", { pause: true }); G.players[1].techs.add('ssj2'); recomputeMods(G.players[1]); setForm(S.vars.gohan, 'gohan_ssj2', true); announce('Super Saiyan 2!'); };
      S.when(() => S.alive(S.vars.cell) && S.vars.cell.hp < maxHp(S.vars.cell) * .5, awaken);
      S.when(() => jr >= 9, awaken);
      S.when(() => S.vars.cell.dead, () => {
        if (!S.vars.reborn) {
          S.vars.reborn = true;
          S.say('cell', 'Did you think it was over? I regenerated from a single cell! Behold, SUPER Perfect Cell!', { pause: true });
          S.vars.cell = S.hero('cell', 2, 48, 14, 'cell_perfect'); S.vars.cell.buffs.push({ until: 1e9, atk: 1.3, spd: 1.1 });
          S.setObj('cell', 'active', 'Defeat Super Perfect Cell'); S.attack([S.vars.cell], 48, 80);
          S.when(() => S.vars.cell.dead, () => { S.setObj('cell', 'done'); S.say('gohanssj2', 'It\'s over, Cell.'); });
        }
      });
      S.when(() => !S.alive(S.vars.arena), () => S.setObj('arena', 'done'));
      S.when(() => G.players[1].stats.wishes > 0, () => S.setObj('shenron', 'done'));
    },
    check(S) { if (S.done('cell') && S.done('arena')) S.win(); lostCheck(S); },
    win: 'Cell is gone. The Earth is at peace, protected by a new generation of heroes. Thank you for playing The Saga of the Dragon Balls!' },
];
B.guru.trains.push('namekwarrior'); B.guru.drop = ['food', 'wood', 'gold']; B.guru.garrison = 10; B.guru.pop = 20;
