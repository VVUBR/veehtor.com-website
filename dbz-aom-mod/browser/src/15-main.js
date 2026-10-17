// =====================================================================
// 15. MAIN LOOP AND START-UP
// =====================================================================
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  vw = view.clientWidth || window.innerWidth; vh = view.clientHeight || window.innerHeight;
  view.width = Math.round(vw * DPR); view.height = Math.round(vh * DPR);
  ctx.imageSmoothingEnabled = true;
  if (G.started && G.map) clampCam();
}
window.addEventListener('resize', resize);
let last = performance.now(), acc = 0, hudT = 0, miniT = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const real = Math.min(.1, (now - last) / 1000); last = now;
  if (!G.started || G.headless || !G.map) return;
  try {
    if (!G.paused && !G.over) {
      const sp = 900 * real / cam.z;
      if (keys.has('ArrowLeft')) cam.x -= sp; if (keys.has('ArrowRight')) cam.x += sp; if (keys.has('ArrowUp')) cam.y -= sp; if (keys.has('ArrowDown')) cam.y += sp;
      const ms = G.mouseScreen;
      if (ms && !drag && document.hasFocus() && !matchMedia('(hover: none)').matches) { const m = 12; if (ms.x < m) cam.x -= sp; if (ms.x > vw - m) cam.x += sp; if (ms.y < m) cam.y -= sp; if (ms.y > vh - m) cam.y += sp; }
      clampCam();
      acc += real * G.speed * (G.speedMul || 1);
      let n = 0;
      while (acc >= STEP && n < 12) { tick(STEP); acc -= STEP; n++; }
      if (n >= 12) acc = 0;
      updateParts(real * G.speed);
    }
    if (G.mouseScreen) G.mouseWorld = screenToWorld(G.mouseScreen.x, G.mouseScreen.y);
    render(G.paused || G.over ? 1 : clamp(acc / STEP, 0, 1), real);
    miniT -= real; if (miniT <= 0) { miniT = .2; renderMinimap(); }
    hudT -= real; if (hudT <= 0) { hudT = .15; updateHUD(); }
    if (G.scn) tickDialogue(real);
  } catch (err) {
    console.error(err);
    if (!G.errShown) { G.errShown = true; toast('Something went wrong: ' + err.message, 'warn'); }
  }
}
resize();
showScreen('scr-menu');
requestAnimationFrame(frame);

// Test hook used by automated checks.
window.__DBH = {
  G: () => G, cam, U, B, TECH, POW, PATRONS,
  headless: o => startSkirmish(Object.assign({ headless: true }, o)),
  step: secs => { for (let t = 0; t < secs; t += STEP) tick(STEP); },
  borrowAI: (secs, diff) => { const P = G.players[G.me]; initAI(P, diff || 'normal'); for (let t = 0; t < secs && !G.over; t += STEP) tick(STEP); P.ai = null; },
  launch: spec => launch(spec),
  toScreen: (x, y) => ({ x: sx(x, y), y: sy(x, y) }),
  dev: () => ({ placeBuilding, spawnUnit, spawnNear, centerOn, castPower, applyTech, startTech, queueUnit, runCheat, refreshLists, CAMPAIGN, kill, setForm, maxHp, ballsHeld, setOrder, DLG, depositBall, quitToMenu, canPlace }),
};
