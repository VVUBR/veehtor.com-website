// =====================================================================
// 1. CORE: constants, math, isometric camera, randomness, storage, sound
// =====================================================================
const TW = 64, TH = 32, HTW = TW / 2, HTH = TH / 2;  // isometric tile diamond at zoom 1
const MT = 0.5;                                      // tiles per meter (one tile = 2 m, as in Age of Mythology)
const STEP = 1 / 20;                                 // simulation tick
const MAX_POP = 300;
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const fmtTime = s => { s = Math.max(0, Math.floor(s)); const m = Math.floor(s / 60); return (m >= 60 ? Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(s % 60).padStart(2, '0'); };
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let rand = Math.random;
const rnd = () => rand();
const rint = (a, b) => a + Math.floor(rand() * (b - a + 1));
const pick = arr => arr[Math.floor(rand() * arr.length)];
const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
// Cosmetic randomness that must not disturb the simulation's seeded stream.
const frnd = Math.random;
function hash2(x, y, s) { let h = (x * 374761393 + y * 668265263 + (s | 0) * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function makeNoise(seed) {
  const r = mulberry32(seed ^ 0x9e3779b9), S = 128, g = new Float32Array(S * S);
  for (let i = 0; i < S * S; i++) g[i] = r();
  const sm = t => t * t * (3 - 2 * t);
  const n1 = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, m = S - 1;
    const a = g[(yi & m) * S + (xi & m)], b = g[(yi & m) * S + ((xi + 1) & m)], c = g[((yi + 1) & m) * S + (xi & m)], d = g[((yi + 1) & m) * S + ((xi + 1) & m)];
    const u = sm(xf), v = sm(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  return (x, y, oct = 3) => { let s = 0, amp = 1, f = 1, norm = 0; for (let o = 0; o < oct; o++) { s += n1(x * f + o * 17.3, y * f - o * 9.1) * amp; norm += amp; amp *= .5; f *= 2; } return s / norm; };
}

// ---------- isometric camera ----------
// World positions are in tiles. The iso plane: ix = (x - y) * HTW, iy = (x + y) * HTH.
const cam = { x: 0, y: 0, z: 1 };
let vw = 800, vh = 600, DPR = 1;
const isoX = (x, y) => (x - y) * HTW;
const isoY = (x, y) => (x + y) * HTH;
const sx = (x, y) => (isoX(x, y) - cam.x) * cam.z;
const sy = (x, y, z) => (isoY(x, y) - (z || 0) - cam.y) * cam.z;
function screenToWorld(px, py) {
  const ix = px / cam.z + cam.x, iy = py / cam.z + cam.y;
  return { x: (iy / HTH + ix / HTW) / 2, y: (iy / HTH - ix / HTW) / 2 };
}

// ---------- storage (best effort; the game works without it) ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem('dbh2.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('dbh2.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
};

// ---------- sound: small synthesized effects, no files ----------
const SFX = (() => {
  let ac = null, master = null, noiseBuf = null, on = store.get('sound', true);
  const last = {};
  function init() {
    if (ac || !on) return;
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = .35; master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ac = null; }
  }
  function tone(f0, f1, dur, type, vol, delay) {
    const t = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .02);
  }
  function noise(dur, freq, q, vol, delay, sweep) {
    const t = ac.currentTime + (delay || 0), s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.setValueAtTime(freq, t); if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t + dur); f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + .02);
  }
  const lib = {
    click: () => tone(900, 600, .05, 'square', .05),
    select: () => tone(520, 780, .07, 'triangle', .06),
    order: () => tone(380, 300, .06, 'triangle', .06),
    punch: () => { noise(.07, 900, 1.2, .25); tone(140, 70, .08, 'sine', .2); },
    blast: () => { noise(.18, 2500, 2, .12, 0, 600); tone(700, 200, .15, 'sawtooth', .03); },
    shot: () => noise(.06, 3000, 3, .1),
    boom: () => { noise(.6, 400, .8, .45, 0, 80); tone(90, 40, .5, 'sine', .35); },
    build: () => { tone(660, 0, .12, 'triangle', .1); tone(990, 0, .18, 'triangle', .08, .1); },
    train: () => { tone(520, 0, .09, 'triangle', .08); tone(780, 0, .12, 'triangle', .07, .08); },
    research: () => { tone(440, 0, .1, 'sine', .08); tone(660, 0, .1, 'sine', .08, .1); tone(880, 0, .2, 'sine', .08, .2); },
    age: () => { [392, 494, 587, 784].forEach((f, i) => tone(f, 0, .35, 'triangle', .12, i * .13)); },
    alert: () => { tone(880, 0, .12, 'square', .07); tone(660, 0, .16, 'square', .07, .14); },
    power: () => { noise(1.1, 300, .7, .3, 0, 2400); tone(110, 440, 1, 'sawtooth', .05); },
    death: () => tone(300, 90, .25, 'triangle', .07),
    collapse: () => { noise(.9, 200, .6, .4, 0, 60); },
    wish: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0, .6, 'sine', .1, i * .12)); },
    win: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0, .5, 'triangle', .14, i * .16)); },
    lose: () => { [392, 330, 262, 196].forEach((f, i) => tone(f, 0, .5, 'triangle', .12, i * .22)); },
    error: () => tone(200, 160, .12, 'square', .06),
  };
  return {
    unlock() { init(); if (ac && ac.state === 'suspended') ac.resume().catch(() => {}); },
    play(name, x, y) {
      if (!on || !ac || !lib[name]) return;
      const now = performance.now();
      if (last[name] && now - last[name] < (name === 'punch' || name === 'shot' || name === 'blast' ? 70 : 140)) return;
      if (x !== undefined && typeof G !== 'undefined' && G.started) {   // only what is near the camera is audible
        const px = sx(x, y), py = sy(x, y);
        if (px < -200 || py < -200 || px > vw + 200 || py > vh + 200) return;
      }
      last[name] = now;
      try { lib[name](); } catch (e) { /* audio is optional */ }
    },
    get on() { return on; },
    toggle() { on = !on; store.set('sound', on); if (on) init(); return on; },
  };
})();
