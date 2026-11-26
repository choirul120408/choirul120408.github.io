/* ==========================================================================
   CHOIRUL RIZKI DWI PUTRA — INTERACTIVE INTRO, CURSOR & ABSTRACT COIN FX
   ========================================================================== */

(() => {
  'use strict';

  const ELEMENT_THEMES = [
    { id: 'cosmic', label: 'COSMIC SUPRA', colors: ['#ff2e93', '#00f5d4', '#ffd166', '#8338ec'] },
    { id: 'halilintar', label: 'HALILINTAR NEON', colors: ['#ff0055', '#ffbe0b', '#b5179e', '#ffffff'] },
    { id: 'taufan', label: 'TAUFAN CYBER', colors: ['#00bbf9', '#9ef01a', '#00f5d4', '#ffe66d'] },
    { id: 'solar', label: 'SOLAR GOLD', colors: ['#fb5607', '#ffd166', '#ff006e', '#fff3b0'] },
    { id: 'prism', label: 'ABSTRACT PRISM', colors: ['#ff3cac', '#00f5d4', '#ffd166', '#784ba0'] }
  ];

  let activeThemeIndex = 0;
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    vx: 0,
    vy: 0,
    active: false
  };

  function getPalette() {
    return ELEMENT_THEMES[activeThemeIndex].colors;
  }

  /* ========================================================================
     1. CINEMATIC INTRO SEQUENCE
     ======================================================================== */
  const introOverlay = document.getElementById('intro-overlay');
  const introProgress = document.getElementById('intro-progress');
  const introStatus = document.getElementById('intro-status');
  const skipIntroBtn = document.getElementById('skip-intro-btn');
  const replayIntroBtn = document.getElementById('replay-intro-btn');

  let introTimers = [];
  let introFinished = false;

  const INTRO_STEPS = [
    { at: 150, pct: 24, msg: 'Mengaktifkan Jam Kuasa Elemental Abstrak...' },
    { at: 1050, pct: 54, msg: 'Menyinkronkan Jaringan Indodax Terbesar di Dunia...' },
    { at: 2050, pct: 84, msg: 'Memuat Efek Koin Emas & Likuiditas Dolar Global...' },
    { at: 2950, pct: 100, msg: 'Portal Profil Choirul Rizki Dwi Putra Siap!' }
  ];

  function clearIntroTimers() {
    introTimers.forEach((t) => clearTimeout(t));
    introTimers = [];
  }

  function finishIntro() {
    if (introFinished) return;
    introFinished = true;
    clearIntroTimers();
    if (introProgress) introProgress.style.width = '100%';
    introOverlay.classList.add('intro-exit');
    document.body.classList.remove('intro-active');
    document.body.classList.add('site-ready');
    spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, 36, true);
  }

  function startIntro() {
    introFinished = false;
    clearIntroTimers();
    document.body.classList.add('intro-active');
    document.body.classList.remove('site-ready');
    introOverlay.classList.remove('intro-exit');
    if (introProgress) introProgress.style.width = '0%';
    if (introStatus) introStatus.textContent = 'Menginisialisasi Portal Elemental...';

    // Restart CSS animations inside intro stage cleanly
    const stage = introOverlay.querySelector('.intro-stage');
    if (stage) {
      const clone = stage.cloneNode(true);
      stage.parentNode.replaceChild(clone, stage);
    }

    const newProgress = document.getElementById('intro-progress');
    const newStatus = document.getElementById('intro-status');

    INTRO_STEPS.forEach((step) => {
      const t = setTimeout(() => {
        if (newProgress) newProgress.style.width = step.pct + '%';
        if (newStatus) newStatus.textContent = step.msg;
      }, step.at);
      introTimers.push(t);
    });

    introTimers.push(setTimeout(finishIntro, 3700));
  }

  if (skipIntroBtn) {
    skipIntroBtn.addEventListener('click', finishIntro);
  }
  if (replayIntroBtn) {
    replayIntroBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      startIntro();
    });
  }

  startIntro();

  /* ========================================================================
     2. ELEMENTAL THEME SWITCHER (BOBOBOY ABSTRACT MODES)
     ======================================================================== */
  const elementLabelEl = document.getElementById('current-element-label');
  const cycleElementBtn = document.getElementById('cycle-element-btn');

  function setElementTheme(themeId) {
    const idx = ELEMENT_THEMES.findIndex((t) => t.id === themeId);
    if (idx === -1) return;
    activeThemeIndex = idx;
    document.documentElement.setAttribute('data-element', themeId);
    if (elementLabelEl) elementLabelEl.textContent = ELEMENT_THEMES[idx].label;

    document.querySelectorAll('.el-dot').forEach((dot) => {
      dot.classList.toggle('active', dot.dataset.setElement === themeId);
    });

    spawnBurst(pointer.x, pointer.y, 26, true);
  }

  document.querySelectorAll('[data-set-element]').forEach((btn) => {
    btn.addEventListener('click', () => setElementTheme(btn.dataset.setElement));
  });

  if (cycleElementBtn) {
    cycleElementBtn.addEventListener('click', () => {
      const next = ELEMENT_THEMES[(activeThemeIndex + 1) % ELEMENT_THEMES.length];
      setElementTheme(next.id);
    });
  }

  /* ========================================================================
     3. CUSTOM ELEMENTAL CURSOR & CURSOR-MOVE TRAIL PARTICLES
     ======================================================================== */
  const cursorCore = document.getElementById('cursor-core');
  const cursorRing = document.getElementById('cursor-ring');
  const trailCanvas = document.getElementById('cursor-trail-canvas');
  const trailCtx = trailCanvas ? trailCanvas.getContext('2d') : null;

  const ringPos = { x: pointer.x, y: pointer.y };
  const trailParticles = [];

  function resizeTrailCanvas() {
    if (!trailCanvas) return;
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resizeTrailCanvas();
  window.addEventListener('resize', resizeTrailCanvas);

  function spawnTrailParticle(x, y, vx, vy, isBurst = false, withCoins = false) {
    const colors = getPalette();
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isSymbol = withCoins && Math.random() < 0.42;
    trailParticles.push({
      x,
      y,
      vx: vx + (Math.random() - 0.5) * (isBurst ? 8 : 2.2),
      vy: vy + (Math.random() - 0.5) * (isBurst ? 8 : 2.2),
      size: isBurst ? Math.random() * 5 + 3 : Math.random() * 3.5 + 1.8,
      life: 1,
      decay: isBurst ? 0.018 + Math.random() * 0.014 : 0.032 + Math.random() * 0.02,
      color,
      shape: isSymbol ? 'coin' : (Math.random() < 0.5 ? 'shard' : 'orb'),
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.18
    });
    if (trailParticles.length > 260) trailParticles.shift();
  }

  function spawnBurst(x, y, count = 20, withCoins = false) {
    for (let i = 0; i < count; i++) {
      const ang = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const spd = 2 + Math.random() * 5.5;
      spawnTrailParticle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd, true, withCoins);
    }
  }

  window.addEventListener('mousemove', (e) => {
    pointer.vx = e.clientX - pointer.x;
    pointer.vy = e.clientY - pointer.y;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;

    if (cursorCore) {
      cursorCore.style.left = pointer.x + 'px';
      cursorCore.style.top = pointer.y + 'px';
    }

    const speed = Math.hypot(pointer.vx, pointer.vy);
    const count = Math.min(4, Math.max(1, Math.floor(speed / 9)));
    for (let i = 0; i < count; i++) {
      spawnTrailParticle(
        pointer.x,
        pointer.y,
        -pointer.vx * 0.12,
        -pointer.vy * 0.12,
        false,
        Math.random() < 0.18
      );
    }
  });

  window.addEventListener('mousedown', (e) => {
    spawnBurst(e.clientX, e.clientY, 18, true);
  });

  // Hover state & magnetic buttons
  const hoverTargets = document.querySelectorAll('a, button, input, textarea, [data-tilt]');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  function renderCursorLoop() {
    ringPos.x += (pointer.x - ringPos.x) * 0.18;
    ringPos.y += (pointer.y - ringPos.y) * 0.18;

    if (cursorRing) {
      cursorRing.style.left = ringPos.x + 'px';
      cursorRing.style.top = ringPos.y + 'px';
    }

    if (trailCtx) {
      trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.rot += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        trailCtx.save();
        trailCtx.globalAlpha = p.life;
        trailCtx.translate(p.x, p.y);
        trailCtx.rotate(p.rot);

        if (p.shape === 'coin') {
          trailCtx.fillStyle = '#ffd166';
          trailCtx.font = `700 ${Math.round(p.size * 3.1)}px "Syne", sans-serif`;
          trailCtx.textAlign = 'center';
          trailCtx.textBaseline = 'middle';
          trailCtx.shadowColor = '#ffd166';
          trailCtx.shadowBlur = 10;
          trailCtx.fillText('$', 0, 0);
        } else if (p.shape === 'shard') {
          trailCtx.fillStyle = p.color;
          trailCtx.shadowColor = p.color;
          trailCtx.shadowBlur = 12;
          trailCtx.beginPath();
          trailCtx.moveTo(0, -p.size * 1.6);
          trailCtx.lineTo(p.size, p.size);
          trailCtx.lineTo(-p.size, p.size * 0.6);
          trailCtx.closePath();
          trailCtx.fill();
        } else {
          trailCtx.fillStyle = p.color;
          trailCtx.shadowColor = p.color;
          trailCtx.shadowBlur = 12;
          trailCtx.beginPath();
          trailCtx.arc(0, 0, p.size, 0, Math.PI * 2);
          trailCtx.fill();
        }
        trailCtx.restore();
      }
    }

    requestAnimationFrame(renderCursorLoop);
  }
  renderCursorLoop();

  /* ========================================================================
     4. INTERACTIVE BACKGROUND ABSTRACT CONSTELLATION FIELD
     ======================================================================== */
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
  const bgNodes = [];

  function initBgNodes() {
    if (!bgCanvas) return;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgNodes.length = 0;
    const count = Math.min(72, Math.floor((bgCanvas.width * bgCanvas.height) / 22000));
    for (let i = 0; i < count; i++) {
      bgNodes.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        r: Math.random() * 2.6 + 1.2,
        cIdx: i % 4
      });
    }
  }
  initBgNodes();
  window.addEventListener('resize', initBgNodes);

  function renderBgLoop() {
    if (bgCtx) {
      const palette = getPalette();
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

      for (let i = 0; i < bgNodes.length; i++) {
        const n = bgNodes[i];

        // Cursor repulsion / swirl
        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160 && dist > 1) {
            const force = (160 - dist) / 160;
            n.vx += (dx / dist) * force * 0.45 - (dy / dist) * force * 0.16;
            n.vy += (dy / dist) * force * 0.45 + (dx / dist) * force * 0.16;
          }
        }

        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.985;
        n.vy *= 0.985;

        // Keep gentle drift alive
        if (Math.hypot(n.vx, n.vy) < 0.2) {
          n.vx += (Math.random() - 0.5) * 0.08;
          n.vy += (Math.random() - 0.5) * 0.08;
        }

        if (n.x < 0) n.x = bgCanvas.width;
        if (n.x > bgCanvas.width) n.x = 0;
        if (n.y < 0) n.y = bgCanvas.height;
        if (n.y > bgCanvas.height) n.y = 0;

        const col = palette[n.cIdx % palette.length];
        bgCtx.fillStyle = col;
        bgCtx.beginPath();
        bgCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        bgCtx.fill();

        for (let j = i + 1; j < bgNodes.length; j++) {
          const m = bgNodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 130) {
            bgCtx.strokeStyle = col;
            bgCtx.globalAlpha = (1 - d / 130) * 0.22;
            bgCtx.lineWidth = 1;
            bgCtx.beginPath();
            bgCtx.moveTo(n.x, n.y);
            bgCtx.lineTo(m.x, m.y);
            bgCtx.stroke();
            bgCtx.globalAlpha = 1;
          }
        }
      }
    }
    requestAnimationFrame(renderBgLoop);
  }
  renderBgLoop();

  /* ========================================================================
     5. PORTRAIT 3D TILT + ABSTRACT GOLD & DOLLAR COIN FX ON PROFILE PHOTO
     ======================================================================== */
  const portraitStage = document.getElementById('portrait-stage');
  const portraitFrame = document.getElementById('portrait-frame');
  const portraitSheen = document.getElementById('portrait-sheen');
  const coinCanvas = document.getElementById('coin-fx-canvas');
  const coinCtx = coinCanvas ? coinCanvas.getContext('2d') : null;

  let portraitHover = { x: 0, y: 0, active: false };

  if (portraitStage && portraitFrame) {
    portraitStage.addEventListener('mousemove', (e) => {
      const rect = portraitStage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      portraitHover.x = nx;
      portraitHover.y = ny;
      portraitHover.active = true;

      portraitFrame.style.transform = `rotateY(${nx * 18}deg) rotateX(${-ny * 16}deg) scale(1.02)`;
      if (portraitSheen) {
        portraitSheen.style.setProperty('--mx', `${(nx + 0.5) * 100}%`);
        portraitSheen.style.setProperty('--my', `${(ny + 0.5) * 100}%`);
      }

      portraitStage.querySelectorAll('.float-badge').forEach((fb) => {
        const depth = Number(fb.dataset.depth || 20);
        fb.style.transform = `translate(${nx * depth}px, ${ny * depth}px)`;
      });
    });

    portraitStage.addEventListener('mouseleave', () => {
      portraitHover.active = false;
      portraitFrame.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
      portraitStage.querySelectorAll('.float-badge').forEach((fb) => {
        fb.style.transform = '';
      });
    });
  }

  // Abstract Orbiting Gold Coins, Dollar Coins & Currency Ribbons around Photo
  const abstractCoins = [];
  const abstractBills = [];
  const abstractSparks = [];

  function initCoinFX() {
    if (!coinCanvas || !portraitStage) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = coinCanvas.clientWidth || 560;
    const h = coinCanvas.clientHeight || 650;
    coinCanvas.width = w * dpr;
    coinCanvas.height = h * dpr;
    if (coinCtx) coinCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    abstractCoins.length = 0;
    abstractBills.length = 0;
    abstractSparks.length = 0;

    // 18 orbiting 3D abstract gold & dollar coins
    for (let i = 0; i < 18; i++) {
      const kind = i % 3 === 0 ? 'dollar' : 'gold';
      abstractCoins.push({
        angle: (Math.PI * 2 * i) / 18,
        speed: (0.007 + Math.random() * 0.009) * (i % 2 === 0 ? 1 : -1),
        rx: 155 + (i % 4) * 28,
        ry: 205 + (i % 3) * 32,
        tilt: (Math.random() - 0.5) * 0.7,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: 0.045 + Math.random() * 0.055,
        radius: 13 + Math.random() * 11,
        kind,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 8 abstract holographic dollar ribbons / bills
    for (let i = 0; i < 8; i++) {
      abstractBills.push({
        angle: (Math.PI * 2 * i) / 8 + 0.3,
        speed: 0.005 + Math.random() * 0.005,
        rx: 185 + (i % 2) * 34,
        ry: 225 + (i % 3) * 24,
        w: 38 + Math.random() * 14,
        h: 19 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 28 abstract golden & neon dust motes
    for (let i = 0; i < 28; i++) {
      abstractSparks.push({
        angle: Math.random() * Math.PI * 2,
        dist: 135 + Math.random() * 115,
        speed: 0.004 + Math.random() * 0.012,
        size: 1.5 + Math.random() * 3,
        gold: i % 2 === 0
      });
    }
  }

  initCoinFX();
  window.addEventListener('resize', initCoinFX);

  function drawAbstractCoin(ctx, x, y, r, spin, kind, depthScale) {
    const scaleX = Math.cos(spin);
    const absScaleX = Math.max(0.18, Math.abs(scaleX));
    const drawR = r * depthScale;

    ctx.save();
    ctx.translate(x, y);

    // Abstract outer halo ring
    ctx.beginPath();
    ctx.ellipse(0, 0, drawR * 1.28 * absScaleX, drawR * 1.28, 0, 0, Math.PI * 2);
    ctx.strokeStyle = kind === 'gold' ? 'rgba(255, 209, 102, 0.35)' : 'rgba(0, 245, 212, 0.38)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Coin metallic body
    ctx.scale(absScaleX, 1);
    const grad = ctx.createRadialGradient(-drawR * 0.3, -drawR * 0.3, drawR * 0.1, 0, 0, drawR);
    if (kind === 'gold') {
      grad.addColorStop(0, '#fff7cc');
      grad.addColorStop(0.45, '#ffd166');
      grad.addColorStop(0.85, '#e09f3e');
      grad.addColorStop(1, '#9e6200');
    } else {
      grad.addColorStop(0, '#d8fff8');
      grad.addColorStop(0.45, '#00f5d4');
      grad.addColorStop(0.85, '#1b998b');
      grad.addColorStop(1, '#0c4a43');
    }

    ctx.shadowColor = kind === 'gold' ? 'rgba(255, 209, 102, 0.75)' : 'rgba(0, 245, 212, 0.7)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, drawR, 0, Math.PI * 2);
    ctx.fill();

    // Inner engraved ring
    ctx.shadowBlur = 0;
    ctx.strokeStyle = kind === 'gold' ? '#fff3b0' : '#b8fff3';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 0, drawR * 0.76, 0, Math.PI * 2);
    ctx.stroke();

    // Symbol ($ for dollar / ★ or $ for gold)
    ctx.fillStyle = kind === 'gold' ? '#4b2d00' : '#032924';
    ctx.font = `800 ${Math.round(drawR * 1.05)}px "Syne", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(kind === 'dollar' ? '$' : '₿', 0, 1);

    ctx.restore();
  }

  function drawAbstractBill(ctx, x, y, w, h, rot, depthScale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(depthScale, depthScale);

    const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    grad.addColorStop(0, 'rgba(46, 196, 182, 0.88)');
    grad.addColorStop(0.5, 'rgba(0, 245, 212, 0.72)');
    grad.addColorStop(1, 'rgba(255, 209, 102, 0.85)');

    ctx.shadowColor = 'rgba(0, 245, 212, 0.55)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = grad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.2;

    // Skewed abstract currency slip
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 5, -h / 2);
    ctx.lineTo(w / 2 + 5, -h / 2);
    ctx.lineTo(w / 2 - 5, h / 2);
    ctx.lineTo(-w / 2 - 5, h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#04241f';
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$USD', 0, 0);

    ctx.restore();
  }

  let coinTime = 0;
  function renderCoinFXLoop() {
    if (coinCtx && coinCanvas) {
      coinTime += 0.016;
      const w = coinCanvas.clientWidth || 560;
      const h = coinCanvas.clientHeight || 650;
      const cx = w * 0.5 + (portraitHover.active ? portraitHover.x * 24 : 0);
      const cy = h * 0.5 + (portraitHover.active ? portraitHover.y * 24 : 0);
      const palette = getPalette();

      coinCtx.clearRect(0, 0, w, h);

      // Abstract energy ribbons orbiting portrait
      for (let r = 0; r < 2; r++) {
        coinCtx.save();
        coinCtx.translate(cx, cy);
        coinCtx.rotate(coinTime * (r === 0 ? 0.35 : -0.28) + r * 1.1);
        coinCtx.strokeStyle = r === 0 ? 'rgba(255, 209, 102, 0.25)' : 'rgba(0, 245, 212, 0.22)';
        coinCtx.lineWidth = 1.6;
        coinCtx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.12) {
          const wobble = Math.sin(a * 3 + coinTime * 3) * 14;
          const rx = (175 + r * 26 + wobble) * Math.cos(a);
          const ry = (220 + r * 18 - wobble) * Math.sin(a);
          if (a === 0) coinCtx.moveTo(rx, ry);
          else coinCtx.lineTo(rx, ry);
        }
        coinCtx.stroke();
        coinCtx.restore();
      }

      // Sparks
      abstractSparks.forEach((s) => {
        s.angle += s.speed * (portraitHover.active ? 1.8 : 1);
        const sx = cx + Math.cos(s.angle) * (s.dist + Math.sin(coinTime * 2 + s.angle) * 18);
        const sy = cy + Math.sin(s.angle) * (s.dist * 1.24 + Math.cos(coinTime * 2) * 14);
        coinCtx.fillStyle = s.gold ? '#ffd166' : palette[1];
        coinCtx.globalAlpha = 0.72;
        coinCtx.beginPath();
        coinCtx.arc(sx, sy, s.size, 0, Math.PI * 2);
        coinCtx.fill();
      });
      coinCtx.globalAlpha = 1;

      // Abstract Dollar Bills
      abstractBills.forEach((b) => {
        b.angle += b.speed * (portraitHover.active ? 1.6 : 1);
        const x = cx + Math.cos(b.angle) * b.rx + Math.sin(coinTime * 2 + b.phase) * 14;
        const y = cy + Math.sin(b.angle) * b.ry + Math.cos(coinTime * 1.7 + b.phase) * 12;
        const depth = 0.82 + 0.28 * Math.sin(b.angle + b.phase);
        drawAbstractBill(ctxOr(coinCtx), x, y, b.w, b.h, Math.sin(coinTime + b.phase) * 0.45, depth);
      });

      // Orbiting 3D Gold & Dollar Coins (sorted slightly by depth, avoiding center face box)
      abstractCoins.forEach((c) => {
        c.angle += c.speed * (portraitHover.active ? 1.75 : 1);
        c.spin += c.spinSpeed;

        // Lissajous-infused elliptical orbit around portrait perimeter
        const rawX = Math.cos(c.angle) * c.rx + Math.sin(c.angle * 2 + c.phase) * 16;
        const rawY = Math.sin(c.angle) * c.ry + Math.cos(c.angle * 2) * 12;
        const rotX = rawX * Math.cos(c.tilt) - rawY * Math.sin(c.tilt);
        const rotY = rawX * Math.sin(c.tilt) + rawY * Math.cos(c.tilt);

        const x = cx + rotX;
        const y = cy + rotY;
        const depthScale = 0.78 + 0.35 * Math.sin(c.angle + c.phase);

        // Keep center portrait face unobstructed by fading coins that pass right over center
        const distFromCenter = Math.hypot(rotX / 135, rotY / 175);
        coinCtx.globalAlpha = distFromCenter < 0.78 ? 0.25 : 0.96;
        drawAbstractCoin(coinCtx, x, y, c.radius, c.spin, c.kind, depthScale);
      });
      coinCtx.globalAlpha = 1;
    }

    requestAnimationFrame(renderCoinFXLoop);
  }

  function ctxOr(c) { return c; }
  renderCoinFXLoop();

  /* ========================================================================
     6. ELEMENTAL & TIMELINE CARD 3D TILT + CURSOR GLOW
     ======================================================================== */
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -10;
      const ry = ((x / r.width) - 0.5) * 10;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      card.style.setProperty('--cx', `${(x / r.width) * 100}%`);
      card.style.setProperty('--cy', `${(y / r.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ========================================================================
     7. LIVE ABSTRACT WEALTH WAVE CANVAS (#wealth-wave-canvas)
     ======================================================================== */
  const waveCanvas = document.getElementById('wealth-wave-canvas');
  const waveCtx = waveCanvas ? waveCanvas.getContext('2d') : null;
  let wavePhase = 0;

  function renderWealthWave() {
    if (waveCtx && waveCanvas) {
      wavePhase += 0.035;
      const w = waveCanvas.width;
      const h = waveCanvas.height;
      const palette = getPalette();

      waveCtx.clearRect(0, 0, w, h);

      // Subtle horizontal grid
      waveCtx.strokeStyle = 'rgba(255,255,255,0.06)';
      waveCtx.lineWidth = 1;
      for (let y = 30; y < h; y += 45) {
        waveCtx.beginPath();
        waveCtx.moveTo(0, y);
        waveCtx.lineTo(w, y);
        waveCtx.stroke();
      }

      // Draw 3 layered abstract market surge waves
      const layers = [
        { amp: 24, freq: 0.018, speed: 1, col: palette[0], base: h * 0.62 },
        { amp: 18, freq: 0.024, speed: 1.4, col: '#ffd166', base: h * 0.50 },
        { amp: 28, freq: 0.014, speed: 0.8, col: palette[1], base: h * 0.38 }
      ];

      layers.forEach((l) => {
        waveCtx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const upwardTrend = -(x / w) * 38;
          const y = l.base + upwardTrend + Math.sin(x * l.freq + wavePhase * l.speed) * l.amp;
          if (x === 0) waveCtx.moveTo(x, y);
          else waveCtx.lineTo(x, y);
        }
        waveCtx.strokeStyle = l.col;
        waveCtx.lineWidth = 2.6;
        waveCtx.shadowColor = l.col;
        waveCtx.shadowBlur = 12;
        waveCtx.stroke();
        waveCtx.shadowBlur = 0;
      });
    }
    requestAnimationFrame(renderWealthWave);
  }
  renderWealthWave();

  /* ========================================================================
     8. SCROLL REVEAL & CONTACT FORM HANDLER
     ======================================================================== */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = document.getElementById('sender-name')?.value.trim() || 'Partner';
      if (formFeedback) {
        formFeedback.textContent = `⚡ Sinyal Kuasa diterima dari ${sender}! Tim Eksekutif Choirul Rizki Dwi Putra (Indodax Global) akan segera merespons.`;
      }
      spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.6, 30, true);
      contactForm.reset();
    });
  }
})();
