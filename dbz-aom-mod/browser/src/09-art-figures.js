// =====================================================================
// 9. ART: colors, sprite cache, animated characters (all procedural)
// =====================================================================
const SR = 2;                       // sprites are rendered at 2× for crisp zooming
const OUTLINE = 'rgba(22,14,28,.9)';
const _rgb = {};
function hexRgb(h) {
  if (_rgb[h]) return _rgb[h];
  if (h[0] !== '#') { const m = h.match(/[\d.]+/g); return (_rgb[h] = [+m[0], +m[1], +m[2]]); }
  let s = h.replace('#', ''); if (s.length === 3) s = s.split('').map(c => c + c).join('');
  return (_rgb[h] = [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]);
}
function shade(h, f) {
  const [r, g, b] = hexRgb(h);
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  return `rgb(${Math.round(r + (t - r) * p)},${Math.round(g + (t - g) * p)},${Math.round(b + (t - b) * p)})`;
}
function mix(a, b, t) { const A = hexRgb(a), B2 = hexRgb(b); return `rgb(${Math.round(A[0] + (B2[0] - A[0]) * t)},${Math.round(A[1] + (B2[1] - A[1]) * t)},${Math.round(A[2] + (B2[2] - A[2]) * t)})`; }
function rgba(h, a) { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; }
const pcol = (i, k) => (PCOL[i] || PCOL[0])[k || 'main'];

const SPR = new Map();
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
// Cached sprite: draw(ctx) works in local px with the anchor at (ax, ay).
function sprite(key, w, h, ax, ay, draw) {
  let s = SPR.get(key);
  if (s) return s;
  const c = makeCanvas(w * SR, h * SR), x = c.getContext('2d');
  x.scale(SR, SR); x.translate(ax, ay); x.lineJoin = 'round'; x.lineCap = 'round';
  draw(x);
  s = { c, ax, ay, w, h };
  SPR.set(key, s);
  if (SPR.size > 2600) { const it = SPR.keys(); for (let i = 0; i < 400; i++) SPR.delete(it.next().value); }
  return s;
}

// ---------- primitive helpers ----------
function limb(c, x1, y1, x2, y2, w, col) {
  c.strokeStyle = OUTLINE; c.lineWidth = w + 2; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
}
function blob(c, x, y, rx, ry, col, rot) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, 7); c.fill(); c.strokeStyle = OUTLINE; c.lineWidth = 1.2; c.stroke(); }
function poly(c, pts, col, noStroke) { c.fillStyle = col; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); if (!noStroke) { c.strokeStyle = OUTLINE; c.lineWidth = 1.2; c.stroke(); } }
function rrect(c, x, y, w, h, r, col, stroke) { c.fillStyle = col; c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); c.fill(); if (stroke !== false) { c.strokeStyle = OUTLINE; c.lineWidth = 1.2; c.stroke(); } }

// ---------- pose maths ----------
const POSE_FRAMES = { idle: 2, walk: 6, atk: 3, shoot: 2, work: 4, build: 4, cast: 2, fly: 2, dead: 1 };
function poseParams(pose, f) {
  const p = { legA: 0, legB: 0, armA: 0, armB: 0, bob: 0, lean: 0, reach: 0, raise: 0, tool: 0, glow: 0 };
  if (pose === 'walk') { const ph = f / 6 * Math.PI * 2; p.legA = Math.sin(ph) * 4.2; p.legB = -p.legA; p.armA = -Math.sin(ph) * 3.5; p.armB = -p.armA; p.bob = Math.abs(Math.sin(ph)) * 1.2; }
  else if (pose === 'idle') p.bob = f ? .6 : 0;
  else if (pose === 'atk') { p.reach = [3, 11, 6][f]; p.lean = [0, 3, 1][f]; p.legA = 2; p.legB = -2; }
  else if (pose === 'shoot') { p.reach = 10; p.glow = f ? 1 : .6; p.legA = 1.5; p.legB = -1.5; }
  else if (pose === 'work' || pose === 'build') { p.tool = [-1.2, -.4, .7, .2][f]; p.lean = [0, 1, 2.5, 1][f]; p.legA = 1.5; p.legB = -1.5; }
  else if (pose === 'cast') { p.raise = 1; p.glow = f ? 1 : .7; }
  else if (pose === 'fly') { p.lean = 6; p.legA = -3; p.legB = -5; p.armA = -3; p.armB = -5; p.bob = f ? 1 : 0; }
  return p;
}

// ---------- humanoid ----------
function drawHuman(c, L, pose, f, pc) {
  const P = poseParams(pose, f);
  const bulk = L.build === 'bulky' ? 1.35 : L.build === 'slim' ? .85 : 1, tall = L.build === 'tall' ? 1.12 : 1;
  const skin = L.skin || '#f2c9a0', top = L.top || '#888', pants = L.pants || top, boots = L.boots || '#333';
  const team = pc != null ? pcol(pc) : (L.belt || '#333');
  const belt = L.keepColors ? (L.belt || team) : team, band = L.keepColors ? (L.band || L.belt || team) : team;
  const hipY = -13 * tall - P.bob, shY = -24 * tall - P.bob, headY = -31.5 * tall - P.bob, hr = 6.6;
  const lean = P.lean;
  if (L.ghost) c.globalAlpha = .82;
  // cape and tail behind
  if (L.cape) poly(c, [[-3 + lean * .5, shY + 1], [3 + lean * .5, shY + 1], [-3 + lean * .2, -2], [-10, -1]], L.cape);
  if (L.tail) { c.strokeStyle = OUTLINE; c.lineWidth = 4; c.beginPath(); c.moveTo(-3, hipY + 2); c.quadraticCurveTo(-12, hipY + 4, -10, hipY - 6); c.stroke(); c.strokeStyle = '#7a4a22'; c.lineWidth = 2.4; c.stroke(); }
  // back arm and back leg
  const shX = 4 * bulk, armL = 10 * tall;
  const backHand = P.raise ? [lean + 2 + 6, shY - 6] : [-shX * .6 + P.armB + lean * .4, shY + armL];
  limb(c, -shX * .6 + lean * .6, shY + 1.5, backHand[0], backHand[1], 3.6 * bulk, shade(L.armC || top, -.18));
  blob(c, backHand[0], backHand[1], 2.1 * bulk, 2.1 * bulk, shade(skin, -.12));
  limb(c, -2 * bulk + lean * .2, hipY, -2 * bulk + P.legB, -2.5, 4.4 * bulk, shade(pants, -.18));
  blob(c, -2 * bulk + P.legB + 1, -1.2, 3.2 * bulk, 1.9, shade(boots, -.15));
  // torso
  const tw = 10.5 * bulk;
  rrect(c, -tw / 2 + lean * .5, shY, tw, hipY - shY + 2, 3.5, top);
  if (L.top2) poly(c, [[lean * .5 - 1.8, shY], [lean * .5 + 3, shY], [lean * .5 + .6, shY + 5]], L.top2, true);
  if (L.vest) rrect(c, -tw / 2 + lean * .5 + 1, shY + 1, tw - 2, hipY - shY - 1, 2.5, L.vest);
  if (L.armor) {
    rrect(c, -tw / 2 + lean * .5 - .5, shY + 1, tw + 1, (hipY - shY) * .78, 3, L.armor.chest);
    blob(c, -tw / 2 + lean * .5, shY + 1.4, 3.2, 2.6, pc != null && !L.keepColors ? team : L.armor.pad);
    blob(c, tw / 2 + lean * .5, shY + 1.4, 3.2, 2.6, pc != null && !L.keepColors ? team : L.armor.pad);
  }
  c.fillStyle = belt; c.fillRect(-tw / 2 + lean * .5, hipY - 1.5, tw, 2.6);
  if (L.scarf) poly(c, [[lean * .5 - 3, shY - 1], [lean * .5 + 4, shY - 1], [lean * .5 + 1, shY + 3]], L.scarf);
  // front leg
  limb(c, 2 * bulk + lean * .2, hipY, 2 * bulk + P.legA, -2.5, 4.6 * bulk, pants);
  blob(c, 2 * bulk + P.legA + 1.2, -1.2, 3.3 * bulk, 2, boots);
  // head
  const hx = lean * .9 + .5, hy = headY;
  if (L.hair === 'raditz' || L.hair === 'ssj3' || L.hair === 'long') drawHairBack(c, L, hx, hy, hr);
  if (L.antenna) { c.strokeStyle = OUTLINE; c.lineWidth = 1.8; c.beginPath(); c.moveTo(hx + 1, hy - hr + 1); c.quadraticCurveTo(hx + 1, hy - hr - 6, hx + 4, hy - hr - 7); c.moveTo(hx - 1.5, hy - hr + 1); c.quadraticCurveTo(hx - 3, hy - hr - 5, hx - 1, hy - hr - 7.5); c.stroke(); blob(c, hx + 4.2, hy - hr - 7.2, 1.3, 1.3, skin); blob(c, hx - 1, hy - hr - 7.7, 1.3, 1.3, skin); }
  blob(c, hx, hy, hr, hr * 1.02, skin);
  if (L.horns) { poly(c, [[hx - 4, hy - 5], [hx - 6, hy - 11], [hx - 2, hy - 6]], '#f4f4f4'); poly(c, [[hx + 2, hy - 6], [hx + 4, hy - 12], [hx + 5, hy - 5]], '#f4f4f4'); }
  // face (facing right)
  c.fillStyle = L.eyes || '#151020';
  c.beginPath(); c.ellipse(hx + 2.6, hy + .2, 1, 1.5, 0, 0, 7); c.ellipse(hx + 5.3, hy + .2, .8, 1.4, 0, 0, 7); c.fill();
  if (!L.nobrows) { c.strokeStyle = shade(L.hairC || '#222', -.2); c.lineWidth = 1.1; c.beginPath(); c.moveTo(hx + 1.2, hy - 2.6); c.lineTo(hx + 3.8, hy - 1.7); c.moveTo(hx + 4.6, hy - 1.9); c.lineTo(hx + 6.2, hy - 2.6); c.stroke(); }
  c.strokeStyle = shade(skin, -.45); c.lineWidth = .9; c.beginPath(); c.moveTo(hx + 3.2, hy + 3.3); c.lineTo(hx + 5, hy + 3); c.stroke();
  if (L.mustache) { c.fillStyle = L.hairC || '#111'; c.beginPath(); c.ellipse(hx + 4, hy + 2.6, 2.6, .9, 0, 0, 7); c.fill(); }
  if (L.beard) { c.fillStyle = L.beard; c.beginPath(); c.moveTo(hx - 2, hy + 2); c.quadraticCurveTo(hx + 2, hy + 12, hx + 6, hy + 2); c.fill(); }
  if (L.dots) { c.fillStyle = '#7a4a22'; for (let i = 0; i < 6; i++) c.fillRect(hx - 2 + (i % 3) * 2, hy - 5.2 - Math.floor(i / 3) * 1.5, .9, .9); }
  if (L.shades) { c.fillStyle = '#111'; c.fillRect(hx + 1, hy - 1.4, 6, 2.6); }
  drawHair(c, L, hx, hy, hr);
  if (L.scouter) { c.fillStyle = 'rgba(80,255,120,.75)'; c.beginPath(); c.ellipse(hx + 4.6, hy - .4, 2.5, 2, 0, 0, 7); c.fill(); c.strokeStyle = OUTLINE; c.lineWidth = 1; c.stroke(); c.fillStyle = '#ddd'; c.fillRect(hx - 1, hy - 1, 2.5, 4); }
  if (L.halo) { c.strokeStyle = '#ffe066'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(hx, hy - hr - 3.5, 4.5, 1.5, 0, 0, 7); c.stroke(); }
  // front arm and held items
  let hand;
  if (P.raise) hand = [lean + 9, shY - 7];
  else if (P.reach) hand = [shX * .4 + 4 + P.reach + lean * .5, shY + 3.5];
  else if (P.tool) hand = [shX + Math.cos(-1.2 + P.tool) * 9 + lean * .5, shY + 2 + Math.sin(-1.2 + P.tool) * 9 + 4];
  else hand = [shX * .6 + P.armA + lean * .5, shY + armL];
  if (L.shield) { rrect(c, hand[0] - 1, shY + 1, 4, 12, 1.5, L.shield); }
  limb(c, shX * .6 + lean * .6, shY + 1.5, hand[0], hand[1], 3.8 * bulk, L.armC || top);
  c.fillStyle = band; c.fillRect(lerp(shX * .6 + lean * .6, hand[0], .78) - 1.6, lerp(shY + 1.5, hand[1], .78) - 1.6, 3.2, 3.2);
  blob(c, hand[0], hand[1], 2.3 * bulk, 2.3 * bulk, skin);
  if (L.gun === 'rifle') { limb(c, hand[0] - 3, hand[1] - .5, hand[0] + 10, hand[1] - 1.5, 2.2, '#2b2b2b'); }
  else if (L.gun === 'pistol') { limb(c, hand[0], hand[1] - .5, hand[0] + 5, hand[1] - 1, 2, '#2b2b2b'); }
  if (L.baton) limb(c, hand[0], hand[1], hand[0] + 4, hand[1] - 8, 1.8, '#3b3b3b');
  if (L.sword) { limb(c, hand[0], hand[1], hand[0] + 6, hand[1] - 15, 2.4, '#dfe7f2'); limb(c, hand[0] - 2, hand[1] + 1, hand[0] + 3, hand[1] - 1, 2, '#a07a2a'); }
  if (L.tool && (pose === 'work' || pose === 'build')) { limb(c, hand[0], hand[1], hand[0] + Math.cos(-1.2 + P.tool - .9) * 7, hand[1] + Math.sin(-1.2 + P.tool - .9) * 7, 1.8, '#6b6b70'); blob(c, hand[0] + Math.cos(-1.2 + P.tool - .9) * 7, hand[1] + Math.sin(-1.2 + P.tool - .9) * 7, 2, 1.5, '#9aa0aa'); }
  if (P.glow) { const g = c.createRadialGradient(hand[0] + 2, hand[1], 0, hand[0] + 2, hand[1], 6 * P.glow); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.4, rgba(L.kiC || '#7fe0ff', .8)); g.addColorStop(1, rgba(L.kiC || '#7fe0ff', 0)); c.fillStyle = g; c.beginPath(); c.arc(hand[0] + 2, hand[1], 6 * P.glow, 0, 7); c.fill(); }
  c.globalAlpha = 1;
}
function spikes(c, hx, hy, list, col) {
  c.fillStyle = col; c.strokeStyle = OUTLINE; c.lineWidth = 1.1;
  c.beginPath();
  for (const [a, len, w] of list) {
    const ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca;
    c.moveTo(hx + ca * 4 + px * w, hy + sa * 4 + py * w); c.lineTo(hx + ca * len, hy + sa * len); c.lineTo(hx + ca * 4 - px * w, hy + sa * 4 - py * w);
  }
  c.fill(); c.stroke();
}
function hairCap(c, hx, hy, hr, col, low) {
  c.fillStyle = col; c.beginPath(); c.arc(hx, hy, hr + .4, Math.PI * (low ? .95 : 1.05), Math.PI * (low ? 2.25 : 1.95)); c.closePath(); c.fill(); c.strokeStyle = OUTLINE; c.lineWidth = 1.1; c.stroke();
}
function drawHairBack(c, L, hx, hy, hr) {
  const col = L.hairC || '#111';
  if (L.hair === 'raditz') poly(c, [[hx - 4, hy - 4], [hx - 14, hy + 10], [hx - 10, hy + 22], [hx - 6, hy + 14], [hx - 3, hy + 26], [hx + 1, hy + 4]], col);
  else if (L.hair === 'ssj3') poly(c, [[hx - 3, hy - 6], [hx - 12, hy + 6], [hx - 9, hy + 18], [hx - 5, hy + 10], [hx - 3, hy + 22], [hx + 2, hy + 3]], col);
  else if (L.hair === 'long') poly(c, [[hx - 5, hy - 4], [hx - 7, hy + 7], [hx + 1, hy + 6], [hx + 2, hy - 2]], col);
}
function drawHair(c, L, hx, hy, hr) {
  const col = L.hairC || '#111', h = L.hair;
  const U2 = -Math.PI / 2;
  switch (h) {
    case 'goku': spikes(c, hx - 1, hy - 1, [[U2 - 1.1, 11, 3], [U2 - .5, 12, 3], [U2, 10, 3], [U2 + .55, 10, 2.6], [Math.PI * .95, 10, 3], [Math.PI * .75, 9, 2.4]], col); hairCap(c, hx, hy, hr, col); spikes(c, hx + 2, hy - 2, [[-.3, 9, 2], [.25, 8, 1.8]], col); break;
    case 'ssj': spikes(c, hx - 1, hy - 1, [[U2 - .9, 13, 3], [U2 - .35, 15, 3], [U2 + .15, 13, 3], [U2 + .6, 11, 2.5], [Math.PI * .92, 10, 3]], col); hairCap(c, hx, hy, hr, col); spikes(c, hx + 2, hy - 2, [[-.4, 8, 1.8]], col); break;
    case 'ssj3': hairCap(c, hx, hy, hr, col); spikes(c, hx - 1, hy - 2, [[U2 - .4, 10, 3.5], [U2 + .3, 9, 3]], col); break;
    case 'vegeta': case 'vegetassj': spikes(c, hx - .5, hy - 2, [[U2 - .35, 15, 3.4], [U2, 16, 3.4], [U2 + .3, 14, 3]], col); hairCap(c, hx, hy, hr, col, true); break;
    case 'gohan': spikes(c, hx - 1, hy - 1, [[U2 - .9, 9, 3], [U2 - .3, 10, 3], [U2 + .3, 9, 2.6], [Math.PI * .9, 8, 2.6]], col); hairCap(c, hx, hy, hr, col); spikes(c, hx + 3, hy - 3, [[.2, 7, 1.5]], col); break;
    case 'raditz': hairCap(c, hx, hy, hr, col); spikes(c, hx - 1, hy - 1, [[U2 - .6, 10, 3], [U2, 9, 3]], col); break;
    case 'spiky': spikes(c, hx - 1, hy - 1, [[U2 - .8, 9, 2.6], [U2 - .2, 10, 2.6], [U2 + .4, 9, 2.4], [Math.PI * .9, 8, 2.4]], col); hairCap(c, hx, hy, hr, col); break;
    case 'short': hairCap(c, hx, hy, hr, col); break;
    case 'bob': hairCap(c, hx, hy, hr, col, true); poly(c, [[hx - hr, hy - 2], [hx - hr - .5, hy + 5], [hx - 2, hy + 5], [hx - 1, hy - 2]], col); poly(c, [[hx + 1, hy - 5], [hx + 7, hy - 2], [hx + 7, hy - 4]], col); break;
    case 'long': hairCap(c, hx, hy, hr, col, true); break;
    case 'mohawk': poly(c, [[hx - 5, hy - 4], [hx - 3, hy - 11], [hx + 2, hy - 10], [hx + 4, hy - 5]], col); break;
    case 'helmet': c.fillStyle = col; c.beginPath(); c.arc(hx, hy - .5, hr + 1.2, Math.PI, 0); c.lineTo(hx + hr + 2.5, hy); c.closePath(); c.fill(); c.strokeStyle = OUTLINE; c.lineWidth = 1.1; c.stroke(); c.fillStyle = 'rgba(160,220,255,.5)'; c.fillRect(hx + 1, hy - 2, 6, 2.4); break;
    case 'cap': hairCap(c, hx, hy, hr + .3, col); c.fillStyle = col; c.fillRect(hx + 2, hy - 3.2, 6, 1.6); break;
    case 'turban': c.fillStyle = col; c.beginPath(); c.arc(hx, hy - 1.5, hr + 1.4, Math.PI * .95, Math.PI * 2.05); c.closePath(); c.fill(); c.strokeStyle = OUTLINE; c.lineWidth = 1.1; c.stroke(); c.fillStyle = '#6a3aa0'; c.fillRect(hx - hr, hy - 3.5, hr * 2, 1.6); break;
    case 'white': hairCap(c, hx, hy, hr, '#f2f2f2'); break;
    default: break;
  }
}

// ---------- other bodies ----------
function drawMech(c, L, pose, f, pc) {
  const trim = pc != null ? pcol(pc) : (L.trim || '#d33a3a'), body = L.body || '#888', P = poseParams(pose, f);
  const k = L.kind;
  if (k === 'drone') { // hovering worker drone
    const y = -10 - P.bob * 1.5;
    c.fillStyle = 'rgba(120,220,255,.35)'; c.beginPath(); c.ellipse(0, -1, 6, 2, 0, 0, 7); c.fill();
    rrect(c, -6, y - 9, 12, 11, 4, body); c.fillStyle = trim; c.fillRect(-6, y - 3, 12, 2.4);
    blob(c, 3, y - 5, 2.2, 2.2, L.glass || '#ff5a5a');
    limb(c, 5, y - 1, 9 + P.reach * .4 + (P.tool ? Math.cos(P.tool) * 3 : 0), y + 3 + (P.tool ? Math.sin(P.tool) * 3 : 0), 2, '#5d636e');
    return;
  }
  if (k === 'sentry') { for (const a of [.5, 2.6, 3.7, 5.8]) limb(c, 0, -10, Math.cos(a) * 9, -2 + Math.sin(a) * 2, 2.4, '#3a3d44'); rrect(c, -8, -20, 16, 13, 4, body); c.fillStyle = trim; c.fillRect(-8, -13, 16, 2.4); blob(c, 4, -16, 2.4, 2.4, L.glass); limb(c, 6, -12, 13, -12, 2.6, '#2a2a2a'); return; }
  const big = k === 'pirate' ? 1.5 : k === 'capsule' ? 1.25 : 1;
  const legA = P.legA * .6, legB = P.legB * .6;
  limb(c, -4 * big, -14 * big, -4 * big + legB, -2, 5 * big, shade(body, -.25));
  limb(c, 4 * big, -14 * big, 4 * big + legA, -2, 5.5 * big, shade(body, -.1));
  rrect(c, -9 * big, -2.5, 7 * big, 3, 1, '#2a2d33'); rrect(c, 1 * big + legA, -2.5, 7 * big, 3, 1, '#2a2d33');
  rrect(c, -10 * big, -32 * big, 20 * big, 19 * big, 5, body);
  c.fillStyle = trim; c.fillRect(-10 * big, -20 * big, 20 * big, 3);
  if (k === 'jacket' || k === 'capsule') { rrect(c, -4 * big, -30 * big, 11 * big, 7 * big, 3, L.glass || '#9fe8ff'); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(-2 * big, -29 * big, 3 * big, 2 * big); }
  if (k === 'pirate') { blob(c, 2, -38 * big + 6, 6, 5, shade(body, .1)); blob(c, 4.5, -38 * big + 5, 1.6, 1.6, L.glass); c.fillStyle = '#111'; c.fillRect(-6, -48, 12, 3); c.fillRect(-3, -54, 6, 7); }
  const reach = P.reach * 1.1;
  if (k === 'pirate') { limb(c, 8 * big, -26 * big, 14 * big + reach, -16 * big, 5, shade(body, -.05)); poly(c, [[14 * big + reach, -16 * big], [24 * big + reach, -30 * big], [26 * big + reach, -27 * big], [16 * big + reach, -14 * big]], '#dfe3ea'); }
  else { limb(c, 9 * big, -26 * big, 15 * big + reach, -22 * big, 4, shade(body, -.05)); rrect(c, 13 * big + reach, -25 * big, 9, 4, 1.5, '#2a2a2a'); if (P.glow) { c.fillStyle = 'rgba(255,220,120,.9)'; c.beginPath(); c.arc(22 * big + reach + 2, -23 * big, 3, 0, 7); c.fill(); } }
}
function drawVehicle(c, L, pose, f, pc) {
  const trim = pc != null ? pcol(pc) : (L.trim || '#ff8a1e'), body = L.body || '#ddd', k = L.kind;
  const bob = pose === 'walk' ? (f % 2) * .8 : 0;
  c.fillStyle = 'rgba(0,0,0,.0)';
  if (k === 'bike' || k === 'glider') {
    c.fillStyle = 'rgba(120,220,255,.4)'; c.beginPath(); c.ellipse(0, -2, 13, 3, 0, 0, 7); c.fill();
    poly(c, [[-14, -8 - bob], [12, -9 - bob], [16, -12 - bob], [8, -15 - bob], [-12, -13 - bob]], body);
    c.fillStyle = trim; c.fillRect(-10, -12 - bob, 18, 2.2);
    drawHuman(c, { skin: L.riderSkin || '#f2c9a0', hair: k === 'glider' ? 'none' : 'helmet', hairC: '#ddd', top: L.rider || '#3c78c8', pants: '#333', boots: '#333', scouter: k === 'glider', build: 'slim' }, pose === 'atk' ? 'atk' : 'idle', pose === 'atk' ? f : 0, pc);
    return;
  }
  if (k === 'buggy') {
    for (const x of [-9, 8]) { blob(c, x, -4, 4.4, 4.4, '#222'); blob(c, x, -4, 1.8, 1.8, '#888'); }
    poly(c, [[-15, -6 - bob], [14, -6 - bob], [16, -12 - bob], [8, -18 - bob], [-10, -18 - bob], [-15, -12 - bob]], body);
    c.fillStyle = trim; c.fillRect(-14, -11 - bob, 28, 2.4);
    rrect(c, -2, -24 - bob, 9, 7, 2, '#5b6b52'); limb(c, 6, -21 - bob, 14 + (pose === 'atk' ? f * 2 : 0), -21 - bob, 2.2, '#2a2a2a');
    return;
  }
  if (k === 'tank') {
    rrect(c, -16, -10, 32, 9, 4, '#3a3d33'); for (let i = -13; i <= 13; i += 5) blob(c, i, -5, 2.4, 2.4, '#222');
    poly(c, [[-15, -10], [15, -10], [12, -17], [-12, -17]], body); c.fillStyle = trim; c.fillRect(-12, -14, 24, 2);
    rrect(c, -6, -24, 13, 8, 3, shade(body, .08)); limb(c, 6, -21, 20 - (pose === 'shoot' && f ? 3 : 0), -23, 3.2, '#2a2a2a');
    return;
  }
  if (k === 'cannon' || k === 'launcher') {
    for (const x of [-7, 7]) { blob(c, x, -5, 5, 5, '#5a4a3a'); blob(c, x, -5, 2, 2, '#c0b090'); }
    rrect(c, -10, -14, 20, 8, 3, body); c.fillStyle = trim; c.fillRect(-10, -11, 20, 2);
    if (k === 'cannon') { limb(c, -2, -14, 16 - (pose === 'shoot' && f ? 3 : 0), -22, 6, shade(body, -.15)); blob(c, 16, -22, 3, 3, '#333'); }
    else { rrect(c, -6, -26, 14, 12, 4, shade(body, -.05)); blob(c, 2, -20, 4.5, 4.5, '#f4f4f4'); blob(c, 3, -21, 1.6, 1.6, '#ff3b3b'); }
    return;
  }
  if (k === 'drone') {
    const y = -26 - bob;
    c.fillStyle = 'rgba(255,240,140,.3)'; c.beginPath(); c.ellipse(0, y + 12, 9, 3, 0, 0, 7); c.fill();
    blob(c, 0, y, 10, 6, body); c.fillStyle = trim; c.fillRect(-10, y - 1, 20, 2.2); blob(c, 4, y - 2, 2.6, 2.6, L.glass || '#ffd84a');
    limb(c, -8, y + 3, -12, y + 9, 2, '#666'); limb(c, 8, y + 3, 12, y + 9, 2, '#666');
  }
}
function drawBeast(c, L, pose, f) {
  const k = L.kind, P = poseParams(pose, f);
  if (k === 'trex') {
    limb(c, -4, -14, -5 + P.legB, -1, 5, '#55692c'); limb(c, 3, -14, 3 + P.legA, -1, 5.5, '#6b7f3a');
    poly(c, [[-22, -20], [-8, -24], [-6, -16]], '#6b7f3a');
    blob(c, -2, -20, 11, 8, '#6b7f3a', -.2);
    blob(c, 11 + P.reach * .5, -30 + P.lean, 8, 5.5, '#7f9446', -.3);
    c.fillStyle = '#f4f0e0'; for (let i = 0; i < 4; i++) c.fillRect(8 + i * 2.5 + P.reach * .5, -27 + P.lean, 1.2, 2);
    blob(c, 13 + P.reach * .5, -32 + P.lean, 1.2, 1.2, '#ffde5a');
    limb(c, 6, -20, 9, -16, 2, '#55692c');
    return;
  }
  if (k === 'stego') {
    limb(c, -7, -8, -7 + P.legB, -1, 4, '#6f7539'); limb(c, 6, -8, 6 + P.legA, -1, 4, '#8a8f4a');
    blob(c, 0, -11, 12, 6.5, '#8a8f4a'); blob(c, 13, -9, 4.5, 3.5, '#8a8f4a');
    for (let i = -8; i <= 8; i += 4) poly(c, [[i - 3, -16], [i, -24 + Math.abs(i) * .4], [i + 3, -16]], '#d9822b');
    poly(c, [[-12, -12], [-20, -9], [-12, -9]], '#8a8f4a');
    return;
  }
  if (k === 'boar') {
    limb(c, -5, -6, -5 + P.legB, -1, 3.2, '#4a3528'); limb(c, 5, -6, 5 + P.legA, -1, 3.2, '#5a4030');
    blob(c, 0, -9, 10, 6, '#5a4030'); blob(c, 10, -9, 4.5, 4, '#6a4a38');
    poly(c, [[12, -8], [16, -12], [13, -7]], '#f4f0e0'); blob(c, 11, -11, 1, 1, '#111');
    return;
  }
  if (k === 'frog') {
    blob(c, -4, -4, 4, 3, '#3f8f6a'); blob(c, 5, -4, 4, 3, '#3f8f6a');
    blob(c, 0, -9, 10, 7, '#4fae7a'); blob(c, 6, -15, 3, 3, '#4fae7a'); blob(c, 6.5, -15.5, 1.2, 1.2, '#111');
    c.fillStyle = '#f2e8a0'; c.beginPath(); c.ellipse(1, -6, 6, 3, 0, 0, 7); c.fill();
  }
}
function drawSaiba(c, pose, f, pc) {
  const P = poseParams(pose, f);
  limb(c, -2, -8, -2 + P.legB, -1, 3, '#4f9a2c'); limb(c, 2, -8, 2 + P.legA, -1, 3.2, '#6fd13c');
  blob(c, 0, -11, 5, 5, '#6fd13c');
  blob(c, 1 + P.lean * .5, -20, 6.5, 6, '#6fd13c');
  c.strokeStyle = '#4f9a2c'; c.lineWidth = 1; for (const a of [-.6, 0, .6]) { c.beginPath(); c.arc(1 + P.lean * .5, -20, 4.6, Math.PI + a - .3, Math.PI + a + .3); c.stroke(); }
  c.fillStyle = '#c0102a'; c.beginPath(); c.ellipse(4 + P.lean * .5, -20, 1.5, 1.1, 0, 0, 7); c.ellipse(6.4 + P.lean * .5, -20, 1.2, 1, 0, 0, 7); c.fill();
  limb(c, 3, -13, 7 + P.reach * .5, -11, 2.4, '#6fd13c');
  if (pc != null) { c.fillStyle = pcol(pc); c.fillRect(-4, -9, 8, 1.8); }
}
function drawBrute(c, pose, f, pc) {
  const P = poseParams(pose, f);
  limb(c, -5, -14, -5 + P.legB, -1, 6, '#c45f8f'); limb(c, 5, -14, 5 + P.legA, -1, 6.5, '#e07aab');
  blob(c, 0, -24, 14, 12, '#e07aab');
  c.fillStyle = '#3b8f4a'; c.fillRect(-12, -22, 24, 6); c.fillStyle = pc != null ? pcol(pc) : '#c9a24a'; c.fillRect(-12, -18, 24, 2);
  for (const [x, y] of [[-8, -36], [-2, -38], [4, -37], [9, -34]]) poly(c, [[x - 2, y + 3], [x, y - 3], [x + 2, y + 3]], '#f4f4f4');
  blob(c, 6, -30, 2, 2, '#fff'); blob(c, 6.6, -30, 1, 1, '#111');
  limb(c, 10, -26, 16 + P.reach, -20, 6, '#e07aab'); blob(c, 16 + P.reach, -20, 3.5, 3.5, '#e07aab');
}
function drawApe(c, pose, f, pc) {
  const P = poseParams(pose, f);
  limb(c, -7, -26, -8 + P.legB, -2, 10, '#5a3a22'); limb(c, 7, -26, 7 + P.legA, -2, 11, '#6e4a2c');
  c.strokeStyle = '#5a3a22'; c.lineWidth = 4; c.beginPath(); c.moveTo(-10, -26); c.quadraticCurveTo(-26, -20, -22, -40); c.stroke();
  blob(c, 0, -44, 18, 21, '#6e4a2c');
  blob(c, 2, -42, 10, 13, '#c9a27a');
  if (pc != null) { c.fillStyle = pcol(pc); c.fillRect(-16, -52, 32, 4); }
  blob(c, 6 + P.lean * .5, -70, 12, 11, '#6e4a2c');
  blob(c, 11 + P.lean * .5, -66, 7, 5, '#c9a27a');
  c.fillStyle = '#ff2a2a'; c.beginPath(); c.arc(9 + P.lean * .5, -73, 1.8, 0, 7); c.arc(14 + P.lean * .5, -73, 1.6, 0, 7); c.fill();
  c.fillStyle = '#f4f0e0'; c.fillRect(10 + P.lean * .5, -64, 6, 1.5);
  limb(c, 12, -54, 22 + P.reach * 1.5, -36 + P.lean, 9, '#6e4a2c'); blob(c, 22 + P.reach * 1.5, -34 + P.lean, 6, 6, '#5a3a22');
  limb(c, -12, -54, -16 + P.armB, -30, 8, '#5a3a22');
}
function drawCell(c, L, pose, f, pc) {
  const form = L.form, P = poseParams(pose, f);
  const jr = form === 'jr', perfect = form === 'perfect' || jr;
  const s = jr ? .72 : 1.05;
  c.save(); c.scale(s, s);
  const green = jr ? '#5fa8e0' : perfect ? '#6fc85a' : '#4f9a3c', dark = jr ? '#2f5a8a' : '#20361a';
  if (form === 'imperfect') { c.strokeStyle = OUTLINE; c.lineWidth = 5; c.beginPath(); c.moveTo(-2, -14); c.quadraticCurveTo(-18, -12, -16, -2); c.stroke(); c.strokeStyle = green; c.lineWidth = 3; c.stroke(); }
  if (!jr) { poly(c, [[-2, -24], [-15, -32], [-12, -18]], '#1a2a12'); }
  limb(c, -2, -13, -2 + P.legB, -2.5, 4.4, shade(green, -.2)); blob(c, -1 + P.legB, -1.4, 3, 1.8, '#f4f4f4');
  rrect(c, -5.5 + P.lean * .5, -25, 11, 13, 3.5, perfect ? '#f4f4f4' : green);
  c.fillStyle = dark; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(-3 + (i % 3) * 3 + P.lean * .5, -22 + Math.floor(i / 3) * 4, .9, 0, 7); c.fill(); }
  if (perfect && !jr) { c.fillStyle = green; c.fillRect(-5.5 + P.lean * .5, -25, 11, 4); c.fillStyle = '#1b1b1b'; c.fillRect(-5.5 + P.lean * .5, -14.5, 11, 2); }
  if (pc != null) { c.fillStyle = pcol(pc); c.fillRect(-5.5 + P.lean * .5, -14, 11, 2); }
  limb(c, 2, -13, 2 + P.legA, -2.5, 4.6, green); blob(c, 3 + P.legA, -1.4, 3, 1.8, '#f4f4f4');
  const hx = P.lean * .9 + .5, hy = -31.5;
  blob(c, hx, hy, 6.4, 6.8, perfect ? '#e9e3d6' : green);
  poly(c, [[hx - 6, hy - 2], [hx - 1, hy - 13], [hx + 3, hy - 5]], perfect ? green : '#2a4a20');
  poly(c, [[hx + 1, hy - 5], [hx + 6, hy - 11], [hx + 6, hy - 1]], perfect ? green : '#2a4a20');
  c.fillStyle = jr ? '#111' : '#a0123a'; c.beginPath(); c.ellipse(hx + 3, hy + .5, 1, 1.4, 0, 0, 7); c.ellipse(hx + 5.4, hy + .5, .8, 1.3, 0, 0, 7); c.fill();
  const hand = P.reach ? [4 + P.reach, -21.5] : P.raise ? [9, -32] : [4 + P.armA, -14];
  limb(c, 3, -23, hand[0], hand[1], 3.6, perfect ? '#f4f4f4' : green); blob(c, hand[0], hand[1], 2.2, 2.2, green);
  if (P.glow) { c.fillStyle = 'rgba(220,255,140,.85)'; c.beginPath(); c.arc(hand[0] + 2, hand[1], 4.5 * P.glow, 0, 7); c.fill(); }
  c.restore();
}
function drawFrieza(c, L, pose, f, pc) {
  const form = L.form, P = poseParams(pose, f);
  const purple = form === 'arcosian' ? '#7aa0d8' : '#a24ad0', white = '#f4f4f4';
  c.strokeStyle = OUTLINE; c.lineWidth = 5; c.beginPath(); c.moveTo(-2, -12); c.quadraticCurveTo(-18, -8, -14, -1); c.stroke(); c.strokeStyle = form === 'final' ? white : '#d8c8e8'; c.lineWidth = 3; c.stroke();
  limb(c, -2, -13, -2 + P.legB, -2.5, 4, shade(white, -.15)); blob(c, -1 + P.legB, -1.4, 2.6, 1.6, purple);
  rrect(c, -5 + P.lean * .5, -25, 10, 13, 3.5, white);
  if (form === 'base') { rrect(c, -5.5 + P.lean * .5, -25, 11, 8, 3, '#2b2b2b'); blob(c, -5 + P.lean * .5, -24, 3, 2.4, '#d9c9a0'); blob(c, 5 + P.lean * .5, -24, 3, 2.4, '#d9c9a0'); }
  else { blob(c, -4 + P.lean * .5, -22, 2.5, 2.5, purple); blob(c, 4 + P.lean * .5, -22, 2.5, 2.5, purple); }
  if (pc != null) { c.fillStyle = pcol(pc); c.fillRect(-5 + P.lean * .5, -14, 10, 2); }
  limb(c, 2, -13, 2 + P.legA, -2.5, 4.2, white); blob(c, 3 + P.legA, -1.4, 2.6, 1.6, purple);
  const hx = P.lean * .9 + .5, hy = -31;
  blob(c, hx, hy, 6, 6.4, white);
  if (form === 'base' || form === 'arcosian') { poly(c, [[hx - 4, hy - 4], [hx - 7, hy - 11], [hx - 2, hy - 6]], '#ddd'); poly(c, [[hx + 2, hy - 6], [hx + 5, hy - 12], [hx + 5, hy - 4]], '#ddd'); }
  c.fillStyle = purple; c.beginPath(); c.arc(hx, hy - 1.5, 5.6, Math.PI * 1.08, Math.PI * 1.92); c.closePath(); c.fill();
  c.fillStyle = '#c0104a'; c.beginPath(); c.ellipse(hx + 2.8, hy + .5, 1, 1.4, 0, 0, 7); c.ellipse(hx + 5, hy + .5, .8, 1.3, 0, 0, 7); c.fill();
  const hand = P.reach ? [4 + P.reach, -21.5] : P.raise ? [9, -32] : [4 + P.armA, -14];
  limb(c, 3, -23, hand[0], hand[1], 3.4, white); blob(c, hand[0], hand[1], 2, 2, white);
  if (P.glow) { c.fillStyle = 'rgba(255,120,220,.9)'; c.beginPath(); c.arc(hand[0] + 3, hand[1] - 1, 2.6, 0, 7); c.fill(); }
}
function drawBuu(c, pose, f) {
  const P = poseParams(pose, f), pink = '#ff9ecf';
  limb(c, -3, -12, -3 + P.legB, -3, 5, shade(pink, -.1)); blob(c, -2 + P.legB, -2, 3.4, 2, '#f4c430');
  rrect(c, -7 + P.lean * .5, -24, 14, 13, 5, pink);
  c.fillStyle = '#1b1b2b'; c.fillRect(-7 + P.lean * .5, -14, 14, 3);
  c.fillStyle = '#f5f2ff'; c.fillRect(-7 + P.lean * .5, -12, 14, 4);
  limb(c, 3, -12, 3 + P.legA, -3, 5, pink); blob(c, 4 + P.legA, -2, 3.4, 2, '#f4c430');
  const hx = P.lean * .9, hy = -30;
  c.strokeStyle = OUTLINE; c.lineWidth = 6; c.beginPath(); c.moveTo(hx - 1, hy - 4); c.quadraticCurveTo(hx - 12, hy - 10, hx - 6, hy - 16); c.stroke(); c.strokeStyle = pink; c.lineWidth = 4; c.stroke();
  blob(c, hx, hy, 6.6, 6.2, pink);
  c.fillStyle = '#111'; c.fillRect(hx + 2, hy - .5, 2.6, 1); c.fillRect(hx + 5, hy - .5, 1.8, 1);
  c.fillStyle = '#7a1a3a'; c.beginPath(); c.ellipse(hx + 4, hy + 3, 2, 1.2, 0, 0, 7); c.fill();
  const hand = P.reach ? [5 + P.reach, -20] : [5 + P.armA, -13];
  limb(c, 4, -21, hand[0], hand[1], 4, pink); blob(c, hand[0], hand[1], 2.8, 2.8, '#f4c430');
}
const LOOK_SCALE = l => (l.scale || 1);
function figureBox(L) {
  const s = LOOK_SCALE(L), r = L.r;
  if (r === 'ape') return [96, 110, 48, 102];
  if (r === 'mech' && L.kind === 'pirate') return [70, 80, 34, 74];
  if (r === 'brute') return [60, 60, 28, 56];
  return [Math.ceil(56 * s), Math.ceil(66 * s), Math.ceil(26 * s), Math.ceil(60 * s)];
}
function drawFigure(c, L, pose, f, pc) {
  const s = LOOK_SCALE(L);
  if (s !== 1) { c.save(); c.scale(s, s); }
  if (pose === 'dead') { c.save(); c.translate(-10, -2); c.rotate(-Math.PI / 2 + .15); c.translate(0, 6); }
  const p = pose === 'dead' ? 'idle' : pose;
  switch (L.r) {
    case 'human': drawHuman(c, L, p, f, pc); break;
    case 'mech': drawMech(c, L, p, f, pc); break;
    case 'vehicle': drawVehicle(c, L, p, f, pc); break;
    case 'beast': drawBeast(c, L, p, f); break;
    case 'saiba': drawSaiba(c, p, f, pc); break;
    case 'brute': drawBrute(c, p, f, pc); break;
    case 'ape': drawApe(c, p, f, pc); break;
    case 'cell': drawCell(c, L, p, f, pc); break;
    case 'frieza': drawFrieza(c, L, p, f, pc); break;
    case 'buu': drawBuu(c, p, f); break;
    default: drawHuman(c, L, p, f, pc);
  }
  if (pose === 'dead') c.restore();
  if (s !== 1) c.restore();
}
const APE_LOOK = { r: 'ape' };
function unitLook(u) {
  if (u.ape) return APE_LOOK;
  const L = stats(u).look;
  return L;
}
function lookKey(u) { return u.ape ? 'ape' : u.key + (u.form ? ':' + u.form : ''); }
// Cached animated frame for a unit (facing right; mirrored at draw time).
function figureSprite(key, L, pose, f, pc) {
  const [w, h, ax, ay] = figureBox(L);
  return sprite(`F|${key}|${pose}|${f}|${pc}`, w, h, ax, ay, c => drawFigure(c, L, pose, f, pc));
}
