/* DARKRIOT — modelos voxel de referência (soldados, veículos, props, terreno). */
(function () {
  const DR = window.DR;

  DR.FACTIONS = {
    coalizao: {
      name: 'Coalizão Kalyna',
      camo: DR.camo(['#5b6b3a', '#6f7a45', '#4a5530', '#7c7350', '#3d4528'], 2, 11),
      vest: '#4f5a36', pouch: '#5f6b40', pack: '#4a5232',
      helmet: DR.camo(['#56603a', '#666f45', '#4b5533'], 2, 4),
      tape: ['#f5c400', '#1f5fbf'], skin: '#c99a76', glove: '#2e2e2a',
      gun: '#2a2a2a', gunAlt: '#8b7a55', mag: '#2a2a2a', pad: '#3a3f2a', mask: false,
    },
    legiao: {
      name: 'Legião Boreal',
      camo: DR.camo(['#4d5a3c', '#3b4530', '#6b6a4a', '#2e3326', '#59654a'], 1, 21),
      vest: '#4c5440', pouch: '#3f4636', pack: '#3a412f',
      helmet: DR.camo(['#4a543a', '#3c4530', '#5a6248'], 1, 9),
      tape: ['#f2f2f2', '#c8262b'], skin: '#d2a684', glove: '#242424',
      gun: '#262626', gunAlt: '#5a3b26', mag: '#6d3a2a', pad: '#2f3328', mask: true,
    },
  };

  // Soldado olhando para +x. pose: 'aim' | 'idle' | 'dig' | 'crouch' | 'ride' (sentado pilotando)
  // opt.goggles: óculos FPV levantados no capacete.
  DR.soldier = function (v, X, Y, Z, f, pose, opt) {
    pose = pose || 'aim';
    const U = f.camo, boot = '#25221d';
    const crouch = pose === 'crouch', ride = pose === 'ride';
    const L = crouch ? 3 : ride ? 4 : 6; // altura das pernas
    if (ride) {
      // coxas para a frente sobre o banco, canelas para baixo até as pedaleiras
      v.box(X, Y, Z + 2, 4, 2, 2, U); v.box(X, Y + 2, Z + 2, 4, 2, 2, U);
      v.box(X + 3, Y, Z - 2, 2, 2, 4, U); v.box(X + 3, Y + 2, Z - 2, 2, 2, 4, U);
      v.box(X + 3, Y, Z - 3, 3, 2, 1, boot); v.box(X + 3, Y + 2, Z - 3, 3, 2, 1, boot);
      v.box(X + 4, Y, Z + 2, 1, 2, 1, f.pad); v.box(X + 4, Y + 2, Z + 2, 1, 2, 1, f.pad);
      v.set(X + 1, Y + 3, Z + 3, f.tape[0]); v.set(X + 2, Y + 3, Z + 3, f.tape[1]);
    } else if (crouch) {
      v.box(X, Y, Z, 4, 2, 2, U); v.box(X - 1, Y + 2, Z, 2, 2, 3, U);
      v.box(X + 3, Y, Z, 1, 2, 1, boot); v.box(X - 1, Y + 2, Z, 1, 2, 1, boot);
      v.box(X + 3, Y, Z + 2, 1, 2, 1, f.pad);
    } else {
      v.box(X, Y, Z, 2, 2, L, U); v.box(X, Y + 2, Z, 2, 2, L, U);
      v.box(X, Y, Z, 3, 2, 1, boot); v.box(X, Y + 2, Z, 3, 2, 1, boot);
      v.box(X + 2, Y, Z + 3, 1, 2, 1, f.pad); v.box(X + 2, Y + 2, Z + 3, 1, 2, 1, f.pad);
      v.set(X + 1, Y + 3, Z + 4, f.tape[0]); v.set(X + 1, Y + 3, Z + 5, f.tape[1]);
    }
    const T = Z + L;
    v.box(X, Y, T, 2, 4, 6, U);
    v.box(X, Y, T + 1, 3, 4, 4, f.vest);
    v.box(X + 3, Y, T + 1, 1, 1, 2, f.pouch); v.box(X + 3, Y + 3, T + 1, 1, 1, 2, f.pouch);
    v.set(X + 3, Y + 1, T + 2, f.pouch);
    v.box(X - 2, Y, T + 1, 2, 4, 5, f.pack);
    v.box(X - 3, Y + 1, T + 3, 1, 2, 2, f.pouch);
    // braços
    v.box(X, Y - 1, T + 2, 1, 1, 4, U); v.box(X, Y + 4, T + 2, 1, 1, 4, U);
    v.set(X, Y - 1, T + 4, f.tape[0]); v.set(X, Y - 1, T + 3, f.tape[1]);
    v.set(X, Y + 4, T + 4, f.tape[0]); v.set(X, Y + 4, T + 3, f.tape[1]);
    if (pose === 'aim' || crouch) {
      v.box(X + 1, Y - 1, T + 2, 3, 1, 1, U); v.box(X + 4, Y - 1, T + 2, 1, 2, 1, f.glove);
      v.box(X + 4, Y, T + 2, 1, 3, 1, f.glove);
      v.box(X + 1, Y + 4, T + 2, 2, 1, 1, U); v.set(X + 3, Y + 4, T + 2, f.glove);
      DR.rifle(v, X + 2, Y + 3, T + 3, f);
    } else if (ride) {
      v.box(X + 1, Y - 1, T + 2, 6, 1, 1, U); v.set(X + 7, Y - 1, T + 2, f.glove);
      v.box(X + 1, Y + 4, T + 2, 6, 1, 1, U); v.set(X + 7, Y + 4, T + 2, f.glove);
    } else if (pose === 'dig') {
      v.box(X + 1, Y - 1, T + 2, 2, 1, 1, U); v.box(X + 1, Y + 4, T + 2, 2, 1, 1, U);
      v.line(X + 3, Y + 1, T + 3, X + 7, Y + 1, T - 3, '#6b4a2b');
      v.box(X + 7, Y, T - 5, 1, 3, 3, '#5a5f60');
    } else {
      v.set(X, Y - 1, T + 1, f.glove); v.set(X, Y + 4, T + 1, f.glove);
      v.box(X - 1, Y + 5, T - 1, 1, 1, 9, f.gun);
    }
    // cabeça
    const H = T + 6;
    v.box(X, Y, H, 3, 4, 4, f.mask ? '#2c2c28' : f.skin);
    if (f.mask) v.box(X + 2, Y, H + 2, 1, 4, 1, f.skin);
    v.set(X + 2, Y + 1, H + 2, '#1a1a1a'); v.set(X + 2, Y + 2, H + 2, '#1a1a1a');
    if (!f.mask) v.box(X + 2, Y, H, 1, 4, 1, '#3a3a32'); // gola / shemagh
    // capacete
    v.box(X - 1, Y - 1, H + 3, 4, 6, 1, f.helmet);
    v.box(X - 1, Y, H + 4, 4, 4, 1, f.helmet);
    v.box(X - 1, Y - 1, H + 1, 1, 6, 2, f.helmet);
    v.set(X + 3, Y + 1, H + 4, '#1b1b1b');
    v.box(X - 1, Y, H + 3, 1, 4, 1, f.tape[0]);
    if (opt && opt.goggles) {
      v.box(X + 3, Y, H + 3, 1, 4, 1, '#151515');
      v.set(X + 3, Y + 1, H + 3, '#2a4a8a'); v.set(X + 3, Y + 2, H + 3, '#2a4a8a');
      v.box(X + 2, Y + 3, H + 4, 1, 1, 2, '#222');
    }
  };

  DR.rifle = function (v, X, Y, Z, f) {
    v.box(X, Y, Z, 9, 1, 1, f.gun);
    v.box(X - 1, Y, Z - 1, 2, 1, 2, f.gunAlt);
    v.box(X + 3, Y, Z - 2, 1, 1, 2, f.mag); v.set(X + 4, Y, Z - 2, f.mag);
    v.set(X + 1, Y, Z - 1, f.gun);
    v.box(X + 2, Y, Z + 1, 2, 1, 1, '#151515');
    v.box(X + 9, Y, Z, 2, 1, 1, '#151515');
  };

  // Terreno estilo blocos (topo grama). fn opcional altura(x,y)
  DR.ground = function (v, x0, y0, W, D, H, opt) {
    opt = opt || {};
    const grass = opt.grass || ['#5f7a33', '#6b8a3a', '#56702e', '#73903f'];
    const dirt = opt.dirt || ['#6b4e32', '#5d432b', '#76583a'];
    const g = DR.camo(grass, 2, 5), d = DR.camo(dirt, 2, 6);
    for (let i = 0; i < W; i++) for (let j = 0; j < D; j++) {
      const h = opt.height ? opt.height(x0 + i, y0 + j) : H;
      for (let k = 0; k < h; k++) {
        v.set(x0 + i, y0 + j, k, k === h - 1 ? g(x0 + i, y0 + j, k) : d(x0 + i, y0 + j, k));
      }
    }
  };

  DR.sunflower = function (v, x, y, z, h) {
    const stem = '#4d7a2a';
    v.box(x, y, z, 1, 1, h, stem);
    v.set(x, y + 1, z + Math.floor(h / 2), '#5c8f32'); v.set(x, y - 1, z + Math.floor(h / 2) + 1, '#5c8f32');
    const top = z + h;
    v.box(x + 1, y - 1, top - 1, 1, 3, 3, '#f2c418');
    v.set(x + 1, y, top, '#5a3a1a');
    v.set(x + 1, y - 2, top, '#e0a810'); v.set(x + 1, y + 2, top, '#e0a810');
    v.set(x + 1, y, top + 2, '#e0a810'); v.set(x + 1, y, top - 2, '#e0a810');
  };

  DR.sandbags = function (v, x, y, z, len, axis, rows) {
    const c = DR.camo(['#a8946a', '#9a8660', '#b49f74'], 1, 3);
    for (let r = 0; r < (rows || 2); r++) for (let i = 0; i < len; i++) {
      if (axis === 'x') v.box(x + i, y, z + r, 1, 2, 1, c); else v.box(x, y + i, z + r, 2, 1, 1, c);
    }
  };

  DR.tree = function (v, x, y, z, h, burnt) {
    v.box(x, y, z, 2, 2, h, burnt ? '#1e1b18' : '#5a3f28');
    if (burnt) {
      v.line(x, y, z + h - 2, x - 3, y + 1, z + h + 2, '#1e1b18');
      v.line(x + 1, y + 1, z + h - 3, x + 4, y + 2, z + h + 1, '#262220');
      return;
    }
    const L = DR.camo(['#3f6b2a', '#4b7a30', '#355a24', '#557f35'], 1, 8);
    v.sphere(x + 1, y + 1, z + h + 1, 4, L, 1.4);
  };

  DR.house = function (v, x, y, z, ruined) {
    const wall = DR.camo(['#e6e0d0', '#d9d2c0', '#efe9da'], 2, 2);
    const W = 16, D = 12, H = 9;
    v.box(x, y, z, W, D, 1, '#7a7468');
    v.box(x, y, z + 1, W, D, H, wall);
    v.carve(x + 1, y + 1, z + 1, W - 2, D - 2, H);
    v.box(x, y, z + 1, W, D, 1, '#4f6f9a');
    // janelas e porta
    for (const wy of [2, 7]) { v.box(x + W - 1, y + wy, z + 4, 1, 3, 3, '#2a3440'); v.box(x + W - 1, y + wy - 1, z + 3, 1, 5, 1, '#4f6f9a'); }
    v.box(x + 4, y + D - 1, z + 1, 3, 1, 6, '#6b4a2b');
    v.box(x + 10, y + D - 1, z + 4, 3, 1, 3, '#2a3440');
    // telhado
    const roof = DR.camo(['#4e6b62', '#5a7a70', '#466058'], 2, 1);
    for (let k = 0; k < 6; k++) v.box(x - 1, y - 1 + k, z + H + 1 + k, W + 2, D + 2 - 2 * k, 1, roof);
    v.box(x + 3, y + 3, z + H + 2, 2, 2, 8, '#8a4b3a');
    if (ruined) {
      v.sphere(x + W, y + 4, z + 6, 4.2, null, 2);
      v.sphere(x + 8, y + 6, z + H + 5, 5, null, 2);
      v.sphere(x + 2, y + D, z + 3, 3, null, 1.5);
    }
  };

  DR.tank = function (v, X, Y, Z, cage) {
    const g = DR.camo(['#4d5233', '#575c3a', '#43482c', '#5e5f3c'], 2, 13);
    const tr = '#2a2925';
    v.box(X, Y - 1, Z, 26, 3, 3, tr); v.box(X, Y + 12, Z, 26, 3, 3, tr);
    for (let i = 2; i < 26; i += 4) { v.box(X + i, Y + 14, Z, 2, 1, 2, '#4a4a40'); v.box(X + i, Y - 1, Z, 2, 1, 2, '#4a4a40'); }
    v.box(X + 26, Y - 1, Z + 1, 1, 3, 1, tr); v.box(X + 26, Y + 12, Z + 1, 1, 3, 1, tr);
    v.box(X, Y + 2, Z + 1, 26, 10, 2, g);
    v.box(X, Y - 1, Z + 3, 26, 16, 3, g);
    v.box(X + 26, Y, Z + 2, 2, 14, 3, g);
    // ERA na frente
    for (let j = 0; j < 14; j += 2) v.box(X + 22, Y + j, Z + 6, 3, 2, 1, (j / 2) % 2 ? '#5d6340' : '#666b47');
    // torre
    v.box(X + 7, Y + 2, Z + 6, 12, 11, 3, g);
    v.box(X + 8, Y + 3, Z + 9, 10, 9, 1, g);
    for (let j = 0; j < 11; j += 2) v.box(X + 19, Y + 2 + j, Z + 6, 1, 2, 2, (j / 2) % 2 ? '#5d6340' : '#6a6f4a');
    v.box(X + 19, Y + 7, Z + 7, 18, 1, 1, '#3b3d2c');
    v.box(X + 25, Y + 7, Z + 7, 3, 1, 1, '#2f3123');
    v.box(X + 10, Y + 9, Z + 10, 3, 2, 1, '#3b3d2c');
    v.set(X + 13, Y + 5, Z + 10, '#3b3d2c');
    v.box(X - 1, Y + 1, Z + 4, 1, 13, 1, '#6b4a2b');
    // barris extras atrás
    v.box(X + 1, Y + 1, Z + 6, 3, 2, 2, '#3e4230'); v.box(X + 1, Y + 11, Z + 6, 3, 2, 2, '#3e4230');
    if (cage) {
      const c = '#3a3a33', zt = Z + 14;
      for (const [a, b] of [[7, 1], [19, 1], [7, 13], [19, 13]]) v.box(X + a, Y + b, Z + 9, 1, 1, 5, c);
      for (let i = 6; i <= 21; i += 3) v.line(X + i, Y, zt, X + i, Y + 14, zt, c);
      for (let j = 0; j <= 14; j += 3) v.line(X + 6, Y + j, zt, X + 21, Y + j, zt, c);
      v.line(X + 6, Y, zt, X + 21, Y + 14, zt, c);
    }
    // fita de identificação
    v.box(X + 7, Y + 12, Z + 7, 12, 1, 1, '#f2f2f2');
  };

  DR.ifv = function (v, X, Y, Z) {
    const g = DR.camo(['#6b6a48', '#5f6040', '#77754f'], 2, 15);
    v.box(X, Y - 1, Z, 22, 2, 3, '#2a2925'); v.box(X, Y + 10, Z, 22, 2, 3, '#2a2925');
    v.box(X, Y - 1, Z + 3, 22, 13, 5, g);
    v.box(X + 22, Y, Z + 2, 2, 11, 4, g);
    v.box(X + 10, Y + 2, Z + 8, 7, 8, 3, g);
    v.box(X + 17, Y + 4, Z + 9, 10, 1, 1, '#2f3123');
    v.box(X + 2, Y + 3, Z + 8, 4, 6, 1, '#54523a');
    v.box(X + 11, Y + 1, Z + 11, 1, 1, 4, '#222');
    v.box(X + 10, Y + 9, Z + 9, 7, 1, 1, '#f5c400');
    v.box(X + 10, Y + 10, Z + 9, 7, 1, 1, '#1f5fbf');
  };

  DR.fpv = function (v, X, Y, Z, k) {
    k = k || 1;
    const frame = '#1d1f22', motor = '#3a3d42', prop = '#8a8f96';
    v.box(X - 3, Y - 2, Z, 7, 5, 1, frame);
    v.line(X - 2, Y - 1, Z, X - 9, Y - 8, Z, frame); v.line(X + 2, Y - 1, Z, X + 9, Y - 8, Z, frame);
    v.line(X - 2, Y + 1, Z, X - 9, Y + 8, Z, frame); v.line(X + 2, Y + 1, Z, X + 9, Y + 8, Z, frame);
    for (const [a, b] of [[-9, -8], [9, -8], [-9, 8], [9, 8]]) {
      v.box(X + a, Y + b, Z, 2, 2, 2, motor);
      v.line(X + a - 4, Y + b + 1, Z + 2, X + a + 5, Y + b + 1, Z + 2, prop);
    }
    v.box(X - 2, Y - 1, Z + 1, 5, 3, 2, '#2b2f36');
    v.box(X - 1, Y - 1, Z + 3, 3, 3, 1, '#d4a514');
    v.box(X + 4, Y - 1, Z + 1, 1, 3, 2, '#111');
    v.set(X + 5, Y, Z + 2, '#3d6bd9');
    v.box(X - 1, Y + 1, Z + 4, 1, 1, 3, '#222');
    // ogiva amarrada
    v.box(X - 2, Y - 1, Z - 3, 8, 3, 3, '#4c5a33');
    v.box(X + 6, Y, Z - 2, 2, 1, 1, '#3c4728');
    v.box(X - 4, Y - 1, Z - 3, 2, 3, 3, '#2c2c2c');
    v.box(X + 1, Y - 1, Z - 1, 1, 3, 1, '#c8c8c8');
  };

  DR.wire = function (v, x, y, z, len) {
    for (let i = 0; i < len; i++) {
      if (i % 4 === 0) v.box(x + i, y, z, 1, 1, 3, '#5a3f28');
      v.set(x + i, y, z + 1 + (i % 2), '#8d8f90');
    }
  };

  DR.crate = function (v, x, y, z, c) {
    v.box(x, y, z, 4, 3, 2, c || '#5a6438');
    v.box(x, y, z + 2, 4, 3, 1, '#4a5230');
    v.set(x + 3, y + 1, z + 1, '#d0c060');
  };
})();
