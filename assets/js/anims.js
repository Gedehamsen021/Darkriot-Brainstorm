/* DARKRIOT — "GIFs" de gameplay: loops determinísticos em canvas (função pura do tempo). */
(function () {
  const DR = window.DR, F = DR.FACTIONS, H = DR.hash;
  DR.ANIMS = {};

  function lowres(w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    return [c, c.getContext('2d')];
  }
  function blit(ctx, c, W, Ht) { ctx.imageSmoothingEnabled = false; ctx.drawImage(c, 0, 0, W, Ht); }
  function hud(ctx, txt, x, y, col, size, align) {
    ctx.font = `bold ${size || 12}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = align || 'left';
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillText(txt, x + 1, y + 1);
    ctx.fillStyle = col || '#e8f5d0'; ctx.fillText(txt, x, y);
    ctx.textAlign = 'left';
  }
  function bg(ctx, W, Ht, a, b) {
    const g = ctx.createLinearGradient(0, 0, 0, Ht); g.addColorStop(0, a); g.addColorStop(1, b);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Ht);
  }
  function fitCached(key, v, W, Ht, extra) {
    const k = key + W + 'x' + Ht;
    return fitCached[k] || (fitCached[k] = DR.fit(v, W, Ht, 16, extra));
  }

  /* ---------- 1. Destruição voxel ---------- */
  (function () {
    const T = 4.2, I = [12, 6, 7];
    let base, damaged, removed;
    function brick(x, y, z) {
      const row = Math.floor(z / 2);
      if (z % 2 === 0 && (x + (row % 2) * 2) % 4 === 0) return '#8f8676';
      return ['#9c4a32', '#8a3f2b', '#a85538', '#7f3a28'][Math.floor(H(x, y, z, 2) * 4)];
    }
    function build() {
      base = new DR.Vox();
      DR.ground(base, 0, 0, 24, 16, 3);
      base.box(4, 5, 3, 16, 2, 10, brick);
      DR.sandbags(base, 16, 11, 3, 6, 'x', 2);
      damaged = base.clone(); removed = [];
      base.each((x, y, z, c) => {
        if (y < 5 || y > 6 || z < 3 || x < 4 || x > 19) return;
        const dx = x - I[0], dy = (y - I[1]) * 1.5, dz = z - I[2];
        const r = 3.8 + (H(x, y, z, 5) - 0.5) * 1.6;
        if (dx * dx + dy * dy + dz * dz < r * r) {
          damaged.set(x, y, z, null);
          const len = Math.hypot(dx, dz) + 0.6;
          const sp = 5 + H(x, y, z, 6) * 7;
          removed.push({ x, y, z, c, vx: dx / len * sp * 0.8, vy: 4 + H(x, y, z, 8) * 8, vz: (dz / len + 0.9) * sp * 0.8 });
        }
      });
      removed.sort((a, b) => a.z - b.z);
    }
    DR.ANIMS.destroy = {
      T, poster: 1.6, label: 'RPG vs parede de tijolo',
      frame(ctx, W, Ht, t) {
        if (!base) build();
        bg(ctx, W, Ht, '#20282c', '#5c5a50');
        const o = Object.assign({}, fitCached('destroy', base, W, Ht, 6), { jitter: 0.07, edge: true });
        const parts = [];
        let v = base;
        if (t >= 1.0 && t < 3.3) {
          v = damaged;
          const dt = t - 1.0;
          for (const p of removed) {
            const tl = (p.vz + Math.sqrt(p.vz * p.vz + 50 * (p.z - 3))) / 25;
            const d = Math.min(dt, tl);
            parts.push({ x: p.x + p.vx * d, y: p.y + p.vy * d, z: Math.max(3, p.z + p.vz * d - 12.5 * d * d), c: p.c, sz: 0.75 });
          }
        } else if (t >= 3.3) {
          v = damaged.clone();
          const n = Math.floor(Math.min(1, (t - 3.3) / 0.7) * removed.length);
          for (let i = 0; i < n; i++) v.set(removed[i].x, removed[i].y, removed[i].z, removed[i].c);
        }
        if (t > 0.4 && t < 1.0) {
          const u = (t - 0.4) / 0.6;
          parts.push({ x: I[0], y: 22 - (22 - I[1] - 1) * u, z: I[2], c: '#3a3f2a', sz: 0.8 });
        }
        o.particles = parts;
        DR.render(ctx, v, o);
        if (t > 0.4 && t < 1.0) {
          const u = (t - 0.4) / 0.6, a = DR.project(I[0] + 0.4, 22, I[2] + 0.4, o), b = DR.project(I[0] + 0.4, 22 - (22 - I[1] - 1) * u, I[2] + 0.4, o);
          ctx.strokeStyle = 'rgba(230,230,220,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        }
        const c = DR.project(I[0], I[1] + 1, I[2], o);
        if (t >= 1.0 && t < 1.35) {
          const k = (t - 1.0) / 0.35;
          const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 30 + k * 90);
          g.addColorStop(0, `rgba(255,240,180,${1 - k})`); g.addColorStop(0.4, `rgba(255,140,40,${0.8 * (1 - k)})`); g.addColorStop(1, 'rgba(255,80,0,0)');
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, Ht);
        }
        if (t >= 1.0 && t < 3.3) {
          for (let i = 0; i < 9; i++) {
            const k = (t - 1.0) / 2.3, r = 10 + k * 40 + i * 3;
            ctx.fillStyle = `rgba(70,66,60,${0.35 * (1 - k)})`;
            ctx.beginPath(); ctx.arc(c[0] + Math.sin(i * 2.1) * 25 * k, c[1] - k * 70 - i * 6, r, 0, 7); ctx.fill();
          }
        }
        hud(ctx, 'IMPACTO: ' + (t >= 1 ? removed.length : 0) + ' blocos', 12, 22, '#ffb000');
        hud(ctx, 'MATERIAL: TIJOLO (HP 40)', 12, 38, '#c9d2b8', 11);
        if (t >= 3.3) hud(ctx, '↺ loop', W - 12, Ht - 12, '#8a9480', 11, 'right');
      },
    };
  })();

  /* ---------- 2. Cavando trincheira ---------- */
  (function () {
    const T = 6.5;
    let base, order;
    const wood = (x) => (x % 3 ? '#7a5a36' : '#6a4c2d');
    function build() {
      base = new DR.Vox();
      DR.ground(base, 0, 0, 26, 16, 6);
      // trecho já cavado (corte lateral: a trincheira abre na borda da maquete)
      base.carve(0, 12, 3, 7, 4, 3);
      for (let x = 0; x < 7; x++) base.box(x, 11, 3, 1, 1, 3, wood(x));
      order = [];
      for (let x = 7; x < 24; x++) for (let z = 5; z >= 3; z--) for (let y = 12; y < 16; y++) order.push([x, y, z]);
    }
    DR.ANIMS.dig = {
      T, label: 'Pá de sapador: cavar 1 bloco / 0.15s',
      frame(ctx, W, Ht, t) {
        if (!base) build();
        bg(ctx, W, Ht, '#2a3540', '#a89b78');
        const p = Math.min(1, t / 5.4), n = Math.floor(p * order.length);
        const v = base.clone();
        for (let i = 0; i < n; i++) v.set(order[i][0], order[i][1], order[i][2], null);
        // revestimento na parede de trás
        for (let i = 0; i + 11 < n; i += 12) v.box(order[i][0], 11, 3, 1, 1, 3, wood(order[i][0]));
        // terra vira sacos de areia na borda de trás
        const bags = Math.floor(n / 4);
        const sb = DR.camo(['#a8946a', '#9a8660', '#b49f74'], 1, 3);
        for (let i = 0; i < bags; i++) { const x = i % 24, y = 9 + Math.floor(i / 24) % 2, z = 6 + Math.floor(i / 48); v.set(x, y, z, sb(x, y, z)); }
        const cx = 7 + Math.floor(n / 12);
        const swing = Math.sin(t * 9) > 0;
        DR.soldier(v, Math.max(0, cx - 8), 12, 3, F.legiao, swing ? 'dig' : 'idle');
        const o = Object.assign({}, fitCached('dig', base, W, Ht, 14), { jitter: 0.08, edge: true });
        const parts = [];
        if (n < order.length) for (let i = 0; i < 4; i++) {
          const k = ((t * 3 + i * 0.25) % 1);
          parts.push({ x: cx - 0.5 + i * 0.2, y: 12.5 + i * 0.6, z: 4 + k * 4 - k * k * 3, c: '#6b4e32', sz: 0.5 });
        }
        o.particles = parts;
        DR.render(ctx, v, o);
        hud(ctx, 'TRINCHEIRA: ' + Math.floor(p * 100) + '%', 12, 22, '#ffb000');
        hud(ctx, 'TERRA → SACOS DE AREIA: ' + bags, 12, 38, '#c9d2b8', 11);
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(12, 46, 140, 6);
        ctx.fillStyle = '#ffb000'; ctx.fillRect(12, 46, 140 * p, 6);
      },
    };
  })();

  /* ---------- 3. Modo Fortaleza: construção de bunker ---------- */
  (function () {
    const T = 7;
    let ground, blocks;
    function build() {
      ground = new DR.Vox();
      DR.ground(ground, 0, 0, 24, 18, 3);
      const b = new DR.Vox();
      const log = DR.camo(['#6b4a2b', '#7a5634', '#5d3f24'], 1, 4);
      const conc = DR.camo(['#8a8a84', '#7d7d77', '#96968f'], 1, 5);
      b.box(5, 4, 3, 13, 10, 4, conc);
      b.carve(6, 5, 3, 11, 8, 4);
      b.carve(17, 7, 5, 1, 4, 1); // seteira
      b.carve(5, 8, 3, 1, 2, 3);  // porta
      b.box(4, 3, 7, 15, 12, 1, log);
      DR.sandbags(b, 4, 3, 8, 15, 'x', 1); DR.sandbags(b, 4, 13, 8, 15, 'x', 1);
      DR.sandbags(b, 4, 5, 8, 8, 'y', 1); DR.sandbags(b, 17, 5, 8, 8, 'y', 1);
      b.box(6, 5, 8, 11, 8, 1, DR.camo(['#4e6b30', '#5a7a35'], 2, 3));
      DR.sandbags(b, 19, 5, 3, 8, 'y', 2);
      blocks = [];
      b.each((x, y, z, c) => blocks.push([x, y, z, c]));
      blocks.sort((a, c) => a[2] - c[2] || (a[0] + a[1]) - (c[0] + c[1]));
    }
    DR.ANIMS.build = {
      T, label: 'Modo Fortaleza — fase de construção',
      frame(ctx, W, Ht, t) {
        if (!ground) build();
        bg(ctx, W, Ht, '#1d2733', '#6f7f7a');
        const v = ground.clone(), parts = [];
        const N = blocks.length, span = 5;
        for (let i = 0; i < N; i++) {
          const ti = i / N * span, b = blocks[i];
          if (t >= ti + 0.25) v.set(b[0], b[1], b[2], b[3]);
          else if (t >= ti) { const u = 1 - (t - ti) / 0.25; parts.push({ x: b[0], y: b[1], z: b[2] + u * u * 8, c: b[3] }); }
        }
        DR.soldier(v, 1, 14, 3, F.coalizao, 'idle');
        const o = Object.assign({}, fitCached('build', ground, W, Ht, 14), { jitter: 0.07, edge: true, particles: parts });
        DR.render(ctx, v, o);
        const left = Math.max(0, 180 - Math.floor(t / T * 180));
        hud(ctx, 'FORTALEZA — ATAQUE EM 0' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0'), 12, 22, '#ffb000');
        hud(ctx, 'SUPRIMENTOS: ' + Math.max(0, 600 - Math.floor(Math.min(1, t / span) * 540)), 12, 38, '#c9d2b8', 11);
      },
    };
  })();

  /* ---------- 4. FPV drone: visão do óculos ---------- */
  (function () {
    const T = 6.6, LW = 192, LH = 120;
    let lc, lx;
    function tankSprite(x, y, s) {
      const w = s, h = s * 0.56, R = (a, b, c, d) => lx.fillRect(x + a * w, y + b * h, c * w, d * h);
      lx.fillStyle = 'rgba(0,0,0,0.35)'; R(-0.52, -0.42, 1.12, 0.98);
      lx.fillStyle = '#1f2018'; R(-0.5, -0.5, 1, 0.22); R(-0.5, 0.28, 1, 0.22);
      lx.fillStyle = '#3a3b2f';
      for (let i = 0; i < 16; i++) { R(-0.5 + (i + 0.3) / 16, -0.5, 0.025, 0.22); R(-0.5 + (i + 0.3) / 16, 0.28, 0.025, 0.22); }
      lx.fillStyle = '#4a5233'; R(-0.47, -0.3, 0.94, 0.6);
      lx.fillStyle = '#58613f'; R(-0.47, -0.3, 0.94, 0.07);
      lx.fillStyle = '#3a4128'; for (let i = 0; i < 4; i++) R(-0.43 + i * 0.05, -0.2, 0.025, 0.4);
      for (let i = 0; i < 5; i++) { lx.fillStyle = i % 2 ? '#5d6340' : '#6a6f4a'; R(0.3, -0.28 + i * 0.112, 0.15, 0.1); }
      lx.fillStyle = '#525a39'; R(-0.13, -0.25, 0.34, 0.5);
      lx.fillStyle = '#626b47'; R(-0.11, -0.23, 0.3, 0.12);
      lx.fillStyle = '#2f3423'; R(0.21, -0.035, 0.56, 0.07);
      lx.fillStyle = '#2b2f1f'; R(-0.02, -0.12, 0.07, 0.1); R(0.08, 0.06, 0.06, 0.08);
      lx.fillStyle = '#e8e8e8'; R(-0.32, 0.2, 0.12, 0.05);
      lx.strokeStyle = 'rgba(34,34,28,0.95)'; lx.lineWidth = Math.max(1, s * 0.01);
      lx.strokeRect(x - 0.19 * w, y - 0.34 * h, 0.44 * w, 0.68 * h);
      for (let i = 1; i < 5; i++) { lx.beginPath(); lx.moveTo(x + (-0.19 + i * 0.088) * w, y - 0.34 * h); lx.lineTo(x + (-0.19 + i * 0.088) * w, y + 0.34 * h); lx.stroke(); }
      lx.beginPath(); lx.moveTo(x - 0.19 * w, y); lx.lineTo(x + 0.25 * w, y); lx.stroke();
    }
    DR.ANIMS.fpv = {
      T, poster: 3.6, label: 'FPV kamikaze vs guerra eletrônica',
      frame(ctx, W, Ht, t) {
        if (!lc) [lc, lx] = lowres(LW, LH);
        const hit = 5.3, p = Math.min(t / hit, 1), e = p * p;
        if (t < hit) {
          const roll = Math.sin(t * 1.9) * 0.14 * (1 - p) + Math.sin(t * 13) * 0.02 * p;
          const hy = 46 - e * 70;
          lx.save(); lx.translate(LW / 2, LH / 2); lx.rotate(roll); lx.translate(-LW / 2, -LH / 2);
          const sk = lx.createLinearGradient(0, hy - 80, 0, hy); sk.addColorStop(0, '#6f8796'); sk.addColorStop(1, '#c7c3a8');
          lx.fillStyle = sk; lx.fillRect(-60, hy - 200, LW + 120, 200);
          lx.fillStyle = '#6a7a3a'; lx.fillRect(-60, hy, LW + 120, 300);
          // fileiras do campo
          for (let k = 1; k < 26; k++) {
            const z = ((k - (t * 2.2 * (1 + e * 3)) % 1) / 26);
            const y = hy + 3 / Math.max(0.02, 1 - z) - 3 + z * z * 160;
            lx.fillStyle = k % 2 ? '#5d6c32' : '#7a8a42'; lx.fillRect(-60, y, LW + 120, 1 + z * 6);
          }
          for (let k = -12; k <= 12; k++) { lx.strokeStyle = 'rgba(60,70,30,0.6)'; lx.beginPath(); lx.moveTo(LW / 2 + k * 3, hy); lx.lineTo(LW / 2 + k * 40, LH + 80); lx.stroke(); }
          // linha das árvores
          lx.fillStyle = '#3b4a2a';
          for (let x = -60; x < LW + 60; x += 3) lx.fillRect(x, hy - 2 - H(x, 1, 1) * 4, 3, 3 + H(x, 1, 1) * 4);
          const s = 10 + Math.pow(p, 3) * 170, k = Math.pow(p, 1.4);
          tankSprite(LW / 2 + Math.sin(t * 0.8) * 8 * (1 - p), (hy + 14) * (1 - k) + (LH / 2) * k, s);
          lx.restore();
          // interferência EW
          const noise = 0.03 + p * p * 0.4 + (Math.sin(t * 7) > 0.9 ? 0.25 : 0);
          for (let i = 0; i < LW * LH * noise * 0.08; i++) {
            const g = Math.random() * 255 | 0; lx.fillStyle = `rgb(${g},${g},${g})`;
            lx.fillRect(Math.random() * LW | 0, Math.random() * LH | 0, 1 + (Math.random() * 3 | 0), 1);
          }
          if (Math.random() < 0.25 + p * 0.4) {
            const y = Math.random() * LH | 0, h = 2 + Math.random() * 6 | 0;
            lx.drawImage(lc, 0, y, LW, h, (Math.random() - 0.5) * 18, y, LW, h);
          }
          blit(ctx, lc, W, Ht);
          // HUD OSD
          ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.5;
          const cx = W / 2, cy = Ht / 2;
          ctx.beginPath(); ctx.moveTo(cx - 16, cy); ctx.lineTo(cx - 5, cy); ctx.moveTo(cx + 5, cy); ctx.lineTo(cx + 16, cy); ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy - 4); ctx.stroke();
          hud(ctx, 'BAT 15.' + (8 - Math.floor(p * 6)) + 'V', 12, 22, '#fff', 12);
          hud(ctx, 'ALT ' + Math.max(0, Math.round(48 * (1 - e))) + 'm', 12, 40, '#fff', 12);
          hud(ctx, 'SPD ' + Math.round(60 + e * 70) + 'km/h', 12, 58, '#fff', 12);
          const rssi = Math.max(1, 5 - Math.floor(p * 4.2));
          for (let i = 0; i < 5; i++) { ctx.fillStyle = i < rssi ? (rssi < 3 ? '#ff5040' : '#fff') : 'rgba(255,255,255,0.2)'; ctx.fillRect(W - 60 + i * 9, 26 - i * 3, 6, 4 + i * 3); }
          hud(ctx, 'RSSI', W - 100, 26, '#fff', 11);
          if (Math.floor(t * 3) % 2) hud(ctx, '● ARMADO', W - 12, Ht - 14, '#ff4030', 12, 'right');
          if (p > 0.55) hud(ctx, '⚠ JAMMER DETECTADO', W / 2, Ht - 14, '#ffb000', 12, 'center');
        } else {
          const k = t - hit;
          if (k < 0.12) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, Ht); }
          else {
            for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x += 2) {
              const g = Math.random() * 200 | 0; lx.fillStyle = `rgb(${g},${g},${g})`; lx.fillRect(x, y, 2, 1);
            }
            blit(ctx, lc, W, Ht);
            ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(W / 2 - 120, Ht / 2 - 30, 240, 60);
            hud(ctx, 'SINAL PERDIDO', W / 2, Ht / 2 - 4, '#fff', 18, 'center');
            hud(ctx, 'ALVO ATINGIDO  +150 XP', W / 2, Ht / 2 + 18, '#ffb000', 12, 'center');
          }
        }
      },
    };
  })();

  /* ---------- 5. Artilharia com observador ---------- */
  (function () {
    const T = 7.5, LW = 200, LH = 120;
    let lc, lx;
    const shots = [{ f: 0.4, l: 2.1, x: 128 }, { f: 3.4, l: 5.1, x: 156 }];
    const gx = (x) => 92 + Math.sin(x * 0.045) * 5 + Math.sin(x * 0.17) * 1.5;
    function surf(x, t) {
      let y = gx(x);
      for (const s of shots) if (t >= s.l) { const d = Math.abs(x - s.x); if (d < 8) y += (8 - d) * 0.7; }
      return y;
    }
    DR.ANIMS.artillery = {
      T, poster: 2.4, label: 'Observador + artilharia: corrigir o tiro',
      frame(ctx, W, Ht, t) {
        if (!lc) [lc, lx] = lowres(LW, LH);
        const sk = lx.createLinearGradient(0, 0, 0, LH); sk.addColorStop(0, '#2b2f3e'); sk.addColorStop(1, '#c4865a');
        lx.fillStyle = sk; lx.fillRect(0, 0, LW, LH);
        lx.fillStyle = '#3a3a3a';
        for (let x = 0; x < LW; x += 2) lx.fillRect(x, 70 - H(x >> 2, 3, 3) * 10 - Math.sin(x * 0.03) * 4, 2, 40);
        for (let x = 0; x < LW; x++) {
          const y = Math.round(surf(x, t));
          for (let yy = y; yy < LH; yy++) {
            const top = yy - y < 2;
            const pal = top ? ['#5f7a33', '#6b8a3a'] : ['#6b4e32', '#5d432b', '#76583a'];
            lx.fillStyle = pal[Math.floor(H(x >> 1, yy >> 1, 4) * pal.length)];
            lx.fillRect(x, yy, 1, 1);
          }
        }
        // obuseiro
        const hx = 16, hyb = gx(hx);
        lx.fillStyle = '#3f452c'; lx.fillRect(hx - 6, hyb - 6, 14, 5);
        lx.fillStyle = '#2a2a24'; lx.fillRect(hx - 5, hyb - 2, 4, 3); lx.fillRect(hx + 3, hyb - 2, 4, 3);
        lx.strokeStyle = '#353a26'; lx.lineWidth = 2; lx.beginPath(); lx.moveTo(hx, hyb - 5); lx.lineTo(hx + 12, hyb - 14); lx.stroke();
        // bunker alvo
        const bx = 156, by = gx(bx);
        if (t < shots[1].l) { lx.fillStyle = '#8a8a84'; lx.fillRect(bx - 6, by - 7, 12, 7); lx.fillStyle = '#1a1a1a'; lx.fillRect(bx - 4, by - 5, 8, 1); lx.fillStyle = '#a8946a'; lx.fillRect(bx - 7, by - 9, 14, 2); }
        else { lx.fillStyle = '#6d6d68'; for (let i = 0; i < 9; i++) lx.fillRect(bx - 9 + H(i, 1, 7) * 18, surf(bx - 9 + H(i, 1, 7) * 18, t) - 2, 2, 2); }
        // drone observador
        const dx = 140 + Math.sin(t) * 4, dy = 18 + Math.sin(t * 2.3) * 2;
        lx.fillStyle = '#d8d8d8'; lx.fillRect(dx - 3, dy, 7, 2); lx.fillRect(dx - 5, dy - 1, 3, 1); lx.fillRect(dx + 3, dy - 1, 3, 1);
        lx.setLineDash([2, 2]); lx.strokeStyle = 'rgba(255,60,40,0.8)'; lx.lineWidth = 1;
        lx.beginPath(); lx.moveTo(dx, dy + 2); lx.lineTo(bx, by - 4); lx.stroke(); lx.setLineDash([]);
        // projéteis
        for (const s of shots) {
          if (t >= s.f && t < s.f + 0.25) { lx.fillStyle = '#ffd070'; lx.beginPath(); lx.arc(hx + 14, hyb - 15, 3 + (t - s.f) * 12, 0, 7); lx.fill(); }
          if (t >= s.f && t < s.l) {
            const u = (t - s.f) / (s.l - s.f), x = hx + 12 + (s.x - hx - 12) * u, y = (hyb - 14) + (gx(s.x) - hyb + 14) * u - 4 * 95 * u * (1 - u);
            lx.fillStyle = '#ffeebb'; lx.fillRect(x, y, 2, 2);
            lx.fillStyle = 'rgba(255,220,160,0.35)'; lx.fillRect(x - 3, y + 1, 3, 1);
          }
          const k = t - s.l;
          if (k >= 0 && k < 1.2) {
            const y0 = gx(s.x);
            lx.fillStyle = `rgba(255,${180 - k * 120 | 0},60,${Math.max(0, 1 - k * 2)})`; lx.beginPath(); lx.arc(s.x, y0 - 2, 4 + k * 14, 0, 7); lx.fill();
            lx.fillStyle = `rgba(60,56,50,${0.7 * (1 - k / 1.2)})`; lx.beginPath(); lx.arc(s.x, y0 - 6 - k * 18, 5 + k * 10, 0, 7); lx.fill();
            for (let i = 0; i < 16; i++) {
              const vx = (H(i, 2, s.x) - 0.5) * 60, vy = -30 - H(i, 3, s.x) * 50;
              const px = s.x + vx * k, py = y0 + vy * k + 60 * k * k;
              if (py < LH) { lx.fillStyle = i % 2 ? '#6b4e32' : '#5f7a33'; lx.fillRect(px, py, 2, 2); }
            }
          }
        }
        blit(ctx, lc, W, Ht);
        hud(ctx, 'OBS: ALVO GRADE 37U-DQ 4512 8890', 12, 22, '#ffb000', 12);
        if (t > 2.3 && t < 3.6) hud(ctx, '“CURTO 50 — ACRESCENTE 50, REPITA”', 12, 40, '#fff', 12);
        if (t > 3.4 && t < 5.1) hud(ctx, 'BATERIA: “A CAMINHO… SPLASH 5”', 12, 40, '#c9d2b8', 12);
        if (t > 5.1) hud(ctx, '✓ ALVO DESTRUÍDO — FIM DA MISSÃO', 12, 40, '#7dff8a', 12);
      },
    };
  })();

  /* ---------- 6. Visão noturna + sinalizador ---------- */
  (function () {
    const T = 7, LW = 192, LH = 120;
    let lc, lx;
    const gy = (x) => 92 + Math.sin(x * 0.05) * 3;
    DR.ANIMS.nvg = {
      T, poster: 3.2, label: 'Blackout: NVG, lasers IR e sinalizador',
      frame(ctx, W, Ht, t) {
        if (!lc) [lc, lx] = lowres(LW, LH);
        const fl = t > 1.6 ? Math.max(0, Math.min(1, (t - 1.6) * 3)) * Math.max(0, 1 - (t - 4.6) / 2) : 0;
        const L = 0.7 + fl * 0.55;
        const g = (l) => { l = Math.min(255, l * L); return `rgb(${l * 0.35 | 0},${l | 0},${l * 0.45 | 0})`; };
        lx.fillStyle = g(30); lx.fillRect(0, 0, LW, LH);
        for (let i = 0; i < 30; i++) { lx.fillStyle = g(200); lx.fillRect(H(i, 1, 1) * LW, H(i, 2, 1) * 50, 1, 1); }
        lx.fillStyle = g(55);
        for (let x = 0; x < LW; x += 3) lx.fillRect(x, 60 - H(x, 5, 5) * 14, 3, 40);
        // casa em silhueta
        lx.fillStyle = g(70); lx.fillRect(120, 70, 30, 22); lx.beginPath(); lx.moveTo(116, 70); lx.lineTo(135, 58); lx.lineTo(154, 70); lx.fill();
        lx.fillStyle = g(15); lx.fillRect(126, 76, 5, 5); lx.fillRect(139, 76, 5, 5);
        for (let x = 0; x < LW; x++) { const y = gy(x); lx.fillStyle = g(85 + H(x, 9, 9) * 20); lx.fillRect(x, y, 1, LH - y); }
        // sacos de areia (amigos)
        lx.fillStyle = g(110); for (let i = 0; i < 6; i++) lx.fillRect(10 + i * 6, gy(10) - 5, 5, 4);
        // inimigos avançando
        const enemies = [[150, 0], [168, 0.7], [178, 1.4]];
        for (const [ex, ph] of enemies) {
          const x = ex - t * 4 + Math.sin(t * 6 + ph) * 0.5, y = gy(x);
          lx.fillStyle = g(150); lx.fillRect(x, y - 9, 3, 9); lx.fillRect(x, y - 11, 3, 2); lx.fillRect(x - 3, y - 7, 3, 1);
        }
        // lasers IR
        const lasers = [[22, 0.2], [34, 1.1]];
        for (const [sx, ph] of lasers) {
          const tx = enemies[sx === 22 ? 0 : 1][0] - t * 4, ty = gy(tx) - 7 + Math.sin(t * 3 + ph) * 2;
          lx.strokeStyle = `rgba(200,255,200,${0.55 + Math.sin(t * 20 + ph) * 0.2})`; lx.lineWidth = 1;
          lx.beginPath(); lx.moveTo(sx, gy(sx) - 7); lx.lineTo(tx, ty); lx.stroke();
          lx.fillStyle = g(140); lx.fillRect(sx - 2, gy(sx) - 9, 3, 5);
        }
        // sinalizador
        if (t > 1.0) {
          const k = t - 1.0, fx = 100 + k * 6 + Math.sin(k * 2) * 3, fy = k < 0.6 ? 90 - k * 130 : 12 + (k - 0.6) * 6;
          const r = lx.createRadialGradient(fx, fy, 0, fx, fy, 24 + fl * 30);
          r.addColorStop(0, `rgba(230,255,230,${0.3 * fl + 0.25})`); r.addColorStop(1, 'rgba(200,255,200,0)');
          lx.fillStyle = r; lx.fillRect(0, 0, LW, LH);
          lx.fillStyle = '#f4fff4'; lx.fillRect(fx - 1, fy - 1, 3, 3);
          lx.strokeStyle = 'rgba(200,255,200,0.25)'; lx.beginPath(); lx.moveTo(fx, fy); lx.lineTo(fx - 4, fy - 12); lx.stroke();
        }
        // traçantes
        if (t > 2.2 && t < 5.5) for (let i = 0; i < 4; i++) {
          const k = ((t * 2.5 + i * 0.27) % 1), x = 30 + k * 130, y = gy(30) - 8 - k * 4 + i;
          lx.fillStyle = '#f0fff0'; lx.fillRect(x, y, 6, 1);
        }
        blit(ctx, lc, W, Ht);
        // grão + vinheta do tubo
        for (let i = 0; i < 900; i++) { ctx.fillStyle = `rgba(180,255,190,${Math.random() * 0.12})`; ctx.fillRect(Math.random() * W, Math.random() * Ht, 2, 2); }
        const v = ctx.createRadialGradient(W / 2, Ht / 2, Ht * 0.35, W / 2, Ht / 2, Ht * 0.62);
        v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = v; ctx.fillRect(0, 0, W, Ht);
        hud(ctx, 'PVS-14  GAIN ' + (fl > 0.2 ? 'AUTO↓' : 'MAX'), W / 2, 24, '#bfffc5', 11, 'center');
      },
    };
  })();

  DR.playAnim = function (cv, id) {
    const a = DR.ANIMS[id];
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    DR.loop(cv, (ctx, W, Ht, t) => a.frame(ctx, W, Ht, t % a.T), a.poster != null ? a.poster : a.T * 0.4, reduce);
  };
})();
