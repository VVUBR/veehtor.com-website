// =====================================================================
// 4. PATHFINDING (A* on tiles, 8-way, gates by team, string-pulled) and spatial hash
// =====================================================================
let NN = 0, gS, came, stamp, closed;
let sid = 0; const hpI = [], hpF = [];
const DX = [1, -1, 0, 0, 1, 1, -1, -1], DY = [0, 0, 1, -1, 1, -1, 1, -1];
function pathAlloc() { NN = MW * MH; gS = new Float32Array(NN); came = new Int32Array(NN); stamp = new Int32Array(NN); closed = new Int32Array(NN); sid = 0; }
function hpush(i, f) { hpI.push(i); hpF.push(f); let k = hpI.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (hpF[p] <= f) break; hpI[k] = hpI[p]; hpF[k] = hpF[p]; k = p; } hpI[k] = i; hpF[k] = f; }
function hpop() { const top = hpI[0], li = hpI.pop(), lf = hpF.pop(), n = hpI.length; if (n > 0) { let k = 0; for (;;) { let c = 2 * k + 1; if (c >= n) break; if (c + 1 < n && hpF[c + 1] < hpF[c]) c++; if (hpF[c] >= lf) break; hpI[k] = hpI[c]; hpF[k] = hpF[c]; k = c; } hpI[k] = li; hpF[k] = lf; } return top; }
const octile = (ax, ay, bx, by) => { const dx = Math.abs(ax - bx), dy = Math.abs(ay - by); return Math.max(dx, dy) + .4142 * Math.min(dx, dy); };
// A tile blocks a team unless it is that team's gate.
const blocked = (i, team) => { const b = G.map.block[i]; return b !== 0 && !(b === 5 && G.map.gate[i] === team); };
function astar(sx0, sy0, isGoal, gx, gy, team, maxExp) {
  sid++; hpI.length = 0; hpF.length = 0;
  if (G.prof) G.prof.astar++;
  const s = idx(sx0, sy0); stamp[s] = sid; gS[s] = 0; came[s] = -1; hpush(s, octile(sx0, sy0, gx, gy));
  let best = s, bestH = 1e9, exp = 0;
  while (hpI.length) {
    const c = hpop(); if (closed[c] === sid) continue; closed[c] = sid;
    const cx = c % MW, cy = (c / MW) | 0;
    if (isGoal(cx, cy)) { if (G.prof) G.prof.exp += exp; return trace(c); }
    const h = octile(cx, cy, gx, gy); if (h < bestH) { bestH = h; best = c; }
    if (++exp > maxExp) { if (G.prof) G.prof.fail++; break; }
    for (let k = 0; k < 8; k++) {
      const nx = cx + DX[k], ny = cy + DY[k]; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue;
      const ni = idx(nx, ny); if (closed[ni] === sid || blocked(ni, team)) continue;
      if (k >= 4 && (blocked(idx(nx, cy), team) || blocked(idx(cx, ny), team))) continue;
      const ng = gS[c] + (k < 4 ? 1 : 1.4142);
      if (stamp[ni] !== sid || ng < gS[ni]) { stamp[ni] = sid; gS[ni] = ng; came[ni] = c; hpush(ni, ng + octile(nx, ny, gx, gy)); }
    }
  }
  if (G.prof) G.prof.exp += exp;
  return trace(best);
}
function trace(c) { const out = []; while (c !== -1) { out.push(c); c = came[c]; } return out.reverse(); }
function walkableAt(x, y, team) { const tx = Math.floor(x), ty = Math.floor(y); return tx >= 0 && ty >= 0 && tx < MW && ty < MH && !blocked(idx(tx, ty), team); }
function lineWalkable(a, b, team) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), n = Math.ceil(d / .25);
  const px = -dy / (d || 1) * .22, py = dx / (d || 1) * .22;
  for (let i = 1; i <= n; i++) { const x = a.x + dx * i / n, y = a.y + dy * i / n; if (!walkableAt(x, y, team) || !walkableAt(x + px, y + py, team) || !walkableAt(x - px, y - py, team)) return false; }
  return true;
}
function smoothPath(pts, team) {
  if (pts.length < 3) return pts;
  const out = [pts[0]]; let i = 0;
  while (i < pts.length - 1) { let j = Math.min(pts.length - 1, i + 20); while (j > i + 1 && !lineWalkable(pts[i], pts[j], team)) j--; out.push(pts[j]); i = j; }
  return out;
}
// ---------- connected regions: lets units skip targets they can never walk to ----------
function computeRegions() {
  const n = MW * MH, R = G.region && G.region.length === n ? G.region : (G.region = new Int32Array(n));
  R.fill(0); let id = 0; const st = [];
  for (let i = 0; i < n; i++) {
    if (R[i] || (G.map.block[i] && G.map.block[i] !== 5)) continue;
    id++; R[i] = id; st.push(i);
    while (st.length) {
      const c = st.pop(), cx = c % MW, cy = (c / MW) | 0;
      if (cx > 0) { const j = c - 1; if (!R[j] && (!G.map.block[j] || G.map.block[j] === 5)) { R[j] = id; st.push(j); } }
      if (cx < MW - 1) { const j = c + 1; if (!R[j] && (!G.map.block[j] || G.map.block[j] === 5)) { R[j] = id; st.push(j); } }
      if (cy > 0) { const j = c - MW; if (!R[j] && (!G.map.block[j] || G.map.block[j] === 5)) { R[j] = id; st.push(j); } }
      if (cy < MH - 1) { const j = c + MW; if (!R[j] && (!G.map.block[j] || G.map.block[j] === 5)) { R[j] = id; st.push(j); } }
    }
  }
  G.regionDirty = false; G.regionT = G.time; G.regionVer = (G.regionVer || 0) + 1;
}
function regionAt(x, y) {
  const tx = clamp(Math.floor(x), 0, MW - 1), ty = clamp(Math.floor(y), 0, MH - 1);
  let r = G.region[idx(tx, ty)]; if (r) return r;
  for (let d = 1; d <= 3; d++) for (let yy = ty - d; yy <= ty + d; yy++) for (let xx = tx - d; xx <= tx + d; xx++) if (inMap(xx, yy) && (r = G.region[idx(xx, yy)])) return r;
  return 0;
}
// Regions touching an entity's footprint (cached per region version).
function regionsOf(e) {
  if (e.kind === 'unit') return [regionAt(e.x, e.y)];
  if (e.reg && e.reg.v === G.regionVer) return e.reg.list;
  const list = [], x0 = e.tx - 1, y0 = e.ty - 1, x1 = e.tx + (e.w || 1), y1 = e.ty + (e.h || 1);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (!inMap(x, y)) continue; const r = G.region[idx(x, y)]; if (r && !list.includes(r)) list.push(r); }
  e.reg = { v: G.regionVer, list };
  return list;
}
function reachable(u, e) {
  if (u.flying || !G.region) return true;
  const r = regionAt(u.x, u.y);
  return !r || regionsOf(e).includes(r);
}
function reachablePt(u, x, y) { if (u.flying || !G.region) return true; const a = regionAt(u.x, u.y), b = regionAt(x, y); return !a || !b || a === b; }
function startTile(u, team) {
  let sx0 = clamp(Math.floor(u.x), 0, MW - 1), sy0 = clamp(Math.floor(u.y), 0, MH - 1);
  if (blocked(idx(sx0, sy0), team)) { const f = freeTileNear(sx0, sy0, 6); if (f) { sx0 = f.x; sy0 = f.y; } }
  return [sx0, sy0];
}
// Path to a point. Returns false when out of path budget this tick.
function goTo(u, x, y) {
  if (u.flying) { u.path = [{ x: clamp(x, .3, MW - .3), y: clamp(y, .3, MH - .3) }]; u.pi = 0; u.wantPath = false; return true; }
  const reach = reachablePt(u, x, y);
  if (!reach && u.unreachT && G.time - u.unreachT < 5) { u.wantPath = false; u.pathPartial = true; return true; }
  if (G.pathBudget <= 0) { u.wantPath = true; return false; }
  if (!reach) u.unreachT = G.time;
  G.pathBudget--; u.wantPath = false; u.lastRepath = G.time;
  const team = teamOf(u.owner);
  const [sx0, sy0] = startTile(u, team);
  let gx = clamp(Math.floor(x), 0, MW - 1), gy = clamp(Math.floor(y), 0, MH - 1), exact = true;
  if (blocked(idx(gx, gy), team)) { const f = freeTileNear(gx, gy, 8); if (f) { gx = f.x; gy = f.y; exact = false; } }
  const tiles = astar(sx0, sy0, (cx, cy) => cx === gx && cy === gy, gx, gy, team, 14000);
  const pts = [{ x: u.x, y: u.y }];
  for (let i = 1; i < tiles.length; i++) pts.push({ x: (tiles[i] % MW) + .5, y: ((tiles[i] / MW) | 0) + .5 });
  const last = tiles[tiles.length - 1];
  u.pathPartial = last !== idx(gx, gy);
  if (exact && !u.pathPartial && walkableAt(x, y, team)) pts.push({ x, y });
  u.path = smoothPath(pts, team).slice(1); u.pi = 0;
  return true;
}
// Path to stand next to an entity (building footprint, resource tiles or unit).
function goToEnt(u, e) {
  if (u.flying) { u.path = [{ x: e.x, y: e.y }]; u.pi = 0; u.wantPath = false; return true; }
  const reach = reachable(u, e);
  if (!reach && u.unreachT && G.time - u.unreachT < 5) { u.wantPath = false; u.pathPartial = true; return true; }
  if (G.pathBudget <= 0) { u.wantPath = true; return false; }
  if (!reach) u.unreachT = G.time;
  G.pathBudget--; u.wantPath = false; u.lastRepath = G.time;
  const team = teamOf(u.owner);
  const [sx0, sy0] = startTile(u, team);
  let x0, y0, x1, y1;
  if (e.kind === 'building' || e.kind === 'res' || e.kind === 'deco') { x0 = e.tx; y0 = e.ty; x1 = e.tx + (e.w || 1) - 1; y1 = e.ty + (e.h || 1) - 1; } else { x0 = x1 = Math.floor(e.x); y0 = y1 = Math.floor(e.y); }
  const walk = (e.kind === 'building' && B[e.key].walk) || (e.kind === 'res' && !RES_DEF[e.key].block);
  const goal = walk ? (cx, cy) => cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1
    : (cx, cy) => cx >= x0 - 1 && cx <= x1 + 1 && cy >= y0 - 1 && cy <= y1 + 1 && (e.kind === 'unit' || !(cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1));
  const tiles = astar(sx0, sy0, goal, (x0 + x1) / 2, (y0 + y1) / 2, team, 14000);
  const lt = tiles[tiles.length - 1];
  u.pathPartial = !goal(lt % MW, (lt / MW) | 0);
  const pts = [{ x: u.x, y: u.y }];
  for (let i = 1; i < tiles.length; i++) pts.push({ x: (tiles[i] % MW) + .5, y: ((tiles[i] / MW) | 0) + .5 });
  u.path = smoothPath(pts, team).slice(1); u.pi = 0;
  return true;
}
function stepMove(u, dt) {
  if (!u.path) return true;
  if (u.pi >= u.path.length) { u.path = null; return true; }
  const t = u.path[u.pi], dx = t.x - u.x, dy = t.y - u.y, d = Math.hypot(dx, dy), step = moveSpeed(u) * dt;
  if (d > .01) faceTo(u, dx, dy);
  u.moving = true;
  if (d <= step) { u.x = t.x; u.y = t.y; u.pi++; if (u.pi >= u.path.length) { u.path = null; return true; } }
  else { u.x += dx / d * step; u.y += dy / d * step; }
  return false;
}
// Straight-line steering for the last few steps (and for flyers).
function steerTo(u, x, y, dt) {
  const dx = x - u.x, dy = y - u.y, d = Math.hypot(dx, dy) || 1, step = Math.min(d, moveSpeed(u) * dt);
  const nx = u.x + dx / d * step, ny = u.y + dy / d * step, team = teamOf(u.owner);
  if (u.flying || walkableAt(nx, ny, team)) { u.x = nx; u.y = ny; }
  else if (walkableAt(nx, u.y, team)) u.x = nx;
  else if (walkableAt(u.x, ny, team)) u.y = ny;
  faceTo(u, dx, dy); u.moving = true;
}
function faceTo(u, dx, dy) { u.face = Math.atan2(dy, dx); const s = dx - dy; if (Math.abs(s) > .001) u.dir = s > 0 ? 1 : -1; }

// ---------- spatial hash (cells of 4 tiles) ----------
const CELL = 4;
let GW = 1, GH = 1, grid = [];
function gridAlloc() { GW = Math.ceil(MW / CELL); GH = Math.ceil(MH / CELL); grid = Array.from({ length: GW * GH }, () => []); }
function rebuildGrid() {
  for (const c of grid) c.length = 0;
  for (const u of G.units) { if (u.garrison) continue; const cx = clamp(Math.floor(u.x / CELL), 0, GW - 1), cy = clamp(Math.floor(u.y / CELL), 0, GH - 1); grid[cy * GW + cx].push(u); }
}
function forUnitsNear(x, y, r, fn) {
  const x0 = clamp(Math.floor((x - r - 1) / CELL), 0, GW - 1), x1 = clamp(Math.floor((x + r + 1) / CELL), 0, GW - 1), y0 = clamp(Math.floor((y - r - 1) / CELL), 0, GH - 1), y1 = clamp(Math.floor((y + r + 1) / CELL), 0, GH - 1);
  for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) for (const u of grid[cy * GW + cx]) if (!u.dead && !u.garrison && Math.hypot(u.x - x, u.y - y) <= r + u.r) fn(u);
}
