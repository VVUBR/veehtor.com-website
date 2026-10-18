// =====================================================================
// 11. RENDERER: terrain chunks, depth-sorted world, effects, fog, minimap
// =====================================================================
const view = $('view'), ctx = view.getContext('2d');
const mini = $('minimap'), mctx = mini.getContext('2d');
const PAL = {
  earth: [['#5c9a3a', '#7cb84c'], ['#a7834f', '#c39d66'], ['#d9c38a', '#e9d8a4'], ['#5aaccd', '#7cc4dd'], ['#2766ab', '#3a86c8'], ['#857c6d', '#a39887'], ['#e8eef5', '#ffffff'], ['#b39467', '#cdb184']],
  namek: [['#3a9e7c', '#5ec098'], ['#8aa874', '#a6c290'], ['#c4d49c', '#d8e6b4'], ['#4cb4ac', '#6ccac2'], ['#1c7288', '#2e92a6'], ['#6a807a', '#8a9e98'], ['#e8eef5', '#ffffff'], ['#a0b884', '#bdd09e']],
  wasteland: [['#869650', '#a0ad62'], ['#b48656', '#c99c68'], ['#d2a66a', '#e4bf86'], ['#66a4b4', '#80bccb'], ['#357aa4', '#4a92ba'], ['#9c6c46', '#b88456'], ['#e8eef5', '#ffffff'], ['#c49b6e', '#d8b088']],
  highlands: [['#5a8a42', '#78a858'], ['#977c56', '#ad9468'], ['#c8b890', '#dccca4'], ['#66a4c4', '#84bcd8'], ['#2c66a4', '#3f80c0'], ['#8a8c94', '#a8aab2'], ['#e4ebf3', '#ffffff'], ['#a48f70', '#bba684']],
};
const PRIO = [5, 3, 2, 1, 0, 7, 6, 4]; // blend order per terrain code
const CH = 8, CM = 34;                   // chunk tiles, top margin for raised cliffs
const chunks = new Map();
let chunkScale = 1;
function chunkKey(cx, cy) { return cx + ',' + cy; }
function terrAt(x, y) { return inMap(x, y) ? G.map.terr[idx(x, y)] : G.map.terr[idx(clamp(x, 0, MW - 1), clamp(y, 0, MH - 1))]; }
function tileColor(x, y, t) {
  const pal = PAL[G.map.biome][t], n = hash2(x, y, G.map.seed) * .1 + G.noise(x / 6, y / 6, 3) * .9;
  const h = G.map.hgt, hx = (inMap(x - 1, y) ? h[idx(x - 1, y)] : h[idx(x, y)]) - (inMap(x + 1, y) ? h[idx(x + 1, y)] : h[idx(x, y)]);
  const hy = (inMap(x, y - 1) ? h[idx(x, y - 1)] : h[idx(x, y)]) - (inMap(x, y + 1) ? h[idx(x, y + 1)] : h[idx(x, y)]);
  const light = clamp((hx + hy) * 1.8, -.14, .14);
  const base = mix(pal[0], pal[1], clamp(n, 0, 1));
  return { base, light };
}
function renderChunk(cx, cy) {
  const x0 = cx * CH, y0 = cy * CH, s = chunkScale;
  const left = (x0 - (y0 + CH)) * HTW, top = (x0 + y0) * HTH - CM;
  const c = makeCanvas((CH * TW) * s, (CH * TH + CM) * s), g = c.getContext('2d');
  g.scale(s, s); g.translate(-left, -top);
  const dia = (x, y) => { g.beginPath(); g.moveTo(isoX(x, y), isoY(x, y)); g.lineTo(isoX(x + 1, y), isoY(x + 1, y)); g.lineTo(isoX(x + 1, y + 1), isoY(x + 1, y + 1)); g.lineTo(isoX(x, y + 1), isoY(x, y + 1)); g.closePath(); };
  const cols = {};
  // 1) base fill
  for (let y = y0; y < y0 + CH; y++) for (let x = x0; x < x0 + CH; x++) {
    if (!inMap(x, y)) continue;
    let t = G.map.terr[idx(x, y)]; if (t === T_ROCK) t = rockGround(x, y);
    const { base, light } = tileColor(x, y, t);
    const col = light >= 0 ? mixRgb(base, '#ffffff', light) : mixRgb(base, '#000000', -light);
    cols[idx(x, y)] = col;
    g.fillStyle = col; dia(x, y); g.fill(); g.strokeStyle = col; g.lineWidth = .8; g.stroke();
  }
  // 2) soft blends toward higher-priority neighbours
  const edges = [[0, -1, [0, 0], [1, 0]], [1, 0, [1, 0], [1, 1]], [0, 1, [1, 1], [0, 1]], [-1, 0, [0, 1], [0, 0]]];
  for (let y = y0; y < y0 + CH; y++) for (let x = x0; x < x0 + CH; x++) {
    if (!inMap(x, y)) continue;
    let t = G.map.terr[idx(x, y)]; if (t === T_ROCK) t = rockGround(x, y);
    for (const [dx, dy, a, b] of edges) {
      let nt = terrAt(x + dx, y + dy); if (nt === T_ROCK) nt = rockGround(x + dx, y + dy);
      if (PRIO[nt] <= PRIO[t]) continue;
      const nc = tileColor(x + dx, y + dy, nt).base;
      const ax = isoX(x + a[0], y + a[1]), ay = isoY(x + a[0], y + a[1]), bx = isoX(x + b[0], y + b[1]), by = isoY(x + b[0], y + b[1]);
      const mxp = (ax + bx) / 2, myp = (ay + by) / 2, cxp = isoX(x + .5, y + .5), cyp = isoY(x + .5, y + .5);
      const depth = nt === T_WATER || t === T_WATER ? .5 : .62;
      const gr = g.createLinearGradient(mxp, myp, lerp(mxp, cxp, depth * 2), lerp(myp, cyp, depth * 2));
      gr.addColorStop(0, rgba(nc, .92)); gr.addColorStop(.55, rgba(nc, .35)); gr.addColorStop(1, rgba(nc, 0));
      g.fillStyle = gr; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.lineTo(lerp(bx, cxp, depth * 1.4), lerp(by, cyp, depth * 1.4)); g.lineTo(lerp(ax, cxp, depth * 1.4), lerp(ay, cyp, depth * 1.4)); g.closePath(); g.fill();
    }
  }
  // 3) surface details
  for (let y = y0; y < y0 + CH; y++) for (let x = x0; x < x0 + CH; x++) {
    if (!inMap(x, y)) continue;
    const t = G.map.terr[idx(x, y)], r = mulberry32((x * 73856093) ^ (y * 19349663) ^ G.map.seed);
    const px = isoX(x + .5, y + .5), py = isoY(x + .5, y + .5);
    if (t === T_GRASS) {
      for (let k = 0; k < 4; k++) { const ox = (r() - .5) * 40, oy = (r() - .5) * 18; if (Math.abs(ox) / 32 + Math.abs(oy) / 16 > .9) continue; g.strokeStyle = r() < .5 ? 'rgba(20,60,20,.35)' : 'rgba(200,240,140,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(px + ox - 2, py + oy); g.lineTo(px + ox, py + oy - 4); g.lineTo(px + ox + 2, py + oy); g.stroke(); }
      const d = G.map.deco[idx(x, y)];
      if (d && d <= 3) { const fc = ['#ffffff', '#ffe46b', '#ff9ec8'][d - 1]; for (let k = 0; k < 3; k++) { g.fillStyle = fc; g.beginPath(); g.arc(px + (r() - .5) * 26, py + (r() - .5) * 10, 1.6, 0, 7); g.fill(); } }
    } else if (t === T_DIRT || t === T_ROAD || t === T_SAND) {
      for (let k = 0; k < 3; k++) { const ox = (r() - .5) * 36, oy = (r() - .5) * 16; if (Math.abs(ox) / 32 + Math.abs(oy) / 16 > .9) continue; g.fillStyle = t === T_SAND ? 'rgba(150,120,70,.25)' : 'rgba(90,64,40,.35)'; g.beginPath(); g.ellipse(px + ox, py + oy, 1.6 + r() * 1.5, 1 + r(), 0, 0, 7); g.fill(); }
      if (t === T_SAND && r() < .5) { g.strokeStyle = 'rgba(255,240,200,.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(px - 12, py); g.quadraticCurveTo(px - 4, py - 3, px + 6, py + 1); g.stroke(); }
      if (G.map.deco[idx(x, y)] === 4) { blobAt(g, px + 6, py, 4, 2.6, '#8a8172'); }
    } else if (t === T_SNOW) {
      if (r() < .3) { g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(px + (r() - .5) * 20, py + (r() - .5) * 8, 1.5, 1.5); }
    } else if (t === T_WATER || t === T_SHALLOW) {
      g.strokeStyle = t === T_WATER ? 'rgba(200,235,255,.28)' : 'rgba(255,255,255,.35)'; g.lineWidth = 1;
      if (r() < .45) { const ox = (r() - .5) * 26, oy = (r() - .5) * 10; g.beginPath(); g.moveTo(px + ox - 7, py + oy); g.quadraticCurveTo(px + ox, py + oy - 3, px + ox + 7, py + oy); g.stroke(); }
      if (t === T_WATER) for (const [dx, dy, a, b] of edges) { const nt = terrAt(x + dx, y + dy); if (nt !== T_WATER && nt !== T_SHALLOW && nt !== T_ROCK) { g.strokeStyle = 'rgba(235,250,255,.55)'; g.lineWidth = 1.6; const ax = isoX(x + a[0], y + a[1]), ay = isoY(x + a[0], y + a[1]), bx = isoX(x + b[0], y + b[1]), by = isoY(x + b[0], y + b[1]); g.beginPath(); g.moveTo(lerp(ax, px, .12), lerp(ay, py, .12)); g.lineTo(lerp(bx, px, .12), lerp(by, py, .12)); g.stroke(); } }
    }
  }
  // 4) raised cliffs, back to front
  const rocks = [];
  for (let y = y0; y < y0 + CH; y++) for (let x = x0; x < x0 + CH; x++) if (inMap(x, y) && G.map.terr[idx(x, y)] === T_ROCK) rocks.push([x, y]);
  rocks.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
  const rp = PAL[G.map.biome][T_ROCK];
  for (const [x, y] of rocks) {
    const h = 14 + G.noise(x / 3, y / 3, 1) * 16;
    const col = mix(rp[0], rp[1], hash2(x, y, 7));
    const P = (xx, yy, z) => [isoX(xx, yy), isoY(xx, yy) - z];
    const quad = (pts, fill) => { g.fillStyle = fill; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill(); g.strokeStyle = 'rgba(30,24,20,.35)'; g.lineWidth = 1; g.stroke(); };
    if (terrAt(x, y + 1) !== T_ROCK) quad([P(x, y + 1, 0), P(x + 1, y + 1, 0), P(x + 1, y + 1, h), P(x, y + 1, h)], shade(rgbHex(col), -.12));
    if (terrAt(x + 1, y) !== T_ROCK) quad([P(x + 1, y, 0), P(x + 1, y + 1, 0), P(x + 1, y + 1, h), P(x + 1, y, h)], shade(rgbHex(col), -.36));
    quad([P(x, y, h), P(x + 1, y, h), P(x + 1, y + 1, h), P(x, y + 1, h)], shade(rgbHex(col), .1));
    const r = mulberry32(x * 911 + y * 37);
    g.strokeStyle = 'rgba(40,30,25,.35)'; g.lineWidth = 1;
    for (let k = 0; k < 2; k++) { const a = P(x + .2 + r() * .6, y + 1, h * (.2 + r() * .6)); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(a[0] + 4 - r() * 8, a[1] + 5); g.stroke(); }
    if (G.map.biome === 'highlands' && h > 22) { g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); const t0 = P(x, y, h), t1 = P(x + 1, y, h), t2 = P(x + 1, y + 1, h), t3 = P(x, y + 1, h); g.moveTo(t0[0], t0[1]); g.lineTo(t1[0], t1[1]); g.lineTo(lerp(t1[0], t2[0], .5), lerp(t1[1], t2[1], .5)); g.lineTo(lerp(t0[0], t3[0], .5), lerp(t0[1], t3[1], .5)); g.closePath(); g.fill(); }
  }
  return { c, left, top };
}
function rockGround(x, y) { return G.map.biome === 'wasteland' ? T_SAND : T_DIRT; }
function blobAt(g, x, y, rx, ry, col) { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(30,20,20,.4)'; g.lineWidth = 1; g.stroke(); }
function mixRgb(a, b, t) { const A = parseRgb(a), B2 = parseRgb(b); return `rgb(${Math.round(A[0] + (B2[0] - A[0]) * t)},${Math.round(A[1] + (B2[1] - A[1]) * t)},${Math.round(A[2] + (B2[2] - A[2]) * t)})`; }
function parseRgb(s) { if (s[0] === '#') return hexRgb(s); const m = s.match(/\d+/g); return [+m[0], +m[1], +m[2]]; }
function rgbHex(s) { const [r, g, b] = parseRgb(s); return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''); }
function getChunk(cx, cy) {
  const k = chunkKey(cx, cy);
  let ch = chunks.get(k);
  if (ch && ch.ver === G.chunkVer) { chunks.delete(k); chunks.set(k, ch); return ch; }
  ch = renderChunk(cx, cy); ch.ver = G.chunkVer;
  chunks.set(k, ch);
  if (chunks.size > 60) chunks.delete(chunks.keys().next().value);
  return ch;
}
function resetRenderCaches() { chunks.clear(); miniBase = null; chunkScale = DPR >= 1.5 ? 1.5 : 1; }

// ---------- particles (visual only, real time) ----------
const parts = [];
function partBurst(x, y, z, n, col, spd, life, grav, size) {
  for (let i = 0; i < n && parts.length < 900; i++) {
    const a = frnd() * Math.PI * 2, v = spd * (.4 + frnd() * .8);
    parts.push({ x, y, z, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vz: (grav ? 60 + frnd() * 90 : (frnd() - .2) * 40), t: 0, life: life * (.6 + frnd() * .6), col, grav, size: size || 2 });
  }
}
function updateParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.t += dt;
    if (p.t >= p.life) { parts.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    if (p.grav) { p.vz -= 260 * dt; if (p.z < 0) { p.z = 0; p.vz *= -.3; p.vx *= .6; p.vy *= .6; } }
    else { p.vz *= .97; }
  }
}
function fxPush(f) {
  if (G.fx.length > 500) return;
  G.fx.push(f);
  if (G.headless) return;
  if (f.type === 'boom') { partBurst(f.x, f.y, 6, 10 + f.r * 6, f.color, 2 + f.r * 1.5, .7, true, 2.4); partBurst(f.x, f.y, 10, 6 + f.r * 3, '#6a6460', .6 + f.r * .4, 1.6, false, 5); }
  else if (f.type === 'spark') partBurst(f.x, f.y, f.z || 14, 4, f.color, 2.2, .3, false, 1.6);
  else if (f.type === 'puff') partBurst(f.x, f.y, 8, 8, '#e8e4dc', 1.2, .7, false, 3.5);
}

// ---------- the frame ----------
const isoView = { x0: 0, y0: 0, x1: 0, y1: 0 };
const inViewIso = (ix, iy, pad) => ix > isoView.x0 - pad && ix < isoView.x1 + pad && iy > isoView.y0 - pad && iy < isoView.y1 + pad;
function setWorldTransform() { ctx.setTransform(DPR * cam.z, 0, 0, DPR * cam.z, -cam.x * cam.z * DPR, -cam.y * cam.z * DPR); }
let shakeT = 0;
function render(alpha, realDt) {
  const z = cam.z;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, vw, vh);
  let shx = 0, shy = 0; if (shakeT > 0) { shakeT -= realDt; shx = (frnd() - .5) * 8 * shakeT; shy = (frnd() - .5) * 8 * shakeT; }
  isoView.x0 = cam.x; isoView.y0 = cam.y; isoView.x1 = cam.x + vw / z; isoView.y1 = cam.y + vh / z;
  ctx.setTransform(DPR * z, 0, 0, DPR * z, (-cam.x * z + shx) * DPR, (-cam.y * z + shy) * DPR);
  // terrain chunks (north to south so cliffs overlap correctly)
  const ncx = Math.ceil(MW / CH), ncy = Math.ceil(MH / CH);
  for (let s = 0; s <= ncx + ncy; s++) for (let cx = 0; cx < ncx; cx++) {
    const cy = s - cx; if (cy < 0 || cy >= ncy) continue;
    const x0 = cx * CH, y0 = cy * CH, left = (x0 - y0 - CH) * HTW, top = (x0 + y0) * HTH - CM;
    if (left > isoView.x1 || left + CH * TW < isoView.x0 || top > isoView.y1 || top + CH * TH + CM < isoView.y0) continue;
    const ch = getChunk(cx, cy);
    ctx.drawImage(ch.c, ch.left, ch.top, CH * TW, CH * TH + CM);
  }
  drawWater(realDt);
  // flat things: settlements, farms, rubble, corpses, shadows, rings
  for (const s of G.settlements) if (!s.tc && exploredAt(s.tx + 2, s.ty + 2)) { const sp = settlementSprite(); drawSpr(sp, isoX(s.tx, s.ty), isoY(s.tx, s.ty)); }
  for (const r of G.ruins) if (exploredAt(r.x, r.y)) { const sp = rubbleSprite(r.w, r.h); ctx.globalAlpha = clamp(1 - (r.t - 45) / 15, 0, 1); drawSpr(sp, isoX(r.tx, r.ty), isoY(r.tx, r.ty)); ctx.globalAlpha = 1; }
  for (const b of G.blds) if (B[b.key].walk && seenBld(b)) drawBuilding(b);
  for (const c of G.corpses) if (visibleAt(c.x, c.y)) drawCorpse(c);
  for (const e of G.kos) if (visibleAt(e.x, e.y) || isAlly(e.owner, G.me)) drawKO(e);
  const lerpX = u => u.px + (u.x - u.px) * alpha, lerpY = u => u.py + (u.y - u.py) * alpha;
  const draws = [];
  for (const u of G.units) {
    if (u.garrison) continue;
    const x = lerpX(u), y = lerpY(u);
    if (!inViewIso(isoX(x, y), isoY(x, y), 120)) continue;
    if (!G.revealAll && !isAlly(u.owner, G.me) && !visibleAt(x, y)) continue;
    drawUnitGround(u, x, y);
    draws.push({ d: x + y + (u.flying ? 1.5 : 0), u, x, y });
  }
  for (const b of G.blds) if (!B[b.key].walk && seenBld(b) && inViewIso(isoX(b.x, b.y), isoY(b.x, b.y), 260)) draws.push({ d: b.x + b.y - .2, b });
  for (const r of G.ress) { if (!inViewIso(isoX(r.x, r.y), isoY(r.x, r.y), 90) || !exploredAt(r.x, r.y)) continue; draws.push({ d: r.x + r.y, r }); }
  for (const e of G.ents) if (e.kind === 'deco' && !e.dead && exploredAt(e.x, e.y)) draws.push({ d: e.x + e.y, deco: e });
  for (const t of G.treeFall) if (exploredAt(t.x, t.y) && inViewIso(isoX(t.x, t.y), isoY(t.x, t.y), 40)) draws.push({ d: t.x + t.y - .3, stump: t });
  for (const b of G.balls) if (b.state === 'ground' && (G.revealAll || visibleAt(b.x, b.y))) draws.push({ d: b.x + b.y, ball: b });
  for (const r of G.relics) if (r.state === 'ground' && (G.revealAll || exploredAt(r.x, r.y))) draws.push({ d: r.x + r.y, relic: r });
  draws.sort((a, b) => a.d - b.d);
  for (const o of draws) {
    if (o.u) drawUnit(o.u, o.x, o.y);
    else if (o.b) drawBuilding(o.b);
    else if (o.r) drawRes(o.r);
    else if (o.deco) { const sp = sealedBallSprite(G.units.some(u => u.def.cls === 'titan')); drawSpr(sp, isoX(o.deco.x, o.deco.y), isoY(o.deco.x, o.deco.y)); }
    else if (o.stump) drawSpr(stumpSprite(), isoX(o.stump.x, o.stump.y), isoY(o.stump.x, o.stump.y));
    else if (o.relic) drawRelic(o.relic, isoX(o.relic.x, o.relic.y), isoY(o.relic.x, o.relic.y), 1);
    else if (o.ball) drawBall(isoX(o.ball.x, o.ball.y), isoY(o.ball.x, o.ball.y) - 6 - Math.sin(G.time * 3 + o.ball.star) * 2, o.ball.star, 1, true);
  }
  for (const p of G.projs) if (inViewIso(isoX(p.x, p.y), isoY(p.x, p.y), 40)) drawProj(p);
  for (const f of G.fx) drawFx(f);
  drawParts();
  // fog of war
  if (!G.revealAll) { if (G.fogDirty) refreshFog(); ctx.save(); ctx.transform(HTW, HTH, -HTW, HTH, 0, 0); ctx.imageSmoothingEnabled = true; ctx.drawImage(fogCanvas, -1, -1, MW + 2, MH + 2); ctx.restore(); }
  drawOverlays(lerpX, lerpY);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  drawScreenFx();
  drawBubbles();
  if (G.boxStart && G.boxEnd) { const bx = Math.min(G.boxStart.sx, G.boxEnd.sx), by = Math.min(G.boxStart.sy, G.boxEnd.sy), bw = Math.abs(G.boxEnd.sx - G.boxStart.sx), bh = Math.abs(G.boxEnd.sy - G.boxStart.sy); ctx.fillStyle = 'rgba(127,224,255,.12)'; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = '#7fe0ff'; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh); }
}
function seenBld(b) { return G.revealAll || isAlly(b.owner, G.me) || exploredAt(b.x, b.y) || exploredAt(b.tx, b.ty); }
function drawSpr(s, x, y, flip, scale) {
  scale = scale || 1;
  if (flip) { ctx.save(); ctx.translate(x, y); ctx.scale(-scale, scale); ctx.drawImage(s.c, -s.ax, -s.ay, s.w, s.h); ctx.restore(); }
  else if (scale !== 1) ctx.drawImage(s.c, x - s.ax * scale, y - s.ay * scale, s.w * scale, s.h * scale);
  else ctx.drawImage(s.c, x - s.ax, y - s.ay, s.w, s.h);
}
let waterT = 0;
function drawWater(dt) {
  waterT += dt;
  const z = cam.z; if (z < .55) return;
  const tx0 = Math.floor(screenToWorld(0, 0).x) - 2, ty0 = Math.floor(screenToWorld(vw, 0).y) - 2, tx1 = Math.ceil(screenToWorld(vw, vh).x) + 2, ty1 = Math.ceil(screenToWorld(0, vh).y) + 2;
  ctx.strokeStyle = 'rgba(230,248,255,.35)'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  let n = 0;
  for (let y = Math.max(0, ty0); y < Math.min(MH, ty1); y++) for (let x = Math.max(0, tx0); x < Math.min(MW, tx1); x++) {
    if (G.map.terr[idx(x, y)] !== T_WATER) continue;
    const ph = waterT * 1.4 + hash2(x, y, 3) * 6.28, k = (Math.sin(ph) + 1) / 2;
    if (k < .55) continue;
    const px = isoX(x + .5, y + .5) + Math.sin(ph * .7) * 6, py = isoY(x + .5, y + .5) + (k - .5) * 4;
    ctx.moveTo(px - 6, py); ctx.quadraticCurveTo(px, py - 2.5, px + 6, py);
    if (++n > 900) break;
  }
  ctx.stroke();
}
function drawUnitGround(u, x, y) {
  const ix = isoX(x, y), iy = isoY(x, y), r = u.r * 46 * (u.ape ? 1 : 1);
  ctx.fillStyle = `rgba(0,0,0,${u.def.naval ? .12 : u.flying || u.def.alwaysFly ? .18 : .32})`;
  ctx.beginPath(); ctx.ellipse(ix + 2, iy + 1, r * 1.1, r * .5, 0, 0, 7); ctx.fill();
  if (u.owner > 0) { ctx.strokeStyle = pcol(G.players[u.owner].color); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(ix, iy, r + 2, r * .5 + 1, 0, 0, 7); ctx.stroke(); }
  if (G.sel.includes(u)) { ctx.strokeStyle = '#7dff9c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ix, iy, r + 5, r * .5 + 3, 0, 0, 7); ctx.stroke(); }
  else if (G.hover === u) { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(ix, iy, r + 5, r * .5 + 3, 0, 0, 7); ctx.stroke(); }
}
function unitPose(u) {
  let pose = u.anim || 'idle', f = 0;
  if (u.flying && pose === 'idle') pose = 'fly';
  const n = POSE_FRAMES[pose] || 1;
  if (pose === 'walk') f = Math.floor(u.animT * 10) % 6;
  else if (pose === 'atk' || pose === 'shoot') f = clamp(Math.floor((.35 - u.atkT) / .35 * n), 0, n - 1);
  else if (pose === 'work' || pose === 'build') f = Math.floor(u.animT * 6) % 4;
  else f = Math.floor(u.animT * 2) % n;
  return [pose, f];
}
function drawUnit(u, x, y) {
  const ix = isoX(x, y), lift = u.leap ? u.lift * 34 : (u.lift || 0) * (u.def.alwaysFly ? 0 : 30) + (u.flying ? Math.sin(G.time * 3 + u.id) * 2 : 0);
  let iy = isoY(x, y) - lift;
  if (u.def.naval) { iy += Math.sin(G.time * 2 + u.id) * 1.2; if (u.moving && frnd() < .5) partBurst(x - Math.cos(u.face) * u.r, y - Math.sin(u.face) * u.r, 1, 1, '#e8f6ff', .25, .7, false, 2.2); }
  const st = stats(u), L = unitLook(u);
  // auras
  const auraC = u.kaio ? '#ff3b3b' : L.aura || (u.buffs.length ? '#ffd166' : null);
  if (auraC) { const fl = .55 + .25 * Math.sin(G.time * 16 + u.id); const g = ctx.createRadialGradient(ix, iy - 18, 2, ix, iy - 18, 26); g.addColorStop(0, rgba(rgbHex(auraC === '#ffd166' ? '#ffd166' : auraC), .0)); g.addColorStop(.5, rgba(auraC, .35 * fl)); g.addColorStop(1, rgba(auraC, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(ix, iy - 18, 18, 28, 0, 0, 7); ctx.fill(); if (frnd() < .2) partBurst(x + (frnd() - .5) * .5, y + (frnd() - .5) * .5, 10 + lift, 1, auraC, .3, .4, false, 1.6); }
  if (u.meditating) { ctx.strokeStyle = 'rgba(98,208,255,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(ix, iy - 14, 12 + Math.sin(G.time * 3 + u.id) * 1.5, 18, 0, 0, 7); ctx.stroke(); }
  const [pose, f] = unitPose(u);
  const pc = u.owner > 0 && !(st.look && st.look.keepColors) ? G.players[u.owner].color : (u.owner > 0 ? G.players[u.owner].color : null);
  const s = figureSprite(lookKey(u), L, pose, f, pc);
  const flip = u.dir < 0;
  drawSpr(s, ix, iy, flip);
  if (u.hitFlash > 0) { ctx.globalAlpha = Math.min(.7, u.hitFlash * 6); ctx.globalCompositeOperation = 'lighter'; drawSpr(s, ix, iy, flip); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
  if (u.stun > 0) { ctx.fillStyle = '#fff6a8'; for (let i = 0; i < 3; i++) { const a = G.time * 4 + i * 2.1; ctx.beginPath(); ctx.arc(ix + Math.cos(a) * 9, iy - 44 + Math.sin(a) * 3, 2, 0, 7); ctx.fill(); } }
  if (u.carryAmt > .5 && u.carry) { ctx.fillStyle = u.carry === 'wood' ? '#a8763c' : u.carry === 'gold' ? '#ffd34d' : '#86e07c'; ctx.beginPath(); ctx.ellipse(ix - (flip ? -6 : 6), iy - 20, 3.5, 3, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.stroke(); }
  if (u.carryBall) { const b = G.balls.find(q => q.id === u.carryBall); drawBall(ix, iy - 52 * (L.scale || 1), b ? b.star : 1, .8); }
  if (u.carryRelic) { const r = G.relics.find(q => q.id === u.carryRelic); if (r) drawRelic(r, ix, iy - 40 * (L.scale || 1), .7, true); }
}
// A knocked-out campaign hero: lying down, with a pulsing ring that says "come and help me up".
function drawKO(e) {
  drawCorpse({ x: e.x, y: e.y, key: e.key, form: e.form, owner: e.owner, dir: e.dir, t: 0, ape: e.ape });
  const x = isoX(e.x, e.y), y = isoY(e.x, e.y), p = .5 + .5 * Math.sin(performance.now() / 280);
  ctx.strokeStyle = `rgba(255,214,77,${.35 + p * .45})`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x, y, 20 + p * 5, 10 + p * 2.5, 0, 0, Math.PI * 2); ctx.stroke();
}
function drawCorpse(c) {
  const L = c.ape ? APE_LOOK : (c.form ? FORMS[c.form].look : U[c.key].look) || {};
  const s = figureSprite(c.ape ? 'ape' : c.key + (c.form ? ':' + c.form : ''), L, 'dead', 0, c.owner > 0 ? G.players[c.owner].color : null);
  ctx.globalAlpha = clamp(1 - (c.t - 8) / 4, 0, .85);
  drawSpr(s, isoX(c.x, c.y), isoY(c.x, c.y), c.dir < 0);
  ctx.globalAlpha = 1;
}
function drawBuilding(b) {
  const P = G.players[b.owner], d = B[b.key];
  const ix = isoX(b.tx, b.ty), iy = isoY(b.tx, b.ty);
  const pc = P ? P.color : 0;
  const sp = buildingSprite(b.key, b.fac, pc);
  if (G.sel.includes(b) || G.hover === b) { ctx.strokeStyle = G.sel.includes(b) ? '#7dff9c' : 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(isoX(b.tx, b.ty), isoY(b.tx, b.ty)); ctx.lineTo(isoX(b.tx + b.w, b.ty), isoY(b.tx + b.w, b.ty)); ctx.lineTo(isoX(b.tx + b.w, b.ty + b.h), isoY(b.tx + b.w, b.ty + b.h)); ctx.lineTo(isoX(b.tx, b.ty + b.h), isoY(b.tx, b.ty + b.h)); ctx.closePath(); ctx.stroke(); }
  if (!b.built) {
    const sc = scaffoldSprite(b.w, b.h); drawSpr(sc, ix, iy);
    const k = clamp(b.progress, 0, 1);
    if (k > .02) { ctx.save(); const cut = sp.h * (1 - k * .9); ctx.beginPath(); ctx.rect(ix - sp.ax - 2, iy - sp.ay + cut, sp.w + 4, sp.h); ctx.clip(); ctx.globalAlpha = .55 + .45 * k; drawSpr(sp, ix, iy); ctx.restore(); }
    return;
  }
  if (b.empowered && b.empowered.until > G.time) { const k = .5 + .5 * Math.sin(G.time * 5); ctx.strokeStyle = `rgba(255,211,77,${.5 + k * .4})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(isoX(b.tx, b.ty), isoY(b.tx, b.ty)); ctx.lineTo(isoX(b.tx + b.w, b.ty), isoY(b.tx + b.w, b.ty)); ctx.lineTo(isoX(b.tx + b.w, b.ty + b.h), isoY(b.tx + b.w, b.ty + b.h)); ctx.lineTo(isoX(b.tx, b.ty + b.h), isoY(b.tx, b.ty + b.h)); ctx.closePath(); ctx.stroke(); if (frnd() < .3) partBurst(b.tx + frnd() * b.w, b.ty + frnd() * b.h, 10, 1, '#ffd34d', .2, .8, false, 2); }
  drawSpr(sp, ix, iy);
  if (b.hitFlash > 0) { ctx.globalAlpha = Math.min(.5, b.hitFlash * 4); ctx.globalCompositeOperation = 'lighter'; drawSpr(sp, ix, iy); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
  const hpk = b.hp / maxHp(b);
  if (hpk < .66 && frnd() < (hpk < .33 ? .5 : .2)) partBurst(b.tx + frnd() * b.w, b.ty + frnd() * b.h, 20 + frnd() * 30, 1, hpk < .33 ? '#ff7a2a' : '#5a5450', .3, 1.6, false, hpk < .33 ? 3 : 5);
  if (b.fac === 'rr' && (b.key === 'barracks' || b.key === 'tc') && frnd() < .06) partBurst(b.tx + .8, b.ty + .8, 70, 1, '#c8c8c8', .15, 2.4, false, 5);
  if (b.relics.length) for (let i = 0; i < b.relics.length; i++) { const r = G.relics.find(q => q.id === b.relics[i]); if (r) drawSpr(relicSprite(r.key), isoX(b.x, b.y) - 24 + (i % 5) * 12, isoY(b.x, b.y) + 16 + Math.floor(i / 5) * 8, false, .55); }
  if (b.balls.length) for (let i = 0; i < b.balls.length; i++) { const bb = G.balls.find(q => q.id === b.balls[i]); drawBall(isoX(b.x, b.y) - 18 + i * 6, isoY(b.x, b.y) + 6, bb ? bb.star : 1, .55); }
  if (b.garrisoned.length && isAlly(b.owner, G.me)) { const [px, py] = [isoX(b.x, b.y), isoY(b.x, b.y) - 20]; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(px - 10, py - 8, 20, 12); ctx.fillStyle = '#fff'; ctx.font = '700 9px "Chakra Petch", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(b.garrisoned.length, px, py + 1); }
}
function drawRes(r) {
  const ix = isoX(r.x, r.y), iy = isoY(r.x, r.y);
  if (r.key === 'tree') drawSpr(treeSprite(G.map.biome, r.v), ix, iy + 2);
  else if (r.key === 'gold') { const s = goldSprite(G.map.biome); drawSpr(s, ix, iy, false, .55 + .45 * Math.min(1, r.amount / 1200)); }
  else if (r.key === 'berry') drawSpr(berrySprite(), ix, iy);
  else if (r.key === 'carcass') drawSpr(carcassSprite(), ix, iy);
  else if (r.key === 'fish') {
    const t = G.time * 1.3 + r.v * 9, ox = Math.cos(t) * 3, oy = Math.sin(t * 1.4) * 1.5;
    ctx.strokeStyle = `rgba(255,255,255,${.25 + .2 * Math.sin(t * 2)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(ix, iy, 12 + Math.sin(t) * 2, 5, 0, 0, 7); ctx.stroke();
    drawSpr(fishSprite(r.v), ix + ox, iy + oy, Math.cos(t) < 0);
  }
  if (G.hover === r) { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(ix, iy, 20 * r.w, 10 * r.w, 0, 0, 7); ctx.stroke(); }
}
function drawRelic(r, x, y, s, carried) {
  const k = .5 + .5 * Math.sin(G.time * 2.4 + r.id);
  const g = ctx.createRadialGradient(x, y - 8, 1, x, y - 8, 22 * s); g.addColorStop(0, `rgba(210,170,255,${.35 + k * .25})`); g.addColorStop(1, 'rgba(180,120,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 8, 22 * s, 0, 7); ctx.fill();
  if (!carried) { ctx.strokeStyle = `rgba(220,190,255,${.4 + k * .3})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(x, y + 2, 13, 6, 0, 0, 7); ctx.stroke(); }
  drawSpr(relicSprite(r.key), x, y - (carried ? 0 : 3 + k * 2), false, s);
  if (!carried && G.hover && G.hover.kind === 'relic' && G.hover.relic === r) { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y + 2, 16, 8, 0, 0, 7); ctx.stroke(); }
}
function drawBall(x, y, star, s, glow) {
  const r = 6 * s * (1 + .06 * Math.sin(G.time * 4 + star));
  if (glow) { const g = ctx.createRadialGradient(x, y, 1, x, y, r * 4); g.addColorStop(0, 'rgba(255,190,60,.55)'); g.addColorStop(1, 'rgba(255,170,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, 7); ctx.fill(); }
  const g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
  g.addColorStop(0, '#fff2b0'); g.addColorStop(.45, '#ffad2e'); g.addColorStop(1, '#d9650b');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.fillStyle = '#d4141c';
  if (star === 1) starShape(ctx, x, y, r * .38);
  else for (let i = 0; i < star; i++) starShape(ctx, x + Math.cos(i / star * 6.283) * r * .45, y + Math.sin(i / star * 6.283) * r * .45, Math.max(.8, r * .2));
}
const PROJ_COL = { kame: '#bff2ff', ki: '#9fdcff', bullet: '#ffd166', acid: '#9cff57', cellki: '#e6ff8a', beam: '#ff7ad8', shell: '#3a3a3a', pod: '#f2f2f2', arrow: '#ddd' };
function drawProj(p) {
  const x = isoX(p.x, p.y), y = isoY(p.x, p.y) - p.z, c = PROJ_COL[p.kind] || '#fff';
  if (p.kind === 'bullet' || p.kind === 'beam') {
    const bx = isoX(p.sx, p.sy), by = isoY(p.sx, p.sy) - p.sz, dx = x - bx, dy = y - by, l = Math.hypot(dx, dy) || 1, len = p.kind === 'beam' ? 22 : 9;
    ctx.strokeStyle = c; ctx.lineWidth = p.kind === 'beam' ? 3 : 1.8; ctx.beginPath(); ctx.moveTo(x - dx / l * len, y - dy / l * len); ctx.lineTo(x, y); ctx.stroke();
    return;
  }
  if (p.kind === 'shell' || p.kind === 'pod') { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, y + p.z, 4, 2, 0, 0, 7); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, p.kind === 'pod' ? 4.5 : 3, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1; ctx.stroke(); if (frnd() < .5) partBurst(p.x, p.y, p.z, 1, '#cfcfcf', .1, .6, false, 3); return; }
  const r = p.kind === 'kame' ? 6 : p.kind === 'cellki' ? 4.5 : 3.4;
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.6); g.addColorStop(0, '#ffffff'); g.addColorStop(.35, c); g.addColorStop(1, rgba(rgbHex(c === '#ffffff' ? '#ffffff' : c), 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, 7); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}
function drawParts() {
  for (const p of parts) {
    const x = isoX(p.x, p.y), y = isoY(p.x, p.y) - p.z, k = p.t / p.life;
    ctx.globalAlpha = 1 - k; ctx.fillStyle = p.col;
    const s = p.grav ? p.size : p.size * (1 + k * 1.5);
    ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function drawFx(f) {
  const k = clamp(f.t / f.dur, 0, 1);
  if (f.t < 0) {
    if (f.type === 'beam' && f.charge) { const x = isoX(f.x1, f.y1), y = isoY(f.x1, f.y1) - (f.z1 || 0); const g = ctx.createRadialGradient(x, y, 0, x, y, 30 * (1 + f.t)); g.addColorStop(0, '#fff'); g.addColorStop(1, rgba(f.color, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.fill(); }
    return;
  }
  const P = (x, y, zz) => [isoX(x, y), isoY(x, y) - (zz || 0)];
  switch (f.type) {
    case 'boom': case 'flash': {
      const [x, y] = P(f.x, f.y, f.z), R = f.r * 46;
      if (!inViewIso(x, y, R + 40)) return;
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(x, y - R * .2, 0, x, y - R * .2, R * (.4 + k * .8)); g.addColorStop(0, `rgba(255,255,255,${1 - k})`); g.addColorStop(.4, rgba(f.color, .8 * (1 - k))); g.addColorStop(1, rgba(f.color, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y - R * .2, R * (.4 + k * .8), R * (.3 + k * .6), 0, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = rgba(f.color, 1 - k); ctx.lineWidth = 3 * (1 - k) + .5; ctx.beginPath(); ctx.ellipse(x, y, R * (.5 + k), R * (.25 + k * .5), 0, 0, 7); ctx.stroke();
      break;
    }
    case 'shock': case 'puff': case 'spark': case 'dust': {
      const [x, y] = P(f.x, f.y, f.z), R = f.r * 46;
      if (f.type !== 'shock') return;
      ctx.strokeStyle = rgba(f.color, 1 - k); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, R * (.3 + k * .9), R * (.15 + k * .45), 0, 0, 7); ctx.stroke();
      break;
    }
    case 'beam': {
      const [x1, y1] = P(f.x1, f.y1, f.z1), [x2, y2] = P(f.x2, f.y2, f.z2);
      ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      ctx.globalAlpha = 1 - k * k;
      ctx.strokeStyle = f.color; ctx.lineWidth = f.w * (1 - k * .5); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = f.w * .35; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      if (f.spiral) { ctx.strokeStyle = '#fff6b0'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const t = i / 30, a = t * 30 + G.time * 20, px = lerp(x1, x2, t) + Math.cos(a) * 6, py = lerp(y1, y2, t) + Math.sin(a) * 6; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.lineCap = 'butt';
      break;
    }
    case 'dragon': {
      const [x1, y1] = P(f.x1, f.y1, f.z1), [x2, y2] = P(f.x2, f.y2, f.z2);
      ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#ffd84a'; ctx.lineWidth = 12 * (1 - k * .4); ctx.lineCap = 'round';
      ctx.beginPath(); const a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
      for (let i = 0; i <= 14; i++) { const t = i / 14, w = Math.sin(t * 9 + f.t * 20) * 10, px = lerp(x1, x2, t) + Math.cos(a) * w, py = lerp(y1, y2, t) + Math.sin(a) * w; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke(); ctx.fillStyle = '#fff7c2'; ctx.beginPath(); ctx.arc(x2, y2, 14 * (1 - k), 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.lineCap = 'butt';
      break;
    }
    case 'tail': { const [x1, y1] = P(f.x1, f.y1, 16), [x2, y2] = P(f.x2, f.y2, 10); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#3c6b30'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, Math.min(y1, y2) - 26, x2, y2); ctx.stroke(); ctx.globalAlpha = 1; break; }
    case 'aura': { const u = byId(f.uid); if (!u) return; const [x, y] = P(u.x, u.y, 0); ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.color; ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x, y - 20, 14 + k * 30 + i * 6, 24 + k * 40 + i * 8, 0, 0, 7); ctx.stroke(); } ctx.globalAlpha = 1; break; }
    case 'rain': { const [x, y] = P(f.x, f.y, 0), R = f.r * 46; ctx.strokeStyle = rgba(f.color, .7 * (1 - k)); ctx.lineWidth = 1.5; for (let i = 0; i < 30; i++) { const a = i * 2.4, rr = (i / 30) * R, px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * .5 - 80 * (1 - k) - (i % 5) * 10; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + 10); ctx.stroke(); } ctx.fillStyle = rgba(f.color, .18 * (1 - k)); ctx.beginPath(); ctx.ellipse(x, y, R, R * .5, 0, 0, 7); ctx.fill(); break; }
    case 'skybolt': { const [x, y] = P(f.x, f.y, 0); ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.color; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + 40, y - 400); ctx.lineTo(x - 10, y - 160); ctx.lineTo(x + 12, y - 120); ctx.lineTo(x, y); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1; break; }
    case 'spiritbomb': case 'skyball': {
      const [x, y] = P(f.x, f.y, 0), R = f.r * 46, grow = Math.min(1, f.t / Math.max(.1, f.dur - .6)), yy = y - 260 * (1 - grow) - 30;
      ctx.globalAlpha = f.t > f.dur - .6 ? Math.max(0, (f.dur - f.t) / .6) : 1;
      const rr = 8 + R * .55 * grow;
      const g = ctx.createRadialGradient(x, yy, 1, x, yy, rr); g.addColorStop(0, '#ffffff'); g.addColorStop(.5, f.color); g.addColorStop(1, rgba(f.color, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, yy, rr, 0, 7); ctx.fill();
      ctx.strokeStyle = rgba(f.color, .5); ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.ellipse(x, y, R, R * .5, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalAlpha = 1; break;
    }
    case 'capsule': case 'sprout': { const [x, y] = P(f.x, f.y, 0); ctx.globalAlpha = 1 - k; ctx.fillStyle = f.type === 'sprout' ? '#6fd13c' : '#ffffff'; ctx.beginPath(); ctx.arc(x, y - 10 * (1 - k), 12 * (1 - k) + 2, 0, 7); ctx.fill(); ctx.globalAlpha = 1; break; }
    case 'bombers': { const [x1, y1] = P(f.x1, f.y1, 160), [x2, y2] = P(f.x2, f.y2, 160); const px = lerp(x1 - (x2 - x1) * .5, x2 + (x2 - x1) * .5, k), py = lerp(y1 - (y2 - y1) * .5, y2 + (y2 - y1) * .5, k); for (const o of [-14, 0, 14]) { ctx.fillStyle = '#5d636e'; ctx.beginPath(); ctx.ellipse(px + o, py + Math.abs(o) * .6, 12, 4, Math.atan2(y2 - y1, x2 - x1), 0, 7); ctx.fill(); ctx.fillStyle = '#d33a3a'; ctx.fillRect(px + o - 2, py + Math.abs(o) * .6 - 2, 4, 4); } break; }
  }
}
function drawOverlays(lerpX, lerpY) {
  // HP bars on top of everything
  for (const u of G.units) {
    if (u.garrison || u.def.cls === 'huntable') continue;
    const sel = G.sel.includes(u), mh = maxHp(u);
    if (!sel && u.hp >= mh - .5 && G.hover !== u) continue;
    const x = lerpX(u), y = lerpY(u);
    if (!G.revealAll && !isAlly(u.owner, G.me) && !visibleAt(x, y)) continue;
    const L = unitLook(u), hgt = (L.r === 'ape' ? 110 : 52 * (L.scale || 1)) + (u.lift || 0) * 30;
    hpBar(isoX(x, y) - 12, isoY(x, y) - hgt, 24, u.hp / mh, u.owner === G.me ? null : '#ff5a5f');
  }
  for (const b of G.blds) {
    if (!seenBld(b)) continue;
    const sel = G.sel.includes(b);
    if (!b.built) { if (isAlly(b.owner, G.me)) hpBar(isoX(b.x, b.y) - 20, isoY(b.tx, b.ty) - 10, 40, b.progress, '#62d0ff'); continue; }
    if (sel || b.hp < maxHp(b) || G.hover === b) hpBar(isoX(b.x, b.y) - 24, isoY(b.tx, b.ty) - 44, 48, b.hp / maxHp(b), b.owner === G.me ? null : '#ff5a5f');
    if (sel && b.rally && b.owner === G.me) { const [rx, ry] = [isoX(b.rally.x, b.rally.y), isoY(b.rally.x, b.rally.y)]; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(isoX(b.x, b.y), isoY(b.x, b.y)); ctx.lineTo(rx, ry); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx, ry - 18); ctx.stroke(); ctx.fillStyle = pcol(G.players[G.me].color); ctx.beginPath(); ctx.moveTo(rx, ry - 18); ctx.lineTo(rx + 11, ry - 14); ctx.lineTo(rx, ry - 10); ctx.fill(); }
  }
  for (const t of G.texts) { const [x, y] = [isoX(t.x, t.y), isoY(t.x, t.y) - t.z - t.t * 18]; ctx.globalAlpha = 1 - t.t / 1.5; ctx.font = '700 13px "Chakra Petch", sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.strokeText(t.s, x, y); ctx.fillStyle = t.c; ctx.fillText(t.s, x, y); ctx.globalAlpha = 1; }
  // move markers
  for (const m of G.marks || []) { const k = (performance.now() - m.t) / 500; if (k > 1) continue; const [x, y] = [isoX(m.x, m.y), isoY(m.x, m.y)]; ctx.strokeStyle = rgba(m.c, 1 - k); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 14 * (1 - k * .5), 7 * (1 - k * .5), 0, 0, 7); ctx.stroke(); }
  drawPlacement();
  if (G.targeting && G.targeting.type === 'power' && G.mouseWorld && POW[G.targeting.key].radius) { const R = POW[G.targeting.key].radius * MT * 2 * 46; const [x, y] = [isoX(G.mouseWorld.x, G.mouseWorld.y), isoY(G.mouseWorld.x, G.mouseWorld.y)]; ctx.strokeStyle = '#ffe066'; ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.ellipse(x, y, R, R * .5, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
}
function hpBar(x, y, w, f, col) {
  ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(x - 1, y - 1, w + 2, 5);
  ctx.fillStyle = col || (f > .6 ? '#46d98a' : f > .3 ? '#ffd34d' : '#ff5a5f'); ctx.fillRect(x, y, w * clamp(f, 0, 1), 3);
}
function drawPlacement() {
  if (!G.placing || !G.mouseWorld) return;
  const cells = placementCells();
  const d = B[G.placing], P = humanP();
  for (const c of cells) {
    const ok = c.ok;
    ctx.fillStyle = ok ? 'rgba(70,217,138,.3)' : 'rgba(255,90,95,.35)';
    ctx.beginPath(); ctx.moveTo(isoX(c.tx, c.ty), isoY(c.tx, c.ty)); ctx.lineTo(isoX(c.tx + d.w, c.ty), isoY(c.tx + d.w, c.ty)); ctx.lineTo(isoX(c.tx + d.w, c.ty + d.h), isoY(c.tx + d.w, c.ty + d.h)); ctx.lineTo(isoX(c.tx, c.ty + d.h), isoY(c.tx, c.ty + d.h)); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = .6; drawSpr(buildingSprite(G.placing, P.faction, P.color), isoX(c.tx, c.ty), isoY(c.tx, c.ty)); ctx.globalAlpha = 1;
  }
}
// ---------- screen-space effects ----------
function drawScreenFx() {
  if (G.shenronOwner || G.wishPending) { ctx.fillStyle = 'rgba(16,6,40,.42)'; ctx.fillRect(0, 0, vw, vh); if (Math.sin(G.time * 2.3) > .985) { ctx.fillStyle = 'rgba(200,230,255,.18)'; ctx.fillRect(0, 0, vw, vh); } }
  for (const f of G.fx) {
    const k = clamp(f.t / f.dur, 0, 1);
    if (f.type === 'screen') { ctx.fillStyle = f.color; ctx.globalAlpha = 1 - k; ctx.fillRect(0, 0, vw, vh); ctx.globalAlpha = 1; }
    else if (f.type === 'moon') { ctx.globalAlpha = Math.sin(k * Math.PI); const g = ctx.createRadialGradient(vw * .8, vh * .18, 4, vw * .8, vh * .18, 70); g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#fff3c4'); g.addColorStop(1, 'rgba(255,243,196,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(vw * .8, vh * .18, 70, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
    else if (f.type === 'shenron') drawShenron(f);
  }
}
function drawShenron(f) {
  const k = f.t / f.dur, a = k < .15 ? k / .15 : k > .85 ? (1 - k) / .15 : 1;
  ctx.save(); ctx.globalAlpha = a;
  const pts = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60; pts.push([vw * (1.1 - t * 1.25), vh * (.85 - t * .55) + Math.sin(t * 9 + f.t * 2.5) * vh * .09]); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [w, c] of [[46, 'rgba(60,255,140,.18)'], [30, '#1f8a46'], [20, '#36c46a'], [6, '#bfffd0']]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
  const [hx, hy] = pts[pts.length - 1];
  ctx.fillStyle = '#2aa457'; ctx.beginPath(); ctx.ellipse(hx, hy, 34, 22, -.3, 0, 7); ctx.fill();
  ctx.fillStyle = '#ff2b2b'; ctx.beginPath(); ctx.arc(hx - 10, hy - 6, 5, 0, 7); ctx.fill();
  ctx.strokeStyle = '#d9c27a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx + 10, hy - 14); ctx.lineTo(hx + 30, hy - 40); ctx.moveTo(hx - 2, hy - 18); ctx.lineTo(hx + 10, hy - 46); ctx.stroke();
  ctx.restore();
}

// ---------- fog ----------
let fogCanvas = null, fogCtx = null, fogImg = null;
function refreshFog() {
  if (!fogCanvas || fogCanvas.width !== MW + 2) { fogCanvas = makeCanvas(MW + 2, MH + 2); fogCtx = fogCanvas.getContext('2d'); fogImg = fogCtx.createImageData(MW + 2, MH + 2); }
  const d = fogImg.data, W2 = MW + 2;
  for (let y = 0; y < MH + 2; y++) for (let x = 0; x < W2; x++) {
    const i = (y * W2 + x) * 4, tx = x - 1, ty = y - 1;
    const v = inMap(tx, ty) ? G.vis[idx(tx, ty)] : 0;
    d[i] = 5; d[i + 1] = 8; d[i + 2] = 18; d[i + 3] = v === 2 ? 0 : v === 1 ? 125 : 255;
  }
  fogCtx.putImageData(fogImg, 0, 0); G.fogDirty = false;
}

// ---------- minimap (diamond) ----------
let miniBase = null, miniScale = 1;
function miniXY(x, y) { return [(isoX(x, y) + MH * HTW) * miniScale, isoY(x, y) * miniScale]; }
function miniToWorld(mx, my) { const ix = mx / miniScale - MH * HTW, iy = my / miniScale; return { x: (iy / HTH + ix / HTW) / 2, y: (iy / HTH - ix / HTW) / 2 }; }
function buildMiniBase() {
  miniScale = mini.width / ((MW + MH) * HTW);
  const flat = makeCanvas(MW, MH), f = flat.getContext('2d'), img = f.createImageData(MW, MH);
  const pal = PAL[G.map.biome];
  for (let i = 0; i < MW * MH; i++) { const t = G.map.terr[i], c = hexRgb(pal[t][0]), sh = 1 + (G.map.hgt[i] - .5) * .3; img.data[i * 4] = clamp(c[0] * sh, 0, 255); img.data[i * 4 + 1] = clamp(c[1] * sh, 0, 255); img.data[i * 4 + 2] = clamp(c[2] * sh, 0, 255); img.data[i * 4 + 3] = 255; }
  f.putImageData(img, 0, 0);
  miniBase = makeCanvas(mini.width, mini.height);
  const m = miniBase.getContext('2d');
  m.setTransform(HTW * miniScale, HTH * miniScale, -HTW * miniScale, HTH * miniScale, MH * HTW * miniScale, 0);
  m.imageSmoothingEnabled = false; m.drawImage(flat, 0, 0);
}
function renderMinimap() {
  if (!miniBase) buildMiniBase();
  const W = mini.width, Hh = mini.height;
  mctx.setTransform(1, 0, 0, 1, 0, 0); mctx.clearRect(0, 0, W, Hh); mctx.drawImage(miniBase, 0, 0);
  const dot = (x, y, s, col) => { const [mx, my] = miniXY(x, y); mctx.fillStyle = col; mctx.fillRect(mx - s / 2, my - s / 2, s, s); };
  for (const r of G.ress) if (r.key !== 'tree' && (G.revealAll || exploredAt(r.x, r.y))) dot(r.x, r.y, r.key === 'gold' ? 5 : 3, r.key === 'gold' ? '#ffd34d' : '#9cff8a');
  for (const r of G.ress) if (r.key === 'tree' && (G.revealAll || exploredAt(r.x, r.y))) dot(r.x, r.y, 2.5, 'rgba(18,60,28,.85)');
  for (const s of G.settlements) if (!s.tc && (G.revealAll || exploredAt(s.tx + 2, s.ty + 2))) dot(s.tx + 2, s.ty + 2, 6, '#ffffff');
  for (const b of G.blds) if (seenBld(b)) { const col = pcol(G.players[b.owner].color); for (let y = b.ty; y < b.ty + b.h; y++) for (let x = b.tx; x < b.tx + b.w; x++) dot(x + .5, y + .5, 4, col); }
  for (const u of G.units) { if (u.garrison) continue; if (!G.revealAll && !isAlly(u.owner, G.me) && !visibleAt(u.x, u.y)) continue; dot(u.x, u.y, u.def.cls === 'hero' || u.def.cls === 'titan' ? 6 : 3.5, u.owner === 0 ? '#caa25b' : pcol(G.players[u.owner].color)); }
  if (!G.revealAll) { if (G.fogDirty) refreshFog(); mctx.save(); mctx.setTransform(HTW * miniScale, HTH * miniScale, -HTW * miniScale, HTH * miniScale, MH * HTW * miniScale, 0); mctx.imageSmoothingEnabled = true; mctx.drawImage(fogCanvas, -1, -1, MW + 2, MH + 2); mctx.restore(); }
  for (const r of G.relics) if (r.state !== 'temple' && (G.revealAll || exploredAt(r.x, r.y))) { const [mx, my] = miniXY(r.x, r.y); mctx.fillStyle = '#c99aff'; mctx.fillRect(mx - 3, my - 3, 6, 6); mctx.strokeStyle = '#fff'; mctx.lineWidth = 1; mctx.strokeRect(mx - 3, my - 3, 6, 6); }
  if (Math.sin(G.time * 6) > -.2) for (const b of G.balls) if (b.state === 'ground' || b.state === 'carried') { const [mx, my] = miniXY(b.x, b.y); mctx.fillStyle = '#ff9a1e'; mctx.beginPath(); mctx.arc(mx, my, 4, 0, 7); mctx.fill(); mctx.strokeStyle = '#fff'; mctx.lineWidth = 1.5; mctx.stroke(); }
  for (const p of G.pings) { const k = (G.time - p.t) / 2.5; if (k > 1) continue; const [mx, my] = miniXY(p.x, p.y); mctx.strokeStyle = `rgba(255,90,95,${1 - k})`; mctx.lineWidth = 3; mctx.beginPath(); mctx.arc(mx, my, 6 + k * 22, 0, 7); mctx.stroke(); }
  if (G.objMarks) for (const p of G.objMarks) { const [mx, my] = miniXY(p.x, p.y); mctx.strokeStyle = '#ffe066'; mctx.lineWidth = 2; mctx.beginPath(); mctx.arc(mx, my, 6 + Math.sin(G.time * 4) * 2, 0, 7); mctx.stroke(); }
  const c = [screenToWorld(0, 0), screenToWorld(vw, 0), screenToWorld(vw, vh), screenToWorld(0, vh)].map(p => miniXY(p.x, p.y));
  mctx.strokeStyle = '#ffffff'; mctx.lineWidth = 2; mctx.beginPath(); c.forEach((p, i) => i ? mctx.lineTo(p[0], p[1]) : mctx.moveTo(p[0], p[1])); mctx.closePath(); mctx.stroke();
}
