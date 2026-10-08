/* DARKRIOT — micro motor voxel isométrico (canvas 2D) usado nas concept arts e GIFs. */
(function () {
  const DR = (window.DR = window.DR || {});

  DR.hash = function (x, y, z, s) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^
            Math.imul(z | 0, 2246822519) ^ Math.imul((s | 0) + 1, 3266489917);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };

  const rgbCache = new Map();
  DR.rgb = function (hex) {
    let c = rgbCache.get(hex);
    if (c) return c;
    let h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; // '#222' → '#222222'
    c = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    rgbCache.set(hex, c);
    return c;
  };

  // Paleta de camuflagem: escolhe cor por bloco (scale) via hash.
  DR.camo = function (pal, scale, seed) {
    scale = scale || 1;
    return (x, y, z) => pal[Math.floor(DR.hash(Math.floor(x / scale), Math.floor(y / scale), Math.floor(z / scale), seed || 7) * pal.length)];
  };

  class Vox {
    constructor() { this.m = new Map(); }
    static key(x, y, z) { return (x + 512) * 1048576 + (y + 512) * 1024 + (z + 512); }
    set(x, y, z, c) {
      const k = Vox.key(x, y, z);
      if (!c) this.m.delete(k); else this.m.set(k, [x, y, z, c]);
      return this;
    }
    clone() { const v = new Vox(); v.m = new Map(this.m); return v; }
    get(x, y, z) { const e = this.m.get(Vox.key(x, y, z)); return e ? e[3] : null; }
    has(x, y, z) { return this.m.has(Vox.key(x, y, z)); }
    box(x, y, z, w, d, h, c) {
      for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) for (let k = 0; k < h; k++) {
        const X = x + i, Y = y + j, Z = z + k;
        this.set(X, Y, Z, typeof c === 'function' ? c(X, Y, Z) : c);
      }
      return this;
    }
    carve(x, y, z, w, d, h) { return this.box(x, y, z, w, d, h, null); }
    sphere(cx, cy, cz, r, c, rough) {
      const R = Math.ceil(r + 1);
      for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) for (let k = -R; k <= R; k++) {
        const jit = rough ? (DR.hash(cx + i, cy + j, cz + k, 99) - 0.5) * rough : 0;
        if (i * i + j * j + k * k <= (r + jit) * (r + jit)) {
          const X = cx + i, Y = cy + j, Z = cz + k;
          if (c === null) this.set(X, Y, Z, null);
          else this.set(X, Y, Z, typeof c === 'function' ? c(X, Y, Z) : c);
        }
      }
      return this;
    }
    line(x0, y0, z0, x1, y1, z1, c) {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)) || 1;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const X = Math.round(x0 + (x1 - x0) * t), Y = Math.round(y0 + (y1 - y0) * t), Z = Math.round(z0 + (z1 - z0) * t);
        this.set(X, Y, Z, typeof c === 'function' ? c(X, Y, Z) : c);
      }
      return this;
    }
    // Remove voxels que estão sem chão (para destruição simples)
    each(fn) { for (const e of this.m.values()) fn(e[0], e[1], e[2], e[3]); }
    get size() { return this.m.size; }
    bounds() {
      let b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9];
      this.each((x, y, z) => {
        if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (z < b[2]) b[2] = z;
        if (x > b[3]) b[3] = x; if (y > b[4]) b[4] = y; if (z > b[5]) b[5] = z;
      });
      return b;
    }
  }
  DR.Vox = Vox;

  const A = Math.cos(Math.PI / 6), B = 0.5;

  // Calcula escala/offset para caber no canvas.
  // bounds opcional [x0, y0, z0, x1, y1, z1]: enquadra só essa caixa (o resto pode sair da imagem).
  DR.fit = function (vox, W, H, pad, extraZ, bounds) {
    const b = bounds || vox.bounds();
    const minSX = (b[0] - (b[4] + 1)) * A, maxSX = (b[3] + 1 - b[1]) * A;
    const minSY = (b[0] + b[1]) * B - (b[5] + 1 + (extraZ || 0)), maxSY = (b[3] + 1 + b[4] + 1) * B - b[2];
    pad = pad == null ? 20 : pad;
    const s = Math.min((W - pad * 2) / (maxSX - minSX), (H - pad * 2) / (maxSY - minSY));
    return { s, ox: (W - (maxSX + minSX) * s) / 2, oy: (H - (maxSY + minSY) * s) / 2 };
  };

  DR.project = function (x, y, z, o) {
    return [o.ox + (x - y) * A * o.s, o.oy + ((x + y) * B - z) * o.s];
  };

  function col(c, f, tint) {
    let r = c[0] * f, g = c[1] * f, b = c[2] * f;
    if (tint) { const t = tint(r, g, b); r = t[0]; g = t[1]; b = t[2]; }
    return 'rgb(' + (r < 0 ? 0 : r > 255 ? 255 : r | 0) + ',' + (g < 0 ? 0 : g > 255 ? 255 : g | 0) + ',' + (b < 0 ? 0 : b > 255 ? 255 : b | 0) + ')';
  }

  function quad(ctx, o, p, fill, stroke, lw) {
    ctx.beginPath();
    let q = DR.project(p[0], p[1], p[2], o); ctx.moveTo(q[0], q[1]);
    q = DR.project(p[3], p[4], p[5], o); ctx.lineTo(q[0], q[1]);
    q = DR.project(p[6], p[7], p[8], o); ctx.lineTo(q[0], q[1]);
    q = DR.project(p[9], p[10], p[11], o); ctx.lineTo(q[0], q[1]);
    ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
  }

  // Desenha um cubo (inteiro ou fracionário). faces: bitmask 1=topo 2=+x 4=+y
  function cube(ctx, o, x, y, z, c, faces, sz, j) {
    const f = sz || 1, t = o.tint, e = o.edge;
    const lt = o.light || [1, 0.78, 0.6];
    const x1 = x + f, y1 = y + f, z1 = z + f;
    const lw = e ? Math.max(0.6, o.s * 0.06) : 0.7;
    if (faces & 4) { const cl = col(c, lt[2] + j, t); quad(ctx, o, [x, y1, z, x1, y1, z, x1, y1, z1, x, y1, z1], cl, e ? col(c, (lt[2] + j) * 0.75, t) : cl, lw); }
    if (faces & 2) { const cl = col(c, lt[1] + j, t); quad(ctx, o, [x1, y, z, x1, y1, z, x1, y1, z1, x1, y, z1], cl, e ? col(c, (lt[1] + j) * 0.75, t) : cl, lw); }
    if (faces & 1) { const cl = col(c, lt[0] + j, t); quad(ctx, o, [x, y, z1, x1, y, z1, x1, y1, z1, x, y1, z1], cl, e ? col(c, (lt[0] + j) * 0.8, t) : cl, lw); }
  }

  // Render principal. o: {s, ox, oy, jitter, edge, tint, light, particles:[{x,y,z,c,sz}]}
  DR.render = function (ctx, vox, o) {
    const list = [];
    const jit = o.jitter == null ? 0.08 : o.jitter;
    for (const e of vox.m.values()) {
      const x = e[0], y = e[1], z = e[2];
      let f = 0;
      if (!vox.has(x, y, z + 1)) f |= 1;
      if (!vox.has(x + 1, y, z)) f |= 2;
      if (!vox.has(x, y + 1, z)) f |= 4;
      if (f) list.push([x + y + z, x, y, z, e[3], f, 1]);
    }
    if (o.particles) for (const p of o.particles) list.push([p.x + p.y + p.z, p.x, p.y, p.z, p.c, 7, p.sz || 1]);
    list.sort((a, b) => a[0] - b[0] || a[3] - b[3]);
    for (const it of list) {
      const j = (DR.hash(Math.floor(it[1]), Math.floor(it[2]), Math.floor(it[3]), 3) - 0.5) * jit * 2;
      cube(ctx, o, it[1], it[2], it[3], DR.rgb(it[4]), it[5], it[6], j);
    }
  };

  // Prepara canvas com DPR
  DR.setupCanvas = function (cv) {
    const dpr = Math.min(window.devicePixelRatio || 1, DR.MAX_DPR || 2);
    const W = cv.clientWidth || cv.width, H = cv.clientHeight || cv.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, W, H };
  };

  // Executa animação somente quando visível. posterT: quadro estático desenhado de cara
  // (e ao redimensionar fora da tela). staticOnly: só o pôster (prefers-reduced-motion).
  DR.loop = function (cv, frame, posterT, staticOnly) {
    let vis = false, start = performance.now(), raf = 0, env = DR.setupCanvas(cv);
    const still = () => { if (posterT != null) frame(env.ctx, env.W, env.H, posterT); };
    still();
    window.addEventListener('resize', () => { env = DR.setupCanvas(cv); if (!vis || staticOnly) still(); });
    if (staticOnly) return;
    const tick = (now) => {
      if (!vis) { raf = 0; return; }
      frame(env.ctx, env.W, env.H, (now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    new IntersectionObserver((ents) => {
      vis = ents[0].isIntersecting;
      if (vis && !raf) raf = requestAnimationFrame(tick);
    }, { threshold: 0.05 }).observe(cv);
  };
})();
