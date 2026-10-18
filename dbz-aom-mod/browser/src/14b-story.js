// =====================================================================
// 14b. STORY SCENES: character conversations before and after missions
// =====================================================================
const STORY = { active: false, scene: null, i: 0, done: null, side: {}, shown: { L: null, R: null }, typed: 0, full: '', timer: 0 };
// Painted backdrops for the places of the saga (1280 x 720 design space).
const SCENE_BG = {
  sky(c, W, H, top, bot) { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, W, H); },
  clouds(c, W, H, col, n, y0, y1) { c.fillStyle = col; for (let i = 0; i < n; i++) { const x = (i * 397 % W), y = y0 + (i * 151 % (y1 - y0)), r = 30 + (i * 37 % 40); for (let k = 0; k < 4; k++) { c.beginPath(); c.ellipse(x + k * r * .7, y + (k % 2) * 8, r, r * .55, 0, 0, 7); c.fill(); } } },
  hills(c, W, H, y, col, amp, seed) { c.fillStyle = col; c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 20) c.lineTo(x, y + Math.sin(x / 140 + seed) * amp + Math.sin(x / 47 + seed * 3) * amp * .3); c.lineTo(W, H); c.fill(); },
  dome(c, x, y, r, col, trim) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, r, r * .8, 0, Math.PI, 0); c.fill(); c.fillRect(x - r, y, r * 2, r * .25); if (trim) { c.strokeStyle = trim; c.lineWidth = 6; c.beginPath(); c.ellipse(x, y - r * .2, r * .98, r * .25, 0, 0, Math.PI); c.stroke(); } },
  palm(c, x, y, h) { c.strokeStyle = '#7a5a32'; c.lineWidth = 10; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 20, y - h * .5, x + 8, y - h); c.stroke(); c.fillStyle = '#3f9a3a'; for (let a = 0; a < 6; a++) { c.beginPath(); c.ellipse(x + 8 + Math.cos(a) * 40, y - h + Math.sin(a) * 10, 46, 12, a * .55, 0, 7); c.fill(); } },
};
const SCENES_PAINT = {
  kamehouse(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#5fb8ff', '#bfe8ff'); B.clouds(c, W, H, 'rgba(255,255,255,.8)', 5, 60, 220); c.fillStyle = '#2f8fd8'; c.fillRect(0, H * .55, W, H); c.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 30; i++) c.fillRect((i * 173) % W, H * .58 + (i * 61) % (H * .4), 40, 3); c.fillStyle = '#f2d39a'; c.beginPath(); c.ellipse(W * .62, H * .62, 260, 70, 0, 0, 7); c.fill(); c.fillStyle = '#ff9ec8'; c.fillRect(W * .55, H * .42, 170, 120); c.fillStyle = '#d33a3a'; c.beginPath(); c.moveTo(W * .55 - 20, H * .43); c.lineTo(W * .55 + 85, H * .3); c.lineTo(W * .55 + 190, H * .43); c.fill(); c.fillStyle = '#fff'; c.font = '700 22px Chakra Petch, sans-serif'; c.fillText('KAME HOUSE', W * .55 + 16, H * .52); c.fillStyle = '#5a3a1e'; c.fillRect(W * .55 + 70, H * .5, 30, 50); B.palm(c, W * .75, H * .62, 210); },
  lookout(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#3d8be0', '#cfe9ff'); B.clouds(c, W, H, 'rgba(255,255,255,.85)', 8, H * .55, H * .95); c.fillStyle = '#e9e4d6'; c.beginPath(); c.ellipse(W * .5, H * .62, W * .48, 90, 0, 0, 7); c.fill(); c.fillStyle = '#c9c2b0'; c.beginPath(); c.ellipse(W * .5, H * .64, W * .48, 80, 0, 0, Math.PI); c.fill(); B.dome(c, W * .5, H * .5, 120, '#f6f2e8', '#ffcc33'); for (const x of [W * .36, W * .64]) { c.fillStyle = '#f6f2e8'; c.fillRect(x - 14, H * .3, 28, 130); B.dome(c, x, H * .3, 18, '#f6f2e8'); } B.palm(c, W * .18, H * .62, 170); B.palm(c, W * .84, H * .64, 150); },
  capsule(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#6fb4ff', '#e7f3ff'); c.fillStyle = '#a9b8c9'; for (let i = 0; i < 14; i++) c.fillRect(i * W / 14, H * .35 + (i * 53) % 90, W / 16, H); B.dome(c, W * .55, H * .62, 230, '#fbfbf6', '#ff8a1e'); c.fillStyle = '#ff8a1e'; c.font = '700 54px Chakra Petch, sans-serif'; c.fillText('CAPSULE CORP', W * .55 - 210, H * .56); c.fillStyle = '#7fbf5a'; c.fillRect(0, H * .8, W, H); },
  mountains(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#79b8ff', '#e6f5ff'); B.clouds(c, W, H, 'rgba(255,255,255,.7)', 4, 50, 200); B.hills(c, W, H, H * .45, '#8aa3b8', 70, 1); B.hills(c, W, H, H * .58, '#5f9a52', 45, 2); B.hills(c, W, H, H * .75, '#4c8a3e', 25, 3); },
  wasteland(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#f4b26a', '#ffe3b0'); for (const [x, w, h] of [[.1, .12, .3], [.32, .08, .22], [.7, .16, .34], [.9, .1, .2]]) { c.fillStyle = '#b96b3a'; c.fillRect(W * x, H * (.62 - h), W * w, H); c.fillStyle = '#d98a52'; c.fillRect(W * x, H * (.62 - h), W * w, 14); } c.fillStyle = '#e0a463'; c.fillRect(0, H * .62, W, H); },
  namek(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#3fbf8a', '#c8f5d0'); for (const [x, y, r] of [[.15, .12, 26], [.45, .08, 20], [.82, .15, 30]]) { c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(W * x, H * y, r, 0, 7); c.fill(); } c.fillStyle = '#2f8fa0'; c.fillRect(0, H * .6, W, H); B.hills(c, W, H, H * .62, '#4fbfa0', 18, 4); for (const [x, s] of [[.12, 1], [.3, .8], [.72, 1.1], [.9, .7]]) { c.strokeStyle = '#5a7a4a'; c.lineWidth = 6 * s; c.beginPath(); c.moveTo(W * x, H * .66); c.lineTo(W * x, H * .66 - 140 * s); c.stroke(); c.fillStyle = '#2f9a5a'; c.beginPath(); c.arc(W * x, H * .66 - 150 * s, 44 * s, 0, 7); c.fill(); } B.dome(c, W * .55, H * .64, 80, '#eaf4e0'); c.fillStyle = '#4a6a8a'; c.beginPath(); c.arc(W * .55, H * .6, 12, 0, 7); c.fill(); },
  frieza_ship(c, W, H) { SCENES_PAINT.namek(c, W, H); c.fillStyle = '#d8d4e8'; c.beginPath(); c.ellipse(W * .32, H * .56, 230, 90, 0, Math.PI, 0); c.fill(); c.fillStyle = '#b8b0cc'; c.fillRect(W * .32 - 230, H * .56, 460, 24); c.fillStyle = '#ffcf6a'; for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(W * .32 - 180 + i * 52, H * .52, 7, 0, 7); c.fill(); } },
  // Planet Vegeta: a red world, with Frieza's round ship hanging in front of it
  vegeta(c, W, H) { c.fillStyle = '#07050c'; c.fillRect(0, 0, W, H); for (let i = 0; i < 220; i++) { c.fillStyle = `rgba(255,240,230,${(i * 37 % 10) / 12})`; c.fillRect((i * 389) % W, (i * 211) % H, 2, 2); } const g = c.createRadialGradient(W * .72, H * .62, 30, W * .72, H * .62, 300); g.addColorStop(0, '#ff9a5a'); g.addColorStop(.6, '#c8452a'); g.addColorStop(1, '#5a1a14'); c.fillStyle = g; c.beginPath(); c.arc(W * .72, H * .62, 270, 0, 7); c.fill(); c.fillStyle = 'rgba(90,20,10,.35)'; for (const [x, y, r] of [[.66, .5, 40], [.8, .7, 55], [.7, .78, 30]]) { c.beginPath(); c.ellipse(W * x, H * y, r, r * .6, 0, 0, 7); c.fill(); } c.fillStyle = '#d8d4e8'; c.beginPath(); c.ellipse(W * .42, H * .3, 120, 46, 0, Math.PI, 0); c.fill(); c.fillStyle = '#b8b0cc'; c.fillRect(W * .42 - 120, H * .3, 240, 14); c.fillStyle = '#ffcf6a'; for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(W * .42 - 85 + k * 34, H * .3 - 18, 5, 0, 7); c.fill(); } },
  space(c, W, H) { c.fillStyle = '#05060f'; c.fillRect(0, 0, W, H); for (let i = 0; i < 220; i++) { c.fillStyle = `rgba(255,255,255,${(i * 37 % 10) / 12})`; c.fillRect((i * 389) % W, (i * 211) % H, 2, 2); } const g = c.createRadialGradient(W * .75, H * .6, 20, W * .75, H * .6, 260); g.addColorStop(0, '#7fd4a0'); g.addColorStop(1, '#1f4f5a'); c.fillStyle = g; c.beginPath(); c.arc(W * .75, H * .6, 240, 0, 7); c.fill(); },
  lab(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#1a1f2a', '#2e3644'); c.fillStyle = '#3a4250'; c.fillRect(0, H * .7, W, H); for (let i = 0; i < 4; i++) { const x = W * (.2 + i * .2); c.fillStyle = 'rgba(120,255,200,.25)'; c.fillRect(x - 40, H * .28, 80, 220); c.strokeStyle = '#8a95a8'; c.lineWidth = 6; c.strokeRect(x - 40, H * .28, 80, 220); c.fillStyle = '#d33a3a'; c.font = '700 22px Chakra Petch, sans-serif'; c.fillText(String(13 + i), x - 12, H * .26); } c.fillStyle = '#d33a3a'; c.font = '700 64px Chakra Petch, sans-serif'; c.fillText('RR', W * .04, H * .2); },
  arena(c, W, H) { SCENES_PAINT.wasteland(c, W, H); c.fillStyle = '#e8e4da'; c.beginPath(); c.moveTo(W * .15, H * .72); c.lineTo(W * .85, H * .72); c.lineTo(W * .95, H * .9); c.lineTo(W * .05, H * .9); c.fill(); c.strokeStyle = '#bdb6a6'; c.lineWidth = 2; for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(W * (.15 + i * .0875), H * .72); c.lineTo(W * (.05 + i * .1125), H * .9); c.stroke(); } for (const x of [.12, .88]) { c.fillStyle = '#e8e4da'; c.fillRect(W * x - 12, H * .5, 24, H * .22); } },
  babidi(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#7a9ac8', '#d8e4f4'); B.hills(c, W, H, H * .5, '#8a7a6a', 60, 5); c.fillStyle = '#6a5a4a'; c.beginPath(); c.ellipse(W * .5, H * .78, W * .4, 80, 0, 0, 7); c.fill(); c.fillStyle = '#e8d8c0'; c.beginPath(); c.ellipse(W * .5, H * .68, 170, 120, 0, 0, 7); c.fill(); c.fillStyle = '#7a1a2a'; c.font = '700 70px Bangers, Impact'; c.fillText('M', W * .5 - 24, H * .7); },
  kai(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#7fd4ff', '#e8fff4'); B.hills(c, W, H, H * .62, '#5fbf5a', 20, 6); for (const [x, h] of [[.15, 160], [.35, 110], [.8, 190]]) { c.fillStyle = 'rgba(180,240,255,.85)'; c.beginPath(); c.moveTo(W * x - 30, H * .66); c.lineTo(W * x, H * .66 - h); c.lineTo(W * x + 30, H * .66); c.fill(); } },
  kingkai(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#ffd88a', '#fff4d0'); B.clouds(c, W, H, 'rgba(255,240,180,.9)', 7, H * .65, H); c.fillStyle = '#5fbf4a'; c.beginPath(); c.arc(W * .5, H * 1.35, H * .8, 0, 7); c.fill(); B.dome(c, W * .45, H * .58, 90, '#fff8e0', '#d33a3a'); c.fillStyle = '#d33a3a'; c.fillRect(W * .62, H * .55, 70, 30); B.palm(c, W * .3, H * .6, 120); },
  tournament(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#6fb4ff', '#dff0ff'); c.fillStyle = '#c8a878'; c.fillRect(0, H * .4, W, H * .2); c.fillStyle = '#e8e2d4'; c.fillRect(W * .1, H * .62, W * .8, H * .12); c.fillStyle = '#bfb6a2'; c.fillRect(W * .1, H * .74, W * .8, 16); c.fillStyle = '#d8b06a'; for (let i = 0; i < 60; i++) { c.beginPath(); c.arc((i * 97) % W, H * .42 + (i * 31) % 60, 8, 0, 7); c.fill(); } },
  city(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#8a8ab0', '#e0d0c8'); for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#6a6a80' : '#7a7a90'; const h = 120 + (i * 71) % 220; c.fillRect(i * W / 12, H * .7 - h, W / 13, h); } c.fillStyle = '#5a5a60'; c.fillRect(0, H * .7, W, H); c.fillStyle = 'rgba(80,80,80,.5)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse((i * 233) % W, H * .3 + (i * 47) % 120, 90, 40, 0, 0, 7); c.fill(); } },
  night(c, W, H) { const B = SCENE_BG; B.sky(c, W, H, '#0a0f2a', '#2a2a5a'); for (let i = 0; i < 120; i++) { c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect((i * 389) % W, (i * 211) % (H * .6), 2, 2); } c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(W * .78, H * .22, 70, 0, 7); c.fill(); B.hills(c, W, H, H * .66, '#1f2f2a', 40, 7); },
};
function paintScene(key) {
  const cv = $('story-bg'), W = cv.width = Math.round(window.innerWidth * Math.min(2, window.devicePixelRatio || 1)), H = cv.height = Math.round(window.innerHeight * Math.min(2, window.devicePixelRatio || 1));
  const c = cv.getContext('2d'), s = Math.max(W / 1280, H / 720);
  c.save(); c.translate((W - 1280 * s) / 2, (H - 720 * s) / 2); c.scale(s, s);
  (SCENES_PAINT[key] || SCENES_PAINT.mountains)(c, 1280, 720);
  c.restore();
  const g = c.createLinearGradient(0, H * .55, 0, H); g.addColorStop(0, 'rgba(5,7,15,0)'); g.addColorStop(1, 'rgba(5,7,15,.85)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function paintSpeaker(cv, k, faceLeft) {
  const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height);
  if (!k) return;
  const sp = SPEAKERS[k] || [k, () => ({ r: 'human' })], L = sp[1]();
  const z = L.r === 'brute' ? 4.6 : L.r === 'buu' ? 6.4 : L.r === 'ape' ? 2.6 : L.r === 'cell' ? 7.4 : L.r === 'beast' ? 5 : 8.2;
  c.save(); c.translate(cv.width / 2 + (faceLeft ? 6 : -6), cv.height * (L.r === 'brute' ? .98 : L.r === 'ape' ? 1.02 : 1.06)); c.scale(faceLeft ? -z : z, z); drawFigure(c, L, 'idle', 0, null); c.restore();
}
function playScene(scene, done) {
  // a list of scenes plays in order; skipping one skips the rest of the list
  if (Array.isArray(scene)) { const rest = scene.slice(1); return playScene(scene[0], () => { if (STORY.skipped || !rest.length) { STORY.skipped = false; if (done) done(); } else playScene(rest.length > 1 ? rest : rest[0], done); }); }
  STORY.skipped = false;
  if (!scene || !scene.lines || !scene.lines.length || G.headless || window.__DBH_NOSTORY) { if (done) done(); return; }
  Object.assign(STORY, { active: true, scene, i: 0, done, side: {}, shown: { L: null, R: null }, wasPaused: !!G.paused });
  G.paused = true;
  for (const k of scene.left || []) STORY.side[k] = 'L';
  for (const k of scene.right || []) STORY.side[k] = 'R';
  let next = 'L'; for (const [k] of scene.lines) if (!STORY.side[k]) { STORY.side[k] = next; next = next === 'L' ? 'R' : 'L'; }
  paintScene(scene.bg);
  $('story-place').textContent = scene.place || '';
  paintSpeaker($('story-left'), null); paintSpeaker($('story-right'), null);
  $('story').hidden = false;
  showStoryLine();
}
function showStoryLine() {
  const [k, text] = STORY.scene.lines[STORY.i], side = STORY.side[k];
  if (STORY.shown[side] !== k) { STORY.shown[side] = k; paintSpeaker($(side === 'L' ? 'story-left' : 'story-right'), k, side === 'R'); }
  $('story-left').className = 'sp' + (!STORY.shown.L ? ' off' : side === 'L' ? '' : ' dim');
  $('story-right').className = 'sp' + (!STORY.shown.R ? ' off' : side === 'R' ? '' : ' dim');
  $('story-name').textContent = (SPEAKERS[k] || [k])[0];
  STORY.full = text; STORY.typed = 0; $('story-text').textContent = '';
  clearInterval(STORY.timer);
  STORY.timer = setInterval(() => { STORY.typed = Math.min(STORY.full.length, STORY.typed + 2); $('story-text').textContent = STORY.full.slice(0, STORY.typed); if (STORY.typed >= STORY.full.length) clearInterval(STORY.timer); }, 18);
  SFX.play('click');
}
function nextStoryLine() {
  if (!STORY.active) return;
  if (STORY.typed < STORY.full.length) { clearInterval(STORY.timer); STORY.typed = STORY.full.length; $('story-text').textContent = STORY.full; return; }
  STORY.i++;
  if (STORY.i >= STORY.scene.lines.length) endScene(); else showStoryLine();
}
function endScene() {
  clearInterval(STORY.timer);
  $('story').hidden = true; STORY.active = false;
  G.paused = STORY.wasPaused;
  const d = STORY.done; STORY.done = null; if (d) d();
}
$('story').addEventListener('click', ev => { if (ev.target.id === 'story-skip') return; nextStoryLine(); });
$('story-skip').addEventListener('click', ev => { ev.stopPropagation(); STORY.skipped = true; endScene(); });
window.addEventListener('keydown', ev => {
  if (!STORY.active) return;
  if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); ev.stopImmediatePropagation(); nextStoryLine(); }
  else if (ev.key === 'Escape') { ev.preventDefault(); ev.stopImmediatePropagation(); STORY.skipped = true; endScene(); }
}, true);
window.addEventListener('resize', () => { if (STORY.active) paintScene(STORY.scene.bg); });
