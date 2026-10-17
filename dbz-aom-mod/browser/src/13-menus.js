// =====================================================================
// 13. MENUS: main menu, skirmish setup, help, pause, cheats, wish, end screen
// =====================================================================
const SCREENS = ['scr-menu', 'scr-campaign', 'scr-brief', 'scr-skirmish', 'scr-how', 'scr-pause', 'scr-wish', 'scr-end'];
function showScreen(id) { for (const s of SCREENS) $(s).hidden = s !== id; if (id) hideTip(); }
function soundLabel() { return 'Sound: ' + (SFX.on ? 'on' : 'off'); }
$('m-sound').textContent = $('p-sound').textContent = soundLabel();
for (const id of ['m-sound', 'p-sound']) $(id).addEventListener('click', () => { SFX.toggle(); SFX.unlock(); $('m-sound').textContent = $('p-sound').textContent = soundLabel(); });
$('m-campaign').addEventListener('click', () => { SFX.unlock(); openCampaignMenu(); });
$('m-skirmish').addEventListener('click', () => { SFX.unlock(); openSkirmish(); });
$('m-how').addEventListener('click', () => { G.howBack = 'scr-menu'; showScreen('scr-how'); });
$('how-back').addEventListener('click', () => showScreen(G.howBack || 'scr-menu'));

// ---------- How to play ----------
$('how-body').innerHTML = `
<h4>Goal</h4>
<p>Build an economy, advance through four Sagas, raise an army of soldiers, heroes and myth units, and destroy your enemies. In <b>Conquest + Wonder</b> games you can also win by building a Wonder and keeping it standing for 5 minutes. Along the way, hunt the seven Dragon Balls and summon Shenron for a wish.</p>
<h4>Mouse and keyboard</h4>
<ul><li>Left-click or drag a box to select. Double-click (or Ctrl-click) selects all units of that type on screen. Shift adds to the selection.</li>
<li>Right-click to act: move, attack, gather, build or repair, carry a Dragon Ball, deposit it in your Temple. Shift + right-click queues orders.</li>
<li>Arrow keys or screen edges scroll, mouse wheel zooms, middle or right drag pans, and the minimap jumps the camera.</li>
<li><kbd>Q W E R T</kbd> / <kbd>A S D F G</kbd> / <kbd>Z X C V B</kbd> press the command buttons. <kbd>Ctrl</kbd>+<kbd>1-9</kbd> makes a control group, <kbd>1-9</kbd> selects it (twice to jump to it).</li>
<li><kbd>.</kbd> idle villager, <kbd>M</kbd> army, <kbd>H</kbd> heroes, <kbd>Home</kbd> Town Center, <kbd>Space</kbd> center on selection, <kbd>Delete</kbd> delete, <kbd>P</kbd> pause, <kbd>Enter</kbd> cheat code.</li></ul>
<h4>Touch</h4>
<ul><li>Tap a unit to select it, then tap the ground, an enemy or a resource to order it. Drag to scroll, pinch to zoom, and turn on <b>Box select</b> to drag-select a group.</li></ul>
<h4>Economy</h4>
<ul><li>Villagers gather <b>Rations</b> (hunting, Senzu bushes, farms), <b>Capsule Alloy</b> (trees) and <b>Zeni</b> (veins) and carry them to a Town Center, Granary (Rations) or Storehouse (Alloy, Zeni). Build drop sites close to what you gather.</li>
<li>Houses give 10 population (up to 10 houses) and Town Centers 15. From the Namek Saga you can build more Town Centers, but only on <b>Settlements</b> (the white H circles).</li>
<li><b>Ki</b> is this game's Favor. Earth villagers meditate at Kami's Lookout, the Red Ribbon builds Bio-Reactors, and the Frieza Force earns it by fighting.</li></ul>
<h4>Sagas and patrons</h4>
<p>You pick a <b>major patron</b> at the start (like an Age of Mythology god). Each time you advance a Saga at the Town Center you choose one of two <b>minor patrons</b>. Each patron grants a one-time <b>god power</b> (left column), a myth unit at the Temple, and a special technology.</p>
<h4>Units and counters</h4>
<ul><li>Infantry beats cavalry, cavalry beats ranged units and siege, ranged units beat infantry, and siege wrecks buildings.</li>
<li>Heroes deal 4× damage to myth units (2.5× to Titans). Myth units deal 2.5× damage to human soldiers but only half to heroes. Only heroes can carry Dragon Balls.</li>
<li>Heroes such as Goku, Vegeta and Frieza can fly (0.4 Ki per second each). At 0 Ki everyone lands. Special attacks fire automatically.</li>
<li>Garrison villagers in Town Centers, towers and fortresses to protect them and add more shots.</li></ul>
<h4>Dragon Balls</h4>
<p>Seven balls lie at guarded camps. Bring them to your Temple (each one trickles Ki and Zeni). Hold all seven and the <b>Summon Shenron</b> power appears: wish for Immortality, Ultimate Wealth or Restored Youth. Then the balls turn to stone for 3 minutes and scatter again.</p>
<h4>Cheat codes</h4>
<p>Press <kbd>Enter</kbd> during a game (phone: Menu, then <b>Enter a cheat code</b>): <b>CAPSULE CORP</b> (+1000 Rations, Alloy and Zeni), <b>KAMI'S BLESSING</b> (full Ki), <b>SENZU BEAN</b> (heal your units), <b>INSTANT TRANSMISSION</b> (reveal the map), <b>SEVEN STARS</b> (all Dragon Balls to your Temple), <b>OVER 9000</b> (strongest hero form), <b>HYPERBOLIC TIME CHAMBER</b> (finish all your construction, training and research).</p>`;

// ---------- skirmish setup ----------
const SK = store.get('skirmish', null) || { map: 'earth', victory: 'conquest', resources: 'standard', slots: [
  { who: 'you', faction: 'earth', major: 'kami', team: 1, diff: 'normal' },
  { who: 'ai', faction: 'rr', major: 'gero', team: 2, diff: 'normal' },
  { who: 'closed', faction: 'ff', major: 'frieza', team: 2, diff: 'normal' },
  { who: 'closed', faction: 'earth', major: 'roshi', team: 1, diff: 'normal' },
] };
function segSet(id, attr, val) { for (const b of $(id).querySelectorAll('button')) b.classList.toggle('sel', b.dataset[attr] === val); }
function openSkirmish() {
  const ms = $('s-map'); ms.innerHTML = '';
  for (const k in MAPS) { const b = document.createElement('button'); b.dataset.m = k; b.textContent = MAPS[k].name; b.title = MAPS[k].desc; b.addEventListener('click', () => { SK.map = k; segSet('s-map', 'm', k); }); ms.appendChild(b); }
  segSet('s-map', 'm', SK.map); segSet('s-victory', 'v', SK.victory); segSet('s-res', 'r', SK.resources);
  renderSlots();
  showScreen('scr-skirmish');
}
for (const b of $('s-victory').querySelectorAll('button')) b.addEventListener('click', () => { SK.victory = b.dataset.v; segSet('s-victory', 'v', SK.victory); });
for (const b of $('s-res').querySelectorAll('button')) b.addEventListener('click', () => { SK.resources = b.dataset.r; segSet('s-res', 'r', SK.resources); });
function opt(v, label, sel) { return `<option value="${v}"${v === sel ? ' selected' : ''}>${esc(label)}</option>`; }
function renderSlots() {
  const el = $('slots'); el.innerHTML = '';
  SK.slots.forEach((s, i) => {
    const row = document.createElement('div'); row.className = 'slot frame';
    const who = i === 0 ? `<div class="who"><span class="sw" style="background:${pcol(i + 1)}"></span>You</div>` : `<select data-k="who" aria-label="Player ${i + 1}">${opt('ai', 'Computer', s.who)}${opt('closed', 'Closed', s.who)}</select>`;
    const closed = s.who === 'closed';
    row.innerHTML = who +
      `<select data-k="faction" aria-label="Faction"${closed ? ' disabled' : ''}>${Object.keys(FACTIONS).map(f => opt(f, FACTIONS[f].name, s.faction)).join('')}</select>` +
      `<select data-k="major" aria-label="Major patron"${closed ? ' disabled' : ''}>${FACTIONS[s.faction].majors.map(m => opt(m, PATRONS[m].name, s.major)).join('')}</select>` +
      `<select data-k="team" aria-label="Team"${closed ? ' disabled' : ''}>${[1, 2, 3, 4].map(t => opt(String(t), 'Team ' + t, String(s.team))).join('')}</select>` +
      (i === 0 ? '<span></span>' : `<select data-k="diff" aria-label="Difficulty"${closed ? ' disabled' : ''}>${opt('easy', 'Easy', s.diff)}${opt('normal', 'Normal', s.diff)}${opt('hard', 'Hard', s.diff)}</select>`) +
      `<div class="patron-info">${closed ? '' : `<b style="color:var(--gi)">${esc(PATRONS[s.major].name)}</b>, ${esc(PATRONS[s.major].title)}. ${esc(PATRONS[s.major].desc)} Power: <b>${esc(POW[PATRONS[s.major].power].name)}</b>. <span style="opacity:.8">${esc(FACTIONS[s.faction].blurb)}</span>`}</div>`;
    for (const sel of row.querySelectorAll('select')) sel.addEventListener('change', () => {
      const k = sel.dataset.k; s[k] = k === 'team' ? +sel.value : sel.value;
      if (k === 'faction') s.major = FACTIONS[s.faction].majors[0];
      renderSlots();
    });
    el.appendChild(row);
  });
}
$('s-back').addEventListener('click', () => showScreen('scr-menu'));
$('s-start').addEventListener('click', () => {
  const act = SK.slots.filter(s => s.who !== 'closed');
  if (act.length < 2) { toastMenu('Open at least one computer opponent.'); return; }
  if (new Set(act.map(s => s.team)).size < 2) { toastMenu('Put at least two players on different teams.'); return; }
  store.set('skirmish', SK);
  const players = [];
  SK.slots.forEach((s, i) => { if (s.who === 'closed') return; players.push({ faction: s.faction, major: s.major, team: s.team, ai: s.who === 'ai' ? s.diff : null, color: i + 1, name: s.who === 'you' ? 'You' : PATRONS[s.major].name }); });
  launch({ kind: 'skirmish', opts: { map: SK.map, victory: SK.victory, resources: SK.resources, dragonBalls: true, players } });
});
function toastMenu(msg) { alertBox(msg); }
function alertBox(msg) { const t = document.createElement('div'); t.className = 'toast warn'; t.textContent = msg; t.style.cssText = 'position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:50'; document.body.appendChild(t); setTimeout(() => t.remove(), 3500); }

// ---------- launching a game ----------
function launch(spec) {
  G.lastSpec = spec;
  showScreen(null);
  if (spec.kind === 'skirmish') startSkirmish(spec.opts);
  else startMission(spec.mission, spec.diff);
  enterPlay();
}
function enterPlay() {
  resize(); resetRenderCaches();
  $('hud').hidden = false; $('cheatbox').hidden = true; $('dialogue').hidden = true; $('toasts').innerHTML = ''; $('announce').classList.remove('on');
  $('btn-obj').hidden = !G.scn; $('objectives').hidden = !G.scn || vw < 820;
  $('btn-speed').textContent = '1×';
  cmdSig = ''; powSig = ''; selSig = ''; lastPortrait = ''; G.cmdPage = 'main';
  parts.length = 0;
  const P = humanP();
  const tc = G.blds.find(b => b.owner === G.me && b.key === 'tc') || G.units.find(u => u.owner === G.me);
  cam.z = vw < 820 ? .72 : 1;
  if (tc) centerOn(tc.x, tc.y);
  if (!G.scn) {
    toast('Gather resources, train an army and destroy your enemies. Press P for help.', 'gold');
    G.sel = G.units.filter(u => u.owner === G.me && u.def.cls === 'villager');
    if (P) setTimeout(() => G.started && !G.over && toast(P.faction === 'earth' ? "Tip: build Kami's Lookout early and send villagers to meditate for Ki." : P.faction === 'rr' ? 'Tip: Bio-Reactors make your Ki. Cell hatches in the Android Saga.' : 'Tip: the Frieza Force earns Ki by fighting. Hunt the Dragon Balls with Vegeta.', ''), 4000);
  }
  last = performance.now(); acc = 0;
}
function quitToMenu() { G.started = false; G.over = true; $('hud').hidden = true; $('dialogue').hidden = true; showScreen('scr-menu'); }

// ---------- pause ----------
function togglePause(force) {
  if (!$('cheatbox').hidden) $('cheatbox').hidden = true;
  const want = force === undefined ? !G.paused : force;
  if (G.wishPending && !want) return;
  G.paused = want;
  $('scr-pause').hidden = !want;
  $('p-restart').hidden = false;
}
$('p-resume').addEventListener('click', () => togglePause(false));
$('p-how').addEventListener('click', () => { G.howBack = 'scr-pause'; showScreen('scr-how'); });
$('p-restart').addEventListener('click', () => { if (G.lastSpec) { G.paused = false; launch(G.lastSpec); } });
$('p-resign').addEventListener('click', () => { G.paused = false; $('scr-pause').hidden = true; const P = humanP(); if (P) { P.defeated = true; endGame(-1, 'resign'); } });
$('p-quit').addEventListener('click', () => { G.paused = false; quitToMenu(); });
$('p-cheat').addEventListener('click', () => { togglePause(false); openCheat(); });
$('btn-obj').addEventListener('click', () => { $('objectives').hidden = !$('objectives').hidden; });

// ---------- cheat codes (always for the human player) ----------
const CHEATS = {
  'CAPSULE CORP': P => { P.res.food += 1000; P.res.wood += 1000; P.res.gold += 1000; return '+1000 Rations, Capsule Alloy and Zeni.'; },
  'KAMIS BLESSING': P => { P.res.ki = P.kiCap; return 'Ki filled to the maximum.'; },
  'SENZU BEAN': P => { let n = 0; for (const u of G.units) if (u.owner === P.id) { u.hp = maxHp(u); u.stun = 0; n++; fxPush({ type: 'shock', x: u.x, y: u.y, z: 0, t: 0, dur: .6, color: '#86e07c', r: .6 }); } return `${n} unit${n === 1 ? '' : 's'} fully healed.`; },
  'INSTANT TRANSMISSION': () => { G.revealAll = !G.revealAll; updateFog(); return G.revealAll ? 'The whole map is revealed.' : 'The fog of war is back.'; },
  'SEVEN STARS': P => {
    if (!G.balls.length) return { fail: 'There are no Dragon Balls in this game.' };
    const t = G.blds.find(b => !b.dead && b.owner === P.id && B[b.key].vault && b.built);
    if (!t) return { fail: `Build a ${bname('temple', P.faction)} first: the Dragon Balls need a Temple.` };
    G.stoneUntil = 0;
    for (const b of G.balls) {
      if (b.state === 'carried') { const h = G.byId.get(b.holder); if (h) h.carryBall = 0; }
      if (b.state === 'temple') { const o = G.byId.get(b.temple); if (o) o.balls = o.balls.filter(x => x !== b.id); }
      Object.assign(b, { state: 'temple', temple: t.id, holder: 0, x: t.x, y: t.y }); t.balls.push(b.id);
    }
    return `All seven Dragon Balls are in ${t.name}. Summon Shenron when the sky darkens.`;
  },
  'OVER 9000': P => {
    const key = FACTIONS[P.faction].mainHero, def = U[key];
    const best = { goku: 'goku_ssj3', blue: null, vegeta: 'vegeta_ssj' }[key];
    const home = G.blds.find(b => !b.dead && b.owner === P.id && b.key === 'tc' && b.built) || G.blds.find(b => !b.dead && b.owner === P.id);
    let u = G.ents.find(x => x.kind === 'unit' && !x.dead && x.owner === P.id && x.key === key);
    if (!u && !home) return { fail: 'Your hero has nowhere to appear.' };
    if (key === 'goku') { P.techs.add('ssj1'); P.techs.add('ssj3'); recomputeMods(P); }
    if (key === 'vegeta') { P.techs.add('vegetassj'); recomputeMods(P); }
    for (const b of G.blds) if (b.owner === P.id) { if (b.research && ['ssj1', 'ssj3', 'vegetassj'].includes(b.research.key)) { refund(P, TECH[b.research.key].cost); b.research = null; } b.queue = b.queue.filter(q => { if (q.key !== key) return true; refund(P, unitCost(P, key)); return false; }); }
    if (!u) u = spawnNear(home, key, P.id);
    if (best) setForm(u, best, true); else { u.hp = maxHp(u); u.buffs.push({ until: G.time + 120, atk: 2, spd: 1.3 }); }
    if (P.faction === 'rr') { P.techs.add('incubation'); P.cellStage = 2; recomputeMods(P); const c = G.ents.find(x => x.kind === 'unit' && !x.dead && x.owner === P.id && x.key === 'cell') || spawnNear(home || u, 'cell', P.id, 'cell_perfect'); setForm(c, 'cell_perfect', true); c.biomass = 16; u = c; }
    announce('Over 9000!'); selectEntities([u], false); centerOn(u.x, u.y);
    return `${stats(u).name} is ready.${stats(u).kiDrain ? ' This form drains Ki every second.' : ''}`;
  },
  'HYPERBOLIC TIME CHAMBER': P => {
    let n = 0;
    for (const b of G.blds) if (b.owner === P.id) {
      if (!b.built) { b.progress = 1; b.hp = maxHp(b); completeBuilding(b); n++; }
      while (b.queue.length) { const q = b.queue.shift(); spawnNear(b, q.key, P.id); n++; }
      if (b.research) { const r = b.research; b.research = null; applyTech(P, r.key, b, r.patron); n++; }
    }
    return n ? `A year of training in a day: ${n} jobs finished.` : 'Nothing was in progress.';
  },
};
function runCheat(raw) {
  const code = String(raw).toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  if (!code) return;
  const fn = CHEATS[code];
  if (!fn) { toast(`"${String(raw).trim().slice(0, 40)}" is not a cheat code.`, 'warn'); SFX.play('error'); return; }
  const r = fn(humanP());
  if (r && r.fail) { toast(r.fail, 'warn'); SFX.play('error'); } else { toast(`Cheat ${code}: ${r}`, 'gold'); SFX.play('research'); }
  cmdSig = ''; powSig = '';
}
let cheatWasPaused = false;
function openCheat() {
  if (!G.started || G.over || !$('scr-wish').hidden || !$('cheatbox').hidden) return;
  cheatWasPaused = G.paused; G.paused = true;
  $('cheat-in').value = ''; $('cheatbox').hidden = false; $('cheat-in').focus();
}
function closeCheat() { $('cheatbox').hidden = true; G.paused = cheatWasPaused; $('cheat-in').blur(); }
$('cheatbox').addEventListener('submit', e => { e.preventDefault(); const v = $('cheat-in').value; closeCheat(); runCheat(v); });
$('cheat-in').addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closeCheat(); } });
$('cheat-cancel').addEventListener('click', closeCheat);

// ---------- Shenron ----------
function openWish() { G.paused = true; $('announce').classList.remove('on'); $('scr-wish').hidden = false; }
for (const b of document.querySelectorAll('.wish')) b.addEventListener('click', () => { $('scr-wish').hidden = true; G.paused = false; grantWish(humanP(), b.dataset.w); SFX.play('wish'); });

// ---------- end screen ----------
function showEnd(won, reason) {
  if (!G.started) return;
  const P = humanP();
  $('end-title').textContent = won ? 'Victory!' : 'Defeat';
  const sub = G.scn ? (won ? G.scn.m.win : (G.scn.loseReason || 'The mission has failed.'))
    : won ? (reason === 'wonder' ? 'Your Wonder stood for five minutes. The universe is yours.' : 'Every enemy has fallen. Peace returns… for now.')
    : reason === 'resign' ? 'You resigned.' : 'Your forces have been wiped out. Train harder and try again.';
  $('end-sub').textContent = sub;
  const st = P ? [['Time', fmtTime(G.time)], ['Saga reached', AGES[P.age]], ['Enemies defeated', P.stats.kills], ['Buildings destroyed', P.stats.killedB], ['Units lost', P.stats.lost], ['Resources gathered', Math.round(P.stats.gathered)], ['Dragon Balls secured', P.stats.balls], ['Wishes made', P.stats.wishes]] : [];
  $('end-stats').innerHTML = st.map(([a, b]) => `<div class="frame"><b>${b}</b><span>${a}</span></div>`).join('');
  const btns = $('end-btns'); btns.innerHTML = '';
  const add = (label, cls, fn) => { const b = document.createElement('button'); b.className = cls; b.textContent = label; b.addEventListener('click', fn); btns.appendChild(b); };
  if (G.scn) {
    const idx = CAMPAIGN.findIndex(m => m.id === G.scn.m.id);
    add('Campaign', 'ghost', () => { quitToMenu(); openCampaignMenu(); });
    add('Retry', won ? 'ghost' : 'go', () => launch(G.lastSpec));
    if (won && CAMPAIGN[idx + 1]) add('Next mission', 'go', () => { quitToMenu(); openBriefing(idx + 1); });
  } else {
    add('Main menu', 'ghost', quitToMenu);
    add('Play again', 'go', () => launch(G.lastSpec));
  }
  SFX.play(won ? 'win' : 'lose');
  $('hud').hidden = true;
  showScreen('scr-end');
}
