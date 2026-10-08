/* DARKRIOT — concept arts renderizadas proceduralmente com o motor voxel. */
(function () {
  const DR = window.DR, F = DR.FACTIONS;

  function sky(ctx, W, H, top, bot, extra) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top); g.addColorStop(1, bot);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (extra) extra(ctx, W, H);
  }
  function smoke(ctx, x, y, r, a) {
    for (let i = 0; i < 7; i++) {
      const g = ctx.createRadialGradient(x + i * r * 0.35, y - i * r * 0.55, 0, x + i * r * 0.35, y - i * r * 0.55, r * (1 + i * 0.25));
      g.addColorStop(0, `rgba(40,38,36,${a})`); g.addColorStop(1, 'rgba(40,38,36,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x + i * r * 0.35, y - i * r * 0.55, r * (1 + i * 0.25), 0, 7); ctx.fill();
    }
  }

  DR.ART = {
    coalizao: {
      sky: ['#2b3a44', '#8a8f7e'],
      build() {
        const v = new DR.Vox();
        DR.ground(v, 0, 0, 22, 18, 3);
        DR.sandbags(v, 15, 2, 3, 12, 'y', 3);
        DR.soldier(v, 6, 4, 3, F.coalizao, 'aim');
        DR.soldier(v, 2, 11, 3, F.coalizao, 'idle');
        DR.crate(v, 9, 13, 3); DR.crate(v, 9, 13, 6, '#4f5a33');
        return v;
      },
    },
    legiao: {
      sky: ['#1f2526', '#6d6a5e'],
      build() {
        const v = new DR.Vox();
        DR.ground(v, 0, 0, 22, 18, 3, { grass: ['#6c6a45', '#5f5d3c', '#77744d'] });
        DR.wire(v, 17, 1, 3, 1); for (let j = 0; j < 16; j++) { if (j % 4 === 0) v.box(18, 1 + j, 3, 1, 1, 3, '#5a3f28'); v.set(18, 1 + j, 4 + (j % 2), '#8d8f90'); }
        DR.soldier(v, 8, 3, 3, F.legiao, 'crouch');
        DR.soldier(v, 3, 10, 3, F.legiao, 'aim');
        return v;
      },
    },
    tank: {
      sky: ['#3a3328', '#a08d6a'],
      bg(ctx, W, H) { smoke(ctx, W * 0.8, H * 0.45, 40, 0.35); },
      build() {
        const v = new DR.Vox();
        DR.ground(v, -2, -4, 40, 24, 2, { grass: ['#5b4a33', '#4f3f2b', '#665238'], dirt: ['#4a3a28', '#3f3122'] });
        for (let i = 0; i < 36; i += 2) { v.set(i, -3, 2, '#3e3020'); v.set(i, 15, 2, '#3e3020'); }
        DR.tank(v, 2, 0, 2, true);
        return v;
      },
    },
    trench: {
      sky: ['#24323a', '#c9a76a'],
      bg(ctx, W, H) {
        ctx.fillStyle = 'rgba(255,200,120,0.25)'; ctx.beginPath(); ctx.arc(W * 0.15, H * 0.3, 30, 0, 7); ctx.fill();
        smoke(ctx, W * 0.75, H * 0.35, 26, 0.3);
      },
      build() {
        const v = new DR.Vox();
        DR.ground(v, 0, 0, 44, 30, 6);
        // trincheira em zigue-zague
        const path = [[0, 14], [10, 14], [14, 18], [24, 18], [28, 13], [44, 13]];
        for (let p = 0; p < path.length - 1; p++) {
          const [ax, ay] = path[p], [bx, by] = path[p + 1];
          const n = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
          for (let i = 0; i <= n; i++) {
            const x = Math.round(ax + (bx - ax) * i / n), y = Math.round(ay + (by - ay) * i / n);
            v.carve(x, y, 2, 1, 4, 4);
          }
        }
        // revestimento de madeira na parede visível da trincheira
        for (let x = 0; x < 44; x++) for (let y = 0; y < 29; y++) {
          if (v.has(x, y, 2) && !v.has(x, y + 1, 2)) v.box(x, y, 2, 1, 1, 4, x % 3 ? '#7a5a36' : '#6a4c2d');
        }
        // sacos de areia na borda
        DR.sandbags(v, 0, 12, 6, 10, 'x', 2);
        DR.sandbags(v, 28, 11, 6, 16, 'x', 2);
        DR.soldier(v, 18, 19, 2, F.coalizao, 'aim');
        DR.soldier(v, 4, 15, 2, F.coalizao, 'dig');
        // girassóis ao fundo
        for (let i = 0; i < 26; i++) {
          const x = 2 + Math.floor(DR.hash(i, 1, 1) * 40), y = 1 + Math.floor(DR.hash(i, 2, 1) * 9);
          if (!v.has(x + 1, y, 7)) DR.sunflower(v, x, y, 6, 5 + Math.floor(DR.hash(i, 3, 1) * 4));
        }
        DR.wire(v, 6, 27, 6, 34);
        // cratera
        v.sphere(36, 23, 6, 3.5, null, 1.5);
        return v;
      },
    },
    village: {
      sky: ['#1e1a1c', '#7b4a32'],
      bg(ctx, W, H) {
        const g = ctx.createRadialGradient(W * 0.7, H * 0.7, 10, W * 0.7, H * 0.7, W * 0.5);
        g.addColorStop(0, 'rgba(255,120,40,0.35)'); g.addColorStop(1, 'rgba(255,120,40,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        smoke(ctx, W * 0.55, H * 0.4, 34, 0.45);
      },
      build() {
        const v = new DR.Vox();
        DR.ground(v, 0, 0, 46, 34, 2, { grass: ['#4f5a32', '#5a5f38', '#4a4430'] });
        DR.house(v, 4, 4, 2, true);
        DR.tree(v, 26, 4, 2, 9, true);
        DR.tree(v, 2, 24, 2, 7, false);
        v.sphere(30, 22, 2, 4, null, 1.5);
        for (let i = 0; i < 18; i++) {
          const x = 18 + Math.floor(DR.hash(i, 5, 2) * 10), y = 6 + Math.floor(DR.hash(i, 6, 2) * 12);
          v.set(x, y, 2, DR.hash(i, 7, 2) > 0.5 ? '#d9d2c0' : '#5a7a70');
        }
        DR.ifv(v, 22, 18, 2);
        for (let i = 0; i < 14; i++) v.box(2 + i * 3, 32, 2, 1, 1, 3, '#6b4a2b');
        v.line(2, 32, 4, 41, 32, 4, '#6b4a2b');
        return v;
      },
    },
    fpv: {
      sky: ['#101418', '#2c3a3a'],
      bg(ctx, W, H) {
        ctx.strokeStyle = 'rgba(120,255,180,0.08)';
        for (let y = 0; y < H; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      },
      build() { const v = new DR.Vox(); DR.fpv(v, 0, 0, 0); return v; },
    },
    hero: {
      build() {
        const v = new DR.Vox();
        DR.ground(v, 0, 0, 60, 34, 5);
        for (let x = 0; x < 60; x++) v.carve(x, 15 + (x % 20 < 10 ? 0 : 2), 2, 1, 3, 3);
        DR.sandbags(v, 0, 13, 5, 60, 'x', 1);
        DR.tank(v, 30, 22, 5, true);
        DR.soldier(v, 8, 15, 2, F.coalizao, 'aim');
        DR.soldier(v, 20, 17, 2, F.coalizao, 'crouch');
        for (let i = 0; i < 34; i++) {
          const x = Math.floor(DR.hash(i, 1, 9) * 58), y = 1 + Math.floor(DR.hash(i, 2, 9) * 10);
          if (!v.has(x + 1, y, 6) && !v.has(x, y, 6)) DR.sunflower(v, x, y, 5, 4 + Math.floor(DR.hash(i, 3, 9) * 4));
        }
        DR.tree(v, 52, 4, 5, 8, true);
        return v;
      },
    },
  };

  DR.drawArt = function (cv, id, opts) {
    const a = DR.ART[id];
    const { ctx, W, H } = DR.setupCanvas(cv);
    if (a.sky) sky(ctx, W, H, a.sky[0], a.sky[1], a.bg);
    const v = a._v || (a._v = a.build());
    const o = Object.assign(DR.fit(v, W, H, (opts && opts.pad) != null ? opts.pad : 18), { jitter: 0.07, edge: true }, opts || {});
    DR.render(ctx, v, o);
    // grão de filme
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for (let i = 0; i < 400; i++) ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
    return v;
  };
})();

/* Mapa tático procedural do Oblast de Vorsk (fictício) */
(function () {
  const DR = window.DR, H = DR.hash;
  function vn(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = H(xi, yi, 0, s), b = H(xi + 1, yi, 0, s), c = H(xi, yi + 1, 0, s), d = H(xi + 1, yi + 1, 0, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, s) { let t = 0, a = 0.5, f = 1; for (let i = 0; i < 4; i++) { t += vn(x * f, y * f, s + i) * a; f *= 2; a *= 0.5; } return t; }

  DR.drawMap = function (cv) {
    const { ctx, W, H: Ht } = DR.setupCanvas(cv);
    const LW = 160, LH = 100;
    const c = document.createElement('canvas'); c.width = LW; c.height = LH;
    const x = c.getContext('2d');
    const riverY = (i) => 64 + Math.sin(i * 0.045) * 9 + (fbm(i * 0.05, 3, 4) - 0.5) * 10;
    const front = (j) => 84 + Math.sin(j * 0.09) * 7 + (fbm(2, j * 0.08, 8) - 0.5) * 10;
    const crops = ['#c9a925', '#bfae6a', '#6b5236', '#7d963f', '#d6b52a', '#9aa24e'];
    for (let i = 0; i < LW; i++) for (let j = 0; j < LH; j++) {
      const fx = Math.floor((i + fbm(i * 0.03, j * 0.03, 2) * 6) / 13), fy = Math.floor((j + fbm(i * 0.03, j * 0.03, 3) * 4) / 9);
      let col = crops[Math.floor(H(fx, fy, 1, 5) * crops.length)];
      const belt = (Math.abs(((i + fbm(i * 0.03, j * 0.03, 2) * 6) % 13)) < 1.2 && H(fx, fy, 2, 6) > 0.35) ||
                   (Math.abs(((j + fbm(i * 0.03, j * 0.03, 3) * 4) % 9)) < 1 && H(fx, fy, 3, 6) > 0.6);
      if (belt) col = '#2f4a25';
      if (fbm(i * 0.05, j * 0.05, 9) > 0.64) col = (i + j) % 3 ? '#2c4523' : '#355229';
      const ry = riverY(i);
      if (Math.abs(j - ry) < 1.6) col = '#3d6a8a'; else if (Math.abs(j - ry) < 2.6) col = '#5d7a4a';
      x.fillStyle = col; x.fillRect(i, j, 1, 1);
      if (H(i, j, 7, 7) < 0.08) { x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(i, j, 1, 1); }
    }
    // estradas
    x.fillStyle = '#8f8a7a';
    for (let i = 0; i < LW; i++) x.fillRect(i, 30 + Math.round(Math.sin(i * 0.02) * 4), 1, 1);
    for (let j = 0; j < LH; j++) x.fillRect(46 + Math.round(Math.sin(j * 0.05) * 3), j, 1, 1);
    for (let j = 0; j < LH; j++) x.fillRect(118 + Math.round(Math.cos(j * 0.04) * 2), j, 1, 1);
    // ferrovia
    for (let i = 0; i < LW; i += 1) { x.fillStyle = i % 2 ? '#3a3633' : '#6d6762'; x.fillRect(i, 12 + Math.round(i * 0.05), 1, 1); }
    // cidade industrial (Vorsk) no canto NE
    for (let i = 128; i < 158; i++) for (let j = 2; j < 26; j++) {
      if (i % 5 === 0 || j % 6 === 0) x.fillStyle = '#7d7a72';
      else x.fillStyle = H(i >> 1, j >> 1, 4, 3) > 0.25 ? ['#9d9a93', '#b3b0a8', '#8a877f'][Math.floor(H(i, j, 1, 1) * 3)] : '#5d6a40';
      x.fillRect(i, j, 1, 1);
    }
    // vilas
    const villages = [[22, 40, 'Sonyashnyk'], [60, 74, 'Lypove'], [100, 46, 'Krasna Balka'], [138, 70, 'Zoryane']];
    for (const [vx, vy] of villages) for (let k = 0; k < 22; k++) {
      const a = H(k, vx, 1, 2) * 6.28, r = H(k, vy, 2, 2) * 6;
      x.fillStyle = H(k, 1, vx, 3) > 0.5 ? '#e8e2d2' : '#b84a3a';
      x.fillRect(Math.round(vx + Math.cos(a) * r), Math.round(vy + Math.sin(a) * r * 0.7), 2, 2);
    }
    // pontes
    x.fillStyle = '#c9c3b0';
    x.fillRect(45, Math.round(riverY(46)) - 2, 3, 5); x.fillRect(117, Math.round(riverY(118)) - 2, 3, 5);
    // linha de frente: trincheiras + terra de ninguém
    for (let j = 0; j < LH; j++) {
      const fx = front(j);
      for (let d = -5; d <= 5; d++) { if (H(Math.round(fx + d), j, 3, 3) < 0.25) { x.fillStyle = 'rgba(70,50,30,0.55)'; x.fillRect(Math.round(fx + d), j, 1, 1); } }
      x.fillStyle = '#3d6fd6'; if (j % 4 < 3) x.fillRect(Math.round(fx - 3 + Math.sin(j * 0.7)), j, 1, 1);
      x.fillStyle = '#d23a3f'; if (j % 4 < 3) x.fillRect(Math.round(fx + 3 + Math.sin(j * 0.7 + 1)), j, 1, 1);
    }
    // crateras
    for (let k = 0; k < 70; k++) {
      const j = Math.floor(H(k, 1, 1, 9) * LH), fx = front(j) + (H(k, 2, 1, 9) - 0.5) * 16;
      x.fillStyle = '#4a3a2a'; x.fillRect(Math.round(fx), j, 1, 1);
    }
    ctx.imageSmoothingEnabled = false; ctx.drawImage(c, 0, 0, W, Ht);
    const sx = W / LW, sy = Ht / LH;
    // grade
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(0,0,0,0.6)';
    for (let i = 0; i <= LW; i += 20) { ctx.beginPath(); ctx.moveTo(i * sx, 0); ctx.lineTo(i * sx, Ht); ctx.stroke(); if (i < LW) ctx.fillText(String(40 + i / 20).padStart(2, '0'), i * sx + 3, 11); }
    for (let j = 0; j <= LH; j += 20) { ctx.beginPath(); ctx.moveTo(0, j * sy); ctx.lineTo(W, j * sy); ctx.stroke(); if (j && j < LH) ctx.fillText(String(90 - j / 20).padStart(2, '0'), 3, j * sy - 3); }
    const label = (t, px, py, col, size) => {
      ctx.font = `bold ${size || 11}px "JetBrains Mono", monospace`;
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(10,12,11,0.85)'; ctx.strokeText(t, px, py);
      ctx.fillStyle = col || '#f1efe6'; ctx.fillText(t, px, py);
    };
    for (const [vx, vy, n] of villages) label(n, (vx + 4) * sx, (vy - 4) * sy);
    label('VORSK (cidade industrial)', 120 * sx, 30 * sy, '#f1efe6');
    label('⛏ Mina de sal Krystal (túneis)', 4 * sx, 92 * sy, '#d9e6ff');
    label('Rio Vorskla', 4 * sx, (riverY(4) + 6) * sy, '#a9d0ff', 10);
    // setores
    const sectors = ['A', 'B', 'C', 'D', 'E'];
    sectors.forEach((s, k) => {
      const j = 10 + k * 20, fx = front(j);
      const owner = k < 2 ? '#3d6fd6' : k > 2 ? '#d23a3f' : '#ffb000';
      ctx.fillStyle = owner; ctx.strokeStyle = '#0a0c0b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(fx * sx - 10, j * sy - 10, 20, 20); ctx.fill(); ctx.stroke();
      ctx.fillStyle = k === 2 ? '#111' : '#fff'; ctx.font = 'bold 12px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText(s, fx * sx, j * sy + 4); ctx.textAlign = 'left';
    });
    label('◀ COALIZÃO', 6 * sx, 52 * sy, '#ffd84a', 12);
    label('LEGIÃO ▶', 140 * sx, 92 * sy, '#ff8a8a', 12);
    // escala
    ctx.fillStyle = '#f1efe6'; ctx.fillRect(W - 16 - 40 * sx, Ht - 16, 40 * sx, 3);
    label('1 km', W - 16 - 40 * sx, Ht - 22, '#f1efe6', 10);
  };
})();
