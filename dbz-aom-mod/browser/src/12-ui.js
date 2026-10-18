// =====================================================================
// 12. HUD AND INPUT
// =====================================================================
const toastsEl = $('toasts');
function toast(msg, kind) {
  if (G.headless) return;
  const el = document.createElement('div'); el.className = 'toast ' + (kind || ''); el.textContent = msg;
  toastsEl.appendChild(el);
  while (toastsEl.children.length > (vw < 820 ? 2 : 4)) toastsEl.firstChild.remove();
  setTimeout(() => el.remove(), 5600);
}
let announceT = 0;
function announce(msg) {
  if (G.headless) return;
  const el = $('announce'); el.textContent = msg; el.classList.add('on'); clearTimeout(announceT); announceT = setTimeout(() => el.classList.remove('on'), 2300);
}
function floatText(x, y, z, s, c) { if (G.texts.length < 40) G.texts.push({ x, y, z, s, c, t: 0 }); }
function alertAttack(t) {
  const P = humanP();
  if (!P || G.time - P.lastAlert < 9) return;
  P.lastAlert = G.time;
  G.pings.push({ x: t.x, y: t.y, t: G.time }); if (G.pings.length > 6) G.pings.shift();
  toast(`Your ${t.kind === 'building' ? t.name : stats(t).name} is under attack!`, 'warn');
  SFX.play('alert');
}

// ---------- camera ----------
function clampCam() {
  const pad = 140 / cam.z;
  const minX = -MH * HTW - pad, maxX = MW * HTW - vw / cam.z + pad;
  const minY = -pad, maxY = (MW + MH) * HTH - vh / cam.z + (vw < 820 ? 260 : 230) / cam.z;
  cam.x = maxX < minX ? (minX + maxX) / 2 : clamp(cam.x, minX, maxX);
  cam.y = maxY < minY ? (minY + maxY) / 2 : clamp(cam.y, minY, maxY);
}
function centerOn(x, y) { cam.x = isoX(x, y) - vw / cam.z / 2; cam.y = isoY(x, y) - vh / cam.z / 2 + 60 / cam.z; clampCam(); }
function zoomAt(f, px, py) {
  const before = screenToWorld(px, py);
  cam.z = clamp(cam.z * f, .45, 1.8);
  const ix = isoX(before.x, before.y), iy = isoY(before.x, before.y);
  cam.x = ix - px / cam.z; cam.y = iy - py / cam.z; clampCam();
}

// ---------- picking ----------
function pickAt(px, py, preferOwn) {
  const w = screenToWorld(px, py);
  let best = null, bd = 1e9;
  for (const u of G.units) {
    if (u.garrison) continue;
    if (!G.revealAll && !isAlly(u.owner, G.me) && !visibleAt(u.x, u.y)) continue;
    const L = unitLook(u), h = (L.r === 'ape' ? 90 : L.r === 'ship' ? 26 : 34 * (L.scale || 1)) * cam.z, lift = ((u.lift || 0) * 30) * cam.z;
    const ux = sx(u.x, u.y), uy = sy(u.x, u.y) - lift;
    const dx = px - ux, dy = py - (uy - h / 2);
    const rw = (L.r === 'ship' ? 30 * (L.scale || 1) : Math.max(9, 11 * (L.scale || 1))) * cam.z, rh = h / 2 + 6 * cam.z;
    if (Math.abs(dx) <= rw && Math.abs(dy) <= rh) { const d = Math.hypot(dx, dy) - (preferOwn && u.owner === G.me ? 30 : 0); if (d < bd) { bd = d; best = u; } }
  }
  if (best) return best;
  for (const b of G.blds) {
    if (!seenBld(b)) continue;
    if (w.x >= b.tx && w.x <= b.tx + b.w && w.y >= b.ty && w.y <= b.ty + b.h) return b;
  }
  // tall building sprites: test the screen box above the footprint
  for (const b of G.blds) {
    if (!seenBld(b) || B[b.key].walk) continue;
    const bx = sx(b.x, b.y), by = sy(b.x, b.y), hw = (b.w + b.h) * HTW * .45 * cam.z, top = by - (40 + b.w * 12) * cam.z;
    if (px > bx - hw && px < bx + hw && py > top && py < by) return b;
  }
  for (const b of G.balls) if (b.state === 'ground' && (G.revealAll || visibleAt(b.x, b.y)) && Math.hypot(sx(b.x, b.y) - px, sy(b.x, b.y) - 6 * cam.z - py) < 14 * cam.z) return { kind: 'ball', ball: b, x: b.x, y: b.y };
  for (const r of G.relics) if (r.state === 'ground' && (G.revealAll || exploredAt(r.x, r.y)) && Math.hypot(sx(r.x, r.y) - px, sy(r.x, r.y) - 10 * cam.z - py) < 16 * cam.z) return { kind: 'relic', relic: r, x: r.x, y: r.y };
  let rb = null, rd = 1e9;
  for (const r of G.ress) {
    if (!G.revealAll && !exploredAt(r.x, r.y)) continue;
    const rx = sx(r.x, r.y), ry = sy(r.x, r.y) - (r.key === 'tree' ? 20 : 8) * cam.z;
    const d = Math.hypot(px - rx, (py - ry) * (r.key === 'tree' ? .7 : 1));
    if (d < (r.key === 'gold' ? 34 : r.key === 'tree' ? 18 : 16) * cam.z && d < rd) { rd = d; rb = r; }
  }
  return rb;
}

// ---------- selection ----------
function selectEntities(list, add) {
  if (!add) G.sel = [];
  for (const e of list) if (e && !G.sel.includes(e)) G.sel.push(e);
  G.sel = G.sel.filter(e => !e.dead);
  cmdSig = ''; G.cmdPage = 'main'; G.placing = null; G.targeting = null;
  if (list.length) SFX.play('select');
  const talker = list.find(e => e && e.kind === 'unit' && e.owner === G.me && BARKS[e.key]);
  if (talker) bark(talker, 'sel');
}
function boxSelect(a, b, add) {
  const x0 = Math.min(a.sx, b.sx), x1 = Math.max(a.sx, b.sx), y0 = Math.min(a.sy, b.sy), y1 = Math.max(a.sy, b.sy);
  const inside = G.units.filter(u => u.owner === G.me && !u.garrison && (() => { const px = sx(u.x, u.y), py = sy(u.x, u.y) - 16 * cam.z - (u.lift || 0) * 30 * cam.z; return px >= x0 && px <= x1 && py >= y0 && py <= y1; })());
  if (!inside.length) { if (!add) selectEntities([], false); return; }
  const mil = inside.filter(u => u.def.cls !== 'villager' && !u.def.fisher);
  selectEntities(mil.length && mil.length < inside.length ? mil : inside, add);
}
function selectSameType(u) {
  const list = G.units.filter(x => x.owner === G.me && x.key === u.key && !x.garrison && (() => { const px = sx(x.x, x.y), py = sy(x.x, x.y); return px > -20 && py > -20 && px < vw + 20 && py < vh + 20; })());
  selectEntities(list, false);
}
const P0team = () => humanP() ? humanP().team : -1;
const ownSel = () => G.sel.filter(e => !e.dead && e.owner === G.me);
const selUnits = () => ownSel().filter(e => e.kind === 'unit' && !e.garrison);
const selBlds = () => ownSel().filter(e => e.kind === 'building');

// ---------- orders from the player ----------
function markAt(x, y, c) { G.marks = (G.marks || []).filter(m => performance.now() - m.t < 500); G.marks.push({ x, y, c, t: performance.now() }); }
function command(wx, wy, target, queued) {
  const P = humanP();
  const units = selUnits();
  if (!units.length) {
    const bl = selBlds();
    if (bl.length) { for (const b of bl) b.rally = { x: wx, y: wy, eid: target && (target.kind === 'res' || target.kind === 'building') ? target.id : 0 }; markAt(wx, wy, '#ffffff'); SFX.play('order'); }
    return;
  }
  const amove = G.targeting && G.targeting.type === 'amove';
  if (amove) G.targeting = null;
  const enemyT = target && (target.kind === 'unit' || target.kind === 'building') && (isEnemy(G.me, target.owner) || (target.owner === 0 && target.kind === 'unit'));
  markAt(wx, wy, enemyT ? '#ff5a5f' : '#7dff9c');
  SFX.play('order');
  let i = 0;
  const n = units.length, cols = Math.ceil(Math.sqrt(n));
  for (const u of units) {
    const ox = ((i % cols) - (cols - 1) / 2) * .9, oy = (Math.floor(i / cols) - (Math.ceil(n / cols) - 1) / 2) * .9; i++;
    const vill = u.def.cls === 'villager';
    let o = null;
    if (target && target.kind === 'relic') {
      if (u.def.cls === 'hero' && !u.carryBall && !u.carryRelic && !units.some(x => x !== u && x.def.cls === 'hero' && x.order.type === 'pickup' && x.order.relic === target.relic.id)) o = { type: 'pickup', relic: target.relic.id };
      else o = { type: 'move', x: wx + ox, y: wy + oy, amove: isCombat(u) };
    } else if (target && target.kind === 'ball') {
      if (u.def.cls === 'hero' && !u.carryBall && !u.carryRelic && !units.some(x => x !== u && x.def.cls === 'hero' && x.order.type === 'pickup' && x.order.ball === target.ball.id)) o = { type: 'pickup', ball: target.ball.id };
      else o = { type: 'move', x: wx + ox, y: wy + oy, amove: isCombat(u) };
    } else if (target && target.kind === 'building' && isAlly(target.owner, G.me)) {
      const d = B[target.key];
      if (u.def.empower && target.owner === G.me && target.built) o = { type: 'empower', bid: target.id };
      else if (u.def.trader && target.key === 'tc' && target.built) { const m = nearestOfKind(G.me, 'market', u); if (m) o = { type: 'trade', home: m.id, dest: target.id }; else { toast('Caravans need a Market to trade from.', 'warn'); o = { type: 'move', x: wx + ox, y: wy + oy }; } }
      else if (target.owner === G.me && (vill || u.def.canBuild) && (!target.built || target.hp < maxHp(target))) o = { type: 'build', bid: target.id };
      else if (target.owner === G.me && target.built && d.farm && vill) o = { type: 'gather', rid: target.id, rtype: 'food' };
      else if (target.built && d.vault && (u.carryBall || (u.carryRelic && target.owner === G.me))) o = { type: 'deposit', bid: target.id };
      else if (target.owner === G.me && target.built && target.key === 'temple' && vill && P.faction === 'earth') o = { type: 'meditate', bid: target.id };
      else if (target.owner === G.me && target.built && d.drop && vill && u.carryAmt > 0 && d.drop.includes(u.carry)) o = { type: 'return', rid: u.order.rid, rtype: u.carry };
      else if (target.built && d.garrison && G.altKey) o = { type: 'garrison', bid: target.id };
      else o = { type: 'move', x: wx + ox, y: wy + oy };
    } else if (target && target.kind === 'res' && ((vill && !RES_DEF[target.key].naval) || (u.def.fisher && RES_DEF[target.key].naval))) o = { type: 'gather', rid: target.id, rtype: resType(target) };
    else if (target && target.kind === 'building' && u.def.fisher && target.owner === G.me && B[target.key].navalDrop && u.carryAmt > 0) o = { type: 'return', rid: u.order.rid, rtype: u.carry };
    else if (enemyT) {
      if (vill && target.kind === 'unit' && target.def.cls !== 'huntable' && target.owner !== 0) o = { type: 'attack', tid: target.id, forced: true };
      else o = { type: 'attack', tid: target.id, hunt: vill && target.kind === 'unit' && target.def.cls === 'huntable', forced: true };
    } else o = { type: 'move', x: wx + ox, y: wy + oy, amove: amove && isCombat(u) };
    setOrder(u, o, queued);
  }
  const talker = units.find(u => BARKS[u.key]);
  if (talker) bark(talker, enemyT ? 'atk' : 'go');
}
// Placement (with drag-to-build walls).
function placementCells() {
  const d = B[G.placing], w = G.mouseWorld;
  const at = p => ({ tx: Math.floor(p.x) - Math.floor(d.w / 2), ty: Math.floor(p.y) - Math.floor(d.h / 2) });
  if (G.placing === 'tc') { const s = snapSettlement(w.x, w.y); const c = s ? { tx: s.tx, ty: s.ty } : at(w); c.ok = !!s && canPlace('tc', c.tx, c.ty, G.me) && !buildCheck(humanP(), 'tc'); return [c]; }
  if ((d.wall) && G.wallStart) {
    const a = G.wallStart, ax = Math.floor(a.x), ay = Math.floor(a.y), bx = Math.floor(w.x), by = Math.floor(w.y);
    const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay)), out = [];
    for (let s = 0; s <= Math.min(steps, 40); s++) { const tx = Math.round(ax + (bx - ax) * s / (steps || 1)), ty = Math.round(ay + (by - ay) * s / (steps || 1)); if (!out.some(c => c.tx === tx && c.ty === ty)) out.push({ tx, ty }); }
    for (const c of out) c.ok = canPlace(G.placing, c.tx, c.ty, G.me);
    return out;
  }
  const c = at(w); c.ok = canPlace(G.placing, c.tx, c.ty, G.me) && !buildCheck(humanP(), G.placing);
  return [c];
}
function placeNow(keep) {
  const P = humanP(), key = G.placing, cost = bcost(key, P.faction);
  const cells = placementCells().filter(c => c.ok);
  if (!cells.length) { toast(key === 'tc' ? 'Town Centers must be built on a free Settlement.' : "You can't build there. Choose clear, explored ground.", 'warn'); SFX.play('error'); return false; }
  const vills = selUnits().filter(u => u.def.cls === 'villager');
  let placed = 0;
  for (const c of cells) {
    const why = buildCheck(P, key); if (why) { toast(why, 'warn'); SFX.play('error'); break; }
    pay(P, cost);
    const b = placeBuilding(key, G.me, c.tx, c.ty, false);
    for (const v of vills) setOrder(v, { type: 'build', bid: b.id }, placed > 0 || G.shiftKey);
    placed++;
  }
  if (placed) SFX.play('order');
  G.wallStart = null;
  if (!keep) G.placing = null;
  cmdSig = '';
  return placed > 0;
}

// ---------- command card ----------
const HOTKEYS = 'QWERTYUASDFGJKZXCVBNL';
let cmdSig = '', cmdList = [];
function costLine(c) { return Object.keys(c || {}).filter(k => c[k] > 0).map(k => `<span class="c-${k}">${Math.ceil(c[k])} ${RES_NAME[k]}</span>`).join(''); }
function getCommands() {
  const P = humanP(), out = [];
  if (!P) return out;
  const units = selUnits(), blds = selBlds();
  if (blds.length && !units.length) {
    const b = blds[0], d = B[b.key];
    if (!b.built) { out.push({ id: 'cancelb', icon: cmdIcon('cancel'), name: 'Cancel construction', desc: 'Refunds the cost.', run: () => { refund(P, bcost(b.key, P.faction), b.progress < .01 ? 1 : .75); kill(b, null); } }); return out; }
    // age up: one button per patron choice
    if (b.key === 'tc') {
      const ak = ['', 'age2', 'age3', 'age4'][P.age];
      if (ak && techAvailable(P, ak) && !b.research && !G.blds.some(x => x.owner === G.me && x.research && TECH[x.research.key].ageUp)) {
        for (const pk of FACTIONS[P.faction].minors[P.age + 1]) {
          const why = techCheck(P, b, ak);
          out.push({ id: 'age-' + pk, icon: patronPortrait(pk, 52), age: true, name: `${TECH[ak].name}: ${PATRONS[pk].name}`, cost: TECH[ak].cost, why, desc: `<i>${PATRONS[pk].title}.</i> ${PATRONS[pk].desc}<br>Power: <b>${POW[PATRONS[pk].power].name}</b>: ${POW[PATRONS[pk].power].desc}<br>Gift: <b>${patronGift(pk)} × ${U[PATRONS[pk].myth].name}</b> at your Temple.<br>Upgrades: ${Object.keys(TECH).filter(k => TECH[k].patron === pk).map(k => TECH[k].name).join(', ')}.`, run: () => { const w = startTech(P, b, ak, pk); if (w) { toast(w, 'warn'); SFX.play('error'); } else SFX.play('click'); } });
        }
      }
    }
    for (const k of d.trains.filter(k => U[k].faction === P.faction && unitAvailable(P, k))) {
      const def = U[k], why = trainCheck(P, b, k);
      if (def.cls === 'hero' && (why === 'Already on the field' || why === 'Already training')) continue;
      if (def.req && !P.techs.has(def.req)) continue;
      const qn = b.queue.filter(q => q.key === k).length;
      out.push({ id: 'train-' + k, icon: unitIcon(k, def.forms ? (P.mods.forms[k] || def.forms.base) : null, P.color), need: (def.age || 1) > P.age ? def.age : 0, hero: def.cls === 'hero', name: (def.cls === 'hero' ? '★ ' : '') + (def.forms ? FORMS[P.mods.forms[k] || def.forms.base].name : def.name), cost: unitCost(P, k), why: why === 'Queue full' ? null : why, q: qn, desc: unitDesc(P, k), run: () => { const w = queueUnit(P, b, k); if (w) { toast(w, 'warn'); SFX.play('error'); } else SFX.play('click'); } });
    }
    for (const k of d.techs) {
      const T = TECH[k];
      if (T.ageUp || P.techs.has(k) || !techAvailable(P, k)) continue;
      const why = techCheck(P, b, k);
      if (why === 'Researching') continue;
      // each upgrade line shows its next level once the previous one is done or under way
      if (T.req && !P.techs.has(T.req) && !G.blds.some(x => x.owner === G.me && x.research && x.research.key === T.req)) continue;
      out.push({ id: 'tech-' + k, icon: techIcon(k), name: T.name, cost: T.cost, why, need: T.age > P.age ? T.age : 0, desc: T.desc, run: () => { const w = startTech(P, b, k); if (w) { toast(w, 'warn'); SFX.play('error'); } else SFX.play('click'); } });
    }
    if (b.key === 'market') for (const r of ['food', 'wood']) {
      out.push({ id: 'buy-' + r, icon: cmdIcon('market'), name: `Buy 100 ${RES_NAME[r]}`, cost: { gold: P.market[r] }, desc: 'Prices rise as you buy.', run: () => { const w = marketTrade(P, r, true); if (w) toast(w, 'warn'); else SFX.play('click'); } });
      out.push({ id: 'sell-' + r, icon: cmdIcon('sell'), name: `Sell 100 ${RES_NAME[r]}`, desc: `You get ${Math.round(P.market[r] * .8)} Zeni. Prices fall as you sell.`, run: () => { const w = marketTrade(P, r, false); if (w) toast(w, 'warn'); else SFX.play('click'); } });
    }
    if (d.garrison && b.garrisoned.length) out.push({ id: 'ungarrison', icon: cmdIcon('ungarrison'), name: 'Ungarrison', desc: `Release the ${b.garrisoned.length} units inside.`, run: () => ungarrisonAll(b) });
    if (b.research) out.push({ id: 'cancelr', icon: cmdIcon('cancel'), name: 'Cancel research', desc: 'Refunds the cost.', run: () => cancelResearch(P, b) });
    out.push({ id: 'delete', icon: cmdIcon('delete'), name: 'Destroy building', desc: 'Demolish this building (no refund). Key: Delete', run: () => kill(b, null) });
    return out;
  }
  if (!units.length) return out;
  const vills = units.filter(u => u.def.cls === 'villager');
  const heroes = units.filter(u => u.def.cls === 'hero');
  if (vills.length && vills.length === units.length) {
    // every building on one panel, as in Age of Mythology; locked ones show the Saga that unlocks them
    const order = ['house', 'granary', 'storehouse', 'farm', 'reactor', 'dock', 'tc', 'barracks', 'temple', 'tower', 'wall', 'gate', 'stable', 'armory', 'market', 'fortress', 'wonder'];
    for (const k of order.filter(k => BUILD_MENU[P.faction].includes(k))) {
      const d = B[k], why = buildCheck(P, k), c = bcost(k, P.faction);
      out.push({ id: 'build-' + k, icon: buildingIcon(k, P.faction, P.color), name: bname(k, P.faction), cost: c, why, need: d.age > P.age ? d.age : 0, on: G.placing === k, desc: d.desc + (k === 'wall' ? ' Click and drag to draw a wall.' : ''), run: () => { if (why) { toast(why, 'warn'); SFX.play('error'); return; } G.placing = k; G.wallStart = null; G.targeting = null; } });
    }
    if (P.faction === 'earth') { const t = nearestOwn(P, 'temple', vills[0]); if (t) out.push({ id: 'meditate', icon: cmdIcon('meditate'), name: "Meditate at Kami's Lookout", desc: 'Villagers meditating at a Temple make Ki (up to 10 per Temple).', run: () => { for (const v of vills) setOrder(v, { type: 'meditate', bid: t.id }); } }); }
  }
  for (const h of heroes.slice(0, 2)) {
    if (canFly(h)) out.push({ id: 'fly-' + h.id, icon: cmdIcon(h.flying ? 'land' : 'fly'), hero: true, on: h.flying, name: h.flying ? `Land (${stats(h).name})` : `Take flight (${stats(h).name})`, desc: 'Flying ignores terrain and walls, +25% speed and −15% Hack armor, but costs 0.4 Ki per second.', run: () => toggleFlight(h) });
    if (stats(h).kaioken) out.push({ id: 'kaio-' + h.id, icon: cmdIcon('kaioken'), hero: true, on: h.kaio, name: h.kaio ? 'Release Kaio-ken' : 'Kaio-ken', desc: 'Doubles attack and speed but costs 5 HP per second. Ground only.', run: () => toggleKaioken(h) });
    if (h.carryRelic) out.push({ id: 'dropr-' + h.id, icon: relicIcon((G.relics.find(r => r.id === h.carryRelic) || { key: 'powerpole' }).key, 52), hero: true, name: 'Drop relic', desc: 'Put the relic down here. Bring it to your Temple instead to get its bonus.', run: () => dropRelic(h) });
    if (h.carryBall) out.push({ id: 'drop-' + h.id, icon: cmdIcon('dropball'), hero: true, name: 'Drop Dragon Ball', desc: 'Put the Dragon Ball down here.', run: () => dropBall(h) });
  }
  const emp = units.filter(u => u.def.empower);
  if (emp.length) out.push({ id: 'empower', icon: cmdIcon('empower'), on: G.targeting && G.targeting.type === 'empower', name: 'Empower a building', desc: 'Click one of your buildings: it trains, researches, builds and shoots 25% faster while he stands by it, and resources dropped off there count 20% more.', run: () => { G.targeting = { type: 'empower' }; G.placing = null; } });
  const trd = units.filter(u => u.def.trader);
  if (trd.length) out.push({ id: 'trade', icon: cmdIcon('trade'), on: G.targeting && G.targeting.type === 'trade', name: 'Trade route', desc: 'Click a Town Center (yours or an ally’s). The caravan shuttles between it and your Market; the longer the route, the more Zeni.', run: () => { G.targeting = { type: 'trade' }; G.placing = null; } });
  const fighters = units.filter(isCombat);
  if (fighters.length) { const cur = fighters[0].stance || 'aggressive', nxt = STANCES[(STANCES.indexOf(cur) + 1) % STANCES.length]; out.push({ id: 'stance-' + cur, icon: cmdIcon('stance_' + cur), name: `Stance: ${STANCE_NAME[cur]}`, desc: 'Click to switch. <b>Aggressive</b>: chase enemies. <b>Defensive</b>: fight nearby, then return. <b>Stand Ground</b>: never move, hit what is in range. <b>No Attack</b>: never fight back. Next: ' + STANCE_NAME[nxt] + '.', run: () => { for (const u of fighters) u.stance = nxt; } }); }
  if (units.some(isCombat)) out.push({ id: 'amove', icon: cmdIcon('amove'), on: G.targeting && G.targeting.type === 'amove', name: 'Attack-move', desc: 'Move and fight anything on the way. Key: A', run: () => { G.targeting = { type: 'amove' }; G.placing = null; } });
  const gar = nearestGarrison(P, units[0]);
  if (gar) out.push({ id: 'garrison', icon: cmdIcon('garrison'), name: `Garrison in ${gar.name}`, desc: 'Units inside are safe, heal slowly, and add shots to Town Centers, towers and fortresses.', run: () => { for (const u of units) setOrder(u, { type: 'garrison', bid: gar.id }); } });
  out.push({ id: 'stop', icon: cmdIcon('stop'), name: 'Stop', desc: 'Cancel current orders.', run: () => { for (const u of units) { u.queue = []; idleOrder(u); } } });
  out.push({ id: 'delete', icon: cmdIcon('delete'), name: 'Delete', desc: 'Remove the selected units. Key: Delete', run: () => { for (const u of units) kill(u, null); } });
  return out;
}
function nearestOwn(P, key, from) { let best = null, bd = 1e9; for (const b of G.blds) if (b.owner === P.id && b.key === key && b.built) { const d = dist(b.x, b.y, from.x, from.y); if (d < bd) { bd = d; best = b; } } return best; }
function nearestGarrison(P, from) { if (!from) return null; let best = null, bd = 20; for (const b of G.blds) if (b.owner === P.id && b.built && B[b.key].garrison && b.garrisoned.length < B[b.key].garrison) { const d = dist(b.x, b.y, from.x, from.y); if (d < bd) { bd = d; best = b; } } return best; }
function unitDesc(P, k) {
  const d = U[k], s = unitStats(P.id, d, d.forms ? (P.mods.forms[k] || d.forms.base) : null);
  const atk = [];
  if (s.melee) atk.push('Melee ' + ['hack', 'pierce', 'crush'].filter(t => s.melee[t]).map(t => `${Math.round(s.melee[t])} ${t}`).join(' + '));
  if (s.ranged) atk.push('Ranged ' + ['hack', 'pierce', 'crush'].filter(t => s.ranged[t]).map(t => `${Math.round(s.ranged[t])} ${t}`).join(' + ') + `, ${s.ranged.range} m`);
  return `${d.desc || ''}<br><span class="stat">${Math.round(s.hp)} HP · ${atk.join(' · ')} · ${d.pop || 0} pop</span>`;
}
function renderCommands() {
  const list = getCommands();
  const sig = list.map(c => c.id + '|' + (c.why ? 1 : 0) + (c.on ? 1 : 0) + (c.q || 0) + '|' + c.name).join(',');
  cmdList = list;
  if (sig === cmdSig) return;
  cmdSig = sig;
  const el = $('cmds'); el.innerHTML = '';
  list.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'cmd' + (c.why ? ' off' : '') + (c.on ? ' on' : '') + (c.hero ? ' hero' : '') + (c.age ? ' age' : '');
    btn.setAttribute('aria-label', c.name);
    const cv = document.createElement('canvas'); cv.width = 104; cv.height = 104;
    const cx = cv.getContext('2d'); if (c.icon) cx.drawImage(c.icon.c, 0, 0, 104, 104);
    btn.appendChild(cv);
    if (HOTKEYS[i]) { const k = document.createElement('span'); k.className = 'k'; k.textContent = HOTKEYS[i]; btn.appendChild(k); }
    if (c.q) { const q = document.createElement('span'); q.className = 'q'; q.textContent = c.q; btn.appendChild(q); }
    if (c.need) { const n = document.createElement('span'); n.className = 'need'; n.textContent = ['', 'I', 'II', 'III', 'IV'][c.need]; n.title = AGES[c.need]; btn.appendChild(n); }
    btn.addEventListener('click', ev => { ev.stopPropagation(); const cur = cmdList[i]; if (cur) { SFX.unlock(); cur.run(); cmdSig = ''; renderCommands(); showTip(btn, cur); } });
    btn.addEventListener('pointerenter', () => showTip(btn, cmdList[i]));
    btn.addEventListener('pointerleave', hideTip);
    el.appendChild(btn);
  });
}
// ---------- tooltip ----------
const tipEl = $('tooltip');
function showTip(anchor, c) {
  if (!c || matchMedia('(hover: none)').matches) return;
  const i = cmdList.indexOf(c);
  tipEl.innerHTML = `<b>${esc(c.name)}</b>${c.cost ? `<div class="cost">${costLine(c.cost)}</div>` : ''}<div class="d">${c.desc || ''}</div>${c.why ? `<div class="why">${esc(c.why)}</div>` : ''}${i >= 0 && HOTKEYS[i] ? `<div class="hk">Hotkey: ${HOTKEYS[i]}</div>` : ''}`;
  tipEl.hidden = false;
  const r = anchor.getBoundingClientRect(), tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
  tipEl.style.left = clamp(r.left + r.width / 2 - tw / 2, 8, vw - tw - 8) + 'px';
  tipEl.style.top = Math.max(8, r.top - th - 8) + 'px';
}
function hideTip() { tipEl.hidden = true; }
function tipFor(el, fn) { el.addEventListener('pointerenter', () => { const c = fn(); if (c) showTip(el, c); }); el.addEventListener('pointerleave', hideTip); }

// ---------- selection panel ----------
const portraitCv = $('portrait'), pctx = portraitCv.getContext('2d');
let selSig = '';
function renderSelection() {
  const sel = G.sel.filter(e => !e.dead && !(e.kind === 'unit' && e.garrison));
  G.sel = sel;
  const body = $('selbody');
  const P = humanP();
  let pk = '';
  if (!sel.length) {
    pk = 'none';
    body.innerHTML = `<div class="sub">${P ? FACTIONS[P.faction].name : ''}</div><h3>${P ? AGES[P.age] : ''}</h3><div class="stat">${G.scn ? 'Check your objectives (top left).' : 'Select units or buildings. Right-click to give orders.'}${G.balls.length ? ' Only heroes can carry Dragon Balls.' : ''}</div>`;
  } else if (sel.length > 1) {
    pk = 'multi';
    const groups = new Map();
    for (const e of sel) { const k = e.kind === 'unit' ? e.key + '|' + (e.form || '') : 'B' + e.key; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(e); }
    const sig = [...groups.keys()].join(',') + sel.map(e => Math.round(e.hp / maxHp(e) * 10)).join('');
    if (sig !== selSig) {
      selSig = sig;
      body.innerHTML = `<div class="sub">${sel.length} selected</div><div class="multi"></div>`;
      const box = body.querySelector('.multi');
      for (const [k, list] of groups) {
        const e = list[0], btn = document.createElement('button'); btn.className = 'mini';
        const cv = document.createElement('canvas'); cv.width = 76; cv.height = 76;
        const ic = e.kind === 'unit' ? unitIcon(e.key, e.form, e.owner > 0 ? G.players[e.owner].color : null) : buildingIcon(e.key, e.fac, G.players[e.owner].color);
        cv.getContext('2d').drawImage(ic.c, 0, 0, 76, 76); btn.appendChild(cv);
        const hp = list.reduce((s, x) => s + x.hp / maxHp(x), 0) / list.length;
        btn.insertAdjacentHTML('beforeend', `<i><b style="width:${hp * 100}%"></b></i>${list.length > 1 ? `<span class="cnt">${list.length}</span>` : ''}`);
        btn.title = (e.kind === 'unit' ? stats(e).name : e.name) + (list.length > 1 ? ` (${list.length})` : '');
        btn.addEventListener('click', ev => { if (ev.shiftKey) { G.sel = G.sel.filter(x => !list.includes(x)); cmdSig = ''; } else selectEntities(list, false); });
        box.appendChild(btn);
      }
    }
    const e = sel[0];
    drawPortrait(e);
    return;
  } else {
    const e = sel[0];
    pk = e.id + '';
    body.innerHTML = singleInfo(e);
    for (const cv of body.querySelectorAll('canvas[data-icon]')) { const k = cv.dataset.icon, d = U[k]; cv.getContext('2d').drawImage(unitIcon(k, d.forms ? (humanP().mods.forms[k] || d.forms.base) : null, humanP().color).c, 0, 0, 68, 68); }
  }
  selSig = '';
  if (sel.length) drawPortrait(sel[0]); else { pctx.clearRect(0, 0, 192, 192); if (P) pctx.drawImage(patronPortrait(P.major, 96).c, 0, 0, 192, 192); }
}
let lastPortrait = '';
function drawPortrait(e) {
  const key = e.kind === 'unit' ? 'u' + e.key + (e.form || '') + e.owner + (e.ape ? 'a' : '') : e.kind === 'building' ? 'b' + e.key + e.owner : 'r' + e.key;
  if (key === lastPortrait) return;
  lastPortrait = key;
  pctx.clearRect(0, 0, 192, 192);
  let s;
  if (e.kind === 'unit') s = e.ape ? { c: (() => { const c = makeCanvas(96, 96), g = c.getContext('2d'); g.fillStyle = '#2a1a0a'; g.fillRect(0, 0, 96, 96); g.translate(44, 124); g.scale(1.2, 1.2); drawApe(g, 'idle', 0, null); return c; })() } : portrait(e.key, e.form, e.owner > 0 ? G.players[e.owner].color : null, 96);
  else if (e.kind === 'building') s = buildingIcon(e.key, e.fac, G.players[e.owner].color, 96);
  else { const c = makeCanvas(96, 96), g = c.getContext('2d'); g.fillStyle = '#1a2a14'; g.fillRect(0, 0, 96, 96); const sp = e.key === 'tree' ? treeSprite(G.map.biome, e.v) : e.key === 'gold' ? goldSprite(G.map.biome) : e.key === 'berry' ? berrySprite() : carcassSprite(); const f = Math.min(80 / sp.w, 80 / sp.h); g.drawImage(sp.c, 48 - sp.w * f / 2, 48 - sp.h * f / 2, sp.w * f, sp.h * f); s = { c }; }
  pctx.drawImage(s.c, 0, 0, 192, 192);
}
function singleInfo(e) {
  const owner = e.owner === G.me ? 'Yours' : e.owner > 0 ? (isAlly(e.owner, G.me) ? 'Ally: ' : 'Enemy: ') + G.players[e.owner].name : e.owner === 0 ? 'Wild' : '';
  if (e.kind === 'res') return `<div class="sub">Resource</div><h3>${SPECIAL_NAMES[e.key]}</h3><div class="stat"><b>${Math.ceil(e.amount)}</b> ${RES_NAME[RES_DEF[e.key].type]} left</div>`;
  if (e.kind === 'unit') {
    const st = stats(e), mh = maxHp(e), A = armorOf(e);
    const atk = [];
    const am = atkMult(e);
    if (st.melee) atk.push('Melee ' + ['hack', 'pierce', 'crush'].filter(k => st.melee[k]).map(k => `<b>${Math.round(st.melee[k] * am)}</b> ${k}`).join(' + '));
    if (st.ranged) atk.push('Ranged ' + ['hack', 'pierce', 'crush'].filter(k => st.ranged[k]).map(k => `<b>${Math.round(st.ranged[k] * am)}</b> ${k}`).join(' + ') + `, ${st.ranged.range} m`);
    let extra = '';
    if (st.special) extra += `<div class="stat">${st.special.name}: <b>${e.spCd > 0 ? Math.ceil(e.spCd) + 's' : 'ready'}</b> (automatic)</div>`;
    if (e.key === 'cell') extra += `<div class="stat">Biomass <b>${e.biomass}</b>${CELL_FORMS.indexOf(e.form) < 2 ? ` / ${(CELL_FORMS.indexOf(e.form) + 1) * 8} to evolve` : ' (Perfect)'}</div>`;
    if (e.flying && !e.def.alwaysFly) extra += `<div class="stat">Flying: <b>−0.4 Ki/s</b></div>`;
    if (e.kaio) extra += `<div class="stat" style="color:#ff8a8a">Kaio-ken: double power, −5 HP/s</div>`;
    if (st.kiDrain) extra += `<div class="stat">Form upkeep: <b>−${st.kiDrain} Ki/s</b></div>`;
    if (e.ape) extra += `<div class="stat" style="color:#ffe9a8">Great Ape for ${Math.ceil(e.ape - G.time)}s</div>`;
    if (e.carryBall) { const b = G.balls.find(q => q.id === e.carryBall); extra += `<div class="stat" style="color:var(--zeni)">Carrying the ${b ? b.star : ''}-Star Dragon Ball</div>`; }
    if (e.carryRelic) { const r = G.relics.find(q => q.id === e.carryRelic); if (r) extra += `<div class="stat" style="color:#d7b8ff">Carrying the ${esc(RELICS[r.key].name)}: ${esc(RELICS[r.key].desc)}</div>`; }
    if (e.carryAmt > .5) extra += `<div class="stat">Carrying <b>${Math.floor(e.carryAmt)}</b> ${RES_NAME[e.carry]}</div>`;
    const cls = { cart: e.def.trader ? 'Caravan' : 'Supply cart', ship: e.def.fisher ? 'Fishing ship' : { arrow: 'Arrow ship', hammer: 'Hammer ship', siege: 'Siege ship' }[e.def.ship] || 'Ship', villager: 'Villager', infantry: 'Infantry', ranged: 'Ranged', cavalry: 'Cavalry', siege: 'Siege', myth: 'Myth unit', hero: 'Hero', titan: 'Titan', guard: 'Guardian', huntable: 'Animal' }[e.def.cls] || '';
    return `<div class="sub">${esc(owner)} · ${cls}</div><h3>${esc(e.nick || (e.ape ? 'Great Ape' : st.name))}</h3><div class="hpbar"><i style="width:${clamp(e.hp / mh, 0, 1) * 100}%"></i></div><div class="stats"><span class="stat"><b>${Math.ceil(e.hp)}</b>/${Math.round(mh)} HP</span><span class="stat">Armor H ${Math.round(A[0] * 100)}% P ${Math.round(A[1] * 100)}% C ${Math.round(A[2] * 100)}%</span></div>${atk.length ? `<div class="stat">${atk.join(' · ')}</div>` : ''}${extra}`;
  }
  const b = e, d = B[b.key], P = G.players[b.owner];
  let h = `<div class="sub">${esc(owner)}</div><h3>${esc(b.name)}</h3>`;
  if (!b.built) return h + `<div class="hpbar prog"><i style="width:${b.progress * 100}%"></i></div><div class="stat">Under construction: <b>${Math.floor(b.progress * 100)}%</b>. Right-click it with villagers to help.</div>`;
  h += `<div class="hpbar"><i style="width:${b.hp / maxHp(b) * 100}%"></i></div><div class="stat"><b>${Math.ceil(b.hp)}</b>/${Math.round(maxHp(b))} HP</div>`;
  if (b.owner === G.me) {
    if (b.queue.length) h += `<div class="queue">${b.queue.map((q, i) => `<button class="mini" data-q="${i}" title="Cancel ${esc(U[q.key].name)}"><canvas width="68" height="68" data-icon="${q.key}"></canvas><span style="width:${q.progress * 100}%"></span></button>`).join('')}${b.queue[0].blocked ? '<span class="stat" style="color:var(--danger)">Needs more houses</span>' : ''}</div>`;
    if (b.research) h += `<div class="stat">Researching <b>${esc(TECH[b.research.key].name)}${b.research.patron ? ' (' + PATRONS[b.research.patron].name + ')' : ''}</b> ${Math.floor(b.research.progress * 100)}%</div><div class="hpbar prog"><i style="width:${b.research.progress * 100}%"></i></div>`;
    if (d.garrison) h += `<div class="stat">Garrison: <b>${b.garrisoned.length}</b> / ${d.garrison}</div>`;
    if (d.vault && G.balls.length) h += `<div class="stat">Dragon Balls inside: <b>${b.balls.length}</b> / 7</div>`;
    if (b.key === 'temple') h += b.relics.length ? `<div class="stat">Relics (${b.relics.length}/${RELIC_CAP}): ${b.relics.map(id => { const r = G.relics.find(q => q.id === id); return r ? `<b style="color:#d7b8ff" title="${esc(RELICS[r.key].desc)}">${esc(RELICS[r.key].name)}</b>` : ''; }).join(', ')}</div>` : (G.relics.length ? '<div class="stat">No relics yet. Heroes can bring relics here for bonuses.</div>' : '');
    if (b.key === 'temple' && P.faction === 'earth') { const n = G.units.filter(u => u.owner === G.me && u.meditating && u.order.bid === b.id).length; h += `<div class="stat">Meditating: <b>${n}</b> (+${(Math.min(n, 10) * .18 * P.mods.kiRate).toFixed(2)} Ki/s)</div>`; }
    if (b.key === 'reactor') h += `<div class="stat">Generating <b>+${bmod(P, 'reactor', 'ki', .2).toFixed(2)} Ki/s</b></div>`;
    if (b.key === 'wonder' && P.wonderSince && modeHas('wonder')) h += `<div class="stat">Victory in <b>${fmtTime(WONDER_TIME - (G.time - P.wonderSince))}</b></div>`;
    if (b.key === 'market') h += `<div class="stat">Rations ${P.market.food} Zeni · Alloy ${P.market.wood} Zeni (per 100)</div>`;
  } else h += `<div class="stat">${esc(d.desc)}</div>`;
  if (b.key === 'korin' && G.koth) h += `<div class="stat">${G.koth.team ? `Held by ${G.koth.team === P0team() ? 'your team' : 'team ' + G.koth.team}: <b>${fmtTime(Math.max(0, KOTH_TIME - G.koth.held))}</b> left to victory` : 'Nobody holds the tower yet.'}</div>`;
  return h;
}
$('selbody').addEventListener('pointerdown', ev => {
  const q = ev.target.closest('[data-q]'); if (!q) return;
  const b = G.sel[0]; if (!b || b.kind !== 'building' || b.owner !== G.me) return;
  cancelQueue(humanP(), b, +q.dataset.q);
});

// ---------- top bar, powers, objectives ----------
let powSig = '';
function updateHUD() {
  const P = G.me ? humanP() : null; if (!P) return;
  $('r-food').textContent = Math.floor(P.res.food); $('r-wood').textContent = Math.floor(P.res.wood); $('r-gold').textContent = Math.floor(P.res.gold);
  $('r-ki').textContent = Math.floor(P.res.ki) + '/' + P.kiCap;
  const pop = $('r-pop'); pop.textContent = P.pop + '/' + P.popCap; pop.classList.toggle('full', P.pop >= P.popCap);
  $('age-name').textContent = AGES[P.age];
  $('patron-name').textContent = [P.major, ...P.minors].map(k => PATRONS[k].name).join(' · ');
  $('clock').textContent = fmtTime(G.time);
  const track = $('dbtrack');
  track.hidden = !G.balls.length;
  if (G.balls.length) {
    if (track.children.length !== 7) { track.innerHTML = ''; for (let i = 0; i < 7; i++) track.appendChild(document.createElement('i')); }
    G.balls.forEach((b, i) => {
      let cls = 'ground';
      if (b.state === 'stone') cls = 'stone';
      else if (b.state === 'temple') { const t = byId(b.temple); cls = t && t.owner === G.me ? 'mine' : 'enemy'; }
      else if (b.state === 'carried') { const h = byId(b.holder); cls = h && h.owner === G.me ? 'carry' : 'enemy'; }
      track.children[i].className = cls; track.children[i].title = `${b.star}-Star Dragon Ball`;
    });
  }
  // powers
  const keys = Object.keys(P.powers);
  const sig = keys.map(k => k + P.powers[k].state + (G.targeting && G.targeting.key === k ? 'a' : '')).join(',');
  if (sig !== powSig) {
    powSig = sig;
    const el = $('powers'); el.innerHTML = '';
    for (const k of keys) {
      const st = P.powers[k].state, btn = document.createElement('button');
      btn.className = 'pow ' + (st === 'used' ? 'used' : '') + (k === 'shenron' ? ' shenron' : '') + (G.targeting && G.targeting.key === k ? ' armed' : '');
      btn.setAttribute('aria-label', POW[k].name);
      const cv = document.createElement('canvas'); cv.width = 108; cv.height = 108; cv.getContext('2d').drawImage(powerIcon(k).c, 0, 0, 108, 108); btn.appendChild(cv);
      btn.addEventListener('click', () => { SFX.unlock(); if (!powerReady(P, k)) return; if (['bolt', 'convert', 'heal', 'buff', 'repair', 'stun', 'drain', 'apes', 'summon', 'strike', 'line', 'bombs'].includes(POW[k].type)) { G.targeting = { type: 'power', key: k }; G.placing = null; toast(`Choose where to cast ${POW[k].name}. Right-click cancels.`, 'gold'); } else castPower(P, k, 0, 0); powSig = ''; });
      tipFor(btn, () => ({ name: POW[k].name, desc: POW[k].desc + (st === 'used' ? '<br><i>Already used.</i>' : '<br>Each god power can be used once.') }));
      el.appendChild(btn);
    }
  }
  const idle = G.units.filter(u => u.owner === G.me && u.def.cls === 'villager' && u.order.type === 'idle' && !u.garrison).length;
  $('q-idle').querySelector('.n').textContent = idle ? idle : '';
  renderSelection();
  renderCommands();
  if (G.scn) renderObjectives();
  const wb = $('wonderbar');
  const timers = victoryTimers();
  wb.hidden = !timers.length;
  if (timers.length) wb.innerHTML = timers.map(t => `<div style="color:${pcol(t.color)}">${esc(t.label)}: ${fmtTime(Math.max(0, t.left))}</div>`).join('');
  const topB = $('top').getBoundingClientRect().bottom;
  if (Math.abs(topB - (G.toastTop || 0)) > 1) { G.toastTop = topB; document.documentElement.style.setProperty('--toast-top', Math.round(topB + 6) + 'px'); document.documentElement.style.setProperty('--obj-top', Math.round(topB + 6) + 'px'); }
}

// ---------- input ----------
const keys = new Set();
const pointers = new Map();
let drag = null, pinch = null;
view.addEventListener('contextmenu', e => e.preventDefault());
view.addEventListener('pointerdown', e => {
  if (!G.started || G.headless) return;
  SFX.unlock();
  view.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const touch = e.pointerType === 'touch';
  if (pointers.size === 2 && touch) { const p = [...pointers.values()]; pinch = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), z: cam.z, cx: (p[0].x + p[1].x) / 2, cy: (p[0].y + p[1].y) / 2 }; drag = null; G.boxStart = G.boxEnd = null; return; }
  drag = { sx: e.clientX, sy: e.clientY, button: e.button, touch, moved: false, camX: cam.x, camY: cam.y };
  if (e.button === 0 && G.placing && B[G.placing].wall && !touch) G.wallStart = screenToWorld(e.clientX, e.clientY);
});
view.addEventListener('pointermove', e => {
  G.mouseScreen = { x: e.clientX, y: e.clientY }; G.mouseWorld = screenToWorld(e.clientX, e.clientY);
  if (!pointers.has(e.pointerId)) { if (e.pointerType === 'mouse') G.hover = pickAt(e.clientX, e.clientY); return; }
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size === 2) { const p = [...pointers.values()]; const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); zoomAt(clamp(pinch.z * d / pinch.d, .45, 1.8) / cam.z, pinch.cx, pinch.cy); return; }
  if (!drag) return;
  const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
  if (!drag.moved && Math.hypot(dx, dy) > (drag.touch ? 10 : 6)) drag.moved = true;
  if (!drag.moved) return;
  const boxMode = (!drag.touch && drag.button === 0 && !G.placing) || (drag.touch && G.boxMode);
  if (boxMode) { G.boxStart = { sx: drag.sx, sy: drag.sy }; G.boxEnd = { sx: e.clientX, sy: e.clientY }; }
  else if (drag.touch && G.placing && B[G.placing].wall) { if (!G.wallStart) G.wallStart = screenToWorld(drag.sx, drag.sy); }
  else if (drag.touch || drag.button === 1 || drag.button === 2) { cam.x = drag.camX - dx / cam.z; cam.y = drag.camY - dy / cam.z; clampCam(); }
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pinch) { if (pointers.size < 2) pinch = null; drag = null; return; }
  if (!drag) return;
  const d = drag; drag = null;
  G.shiftKey = e.shiftKey; G.altKey = e.altKey;
  if (G.boxStart && G.boxEnd) { boxSelect(G.boxStart, G.boxEnd, e.shiftKey); G.boxStart = G.boxEnd = null; if (d.touch) { G.boxMode = false; $('q-box').classList.remove('on'); } return; }
  if (G.placing && (d.button === 0 || d.touch) && (!d.moved || (G.wallStart && B[G.placing].wall))) { G.mouseWorld = screenToWorld(e.clientX, e.clientY); placeNow(e.shiftKey); return; }
  if (d.moved) return;
  if (d.touch) { tapAt(e.clientX, e.clientY); return; }
  if (d.button === 0) clickAt(e.clientX, e.clientY, e);
  else if (d.button === 2) {
    if (G.placing || G.targeting) { G.placing = null; G.targeting = null; G.wallStart = null; cmdSig = ''; powSig = ''; return; }
    const w = screenToWorld(e.clientX, e.clientY); command(w.x, w.y, pickAt(e.clientX, e.clientY), e.shiftKey);
  }
}
view.addEventListener('pointerup', endPointer);
view.addEventListener('pointercancel', e => { pointers.delete(e.pointerId); drag = null; pinch = null; G.boxStart = G.boxEnd = null; });
view.addEventListener('pointerleave', () => { G.mouseScreen = null; G.hover = null; });
view.addEventListener('wheel', e => { e.preventDefault(); if (!G.started) return; zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, { passive: false });
let lastClick = 0, lastHit = null;
function clickAt(px, py, ev) {
  const w = screenToWorld(px, py);
  if (G.targeting) {
    if (G.targeting.type === 'power') { if (castPower(humanP(), G.targeting.key, w.x, w.y)) G.targeting = null; powSig = ''; return; }
    if (G.targeting.type === 'empower' || G.targeting.type === 'trade') { const hit = pickAt(px, py); if (hit && hit.kind === 'building') command(w.x, w.y, hit, ev && ev.shiftKey); else toast(G.targeting.type === 'empower' ? 'Click one of your buildings.' : 'Click a Town Center.', 'warn'); G.targeting = null; cmdSig = ''; return; }
    if (G.targeting.type === 'amove') { command(w.x, w.y, pickAt(px, py), ev && ev.shiftKey); G.targeting = null; cmdSig = ''; return; }
  }
  const hit = pickAt(px, py, true);
  const now = performance.now(), dbl = now - lastClick < 330 && hit && lastHit === hit;
  lastClick = now; lastHit = hit;
  if (hit && hit.kind === 'relic') { const R = RELICS[hit.relic.key]; toast(`${R.name} (relic): ${R.desc} Right-click it with a hero, then bring it to your Temple.`, 'gold'); if (!(ev && ev.shiftKey)) selectEntities([], false); return; }
  if (hit && hit.kind !== 'ball') {
    if ((dbl || (ev && (ev.ctrlKey || ev.metaKey))) && hit.kind === 'unit' && hit.owner === G.me) selectSameType(hit);
    else if (ev && ev.shiftKey && hit.owner === G.me) { if (G.sel.includes(hit)) G.sel = G.sel.filter(s => s !== hit); else G.sel.push(hit); cmdSig = ''; }
    else selectEntities([hit], false);
  } else if (!(ev && ev.shiftKey)) selectEntities([], false);
}
function tapAt(px, py) {
  const w = screenToWorld(px, py);
  if (G.targeting) { clickAt(px, py, null); return; }
  const hit = pickAt(px, py, true);
  const now = performance.now(), dbl = now - lastClick < 330 && hit && lastHit === hit;
  lastClick = now; lastHit = hit;
  const myUnits = selUnits();
  if (hit && hit.owner === G.me && hit.kind === 'building' && myUnits.length) {
    const useful = myUnits.some(u => (u.def.cls === 'villager' && (!hit.built || hit.hp < maxHp(hit) || B[hit.key].farm || (hit.key === 'temple' && humanP().faction === 'earth') || (B[hit.key].drop && u.carryAmt > 0))) || ((u.carryBall || u.carryRelic) && B[hit.key].vault));
    if (useful) { command(w.x, w.y, hit, false); return; }
  }
  if (hit && hit.owner === G.me && (hit.kind === 'unit' || hit.kind === 'building')) { if (dbl && hit.kind === 'unit') selectSameType(hit); else selectEntities([hit], false); return; }
  if (myUnits.length || selBlds().length) { command(w.x, w.y, hit, false); return; }
  if (hit && hit.kind === 'relic') { const R = RELICS[hit.relic.key]; toast(`${R.name} (relic): ${R.desc} A hero can carry it to your Temple.`, 'gold'); }
  selectEntities(hit && hit.kind !== 'ball' && hit.kind !== 'relic' ? [hit] : [], false);
}
// minimap
function miniPos(e) { const r = mini.getBoundingClientRect(); return miniToWorld((e.clientX - r.left) / r.width * mini.width, (e.clientY - r.top) / r.height * mini.height); }
let miniDrag = false;
mini.addEventListener('contextmenu', e => e.preventDefault());
mini.addEventListener('pointerdown', e => { if (!G.started) return; const p = miniPos(e); if (e.button === 2) { command(p.x, p.y, null, e.shiftKey); return; } mini.setPointerCapture(e.pointerId); miniDrag = true; centerOn(p.x, p.y); });
mini.addEventListener('pointermove', e => { if (miniDrag) { const p = miniPos(e); centerOn(p.x, p.y); } });
mini.addEventListener('pointerup', () => { miniDrag = false; });
// keyboard
window.addEventListener('keydown', e => {
  if (!G.started || G.over || G.headless) return;
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return;
  keys.add(e.key); G.shiftKey = e.shiftKey;
  const k = e.key.toLowerCase();
  if (e.key === 'Escape') { if (!$('scr-pause').hidden) { togglePause(false); return; } if (G.placing || G.targeting) { G.placing = null; G.targeting = null; G.wallStart = null; cmdSig = ''; powSig = ''; return; } selectEntities([], false); return; }
  if (e.key === 'Enter') { e.preventDefault(); openCheat(); return; }
  if (k === 'p' || e.key === 'F10') { e.preventDefault(); togglePause(); return; }
  if (G.paused) return;
  if (/^[0-9]$/.test(e.key)) {
    const n = e.key;
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); G.groups[n] = ownSel().map(x => x.id); toast(`Group ${n} set (${G.groups[n].length}).`, ''); return; }
    const list = (G.groups[n] || []).map(id => byId(id)).filter(x => x && x.owner === G.me);
    if (list.length) { const again = G.lastGroup === n && performance.now() - G.lastGroupT < 400; selectEntities(list, e.shiftKey); if (again) centerOn(list[0].x, list[0].y); G.lastGroup = n; G.lastGroupT = performance.now(); }
    return;
  }
  if (e.key === 'Delete') { const own = ownSel(); for (const x of own) kill(x, null); return; }
  if (k === 'h' && !e.ctrlKey) { selectHeroes(); return; }
  if (k === 'm' && !e.ctrlKey) { selectArmy(); return; }
  if (k === '.' || k === 'i') { selectIdle(); return; }
  if (e.key === ' ') { e.preventDefault(); const s = G.sel[0]; if (s) centerOn(s.x, s.y); return; }
  if (e.key === 'Home') { const tc = G.blds.find(b => b.owner === G.me && b.key === 'tc'); if (tc) centerOn(tc.x, tc.y); return; }
  if (e.key === 'Backspace') { G.cmdPage = 'main'; cmdSig = ''; return; }
  const hk = HOTKEYS.toLowerCase().indexOf(k);
  if (k === 'a' && cmdList.some(c => c.id === 'amove') && !cmdList.some((c, i) => HOTKEYS[i] === 'A' && c.id !== 'amove')) { G.targeting = { type: 'amove' }; cmdSig = ''; return; }
  if (hk >= 0 && cmdList[hk]) { const c = cmdList[hk]; c.run(); cmdSig = ''; renderCommands(); }
});
window.addEventListener('keyup', e => { keys.delete(e.key); G.shiftKey = e.shiftKey; });
function selectHeroes() { const h = G.units.filter(u => u.owner === G.me && (u.def.cls === 'hero' || u.def.cls === 'titan') && !u.garrison); if (h.length) { selectEntities(h, false); if (h.length === 1) centerOn(h[0].x, h[0].y); } else toast('You have no heroes on the field.', ''); }
function selectArmy() { const a = G.units.filter(u => u.owner === G.me && u.def.cls !== 'villager' && !u.garrison); if (a.length) selectEntities(a, false); else toast('You have no army yet.', ''); }
let idleIdx = 0;
function selectIdle() { const v = G.units.filter(u => u.owner === G.me && u.def.cls === 'villager' && u.order.type === 'idle' && !u.garrison); if (!v.length) { toast('No idle villagers.', ''); return; } const u = v[idleIdx++ % v.length]; selectEntities([u], false); centerOn(u.x, u.y); }
$('q-hero').addEventListener('click', selectHeroes);
$('q-army').addEventListener('click', selectArmy);
$('q-idle').addEventListener('click', selectIdle);
$('q-box').addEventListener('click', () => { G.boxMode = !G.boxMode; $('q-box').classList.toggle('on', G.boxMode); });
$('q-zin').addEventListener('click', () => zoomAt(1.2, vw / 2, vh / 2));
$('q-zout').addEventListener('click', () => zoomAt(1 / 1.2, vw / 2, vh / 2));
$('dbtrack').addEventListener('click', () => { const list = G.balls.filter(b => b.state === 'ground' || b.state === 'carried'); if (!list.length) return; G.radarIdx = ((G.radarIdx || 0) + 1) % list.length; const b = list[G.radarIdx]; centerOn(b.x, b.y); });
$('btn-speed').addEventListener('click', () => { G.speed = G.speed >= 3 ? 1 : G.speed + 1; $('btn-speed').textContent = G.speed + '×'; });
$('btn-menu').addEventListener('click', () => togglePause(true));
for (const el of document.querySelectorAll('.res')) tipFor(el, () => {
  const k = el.dataset.tip, P = humanP(); if (!P) return null;
  const d = { food: ['Rations', 'Hunt dinosaurs, pick Senzu bushes, or farm. Drop off at a Granary or Town Center.'], wood: ['Capsule Alloy', 'Cut from forests. Drop off at a Storehouse or Town Center.'], gold: ['Zeni', 'Mined from Zeni veins. Drop off at a Storehouse or Town Center.'], ki: ['Ki', { earth: "Villagers meditate at Kami's Lookout.", rr: 'Bio-Reactors generate it.', ff: 'Earned by fighting.' }[P.faction] + ' Spent on myth units, heroes and flight.'], pop: ['Population', 'Houses +10 (up to 10), Town Centers +15. Maximum 200.'] }[k];
  return { name: d[0], desc: d[1] };
});

// ---------- tribute (team games): send resources to an ally, minus the 10% courier fee ----------
const myAllies = () => G.players.filter(P => P.id && P.id !== G.me && G.me && isAlly(P.id, G.me) && !P.defeated);
function renderTribute() {
  const el = $('tribute'), me = humanP(); if (!me) return;
  el.innerHTML = `<h4>Tribute</h4><p class="note">Send 100 to an ally. The courier keeps ${Math.round(TRIBUTE_FEE * 100)}%.</p>` + myAllies().map(P => `<div class="trow"><span class="who"><span style="color:${pcol(P.color)}">■</span> ${esc(P.name)}</span>${['food', 'wood', 'gold'].map(r => `<button class="tbtn" data-to="${P.id}" data-r="${r}">+100 ${esc(RES_NAME[r])}</button>`).join('')}</div>`).join('') + '<button class="ghost tclose">Close</button>';
  for (const b of el.querySelectorAll('button[data-to]')) b.addEventListener('click', () => { const w = tribute(me, G.players[+b.dataset.to], b.dataset.r, 100); if (w) { toast(w, 'warn'); SFX.play('error'); } else { toast(`Sent 100 ${RES_NAME[b.dataset.r]} to ${G.players[+b.dataset.to].name}.`, 'good'); SFX.play('click'); } });
  el.querySelector('.tclose').addEventListener('click', () => { el.hidden = true; });
}
$('btn-trib').addEventListener('click', () => { const el = $('tribute'); el.hidden = !el.hidden; if (!el.hidden) renderTribute(); });
