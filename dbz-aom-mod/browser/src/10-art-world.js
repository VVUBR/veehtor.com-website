// =====================================================================
// 10. ART: isometric buildings, trees, resources, icons, portraits
// =====================================================================
// Local iso coordinates for a building footprint: tile (x,y) at height z (px).
const ip = (x, y, z) => [(x - y) * HTW, (x + y) * HTH - (z || 0)];
function isoPoly(c, pts, col, stroke) {
  c.fillStyle = col; c.beginPath();
  pts.forEach((p, i) => { const q = ip(p[0], p[1], p[2]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); });
  c.closePath(); c.fill();
  if (stroke !== false) { c.strokeStyle = 'rgba(20,14,28,.55)'; c.lineWidth = 1; c.stroke(); }
}
// Box from (x0,y0) to (x1,y1) between heights z0..z1; shows the top, south (left-front) and east (right-front) faces.
function isoBox(c, x0, y0, x1, y1, z0, z1, col, o) {
  o = o || {};
  isoPoly(c, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], o.left || shade(col, -.1));
  isoPoly(c, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], o.right || shade(col, -.32));
  if (!o.noTop) isoPoly(c, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], o.top || shade(col, .12));
}
// Ground-plane ellipse centred on tile (x,y), radius r tiles, at height z.
function isoEllipse(c, x, y, r, z, col, stroke) {
  const [cx, cy] = ip(x, y, z);
  c.fillStyle = col; c.beginPath(); c.ellipse(cx, cy, r * HTW * 1.414, r * HTH * 1.414, 0, 0, 7); c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
}
function isoCyl(c, x, y, r, z0, z1, col) {
  const [cx, cy0] = ip(x, y, z0), cy1 = cy0 - (z1 - z0), rx = r * HTW * 1.414, ry = r * HTH * 1.414;
  const g = c.createLinearGradient(cx - rx, 0, cx + rx, 0);
  g.addColorStop(0, shade(col, .05)); g.addColorStop(.45, shade(col, .22)); g.addColorStop(1, shade(col, -.35));
  c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy0, rx, ry, 0, 0, Math.PI); c.lineTo(cx - rx, cy1); c.ellipse(cx, cy1, rx, ry, 0, Math.PI, 0, true); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(20,14,28,.5)'; c.lineWidth = 1; c.stroke();
  c.fillStyle = shade(col, .15); c.beginPath(); c.ellipse(cx, cy1, rx, ry, 0, 0, 7); c.fill(); c.stroke();
}
function isoDome(c, x, y, r, z, h, col) {
  const [cx, cy] = ip(x, y, z), rx = r * HTW * 1.414, ry = r * HTH * 1.414;
  const g = c.createRadialGradient(cx - rx * .35, cy - h * .7, rx * .08, cx, cy - h * .3, rx * 1.15);
  g.addColorStop(0, '#ffffff'); g.addColorStop(.35, shade(col, .1)); g.addColorStop(1, shade(col, -.38));
  c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI); c.ellipse(cx, cy, rx, h + ry * .2, 0, Math.PI, 0); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(20,14,28,.5)'; c.lineWidth = 1; c.stroke();
}
function isoRoof(c, x0, y0, x1, y1, z, h, col) { // hip roof
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, ix = (x1 - x0) * .25;
  isoPoly(c, [[x0, y1, z], [x1, y1, z], [mx + ix, my, z + h], [mx - ix, my, z + h]], shade(col, -.05));
  isoPoly(c, [[x1, y0, z], [x1, y1, z], [mx + ix, my, z + h]], shade(col, -.3));
  isoPoly(c, [[x0, y0, z], [x1, y0, z], [mx + ix, my, z + h], [mx - ix, my, z + h]], shade(col, .15));
}
// Windows on the south or east face.
function winS(c, x, y, z, w, h, col) { isoPoly(c, [[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]], col, false); }
function winE(c, x, y, z, w, h, col) { isoPoly(c, [[x, y, z], [x, y + w, z], [x, y + w, z + h], [x, y, z + h]], col, false); }
function flag(c, x, y, z, col, h) {
  const [px, py] = ip(x, y, z); h = h || 26;
  c.strokeStyle = '#3a3a3a'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py - h); c.stroke();
  c.fillStyle = col; c.beginPath(); c.moveTo(px, py - h); c.lineTo(px + 11, py - h + 3); c.lineTo(px, py - h + 7); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = .8; c.stroke();
}
function palm(c, x, y, s) {
  const [px, py] = ip(x, y, 0); s = s || 1;
  c.strokeStyle = '#7a5a32'; c.lineWidth = 2.4 * s; c.beginPath(); c.moveTo(px, py); c.quadraticCurveTo(px + 3 * s, py - 12 * s, px + 1 * s, py - 22 * s); c.stroke();
  c.fillStyle = '#3f9a4a'; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; c.beginPath(); c.ellipse(px + 1 * s + Math.cos(a) * 6 * s, py - 22 * s + Math.sin(a) * 2.5 * s, 7 * s, 2.2 * s, a, 0, 7); c.fill(); }
}
function emblem(c, x, y, z, txt, col, bg) {
  const [px, py] = ip(x, y, z);
  c.fillStyle = bg || '#fff'; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.strokeStyle = col; c.lineWidth = 1.4; c.stroke();
  c.fillStyle = col; c.font = '700 8px Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, px, py + .5);
}

// Architecture per faction. Each style draws a building footprint w×h tiles with the north corner at the origin.
const ARCH = {
  earth: { wall: '#ece6d6', roof: '#ff8a1e', trim: '#2f6fd0', glass: '#7fd3ff', dark: '#b9b09a' },
  rr: { wall: '#9aa0a8', roof: '#5d636e', trim: '#d33a3a', glass: '#ffd84a', dark: '#6d737c' },
  ff: { wall: '#efeaf6', roof: '#8a5ad8', trim: '#c9a24a', glass: '#ff4dd2', dark: '#b8afc8' },
};
function drawBuildingArt(c, key, fac, pc, w, h) {
  const A = ARCH[fac] || ARCH.earth, team = pcol(pc), m = .25;
  const W = w - m, Hh = h - m;
  // foundation
  isoPoly(c, [[0, 0, 0], [w, 0, 0], [w, h, 0], [0, h, 0]], fac === 'rr' ? '#7b7f86' : fac === 'ff' ? '#b6aecb' : '#c9bfa6');
  switch (key) {
    case 'tc':
      if (fac === 'earth') { isoCyl(c, w / 2, h / 2, 1.75, 0, 16, A.wall); isoDome(c, w / 2, h / 2, 1.7, 16, 46, A.wall); isoEllipse(c, w / 2, h / 2, 1.72, 18, 'rgba(0,0,0,0)', A.roof); c.lineWidth = 4; c.strokeStyle = A.roof; const [ex, ey] = ip(w / 2, h / 2, 26); c.beginPath(); c.ellipse(ex, ey, 1.62 * HTW * 1.414, 1.62 * HTH * 1.414 * .55, 0, .1, Math.PI - .1); c.stroke(); for (let i = 0; i < 3; i++) winS(c, .9 + i * .8, h - .55, 6, .45, 6, A.glass); emblem(c, w / 2 + .9, h / 2 + .9, 34, 'CC', A.trim); flag(c, w / 2, h / 2, 60, team, 30); }
      else if (fac === 'rr') { isoBox(c, m, m, W, Hh, 0, 26, A.wall); isoBox(c, 1, 1, W - .6, Hh - .6, 26, 40, A.roof); isoBox(c, 1.4, 1.4, 2.4, 2.4, 40, 70, A.wall); c.fillStyle = A.trim; isoPoly(c, [[m, Hh, 14], [W, Hh, 14], [W, Hh, 19], [m, Hh, 19]], A.trim, false); isoPoly(c, [[W, m, 14], [W, Hh, 14], [W, Hh, 19], [W, m, 19]], shade(A.trim, -.3), false); emblem(c, w / 2 + .2, h - .1, 30, 'RR', '#fff', A.trim); for (let i = 0; i < 4; i++) winE(c, W, .6 + i * .8, 5, .4, 5, A.glass); flag(c, 1.9, 1.9, 70, team, 28); }
      else { isoDome(c, w / 2, h / 2, 1.85, 0, 50, A.wall); isoEllipse(c, w / 2, h / 2, 1.2, 50, shade(A.roof, .1)); isoDome(c, w / 2, h / 2, .8, 46, 22, A.roof); for (const a of [0, 1.6, 3.2, 4.8]) { const x = w / 2 + Math.cos(a) * 1.7, y = h / 2 + Math.sin(a) * 1.7; isoBox(c, x - .15, y - .15, x + .15, y + .15, 0, 30, A.trim); } winS(c, w / 2 - .3, h / 2 + 1.75, 8, .6, 10, A.glass); flag(c, w / 2, h / 2, 74, team, 26); }
      break;
    case 'house':
      if (fac === 'earth') { isoDome(c, w / 2, h / 2, .85, 0, 30, A.wall); isoEllipse(c, w / 2, h / 2, .86, 8, 'rgba(0,0,0,0)', A.roof); winS(c, .8, h - .2, 4, .4, 6, A.glass); winS(c, 1.4, h - .2, 4, .25, 4, A.glass); flag(c, w / 2 + .5, h / 2 - .5, 18, team, 16); }
      else if (fac === 'rr') { isoBox(c, m, m, W, Hh, 0, 20, A.wall); isoBox(c, m, m, W, Hh, 20, 23, A.roof); winS(c, .5, Hh, 8, .4, 5, A.glass); winS(c, 1.1, Hh, 8, .4, 5, A.glass); isoPoly(c, [[m, Hh, 15], [W, Hh, 15], [W, Hh, 17], [m, Hh, 17]], team, false); }
      else { isoDome(c, w / 2, h / 2, .9, 0, 28, A.wall); c.fillStyle = '#c01a3a'; const [px, py] = ip(w / 2 + .4, h / 2 + .4, 12); c.beginPath(); c.ellipse(px, py, 6, 4, 0, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 1; c.stroke(); flag(c, w / 2 - .3, h / 2 - .3, 26, team, 12); }
      break;
    case 'granary':
      isoCyl(c, w / 2, h / 2, .8, 0, 30, fac === 'rr' ? A.wall : A.wall); isoDome(c, w / 2, h / 2, .8, 30, 12, fac === 'earth' ? '#6fc85a' : A.roof);
      if (fac === 'earth') { const [px, py] = ip(w / 2 + .6, h / 2 + .6, 16); c.fillStyle = '#6fc85a'; c.beginPath(); c.ellipse(px, py, 5, 3, -.4, 0, 7); c.fill(); }
      flag(c, w / 2 + .6, h / 2 - .6, 20, team, 14); break;
    case 'storehouse':
      isoBox(c, m, m, W, Hh, 0, 18, A.wall); isoRoof(c, m - .05, m - .05, W + .05, Hh + .05, 18, 12, A.roof);
      for (const [x, y] of [[1.2, 1.9], [1.6, 2.15]]) isoBox(c, x - .2, y - .2, x + .2, y + .2, 0, 8, fac === 'earth' ? '#ff8a1e' : fac === 'rr' ? '#5b6b52' : '#8a5ad8');
      flag(c, .5, .5, 26, team, 12); break;
    case 'farm':
      isoPoly(c, [[.08, .08, 0], [w - .08, .08, 0], [w - .08, h - .08, 0], [.08, h - .08, 0]], fac === 'rr' ? '#4a5048' : '#7a5a32');
      for (let i = 0; i < 6; i++) { const y = .35 + i * .45; isoPoly(c, [[.25, y, 1], [w - .25, y, 1], [w - .25, y + .22, 1], [.25, y + .22, 1]], fac === 'earth' ? '#6fbf4a' : fac === 'rr' ? '#7dff9c' : '#b07ae0', false); }
      if (fac === 'rr') { isoCyl(c, .5, .5, .3, 0, 14, '#9aa0a8'); }
      flag(c, .3, .3, 0, team, 14); break;
    case 'barracks':
      if (fac === 'earth') { isoBox(c, m, m, W, Hh, 0, 22, '#c4572e'); isoRoof(c, m - .2, m - .2, W + .2, Hh + .2, 22, 20, '#ff8a1e'); isoPoly(c, [[1.1, Hh, 0], [1.9, Hh, 0], [1.9, Hh, 14], [1.1, Hh, 14]], '#3b2a1a', false); emblem(c, w / 2 + .4, h / 2 + .4, 38, '亀', '#c4572e', '#ffe9b0'); }
      else if (fac === 'rr') { isoBox(c, m, m, W, Hh, 0, 24, A.wall); isoBox(c, m, m, W, Hh, 24, 27, A.roof); isoBox(c, .5, .5, 1.1, 1.1, 27, 46, A.dark); isoPoly(c, [[1, Hh, 0], [2, Hh, 0], [2, Hh, 14], [1, Hh, 14]], '#3a3d44', false); isoPoly(c, [[W, .6, 18], [W, 2.4, 18], [W, 2.4, 21], [W, .6, 21]], A.trim, false); }
      else { isoPoly(c, [[m, m, 1], [W, m, 1], [W, Hh, 1], [m, Hh, 1]], '#d8d0e6'); for (const [x, y] of [[m, m], [W, m], [W, Hh], [m, Hh]]) isoBox(c, x - .12, y - .12, x + .12, y + .12, 0, 34, A.roof); isoEllipse(c, w / 2, h / 2, .6, 2, A.trim); }
      flag(c, w - .4, .4, fac === 'ff' ? 34 : 26, team, 16); break;
    case 'stable':
      isoBox(c, m, m, W, Hh, 0, 22, A.wall); c.fillStyle = A.roof;
      { const [px, py] = ip(w / 2 + .3, h / 2 + .3, 22); c.beginPath(); c.ellipse(px, py, (w - .5) * HTW * .72, (h - .5) * HTH * .9, 0, Math.PI, 0); c.fill(); c.strokeStyle = 'rgba(20,14,28,.5)'; c.stroke(); }
      isoPoly(c, [[.8, Hh, 0], [2.2, Hh, 0], [2.2, Hh, 15], [.8, Hh, 15]], '#2a2d33', false); flag(c, .4, .4, 22, team, 16); break;
    case 'armory':
      isoBox(c, m, m, W, Hh, 0, 24, A.dark); isoBox(c, m, m, W, Hh, 24, 27, A.roof); isoCyl(c, 1.4, .7, .18, 27, 44, '#6b6b70');
      { const [px, py] = ip(1.4, .7, 46); c.fillStyle = '#ff4d4d'; c.beginPath(); c.arc(px, py, 2.5, 0, 7); c.fill(); }
      winS(c, .6, Hh, 8, .7, 7, A.glass); flag(c, .5, .5, 27, team, 12); break;
    case 'temple':
      if (fac === 'earth') { isoCyl(c, w / 2, h / 2, 1.45, 0, 10, '#f2efe6'); palm(c, .9, 1.9, .8); palm(c, 2.1, .8, .8); isoCyl(c, w / 2, h / 2, .6, 10, 22, A.wall); isoDome(c, w / 2, h / 2, .6, 22, 20, A.wall); for (const a of [0, 1.57, 3.14, 4.71]) { const x = w / 2 + Math.cos(a + .78) * 1.1, y = h / 2 + Math.sin(a + .78) * 1.1; isoBox(c, x - .08, y - .08, x + .08, y + .08, 10, 24, '#e8e2d2'); } const [px, py] = ip(w / 2, h / 2, 44); c.fillStyle = '#e0a020'; c.beginPath(); c.arc(px, py, 2.6, 0, 7); c.fill(); }
      else if (fac === 'rr') { isoBox(c, .1, .1, w - .1, h - .1, 0, 8, '#ecebe6'); c.strokeStyle = '#b9b6ad'; c.lineWidth = 1; for (let i = 1; i < 6; i++) { const a = ip(.1 + i * (w - .2) / 6, .1, 8), b = ip(.1 + i * (w - .2) / 6, h - .1, 8); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); const d = ip(.1, .1 + i * (h - .2) / 6, 8), e = ip(w - .1, .1 + i * (h - .2) / 6, 8); c.beginPath(); c.moveTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.stroke(); } for (const [x, y] of [[.2, .2], [w - .2, .2], [w - .2, h - .2], [.2, h - .2]]) isoBox(c, x - .14, y - .14, x + .14, y + .14, 8, 40, '#f4f4f0'); }
      else { isoBox(c, .3, .3, w - .3, h - .3, 0, 10, '#d8d0e6'); isoDome(c, w / 2, h / 2, 1.2, 10, 38, A.roof); isoBox(c, w / 2 - .25, h - .6, w / 2 + .25, h - .3, 10, 26, '#5a2a8a'); const [px, py] = ip(w / 2, h / 2, 56); c.fillStyle = A.glass; c.beginPath(); c.arc(px, py, 3, 0, 7); c.fill(); }
      flag(c, w - .3, .3, fac === 'rr' ? 40 : 10, team, 18); break;
    case 'tower':
      if (fac === 'earth') { isoCyl(c, w / 2, h / 2, .55, 0, 46, A.wall); isoCyl(c, w / 2, h / 2, .7, 46, 52, A.roof); const [px, py] = ip(w / 2, h / 2, 64); const g = c.createRadialGradient(px, py, 1, px, py, 9); g.addColorStop(0, '#ffffff'); g.addColorStop(.5, '#7fe0ff'); g.addColorStop(1, 'rgba(60,170,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(px, py, 9, 0, 7); c.fill(); c.fillStyle = '#3fb6ff'; c.beginPath(); c.moveTo(px, py - 8); c.lineTo(px + 4, py); c.lineTo(px, py + 6); c.lineTo(px - 4, py); c.closePath(); c.fill(); }
      else if (fac === 'rr') { isoBox(c, .35, .35, w - .35, h - .35, 0, 40, A.wall); isoBox(c, .2, .2, w - .2, h - .2, 40, 50, A.roof); const [px, py] = ip(w / 2, h / 2, 54); c.strokeStyle = '#222'; c.lineWidth = 4; c.beginPath(); c.moveTo(px, py); c.lineTo(px + 14, py + 4); c.stroke(); }
      else { isoCyl(c, w / 2, h / 2, .35, 0, 54, A.wall); const [px, py] = ip(w / 2, h / 2, 62); c.fillStyle = A.glass; c.beginPath(); c.arc(px, py, 6, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 1; c.stroke(); }
      flag(c, w / 2 + .5, h / 2 - .5, fac === 'rr' ? 50 : 30, team, 12); break;
    case 'market':
      isoPoly(c, [[m, m, 0], [W, m, 0], [W, Hh, 0], [m, Hh, 0]], '#d8c9a8');
      for (const [x, y, col] of [[.9, .9, '#ff8a1e'], [2.1, .9, '#2f8cff'], [.9, 2.1, '#ffd34d'], [2.1, 2.1, '#46d98a']]) { isoBox(c, x - .35, y - .35, x + .35, y + .35, 0, 8, '#8a6a42'); const [px, py] = ip(x, y, 24); c.fillStyle = col; c.beginPath(); c.ellipse(px, py, 18, 9, 0, Math.PI, 0); c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.stroke(); c.strokeStyle = '#555'; c.beginPath(); const q = ip(x, y, 8); c.moveTo(q[0], q[1]); c.lineTo(px, py); c.stroke(); }
      flag(c, .3, .3, 0, team, 30); break;
    case 'fortress':
      isoBox(c, m, m, W, Hh, 0, 30, A.wall);
      for (const [x, y] of [[m, m], [W, m], [W, Hh], [m, Hh]]) isoCyl(c, x, y, .45, 0, 48, fac === 'earth' ? A.wall : A.dark);
      if (fac === 'earth') { isoDome(c, w / 2, h / 2, 1.3, 30, 36, A.wall); emblem(c, w / 2 + 1.1, h / 2 + 1.1, 46, 'CC', A.trim); }
      else if (fac === 'rr') { isoBox(c, 1.2, 1.2, w - 1.2, h - 1.2, 30, 56, A.roof); emblem(c, w / 2 + .6, h - .9, 44, 'RR', '#fff', A.trim); }
      else { isoDome(c, w / 2, h / 2, 1.4, 30, 30, A.roof); isoCyl(c, w / 2, h / 2, .2, 60, 84, A.trim); }
      isoPoly(c, [[1.4, Hh, 0], [2.4, Hh, 0], [2.4, Hh, 18], [1.4, Hh, 18]], '#2a2d33', false);
      flag(c, m, m, 48, team, 22); flag(c, W, Hh, 48, team, 22); break;
    case 'wall':
      if (fac === 'ff') { isoCyl(c, .5, .5, .22, 0, 30, A.wall); const [px, py] = ip(.5, .5, 30); c.fillStyle = A.glass; c.beginPath(); c.arc(px, py, 3, 0, 7); c.fill(); }
      else isoBox(c, .05, .05, .95, .95, 0, fac === 'rr' ? 20 : 24, fac === 'rr' ? '#8a8f98' : '#e8e2d2', { top: shade(fac === 'rr' ? '#8a8f98' : '#e8e2d2', .1) });
      break;
    case 'gate':
      isoBox(c, .05, .05, .95, .95, 0, 6, A.dark); isoBox(c, .05, .05, .3, .3, 6, 34, A.wall); isoBox(c, .7, .7, .95, .95, 6, 34, A.wall); isoPoly(c, [[.05, .05, 34], [.95, .95, 34], [.95, .95, 38], [.05, .05, 38]], team); break;
    case 'reactor':
      isoCyl(c, w / 2, h / 2, .75, 0, 26, '#5d636e'); { const [px, py] = ip(w / 2, h / 2, 30); const g = c.createRadialGradient(px, py, 1, px, py, 14); g.addColorStop(0, 'rgba(230,255,200,.95)'); g.addColorStop(.5, 'rgba(120,255,140,.7)'); g.addColorStop(1, 'rgba(60,200,90,0)'); c.fillStyle = g; c.beginPath(); c.arc(px, py, 14, 0, 7); c.fill(); }
      isoBox(c, .1, .1, .5, .5, 0, 34, '#7d8796'); flag(c, .3, .3, 34, team, 10); break;
    case 'wonder':
      if (fac === 'earth') { isoCyl(c, w / 2, h / 2, 2.3, 0, 18, '#f2efe6'); palm(c, 1, 3.6, 1); palm(c, 3.6, 1, 1); palm(c, 1.2, 1.2, .9); isoCyl(c, w / 2, h / 2, 1.2, 18, 50, A.wall); isoDome(c, w / 2, h / 2, 1.2, 50, 40, A.wall); for (const a of [0, 1.05, 2.1, 3.14, 4.2, 5.25]) { const x = w / 2 + Math.cos(a) * 1.25, y = h / 2 + Math.sin(a) * 1.25; isoBox(c, x - .12, y - .12, x + .12, y + .12, 18, 64, '#e8e2d2'); } const [px, py] = ip(w / 2, h / 2, 96); c.fillStyle = '#e0a020'; c.beginPath(); c.arc(px, py, 4, 0, 7); c.fill(); }
      else if (fac === 'rr') { isoBox(c, .5, .5, w - .5, h - .5, 0, 20, A.wall); isoBox(c, 1.4, 1.4, w - 1.4, h - 1.4, 20, 110, A.wall); isoBox(c, 1.2, 1.2, w - 1.2, h - 1.2, 110, 120, A.trim); isoBox(c, 2.2, 2.2, w - 2.2, h - 2.2, 120, 150, A.dark); emblem(c, w / 2 + .6, h - 1.3, 80, 'RR', '#fff', A.trim); for (let i = 0; i < 6; i++) winS(c, 1.6, h - 1.4, 26 + i * 13, 1.8, 5, A.glass); }
      else { const [px, py] = ip(w / 2, h / 2, 40); c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(px, py + 40, 120, 50, 0, 0, 7); c.fill(); isoDome(c, w / 2, h / 2, 2.4, 30, 26, A.wall); isoEllipse(c, w / 2, h / 2, 2.45, 30, shade(A.wall, -.1)); isoDome(c, w / 2, h / 2, 1.1, 50, 22, A.roof); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28, x = w / 2 + Math.cos(a) * 2.2, y = h / 2 + Math.sin(a) * 2.2, [qx, qy] = ip(x, y, 32); c.fillStyle = A.glass; c.beginPath(); c.arc(qx, qy, 2.4, 0, 7); c.fill(); } for (const [x, y] of [[1, 4], [4, 1], [4, 4]]) isoBox(c, x - .1, y - .1, x + .1, y + .1, 0, 34, '#8a8f98'); }
      flag(c, .4, .4, 20, team, 30); break;
    // ---- scenario buildings
    case 'attackpod': { const [px, py] = ip(.5, .5, 0); c.fillStyle = 'rgba(60,40,30,.5)'; c.beginPath(); c.ellipse(px, py, 30, 14, 0, 0, 7); c.fill(); isoDome(c, .5, .5, .45, 0, 26, '#f2f2f2'); const [wx, wy] = ip(.75, .75, 12); c.fillStyle = '#c01a3a'; c.beginPath(); c.ellipse(wx, wy, 6, 4, 0, 0, 7); c.fill(); break; }
    case 'lab': isoBox(c, m, m, W, Hh, 0, 16, '#6d737c'); isoDome(c, w / 2, h / 2, 1.5, 16, 34, '#9aa0a8'); isoBox(c, .5, h - 1.3, 1.3, h - .3, 0, 24, '#5d636e'); emblem(c, w / 2 + 1.2, h / 2 + 1.2, 18, 'RR', '#fff', '#d33a3a'); { const [px, py] = ip(w / 2, h / 2, 50); c.fillStyle = 'rgba(120,255,140,.7)'; c.beginPath(); c.arc(px, py, 5, 0, 7); c.fill(); } break;
    case 'ship': { const [px, py] = ip(w / 2, h / 2, 0); c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(px, py, 150, 64, 0, 0, 7); c.fill(); for (const [x, y] of [[1, 4], [4, 1], [4, 4], [1, 1]]) isoBox(c, x - .1, y - .1, x + .1, y + .1, 0, 26, '#8a8f98'); isoEllipse(c, w / 2, h / 2, 2.5, 26, '#e6e1ee', '#8a8f98'); isoDome(c, w / 2, h / 2, 2.4, 26, 22, '#efeaf6'); isoDome(c, w / 2, h / 2, 1, 44, 16, '#d7d0e6'); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28, [qx, qy] = ip(w / 2 + Math.cos(a) * 2.3, h / 2 + Math.sin(a) * 2.3, 28); c.fillStyle = '#ff7ad8'; c.beginPath(); c.arc(qx, qy, 2.2, 0, 7); c.fill(); } break; }
    case 'guru': isoCyl(c, w / 2, h / 2, 1.3, 0, 14, '#eef4e8'); isoDome(c, w / 2, h / 2, 1.3, 14, 30, '#eef4e8'); isoCyl(c, w / 2 + 1, h / 2 - .6, .35, 0, 46, '#eef4e8'); isoDome(c, w / 2 + 1, h / 2 - .6, .35, 46, 10, '#eef4e8'); winS(c, w / 2 - .2, h / 2 + 1.25, 4, .4, 8, '#3f6f8f'); break;
    case 'dock': {
      const plank = fac === 'rr' ? '#5d636e' : fac === 'ff' ? '#b6aecb' : '#a8763c';
      isoBox(c, .1, .1, w - .1, h - .1, 0, 6, plank);
      for (let i = 0; i < 5; i++) { const y = .35 + i * .55; isoPoly(c, [[.15, y, 6.2], [w - .15, y, 6.2], [w - .15, y + .05, 6.2], [.15, y + .05, 6.2]], shade(plank, -.25), false); }
      for (const [x, y] of [[.2, .2], [w - .2, .2], [w - .2, h - .2], [.2, h - .2]]) isoCyl(c, x, y, .12, 0, 12, shade(plank, -.3));
      isoBox(c, .3, .3, 1.3, 1.3, 6, 22, fac === 'earth' ? A.wall : A.wall); isoRoof(c, .25, .25, 1.35, 1.35, 22, 8, A.roof);
      // crane
      isoCyl(c, w - .7, .7, .14, 6, 44, fac === 'rr' ? '#d33a3a' : fac === 'ff' ? '#8a5ad8' : '#ff8a1e');
      { const a = ip(w - .7, .7, 44), b = ip(w - .7, h - .4, 40); c.strokeStyle = fac === 'rr' ? '#d33a3a' : fac === 'ff' ? '#8a5ad8' : '#ff8a1e'; c.lineWidth = 3; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.lineWidth = 1; c.strokeStyle = '#333'; c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(b[0], b[1] + 18); c.stroke(); }
      isoBox(c, 1.6, 1.8, 2.2, 2.4, 6, 11, fac === 'earth' ? '#3c78c8' : '#5b6b52');
      flag(c, .5, .5, 30, team, 16);
      break;
    }
    case 'korin': {
      // Korin's Tower: a white stone pillar with Korin's sanctuary on top
      isoCyl(c, w / 2, h / 2, 1.45, 0, 7, '#bdb39b'); isoCyl(c, w / 2, h / 2, 1.05, 7, 12, '#d8cfb6');
      isoCyl(c, w / 2, h / 2, .55, 12, 176, '#efe8d6');
      for (const z of [40, 80, 120, 160]) isoCyl(c, w / 2, h / 2, .6, z, z + 4, '#c98a3a');
      isoCyl(c, w / 2, h / 2, 1.25, 176, 184, '#d9cfb5'); isoCyl(c, w / 2, h / 2, 1.05, 184, 196, '#efe8d6');
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, x = w / 2 + Math.cos(a) * .9, y = h / 2 + Math.sin(a) * .9; if (Math.sin(a) + Math.cos(a) > -.3) winS(c, x, y, 186, .18, 7, '#4a6fa5'); }
      isoDome(c, w / 2, h / 2, 1.0, 196, 22, '#c9884a'); isoCyl(c, w / 2, h / 2, .08, 216, 232, '#ffd34d');
      const [gx, gy] = ip(w / 2, h / 2, 234); c.fillStyle = '#ffd34d'; c.beginPath(); c.arc(gx, gy, 3.5, 0, 7); c.fill();
      break;
    }
    case 'hut': isoBox(c, m, m, W, Hh, 0, 14, '#d8c9a8'); isoRoof(c, m - .1, m - .1, W + .1, Hh + .1, 14, 16, '#a0572e'); winS(c, .6, Hh, 0, .45, 9, '#5a3a1e'); break;
    default: isoBox(c, m, m, W, Hh, 0, 20, A.wall);
  }
}
function buildingSprite(key, fac, pc) {
  const d = B[key], w = d.w, h = d.h;
  const top = { tc: 100, wonder: 170, tower: 90, fortress: 110, temple: 80, ship: 90, lab: 70, korin: 250, dock: 70 }[key] || 70;
  const W = (w + h) * HTW + 8, Hh = (w + h) * HTH + top + 6;
  return sprite(`B|${key}|${fac}|${pc}`, W, Hh, h * HTW + 4, top, c => drawBuildingArt(c, key, fac, pc, w, h));
}
function scaffoldSprite(w, h) {
  return sprite(`S|${w}|${h}`, (w + h) * HTW + 8, (w + h) * HTH + 46, h * HTW + 4, 40, c => {
    isoPoly(c, [[0, 0, 0], [w, 0, 0], [w, h, 0], [0, h, 0]], '#b9a882');
    c.strokeStyle = '#8a6a42'; c.lineWidth = 1.6;
    for (const [x, y] of [[.1, .1], [w - .1, .1], [w - .1, h - .1], [.1, h - .1]]) { const a = ip(x, y, 0), b = ip(x, y, 30); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    for (const z of [10, 20, 30]) { c.beginPath(); [[.1, h - .1], [w - .1, h - .1], [w - .1, .1]].forEach((p, i) => { const q = ip(p[0], p[1], z); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.stroke(); }
  });
}
function settlementSprite() {
  return sprite('SETTLE', 4 * TW + 8, 4 * TH + 40, 4 * HTW + 4, 30, c => {
    isoPoly(c, [[.2, .2, 0], [3.8, .2, 0], [3.8, 3.8, 0], [.2, 3.8, 0]], 'rgba(210,190,140,.85)');
    isoPoly(c, [[.6, .6, 0], [3.4, .6, 0], [3.4, 3.4, 0], [.6, 3.4, 0]], 'rgba(160,150,130,.6)');
    for (const [x, y] of [[.4, .4], [3.6, .4], [3.6, 3.6], [.4, 3.6]]) isoBox(c, x - .15, y - .15, x + .15, y + .15, 0, 10 + (x + y) * 2, '#bdb39a');
    const [px, py] = ip(2, 2, 0); c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.beginPath(); c.ellipse(px, py, 34, 17, 0, 0, 7); c.stroke();
    c.fillStyle = '#ffffff'; c.font = '700 12px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('H', px, py);
  });
}
function rubbleSprite(w, h) {
  return sprite(`R|${w}|${h}`, (w + h) * HTW + 8, (w + h) * HTH + 20, h * HTW + 4, 14, c => {
    isoPoly(c, [[.1, .1, 0], [w - .1, .1, 0], [w - .1, h - .1, 0], [.1, h - .1, 0]], 'rgba(60,50,45,.65)');
    const r = mulberry32(w * 31 + h);
    for (let i = 0; i < w * h * 3; i++) { const x = .3 + r() * (w - .6), y = .3 + r() * (h - .6), s = .1 + r() * .18; isoBox(c, x - s, y - s, x + s, y + s, 0, 3 + r() * 6, r() < .5 ? '#8a8172' : '#6d655a'); }
  });
}

// ---------- trees and resources ----------
function treeSprite(biome, v) {
  const variant = Math.floor(v * 4);
  return sprite(`T|${biome}|${variant}`, 44, 74, 22, 66, c => {
    const s = .85 + (variant % 4) * .1;
    const shadow = () => { c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(5, 0, 14 * s, 5 * s, 0, 0, 7); c.fill(); };
    shadow();
    if (biome === 'namek') {
      c.strokeStyle = '#6a7a5a'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -34 * s); c.stroke();
      const g = c.createRadialGradient(-4, -44 * s, 2, 0, -40 * s, 14 * s); g.addColorStop(0, '#bff3ff'); g.addColorStop(.5, '#5fb8d8'); g.addColorStop(1, '#2f7a9e');
      c.fillStyle = g; c.beginPath(); c.arc(0, -40 * s, 12 * s, 0, 7); c.fill(); c.strokeStyle = 'rgba(20,40,60,.5)'; c.lineWidth = 1; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(-4 * s, -44 * s, 3 * s, 0, 7); c.fill();
    } else if (biome === 'wasteland') {
      if (variant % 2) { c.fillStyle = '#6a9a4a'; rrect(c, -3, -30 * s, 6, 30 * s, 3, '#6a9a4a'); rrect(c, -11, -22 * s, 5, 12 * s, 2.5, '#6a9a4a'); rrect(c, 6, -26 * s, 5, 12 * s, 2.5, '#5a8a3a'); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(-2, -28 * s, 1.5, 26 * s); }
      else { c.strokeStyle = '#6a4a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -26 * s); c.moveTo(0, -16 * s); c.lineTo(-9, -26 * s); c.moveTo(0, -20 * s); c.lineTo(8, -30 * s); c.stroke(); }
    } else if (biome === 'highlands' || variant % 2 === 0) {
      c.fillStyle = '#5a3a1e'; c.fillRect(-1.5, -8, 3, 8);
      const snow = biome === 'highlands';
      for (let i = 0; i < 3; i++) { const y = -8 - i * 11 * s, w2 = (13 - i * 3) * s; poly(c, [[-w2, y], [0, y - 18 * s], [w2, y]], i % 2 ? '#2d7044' : '#235f38'); if (snow) poly(c, [[-w2 * .5, y - 8 * s], [0, y - 18 * s], [w2 * .5, y - 8 * s]], '#f2f6fa', true); }
    } else {
      c.fillStyle = '#5a3a1e'; c.fillRect(-2, -14, 4, 14);
      for (const [x, y, r, col] of [[-6, -22, 9, '#2f7d3a'], [6, -24, 9, '#2a7034'], [0, -32, 10, '#3b8f4c'], [-2, -27, 7, '#4aa058']]) { c.fillStyle = col; c.beginPath(); c.arc(x * s, y * s, r * s, 0, 7); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.arc(-4 * s, -36 * s, 4 * s, 0, 7); c.fill();
      c.strokeStyle = 'rgba(20,40,20,.35)'; c.lineWidth = 1; c.beginPath(); c.arc(0, -28 * s, 14 * s, 0, 7); c.stroke();
    }
  });
}
function stumpSprite() { return sprite('STUMP', 20, 14, 10, 8, c => { blob(c, 0, 0, 5, 2.6, '#6a4a2a'); c.fillStyle = '#c9a26a'; c.beginPath(); c.ellipse(0, -1, 4, 2, 0, 0, 7); c.fill(); }); }
function goldSprite(biome) {
  return sprite(`GOLD|${biome}`, 140, 90, 70, 60, c => {
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(4, 4, 56, 24, 0, 0, 7); c.fill();
    const rock = biome === 'wasteland' ? '#a0714a' : biome === 'namek' ? '#7a8c88' : '#8a8172';
    for (const [x, y, r] of [[-30, -4, 16], [24, -2, 18], [-4, -10, 22], [8, 10, 14], [-18, 10, 12]]) blob(c, x, y, r, r * .7, shade(rock, (x % 3) * .05));
    for (const [x, y, s] of [[-10, -18, 1.2], [6, -22, 1.5], [20, -12, 1], [-24, -8, .9], [2, -4, 1.1], [14, 4, .8]]) {
      c.fillStyle = '#c98a12'; c.beginPath(); c.moveTo(x - 4 * s, y + 4 * s); c.lineTo(x, y - 12 * s); c.lineTo(x + 4 * s, y + 4 * s); c.closePath(); c.fill();
      c.fillStyle = '#ffe27a'; c.beginPath(); c.moveTo(x - 1.5 * s, y + 3 * s); c.lineTo(x, y - 12 * s); c.lineTo(x + 2.5 * s, y + 2 * s); c.closePath(); c.fill();
    }
  });
}
function berrySprite() { return sprite('BERRY', 34, 28, 17, 18, c => { c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(2, 2, 13, 5, 0, 0, 7); c.fill(); blob(c, 0, -5, 12, 9, '#2f7a34'); blob(c, -3, -8, 7, 5, '#4fa850'); c.fillStyle = '#c8f59a'; for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(-7 + i * 2.8, -4 + (i % 2 ? 2 : -2), 1.6, 2.4, .4, 0, 7); c.fill(); } }); }
function fishSprite(v) {
  return sprite('FISH' + (v > .5 ? 1 : 0), 44, 26, 22, 14, c => {
    c.fillStyle = 'rgba(20,50,80,.35)'; c.beginPath(); c.ellipse(0, 0, 14, 5, 0, 0, 7); c.fill();
    const col = v > .5 ? '#5a8fb0' : '#6aa38a';
    c.fillStyle = col; c.beginPath(); c.ellipse(-1, 0, 9, 3.4, 0, 0, 7); c.fill();
    c.beginPath(); c.moveTo(7, 0); c.lineTo(13, -4); c.lineTo(13, 4); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-4, -1, 3, 1, 0, 0, 7); c.fill();
  });
}
function carcassSprite() { return sprite('MEAT', 34, 22, 17, 12, c => { blob(c, 0, 0, 11, 5, '#8a4a2a', .2); c.strokeStyle = '#f2e6cf'; c.lineWidth = 2; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(i * 4, -4); c.lineTo(i * 4 + 1, 4); c.stroke(); } }); }
// Relic items, drawn around (0,0) at about 22 px.
const RELIC_ART = {
  powerpole: c => { limb(c, -9, 7, 9, -9, 3.2, '#d4141c'); for (const [x, y] of [[-9, 7], [9, -9]]) blob(c, x, y, 2.4, 2.4, '#ffd34d'); },
  zsword: c => { limb(c, -8, 8, 7, -7, 3, '#dfe6ee'); limb(c, -9, 3, -3, 9, 2.4, '#8a6a42'); blob(c, -8, 8, 1.8, 1.8, '#ffd34d'); },
  scouter: c => { rrect(c, -9, -4, 7, 9, 2, '#e8e8e8'); blob(c, 3, -1, 6, 5, 'rgba(90,220,120,.85)'); limb(c, -2, -4, 3, -7, 1.6, '#e8e8e8'); },
  radar: c => { blob(c, 0, 0, 9, 9, '#f2f2f2'); blob(c, 0, 0, 6.5, 6.5, '#3fae5a'); c.strokeStyle = 'rgba(200,255,200,.8)'; c.lineWidth = .8; for (const r of [2.5, 5]) { c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); } blob(c, 2, -2, 1.3, 1.3, '#ffcf3a'); blob(c, 0, -9, 2, 1.5, '#cfcfcf'); },
  nimbus: c => { for (const [x, y, r] of [[-6, 1, 5], [0, -2, 6.5], [6, 1, 5], [1, 3, 5]]) blob(c, x, y, r, r * .75, '#ffe066'); },
  senzu: c => { blob(c, 0, 2, 8, 7, '#a8763c'); limb(c, -3, -5, 3, -5, 2.4, '#7a4a20'); for (const [x, y] of [[-3, 0], [2, 1], [-1, 4]]) blob(c, x, y, 1.8, 2.4, '#8fe06f'); },
  goldcap: c => { rrect(c, -9, -4, 18, 8, 4, '#ffd34d'); c.fillStyle = '#c98a12'; c.fillRect(-1, -4, 2, 8); blob(c, -5, -1.5, 1.4, 1, 'rgba(255,255,255,.8)'); },
  fan: c => { poly(c, [[0, 8], [-10, -6], [-4, -10], [4, -10], [10, -6]], '#4fa850'); limb(c, 0, 8, 0, 11, 2.2, '#8a6a42'); c.strokeStyle = '#2f7a34'; c.lineWidth = 1; for (const a of [-.7, -.25, .25, .7]) { c.beginPath(); c.moveTo(0, 8); c.lineTo(Math.sin(a) * 11, 8 - Math.cos(a) * 17); c.stroke(); } },
  jar: c => { rrect(c, -7, -5, 14, 13, 4, '#f2f2f2'); rrect(c, -8, -8, 16, 4, 2, '#5b7fbf'); blob(c, 0, -9, 2.5, 1.5, '#3e5f9a'); c.fillStyle = '#d4141c'; c.fillRect(-4, 0, 8, 3); },
  shard: c => { poly(c, [[-9, -3], [0, -8], [9, -3], [7, 6], [-7, 6]], '#f2f2f2'); poly(c, [[-9, -3], [0, -8], [9, -3], [0, -1]], '#ffd34d'); },
  flask: c => { rrect(c, -2.5, -10, 5, 5, 1.5, '#d9e8f2'); blob(c, 0, 2, 7, 7, 'rgba(110,190,255,.9)'); blob(c, -2, 0, 2, 1.5, 'rgba(255,255,255,.8)'); },
  shell: c => { blob(c, 0, 1, 10, 7.5, '#3f8f3a'); c.strokeStyle = '#2b5f28'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-6, -3); c.lineTo(6, 5); c.moveTo(6, -3); c.lineTo(-6, 5); c.stroke(); blob(c, 0, 1, 3.5, 2.6, '#6fbf4a'); },
};
function relicSprite(key) {
  return sprite('RELIC|' + key, 40, 40, 20, 26, c => {
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(0, 10, 11, 4, 0, 0, 7); c.fill();
    RELIC_ART[key](c);
  });
}
function relicIcon(key, size) {
  size = size || 40;
  return iconCanvas('R' + key, size, c => {
    const g = c.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size * .6); g.addColorStop(0, '#5b3f8a'); g.addColorStop(1, '#1d1430'); c.fillStyle = g; c.fillRect(0, 0, size, size);
    c.save(); c.translate(size / 2, size / 2 + 1); c.scale(size / 30, size / 30); RELIC_ART[key](c); c.restore();
  });
}
function sealedBallSprite(open) {
  return sprite('SEAL' + (open ? 1 : 0), 90, 90, 45, 70, c => {
    c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(0, 0, 34, 14, 0, 0, 7); c.fill();
    const g = c.createRadialGradient(-10, -42, 4, 0, -30, 34); g.addColorStop(0, open ? '#6d5a52' : '#ffd0ea'); g.addColorStop(1, open ? '#2e2420' : '#b24a8a');
    c.fillStyle = g; c.beginPath(); c.arc(0, -30, 30, 0, 7); c.fill(); c.strokeStyle = 'rgba(60,10,40,.6)'; c.lineWidth = 2; c.stroke();
    if (open) { c.strokeStyle = '#1b1110'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-16, -46); c.lineTo(-2, -30); c.lineTo(-10, -14); c.moveTo(8, -50); c.lineTo(4, -28); c.stroke(); }
    else { c.font = '400 30px Bangers, Impact, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#5a0c37'; c.fillText('M', 0, -20); }
  });
}

// ---------- icons and portraits (for the HUD) ----------
const CLASS_BG = { cart: ['#4a4a2a', '#22220c'], ship: ['#1a4a5a', '#0c222a'], villager: ['#2f4a2a', '#1b2a18'], infantry: ['#5a2a1a', '#2a140c'], ranged: ['#1a3a5a', '#0c1a2a'], cavalry: ['#4a3a1a', '#24180a'], siege: ['#3a3a3a', '#1a1a1a'], myth: ['#3a1a5a', '#1a0c2a'], hero: ['#6a4a0a', '#2a1a04'], titan: ['#5a1a3a', '#2a0c1a'], guard: ['#3a3a1a', '#1a1a0c'], huntable: ['#3a3a1a', '#1a1a0c'] };
function iconCanvas(key, size, draw) {
  return sprite('I|' + key + '|' + size, size, size, 0, 0, draw);
}
function unitIcon(key, form, pc, size) {
  size = size || 52;
  return iconCanvas(`U${key}|${form || ''}|${pc}`, size, c => {
    const d = U[key], L = form ? FORMS[form].look : d.look || {};
    const bg = CLASS_BG[d.cls] || CLASS_BG.villager;
    const g = c.createLinearGradient(0, 0, 0, size); g.addColorStop(0, bg[0]); g.addColorStop(1, bg[1]); c.fillStyle = g; c.fillRect(0, 0, size, size);
    const [w, h, ax, ay] = figureBox(L);
    const big = L.r === 'ship' ? .72 : L.r === 'ape' ? .45 : L.r === 'vehicle' ? 1.15 : L.r === 'mech' && L.kind === 'pirate' ? .6 : 1.25 / (L.scale || 1);
    c.save(); c.translate(size / 2 + (L.r === 'vehicle' || L.r === 'ship' ? -2 : -2), size * (L.r === 'ship' ? .74 : L.r === 'vehicle' ? .74 : .98)); c.scale(big * size / 52, big * size / 52);
    drawFigure(c, L, 'idle', 0, pc); c.restore();
  });
}
function portrait(key, form, pc, size) {
  size = size || 96;
  return iconCanvas(`P${key}|${form || ''}|${pc}`, size, c => {
    const d = U[key] || {}, L = form ? FORMS[form].look : (d.look || {});
    const bg = CLASS_BG[d.cls] || CLASS_BG.villager;
    const g = c.createRadialGradient(size * .5, size * .35, 4, size * .5, size * .5, size * .75); g.addColorStop(0, shade(bg[0], .15)); g.addColorStop(1, bg[1]); c.fillStyle = g; c.fillRect(0, 0, size, size);
    const zoom = L.r === 'ship' ? 1.5 : L.r === 'ape' ? 1.3 : L.r === 'vehicle' ? 2.2 : L.r === 'mech' ? 2 : L.r === 'beast' ? 2.4 : 3.2 / (L.scale || 1);
    c.save(); c.translate(size * .44, size * (L.r === 'ship' ? .72 : L.r === 'vehicle' ? .85 : L.r === 'beast' ? .9 : 1.42)); c.scale(zoom * size / 96, zoom * size / 96);
    drawFigure(c, L, 'idle', 0, pc); c.restore();
  });
}
const PATRON_LOOKS = {
  kami: { r: 'human', skin: '#6fbf4a', hair: 'none', antenna: true, top: '#f4f4f4', pants: '#f4f4f4', belt: '#6a3aa0', beard: '#f2f2f2', keepColors: true },
  roshi: { r: 'human', skin: '#f2c9a0', hair: 'bald', top: '#ff8a1e', pants: '#ff8a1e', belt: '#2f6fd0', beard: '#f4f4f4', shades: true, keepColors: true },
  piccolo: U.piccolo.look, bulma: { r: 'human', skin: '#f6d2b0', hair: 'bob', hairC: '#4fc3d8', top: '#f06a9a', pants: '#2a3a7a', belt: '#222', keepColors: true },
  dende: { r: 'human', skin: '#6fbf4a', hair: 'none', antenna: true, top: '#f4f4f4', pants: '#f4f4f4', belt: '#ff8a1e', build: 'slim', keepColors: true },
  kingkai: { r: 'human', skin: '#3c7ad8', hair: 'none', antenna: true, top: '#1b1b2b', pants: '#1b1b2b', belt: '#f4f4f4', shades: true, keepColors: true },
  supremekai: { r: 'human', skin: '#b58ae0', hair: 'mohawk', hairC: '#f4f4f4', top: '#3a2a6a', pants: '#3a2a6a', belt: '#ffcc33', keepColors: true },
  elderkai: { r: 'human', skin: '#b58ae0', hair: 'white', top: '#d33a3a', pants: '#3a2a6a', belt: '#ffcc33', beard: '#f4f4f4', keepColors: true },
  gero: { r: 'human', skin: '#f2c9a0', hair: 'white', top: '#e8e8e8', pants: '#3a3a3a', belt: '#222', mustache: true, hairC: '#f4f4f4', keepColors: true },
  red: { r: 'human', skin: '#f2c9a0', hair: 'spiky', hairC: '#d33a3a', top: '#5b6b52', pants: '#3d4a36', belt: '#d33a3a', keepColors: true },
  blue: U.blue.look, silver: { r: 'human', skin: '#f2c9a0', hair: 'short', hairC: '#c8c8c8', top: '#5b6b52', pants: '#3d4a36', belt: '#c8c8c8', shades: true, keepColors: true },
  a16: { r: 'human', skin: '#f2c9a0', hair: 'mohawk', hairC: '#ff7a2a', top: '#2f8f4a', pants: '#3a3a3a', belt: '#222', build: 'bulky', keepColors: true },
  cellp: FORMS.cell_perfect.look, a13: { r: 'human', skin: '#f2c9a0', hair: 'cap', hairC: '#f4f4f4', top: '#d0a020', pants: '#2a3a7a', belt: '#222', keepColors: true },
  frieza: FORMS.frieza_base.look, kingvegeta: { r: 'human', skin: '#e8b88f', hair: 'vegeta', hairC: '#151515', beard: '#151515', top: '#2b2b52', pants: '#2b2b52', armor: { chest: '#f4f4f4', pad: '#d9b44a' }, cape: '#c01a3a', keepColors: true },
  nappa: U.nappa.look, dodoria: { r: 'brute' }, ginyu: { r: 'human', skin: '#a77de0', hair: 'none', horns: true, top: '#1b1b2b', pants: '#1b1b2b', armor: { chest: '#f4f4f4', pad: '#ffcc33' }, scouter: true, keepColors: true },
  zarbon: { r: 'human', skin: '#7fc8a0', hair: 'long', hairC: '#2f8f4a', top: '#1b1b2b', pants: '#1b1b2b', armor: { chest: '#f4f4f4', pad: '#d9b44a' }, cape: '#ffd84a', keepColors: true },
  kingcold: { r: 'frieza', form: 'base' }, cooler: { r: 'frieza', form: 'final' },
};
function patronPortrait(key, size) {
  size = size || 96;
  return iconCanvas('PAT' + key + '|' + size, size, c => {
    const g = c.createRadialGradient(size * .5, size * .35, 4, size * .5, size * .5, size * .75); g.addColorStop(0, '#5a4a1a'); g.addColorStop(1, '#1a1206'); c.fillStyle = g; c.fillRect(0, 0, size, size);
    const L = PATRON_LOOKS[PATRONS[key].look] || PATRON_LOOKS[key] || {};
    const zoom = L.r === 'brute' ? 1.8 : 3.2;
    c.save(); c.translate(size * .44, size * (L.r === 'brute' ? 1.05 : 1.42)); c.scale(zoom * size / 96, zoom * size / 96); drawFigure(c, L, 'idle', 0, null); c.restore();
  });
}
function buildingIcon(key, fac, pc, size) {
  size = size || 52;
  return iconCanvas(`B${key}|${fac}|${pc}`, size, c => {
    const g = c.createLinearGradient(0, 0, 0, size); g.addColorStop(0, '#24365e'); g.addColorStop(1, '#101a30'); c.fillStyle = g; c.fillRect(0, 0, size, size);
    const s = buildingSprite(key, fac, pc), d = B[key];
    const fit = Math.min((size - 4) / s.w, (size - 4) / s.h) * (key === 'wall' || key === 'gate' ? .8 : 1);
    c.drawImage(s.c, (size - s.w * fit) / 2, (size - s.h * fit) / 2 + 1, s.w * fit, s.h * fit);
    if (['barracks', 'stable', 'fortress'].includes(key)) {
      // crossed swords badge: tells military buildings apart from look-alike economy ones
      const r = size * .15, x = r + 2, y = size - r - 2;
      c.fillStyle = '#7a1d1d'; c.strokeStyle = '#ffd34d'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
      limb(c, x - r * .55, y + r * .55, x + r * .55, y - r * .55, 1.6, '#e8eef7'); limb(c, x + r * .55, y + r * .55, x - r * .55, y - r * .55, 1.6, '#e8eef7');
    }
  });
}
const TECH_GLYPH = {
  hunt: (c) => { limb(c, 14, 38, 38, 14, 3, '#c9a26a'); poly(c, [[38, 14], [42, 10], [40, 18]], '#ddd'); },
  farm: (c) => { for (let i = 0; i < 4; i++) limb(c, 12 + i * 8, 40, 12 + i * 8, 22, 3, '#6fc85a'); c.fillStyle = '#ffd34d'; c.beginPath(); c.arc(38, 14, 6, 0, 7); c.fill(); },
  wood: (c) => { rrect(c, 10, 22, 30, 12, 6, '#b9874b'); blob(c, 40, 28, 6, 6, '#e7c48d'); },
  gold: (c) => { blob(c, 26, 28, 13, 13, '#ffc83d'); c.fillStyle = '#8a5a00'; c.font = '700 14px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Z', 26, 29); },
  cart: (c) => { rrect(c, 10, 18, 32, 16, 3, '#9aa0aa'); blob(c, 16, 38, 4, 4, '#333'); blob(c, 36, 38, 4, 4, '#333'); c.fillStyle = 'rgba(120,220,255,.5)'; c.fillRect(10, 40, 32, 3); },
  tower: (c) => { rrect(c, 18, 12, 16, 30, 3, '#ece6d6'); blob(c, 26, 12, 6, 6, '#7fe0ff'); },
  sword: (c) => { limb(c, 14, 40, 38, 14, 4, '#dfe7f2'); limb(c, 12, 32, 22, 42, 3, '#a07a2a'); },
  shield: (c) => { poly(c, [[26, 10], [40, 16], [38, 32], [26, 42], [14, 32], [12, 16]], '#9aa0aa'); poly(c, [[26, 16], [34, 20], [33, 30], [26, 36], [19, 30], [18, 20]], '#5d636e'); },
  inf: (c) => drawHuman(c, U.fighter.look, 'atk', 1, null),
  rng: (c) => drawHuman(c, U.gunner.look, 'shoot', 1, null),
  cav: (c) => drawVehicle(c, U.rider.look, 'idle', 0, null),
  siege: (c) => drawVehicle(c, U.cannon.look, 'idle', 0, null),
  ssj: (c) => { const g = c.createRadialGradient(26, 26, 2, 26, 26, 22); g.addColorStop(0, '#fff7c2'); g.addColorStop(.5, '#ffd84a'); g.addColorStop(1, 'rgba(255,200,40,0)'); c.fillStyle = g; c.beginPath(); c.arc(26, 26, 22, 0, 7); c.fill(); spikes(c, 26, 32, [[-2.4, 18, 4], [-1.6, 20, 4], [-.8, 18, 4]], '#ffd84a'); },
  cell: (c) => drawCell(c, { form: 'imperfect' }, 'idle', 0, null),
  buu: (c) => drawBuu(c, 'idle', 0),
  heal: (c) => { c.fillStyle = '#46d98a'; c.fillRect(21, 10, 10, 32); c.fillRect(10, 21, 32, 10); },
  ki: (c) => { poly(c, [[26, 6], [38, 26], [32, 42], [20, 42], [14, 26]], '#62d0ff'); },
};
function techIcon(key, size) {
  size = size || 52;
  return iconCanvas('TE' + key, size, c => {
    const T = TECH[key];
    const g = c.createLinearGradient(0, 0, 0, size); g.addColorStop(0, T.ageUp ? '#6a3a0a' : '#2a3a2a'); g.addColorStop(1, T.ageUp ? '#2a1404' : '#101a10'); c.fillStyle = g; c.fillRect(0, 0, size, size);
    c.save(); c.scale(size / 52, size / 52);
    const glyph = T.icon && TECH_GLYPH[T.icon];
    if (glyph) { if (['inf', 'rng', 'cell', 'buu'].includes(T.icon)) { c.translate(24, 50); c.scale(1.2, 1.2); } else if (['cav', 'siege'].includes(T.icon)) { c.translate(26, 40); c.scale(1.2, 1.2); } glyph(c); }
    else { c.fillStyle = '#ffd34d'; c.font = '400 26px Bangers, Impact'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(T.ageUp ? AGE_SHORT[T.ageUp] : '?', 26, 28); }
    c.restore();
  });
}
function powerIcon(key, size) {
  size = size || 56;
  return iconCanvas('PW' + key, size, c => {
    const pw = POW[key], col = pw.color || '#ffd34d';
    const g = c.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2); g.addColorStop(0, shade(col, .55)); g.addColorStop(.55, col); g.addColorStop(1, shade(col, -.6)); c.fillStyle = g; c.fillRect(0, 0, size, size);
    c.save(); c.translate(size / 2, size / 2); c.scale(size / 56, size / 56);
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.fillStyle = 'rgba(255,255,255,.92)'; c.lineWidth = 3;
    switch (pw.type) {
      case 'strike': c.beginPath(); c.arc(0, 0, 12, 0, 7); c.fill(); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; c.beginPath(); c.moveTo(Math.cos(a) * 15, Math.sin(a) * 15); c.lineTo(Math.cos(a) * 22, Math.sin(a) * 22); c.stroke(); } break;
      case 'line': case 'bombs': c.beginPath(); c.moveTo(-20, 12); c.lineTo(20, -12); c.lineWidth = 7; c.stroke(); break;
      case 'bolt': c.beginPath(); c.moveTo(-18, -18); c.lineTo(18, 18); c.lineWidth = 4; c.stroke(); c.beginPath(); c.arc(18, 18, 4, 0, 7); c.fill(); break;
      case 'heal': case 'globalHeal': case 'repair': c.fillRect(-5, -16, 10, 32); c.fillRect(-16, -5, 32, 10); break;
      case 'buff': case 'heroBuff': c.beginPath(); c.moveTo(0, -20); c.lineTo(12, 0); c.lineTo(4, 0); c.lineTo(8, 20); c.lineTo(-12, -2); c.lineTo(-3, -2); c.closePath(); c.fill(); break;
      case 'summon': for (let i = -1; i <= 1; i++) { c.beginPath(); c.arc(i * 12, 4, 6, 0, 7); c.fill(); c.fillRect(i * 12 - 4, 10, 8, 8); } break;
      case 'stun': c.beginPath(); c.arc(0, 0, 16, 0, 7); c.stroke(); c.beginPath(); c.arc(0, 0, 8, 0, 7); c.stroke(); c.beginPath(); c.arc(0, 0, 2.5, 0, 7); c.fill(); break;
      case 'grant': c.beginPath(); c.arc(0, 0, 14, 0, 7); c.fill(); c.fillStyle = shade(col, -.5); c.font = '700 16px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Z', 0, 1); break;
      case 'drain': c.beginPath(); for (let i = 0; i < 3; i++) { c.moveTo(-18 + i * 4, -18 + i * 4); c.quadraticCurveTo(0, -8 + i * 6, 18 - i * 4, -18 + i * 4); } c.stroke(); c.beginPath(); c.arc(0, 10, 8, 0, 7); c.fill(); break;
      case 'apes': c.beginPath(); c.arc(0, 0, 16, 0, 7); c.fill(); c.fillStyle = shade(col, -.3); c.beginPath(); c.arc(5, -4, 4, 0, 7); c.arc(-6, 5, 3, 0, 7); c.fill(); break;
      case 'convert': c.beginPath(); c.arc(-7, 0, 9, 0, 7); c.stroke(); c.beginPath(); c.arc(7, 0, 9, 0, 7); c.stroke(); break;
      case 'shenron': c.lineWidth = 5; c.beginPath(); c.moveTo(-20, 14); c.bezierCurveTo(-10, -20, 10, 20, 20, -14); c.stroke(); c.beginPath(); c.arc(20, -14, 5, 0, 7); c.fill(); break;
    }
    c.restore();
  });
}
const CMD_GLYPH = {
  empower: c => { for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; limb(c, 26 + Math.cos(a) * 8, 26 + Math.sin(a) * 8, 26 + Math.cos(a) * 16, 26 + Math.sin(a) * 16, 2.4, '#ffd34d'); } blob(c, 26, 26, 7, 7, '#fff2b0'); },
  trade: c => { limb(c, 10, 30, 42, 30, 3, '#dfe7f2'); poly(c, [[42, 24], [48, 30], [42, 36]], '#dfe7f2'); poly(c, [[10, 16], [4, 22], [10, 28]], '#ffd34d'); limb(c, 10, 22, 40, 22, 3, '#ffd34d'); },
  stance_aggressive: c => { limb(c, 12, 40, 34, 14, 3.4, '#dfe7f2'); limb(c, 40, 40, 18, 14, 3.4, '#dfe7f2'); blob(c, 26, 26, 4, 4, '#ff5a5f'); },
  stance_defensive: c => { poly(c, [[26, 8], [42, 14], [40, 30], [26, 44], [12, 30], [10, 14]], '#5b8fd8'); poly(c, [[26, 14], [36, 18], [34, 29], [26, 38]], '#9fc4ff', true); },
  stance_ground: c => { limb(c, 26, 10, 26, 36, 3.4, '#dfe7f2'); limb(c, 18, 18, 34, 18, 3, '#a07a2a'); c.fillStyle = '#8a6a42'; c.fillRect(10, 38, 32, 5); },
  stance_passive: c => { blob(c, 26, 26, 14, 14, 'rgba(0,0,0,0)'); c.strokeStyle = '#ffd34d'; c.lineWidth = 3; c.beginPath(); c.arc(26, 26, 13, 0, 7); c.stroke(); limb(c, 16, 16, 36, 36, 3, '#ff5a5f'); },
  stop: c => { c.fillStyle = '#ff5a5f'; c.fillRect(16, 16, 20, 20); },
  amove: c => { limb(c, 12, 40, 36, 16, 3, '#dfe7f2'); poly(c, [[36, 12], [42, 10], [40, 18]], '#ff5a5f'); },
  garrison: c => { poly(c, [[10, 26], [26, 12], [42, 26], [42, 42], [10, 42]], '#9aa0aa'); c.fillStyle = '#2a2d33'; c.fillRect(22, 30, 8, 12); },
  ungarrison: c => { poly(c, [[10, 26], [26, 12], [42, 26], [42, 42], [10, 42]], '#9aa0aa'); limb(c, 26, 36, 44, 36, 3, '#46d98a'); },
  delete: c => { limb(c, 14, 14, 38, 38, 5, '#ff5a5f'); limb(c, 38, 14, 14, 38, 5, '#ff5a5f'); },
  fly: c => { c.fillStyle = 'rgba(255,214,90,.95)'; c.beginPath(); c.ellipse(26, 36, 16, 5, 0, 0, 7); c.fill(); poly(c, [[26, 8], [34, 22], [29, 22], [29, 32], [23, 32], [23, 22], [18, 22]], '#7fe0ff'); },
  land: c => { c.fillStyle = '#6fbf4a'; c.fillRect(8, 38, 36, 6); poly(c, [[26, 34], [34, 20], [29, 20], [29, 10], [23, 10], [23, 20], [18, 20]], '#7fe0ff'); },
  kaioken: c => { const g = c.createRadialGradient(26, 26, 2, 26, 26, 22); g.addColorStop(0, '#ffd0d0'); g.addColorStop(.5, '#ff4d4d'); g.addColorStop(1, 'rgba(255,60,60,0)'); c.fillStyle = g; c.beginPath(); c.arc(26, 26, 22, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = '700 13px Arial'; c.textAlign = 'center'; c.fillText('×2', 26, 31); },
  dropball: c => { const g = c.createRadialGradient(22, 22, 2, 26, 26, 14); g.addColorStop(0, '#fff2b0'); g.addColorStop(1, '#d9650b'); c.fillStyle = g; c.beginPath(); c.arc(26, 26, 13, 0, 7); c.fill(); c.fillStyle = '#d4141c'; starShape(c, 26, 26, 5); },
  meditate: c => { blob(c, 26, 20, 7, 7, '#f2c9a0'); poly(c, [[12, 40], [26, 28], [40, 40]], '#ff8a1e'); c.strokeStyle = '#62d0ff'; c.lineWidth = 2; c.beginPath(); c.arc(26, 28, 18, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); },
  market: c => { blob(c, 18, 26, 9, 9, '#ffc83d'); poly(c, [[30, 16], [44, 26], [30, 36]], '#46d98a'); },
  sell: c => { blob(c, 34, 26, 9, 9, '#ffc83d'); poly(c, [[22, 16], [8, 26], [22, 36]], '#ff5a5f'); },
  cancel: c => { limb(c, 16, 16, 36, 36, 4, '#ffd34d'); limb(c, 36, 16, 16, 36, 4, '#ffd34d'); },
  back: c => { poly(c, [[34, 12], [16, 26], [34, 40]], '#dfe7f2'); },
  build: c => { limb(c, 14, 40, 32, 22, 4, '#8a6a42'); rrect(c, 26, 10, 18, 10, 2, '#9aa0aa'); },
  buildmil: c => { limb(c, 14, 40, 32, 22, 4, '#8a6a42'); rrect(c, 26, 10, 18, 10, 2, '#9aa0aa'); limb(c, 34, 34, 44, 44, 3, '#ff5a5f'); },
  repair: c => { limb(c, 14, 40, 36, 18, 5, '#9aa0aa'); blob(c, 38, 15, 6, 6, '#9aa0aa'); c.fillStyle = '#46d98a'; c.fillRect(8, 8, 4, 12); c.fillRect(4, 12, 12, 4); },
};
function starShape(c, x, y, r) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
function cmdIcon(key, size) {
  size = size || 52;
  return iconCanvas('C' + key, size, c => {
    const g = c.createLinearGradient(0, 0, 0, size); g.addColorStop(0, '#2a3a62'); g.addColorStop(1, '#111b34'); c.fillStyle = g; c.fillRect(0, 0, size, size);
    c.save(); c.scale(size / 52, size / 52); (CMD_GLYPH[key] || (() => {}))(c); c.restore();
  });
}
