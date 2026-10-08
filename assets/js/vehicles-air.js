/* DARKRIOT — aeronaves tripuladas (os drones ficam de fora da contagem).
   Mesmas convenções: nariz para +x, (X, Y, Z) = traseira da fuselagem principal, lado direito, base. */
(function () {
  const DR = window.DR, H = DR.hash, A = DR.ART;
  const { dust, rotor, tailRotor, disc, shadow, merge, UC, RU, GLASS, BLACK, HUB, ROTOR, PORT } = DR.VH;
  const PROP = '#2a2c2a', SPINNER = '#c9a227';
  const NEUTRAL = ['#e8e2d0', '#5d6569'];

  // Hélice no plano y-z, na posição x.
  function prop(v, x, cy, cz, R, n, start) {
    for (let k = 0; k < n; k++) {
      const a = start + k * 2 * Math.PI / n;
      v.line(x, cy, cz, x, Math.round(cy + Math.cos(a) * R), Math.round(cz + Math.sin(a) * R), PROP);
    }
  }
  // Caixa de suprimentos descendo de paraquedas (cúpula em casca, cordas e caixa).
  function chute(v, cx, cy, cz, col) {
    for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) for (let k = 0; k <= 3; k++) {
      const d = i * i + j * j + (k * 1.4) * (k * 1.4);
      if (d <= 17 && d >= 9) v.set(cx + i, cy + j, cz + k, (i + j) & 1 ? col : '#e8e2d0');
    }
    for (const [a, b] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) v.line(cx + a, cy + b, cz, cx, cy, cz - 7, '#b8b8b0');
    DR.crate(v, cx - 2, cy - 1, cz - 10);
  }
  // Nuvem voxel (para as cenas no alto).
  function cloud(v, x, y, z, s, seed) {
    const C = DR.camo(['#f2f4f5', '#e3e7ea', '#d5dbe0'], 2, seed);
    for (let k = 0; k < 4; k++) v.sphere(x + Math.round(H(k, 1, seed) * s * 2), y + Math.round(H(k, 2, seed) * s), z + (k % 2), Math.max(2, s - k), C, 1.2);
  }
  // Campo visto do alto: lavouras em retalhos e cinturões de árvores.
  function farmland(v, x0, y0, W, D) {
    const crops = ['#c9a925', '#bfae6a', '#6b5236', '#7d963f', '#d6b52a', '#9aa24e'];
    for (let i = 0; i < W; i++) for (let j = 0; j < D; j++) {
      const x = x0 + i, y = y0 + j, f = crops[Math.floor(H(Math.floor(x / 14), Math.floor(y / 10), 1, 5) * crops.length)];
      v.set(x, y, 0, '#5d432b');
      v.set(x, y, 1, (((x % 14) + 14) % 14 === 0 || ((y % 10) + 10) % 10 === 0) ? '#2f4a25' : f);
    }
  }

  /* ---------------- HELICÓPTEROS ---------------- */

  DR.anjo = function (v, X, Y, Z) {
    const W = DR.camo(['#e8e8e2', '#dcdcd5', '#f0f0ea'], 2, 131), G = '#1f8a4c';
    v.box(X, Y, Z + 2, 12, 6, 5, W);
    for (const yy of [Y, Y + 5]) { v.carve(X, yy, Z + 6, 12, 1, 1); v.carve(X, yy, Z + 2, 12, 1, 1); }
    v.box(X + 12, Y + 1, Z + 2, 3, 4, 4, W); v.box(X + 15, Y + 2, Z + 3, 1, 2, 2, W);
    v.box(X + 12, Y + 1, Z + 4, 3, 4, 2, GLASS); v.box(X + 15, Y + 2, Z + 4, 1, 2, 1, GLASS);
    v.box(X + 6, Y + 5, Z + 3, 4, 1, 2, GLASS);
    v.box(X + 2, Y + 1, Z + 7, 8, 4, 2, '#cfcfc8');
    // cone de cauda, deriva com rotor carenado e estabilizador
    v.box(X - 13, Y + 2, Z + 4, 13, 2, 2, W);
    v.box(X - 16, Y + 2, Z + 4, 3, 2, 7, W);
    v.box(X - 16, Y + 3, Z + 6, 3, 1, 3, '#2b2b25'); v.set(X - 15, Y + 3, Z + 7, '#5d6569');
    v.box(X - 12, Y - 1, Z + 4, 2, 8, 1, W);
    for (const yy of [Y - 1, Y + 6]) { v.box(X, yy, Z, 13, 1, 1, HUB); v.box(X + 2, yy, Z + 1, 1, 1, 1, HUB); v.box(X + 9, yy, Z + 1, 1, 1, 1, HUB); }
    // marcas médicas: cruz e faixa verdes (a cruz vermelha é emblema protegido)
    v.box(X + 3, Y + 5, Z + 3, 1, 1, 3, G); v.box(X + 2, Y + 5, Z + 4, 3, 1, 1, G);
    v.box(X - 9, Y + 3, Z + 4, 6, 1, 2, G);
    v.box(X + 5, Y + 2, Z + 9, 2, 2, 1, HUB);
    rotor(v, X + 6, Y + 3, Z + 10, 14, 4, 0.5, ROTOR);
  };

  DR.marimbondo = function (v, X, Y, Z, paint, tape) {
    const P = paint;
    v.box(X, Y + 1, Z + 1, 22, 6, 6, P);
    for (const yy of [Y + 1, Y + 6]) { v.carve(X, yy, Z + 1, 22, 1, 1); v.carve(X, yy, Z + 6, 22, 1, 1); }
    // nariz com cabines em degrau (atirador na frente e embaixo, piloto atrás e em cima)
    v.box(X + 22, Y + 1, Z + 1, 4, 6, 5, P);
    v.box(X + 26, Y + 2, Z + 1, 3, 4, 3, P);
    v.box(X + 26, Y + 2, Z + 4, 3, 4, 2, GLASS);
    v.box(X + 22, Y + 2, Z + 6, 4, 4, 2, GLASS);
    v.box(X + 28, Y + 3, Z, 2, 2, 1, BLACK); v.box(X + 30, Y + 3, Z, 3, 1, 1, BLACK);
    // asas curtas com casulos de foguetes e mísseis nas pontas
    v.box(X + 10, Y - 6, Z + 4, 5, 20, 1, P);
    for (const yy of [Y - 5, Y - 2, Y + 9, Y + 12]) { v.box(X + 9, yy, Z + 2, 6, 1, 2, '#3b3d2c'); v.box(X + 14, yy, Z + 2, 1, 1, 2, '#151515'); }
    v.box(X + 11, Y - 7, Z + 4, 3, 1, 1, '#d9d9d6'); v.box(X + 11, Y + 14, Z + 4, 3, 1, 1, '#d9d9d6');
    // motores, mastro e 5 pás
    v.box(X + 8, Y + 2, Z + 7, 13, 4, 3, P);
    v.box(X + 21, Y + 2, Z + 7, 1, 1, 2, '#151515'); v.box(X + 21, Y + 5, Z + 7, 1, 1, 2, '#151515');
    v.box(X + 13, Y + 3, Z + 10, 2, 2, 2, HUB); v.box(X + 12, Y + 2, Z + 12, 4, 4, 1, HUB);
    rotor(v, X + 14, Y + 4, Z + 13, 22, 5, 0.4, ROTOR);
    // cauda
    v.box(X - 18, Y + 3, Z + 4, 18, 2, 2, P);
    v.box(X - 22, Y + 3, Z + 4, 4, 2, 8, P);
    v.box(X - 13, Y, Z + 5, 3, 8, 1, P);
    v.box(X - 20, Y + 5, Z + 9, 1, 1, 1, HUB);
    tailRotor(v, X - 20, Y + 6, Z + 9, 5, 3, ROTOR);
    v.box(X + 5, Y + 6, Z + 2, 3, 1, 3, '#2b2e2a');
    v.box(X - 8, Y + 3, Z + 4, 1, 2, 2, tape[0]); v.box(X - 9, Y + 3, Z + 4, 1, 2, 2, tape[1]);
  };

  DR.jacare = function (v, X, Y, Z, paint, tape) {
    const P = paint;
    v.box(X, Y + 1, Z + 1, 20, 6, 5, P);
    for (const yy of [Y + 1, Y + 6]) { v.carve(X, yy, Z + 1, 20, 1, 1); v.carve(X, yy, Z + 5, 20, 1, 1); }
    v.box(X + 20, Y + 1, Z + 1, 5, 6, 4, P); v.box(X + 25, Y + 2, Z + 1, 2, 4, 3, P);
    v.box(X + 20, Y + 1, Z + 5, 5, 6, 2, GLASS); v.box(X + 22, Y + 1, Z + 5, 1, 6, 2, '#3b3d3f');
    v.box(X + 25, Y + 3, Z - 1, 2, 2, 2, '#2b2b25'); v.set(X + 27, Y + 3, Z, '#3d6bd9');
    v.box(X + 10, Y - 6, Z + 3, 5, 20, 1, P);
    for (const yy of [Y - 5, Y - 2, Y + 9, Y + 12]) { v.box(X + 9, yy, Z + 1, 6, 1, 2, '#3b3d2c'); v.box(X + 14, yy, Z + 1, 1, 1, 2, '#151515'); }
    v.box(X + 12, Y + 7, Z + 1, 7, 1, 1, BLACK);
    // cauda em H, sem rotor de cauda
    v.box(X - 16, Y + 2, Z + 3, 16, 4, 3, P);
    v.box(X - 19, Y - 2, Z + 5, 3, 12, 1, P);
    v.box(X - 19, Y - 2, Z + 3, 3, 1, 6, P); v.box(X - 19, Y + 9, Z + 3, 3, 1, 6, P);
    // dois rotores coaxiais girando em sentidos opostos
    v.box(X + 11, Y + 3, Z + 6, 2, 2, 7, HUB);
    v.box(X + 10, Y + 2, Z + 9, 4, 4, 1, HUB); v.box(X + 10, Y + 2, Z + 12, 4, 4, 1, HUB);
    rotor(v, X + 12, Y + 4, Z + 10, 20, 3, 0.2, ROTOR);
    rotor(v, X + 12, Y + 4, Z + 13, 20, 3, 1.25, ROTOR);
    v.box(X - 8, Y + 5, Z + 4, 1, 1, 2, tape[0]); v.box(X - 9, Y + 5, Z + 4, 1, 1, 2, tape[1]);
  };

  /* ---------------- AVIÕES ---------------- */

  DR.gralha = function (v, X, Y, Z, paint, tape) {
    const P = paint;
    v.box(X, Y + 3, Z + 2, 26, 4, 4, P);
    v.box(X + 26, Y + 4, Z + 3, 4, 2, 2, P); v.box(X + 30, Y + 4, Z + 3, 2, 2, 1, '#2b2b25');
    v.box(X + 19, Y + 4, Z + 6, 4, 2, 2, GLASS);
    for (const yy of [Y + 1, Y + 7]) { v.box(X + 1, yy, Z + 2, 15, 2, 3, P); v.box(X + 15, yy, Z + 2, 1, 2, 3, '#151515'); v.box(X, yy, Z + 2, 1, 2, 3, '#2b2b25'); }
    v.box(X + 9, Y - 12, Z + 4, 7, 34, 1, P);
    v.carve(X + 14, Y - 12, Z + 4, 2, 4, 1); v.carve(X + 14, Y + 18, Z + 4, 2, 4, 1);
    for (const yy of [Y - 9, Y - 5, Y + 14, Y + 18]) v.box(X + 10, yy, Z + 2, 5, 1, 2, yy % 2 ? '#3b3d2c' : '#4c5a33');
    v.box(X - 1, Y + 4, Z + 6, 5, 2, 7, P);
    v.box(X - 1, Y - 3, Z + 5, 4, 16, 1, P);
    v.box(X, Y + 5, Z + 9, 3, 1, 1, tape[0]); v.box(X, Y + 5, Z + 8, 3, 1, 1, tape[1]);
  };

  DR.falcao = function (v, X, Y, Z, paint, tape) {
    const P = paint;
    v.box(X, Y + 2, Z + 2, 24, 3, 3, P);
    v.box(X + 24, Y + 2, Z + 2, 3, 3, 2, P); v.box(X + 27, Y + 3, Z + 2, 2, 1, 1, P);
    v.box(X + 14, Y + 2, Z, 6, 3, 2, P); v.box(X + 19, Y + 2, Z, 1, 3, 2, '#151515');
    v.box(X + 17, Y + 2, Z + 5, 6, 3, 2, '#b89a4a');
    v.box(X - 2, Y + 2, Z + 2, 2, 3, 3, '#3b3d3f');
    // asas trapezoidais em degraus e mísseis nas pontas
    v.box(X + 4, Y - 2, Z + 3, 11, 9, 1, P);
    v.box(X + 5, Y - 5, Z + 3, 8, 15, 1, P);
    v.box(X + 6, Y - 9, Z + 3, 4, 23, 1, P);
    v.box(X + 5, Y - 10, Z + 3, 6, 1, 1, '#d9d9d6'); v.box(X + 5, Y + 14, Z + 3, 6, 1, 1, '#d9d9d6');
    v.box(X + 6, Y - 5, Z + 1, 6, 1, 2, '#5d6569'); v.box(X + 6, Y + 9, Z + 1, 6, 1, 2, '#5d6569');
    v.box(X, Y + 3, Z + 5, 5, 1, 6, P); v.box(X + 1, Y + 3, Z + 11, 3, 1, 1, P);
    v.box(X - 1, Y - 2, Z + 3, 4, 9, 1, P);
    v.box(X + 1, Y + 3, Z + 8, 2, 1, 1, tape[0]); v.box(X + 1, Y + 3, Z + 7, 2, 1, 1, tape[1]);
  };

  DR.urubu = function (v, X, Y, Z, paint, tape) {
    const P = paint;
    v.box(X, Y + 1, Z + 2, 30, 7, 4, P);
    v.box(X + 30, Y + 2, Z + 3, 7, 5, 2, P); v.box(X + 37, Y + 3, Z + 3, 2, 3, 1, P);
    v.box(X + 24, Y + 2, Z + 6, 6, 5, 2, GLASS); v.box(X + 26, Y + 2, Z + 6, 1, 5, 2, '#3b3d3f');
    for (const yy of [Y - 1, Y + 8]) { v.box(X + 12, yy, Z + 2, 8, 1, 3, P); v.box(X + 19, yy, Z + 2, 1, 1, 3, '#151515'); }
    v.box(X + 4, Y - 14, Z + 4, 13, 37, 1, P);
    v.carve(X + 13, Y - 14, Z + 4, 4, 6, 1); v.carve(X + 13, Y + 17, Z + 4, 4, 6, 1);
    v.carve(X + 15, Y - 8, Z + 4, 2, 4, 1); v.carve(X + 15, Y + 13, Z + 4, 2, 4, 1);
    v.box(X + 23, Y - 4, Z + 4, 3, 17, 1, P);
    for (const yy of [Y + 1, Y + 7]) v.box(X, yy, Z + 6, 6, 1, 8, P);
    v.box(X - 1, Y - 6, Z + 4, 5, 21, 1, P);
    for (const yy of [Y + 2, Y + 5]) v.box(X - 2, yy, Z + 2, 2, 2, 3, '#3b3d3f');
    // bomba planadora presa sob a fuselagem
    v.box(X + 10, Y + 3, Z, 7, 2, 2, '#3b3d2c'); v.box(X + 12, Y + 1, Z + 1, 2, 6, 1, '#4c5233');
    v.box(X + 1, Y + 7, Z + 9, 3, 1, 1, tape[0]); v.box(X + 1, Y + 7, Z + 8, 3, 1, 1, tape[1]);
  };
  // Bomba planadora já lançada, com as asas abertas.
  function glideBomb(v, x, y, z) {
    v.box(x, y, z, 8, 2, 2, '#3b3d2c'); v.box(x + 8, y, z, 1, 2, 1, '#2b2b25');
    v.box(x + 3, y - 4, z + 2, 2, 10, 1, '#4c5233'); v.box(x - 1, y - 1, z, 1, 4, 2, '#2b2b25');
  }

  DR.pardal = function (v, X, Y, Z, paint, tape) {
    const P = paint;
    v.box(X, Y + 2, Z + 2, 14, 3, 3, P);
    v.box(X - 6, Y + 2, Z + 3, 6, 3, 2, P);
    v.box(X + 14, Y + 1, Z + 1, 3, 5, 5, '#3b3d3f');
    for (const [a, b] of [[1, 1], [1, 4], [4, 1], [4, 4]]) v.set(X + 16, Y + a, Z + b, '#5d6569');
    v.box(X + 17, Y + 3, Z + 3, 1, 1, 1, SPINNER);
    prop(v, X + 18, Y + 3, Z + 3, 5, 2, 0.6);
    // cabine em tandem; a capota traseira aberta deixa o atirador mirar os drones
    v.box(X + 6, Y + 2, Z + 5, 7, 3, 2, GLASS); v.box(X + 9, Y + 2, Z + 5, 1, 3, 2, '#3b3d3f');
    v.carve(X + 6, Y + 2, Z + 6, 3, 3, 1);
    v.box(X + 7, Y + 5, Z + 6, 1, 4, 1, BLACK);
    v.box(X + 7, Y - 8, Z + 2, 5, 19, 1, P);
    v.box(X - 6, Y + 3, Z + 5, 3, 1, 4, P); v.box(X - 6, Y - 1, Z + 4, 3, 7, 1, P);
    v.box(X + 9, Y - 2, Z, 1, 1, 2, BLACK); v.box(X + 9, Y + 6, Z, 1, 1, 2, BLACK);
    v.box(X + 1, Y + 4, Z + 3, 5, 1, 1, tape[0]); v.box(X - 6, Y + 3, Z + 8, 3, 1, 1, tape[1]);
  };
  // Drone de longo alcance em asa delta (o alvo do Pardal).
  function deltaDrone(v, X, Y, Z) {
    for (let i = 0; i < 8; i++) v.box(X + i, Y - (7 - i), Z, 1, 2 * (7 - i) + 1, 1, '#4a4d50');
    v.box(X - 1, Y, Z, 10, 1, 2, '#3b3d3f');
    v.box(X, Y - 7, Z + 1, 2, 1, 2, '#3b3d3f'); v.box(X, Y + 7, Z + 1, 2, 1, 2, '#3b3d3f');
    v.box(X - 2, Y, Z, 1, 1, 1, '#222');
  }

  DR.abelha = function (v, X, Y, Z, paint) {
    const P = paint;
    v.box(X, Y + 1, Z + 2, 16, 5, 6, P);
    v.carve(X, Y + 1, Z + 7, 16, 1, 1); v.carve(X, Y + 5, Z + 7, 16, 1, 1);
    v.box(X - 10, Y + 2, Z + 4, 10, 3, 3, P);
    v.box(X + 16, Y + 1, Z + 2, 3, 5, 6, '#3b3d3f');
    v.box(X + 19, Y + 3, Z + 4, 1, 1, 2, SPINNER);
    prop(v, X + 20, Y + 3, Z + 5, 6, 4, 0.4);
    v.box(X + 13, Y + 1, Z + 6, 3, 5, 2, GLASS);
    for (let i = 2; i < 12; i += 3) v.set(X + i, Y + 5, Z + 5, PORT);
    v.box(X + 4, Y + 5, Z + 2, 2, 1, 4, '#2b2e2a');
    // duas asas com montantes
    v.box(X + 8, Y - 15, Z + 10, 6, 35, 1, P);
    v.box(X + 9, Y - 11, Z + 2, 5, 27, 1, P);
    for (const yy of [Y - 9, Y + 13]) { v.box(X + 10, yy, Z + 3, 1, 1, 7, HUB); v.box(X + 12, yy, Z + 3, 1, 1, 7, HUB); }
    v.box(X + 10, Y + 1, Z + 8, 1, 1, 2, HUB); v.box(X + 10, Y + 5, Z + 8, 1, 1, 2, HUB);
    v.box(X - 12, Y + 3, Z + 5, 3, 1, 8, P); v.box(X - 12, Y - 3, Z + 6, 3, 11, 1, P);
    v.box(X + 11, Y - 1, Z - 1, 2, 1, 3, BLACK); v.box(X + 11, Y + 5, Z - 1, 2, 1, 3, BLACK);
    v.box(X - 10, Y + 3, Z + 3, 1, 1, 1, BLACK);
  };

  DR.cegonha = function (v, X, Y, Z, paint) {
    const P = paint;
    v.box(X, Y + 1, Z + 3, 36, 8, 8, P);
    for (const yy of [Y + 1, Y + 8]) { v.carve(X, yy, Z + 3, 36, 1, 1); v.carve(X, yy, Z + 10, 36, 1, 1); }
    v.box(X + 36, Y + 2, Z + 4, 4, 6, 6, P); v.box(X + 40, Y + 3, Z + 5, 2, 4, 4, GLASS);
    v.box(X + 34, Y + 2, Z + 10, 4, 6, 1, GLASS);
    v.box(X - 12, Y + 2, Z + 6, 12, 6, 5, P);
    v.box(X - 14, Y + 4, Z + 10, 6, 2, 12, P);
    v.box(X - 14, Y - 6, Z + 10, 5, 22, 1, P);
    v.box(X - 15, Y + 4, Z + 7, 2, 2, 3, GLASS);
    v.box(X + 16, Y - 26, Z + 11, 8, 61, 1, P);
    for (const yy of [Y - 19, Y - 9, Y + 16, Y + 26]) {
      v.box(X + 18, yy, Z + 8, 9, 3, 3, P);
      v.box(X + 27, yy + 1, Z + 9, 1, 1, 1, SPINNER);
      prop(v, X + 28, yy + 1, Z + 9, 4, 4, 0.3);
    }
    for (const yy of [Y - 1, Y + 9]) v.box(X + 12, yy, Z + 2, 12, 2, 4, P);
    for (let i = 4; i < 30; i += 5) v.set(X + i, Y + 8, Z + 8, PORT);
    v.box(X - 12, Y + 7, Z + 8, 4, 1, 1, NEUTRAL[0]);
  };

  /* ---------------- CENAS ---------------- */

  const heliCamo = DR.camo(['#5d6a3f', '#6b6f47', '#4a5434', '#7a7452'], 3, 141);
  const ruHeli = DR.camo(['#3f4a3a', '#4b5545', '#353e31'], 3, 143);

  A['veh-anjo'] = {
    sky: ['#2c3a40', '#b3ab92'],
    fitBox: [-14, -8, 0, 22, 22, 18],
    fg(ctx, W, Ht, o) {
      const p = DR.project(6.5, 7.5, 2, o); dust(ctx, p[0], p[1], o.s * 5, 0.3, '170,160,130');
      disc(ctx, o, 6.5, 7.5, 13.5, 14, 'xy', 'rgba(40,44,40,0.14)');
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -24, -16, 60, 46, 2);
      for (let i = -3; i <= 3; i++) { v.set(3, 7 + i, 1, '#e8e2d0'); v.set(9, 7 + i, 1, '#e8e2d0'); }
      for (let x = 4; x < 9; x++) v.set(x, 7, 1, '#e8e2d0');
      const tent = (x, y) => {
        v.box(x, y, 2, 10, 7, 4, '#55603a'); v.box(x + 1, y + 1, 6, 8, 5, 1, '#55603a'); v.box(x + 2, y + 2, 7, 6, 3, 1, '#4b5533');
        v.box(x + 4, y + 6, 3, 1, 1, 3, '#f2f2f2'); v.box(x + 3, y + 6, 4, 3, 1, 1, '#f2f2f2'); v.set(x + 4, y + 6, 4, '#1f8a4c');
      };
      tent(-12, -6); tent(-12, 6);
      const h = new DR.Vox();
      DR.anjo(h, 0, 4, 4);
      shadow(v, h, 1, 2, 2, '#4a5a2a');
      merge(v, h);
      return v;
    },
  };
  A['veh-marimbondo'] = {
    sky: ['#2b3a44', '#c4a77a'],
    fitBox: [-24, -8, 0, 36, 20, 26],
    fg(ctx, W, Ht, o) {
      disc(ctx, o, 14.5, 4.5, 23.5, 22, 'xy', 'rgba(40,44,40,0.14)');
      disc(ctx, o, -20, 6.5, 19.5, 5, 'xz', 'rgba(40,44,40,0.2)');
      for (const yy of [-5, 12]) for (let k = 0; k < 3; k++) {
        const a = DR.project(18 + k * 8, yy, 11 - k * 2.5, o), b = DR.project(22 + k * 8, yy, 10 - k * 2.5, o);
        ctx.strokeStyle = 'rgba(235,230,220,0.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        ctx.fillStyle = 'rgba(255,210,120,0.95)'; ctx.beginPath(); ctx.arc(b[0], b[1], 2.5, 0, 7); ctx.fill();
      }
    },
    build() {
      const v = new DR.Vox();
      farmland(v, -40, -30, 100, 70);
      const h = new DR.Vox();
      DR.marimbondo(h, 0, 0, 10, heliCamo, UC);
      shadow(v, h, 1, 4, 4, '#3f3d22');
      merge(v, h);
      return v;
    },
  };
  A['veh-jacare'] = {
    sky: ['#26313a', '#9aa39a'],
    fitBox: [-20, -8, 0, 30, 20, 26],
    fg(ctx, W, Ht, o) {
      disc(ctx, o, 12.5, 4.5, 20.5, 20, 'xy', 'rgba(40,44,40,0.12)');
      disc(ctx, o, 12.5, 4.5, 23.5, 20, 'xy', 'rgba(40,44,40,0.12)');
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -40, -30, 90, 70, 2);
      for (let i = 0; i < 22; i++) DR.tree(v, -36 + (i % 11) * 8, -28 + Math.floor(i / 11) * 52 + (i % 3), 2, 6 + (i % 4), false);
      const h = new DR.Vox();
      DR.jacare(h, 0, 0, 10, ruHeli, RU);
      shadow(v, h, 1, 4, 4, '#3a4a26');
      merge(v, h);
      return v;
    },
  };
  A['veh-gralha'] = {
    sky: ['#2a3540', '#c2a57d'],
    fitBox: [-6, -14, 0, 34, 24, 18],
    build() {
      const v = new DR.Vox();
      farmland(v, -40, -40, 110, 90);
      const h = new DR.Vox();
      DR.gralha(h, 0, 0, 12, DR.camo(['#7a7a5a', '#5f6a4a', '#8a7a5a', '#6a6a6a'], 3, 145), RU);
      shadow(v, h, 1, 6, 6, '#3f3d22');
      merge(v, h);
      return v;
    },
  };
  A['veh-falcao'] = {
    sky: ['#3d6f9a', '#a9c6dc'],
    fitBox: [-4, -12, 0, 30, 18, 14],
    build() {
      const v = new DR.Vox();
      cloud(v, -10, -20, 0, 6, 1); cloud(v, 24, 16, -2, 7, 2); cloud(v, -16, 12, -4, 5, 3); cloud(v, 30, -22, -3, 5, 4);
      DR.falcao(v, 0, 0, 4, DR.camo(['#7d868a', '#6b7478', '#8a9296'], 3, 147), UC);
      return v;
    },
  };
  A['veh-urubu'] = {
    sky: ['#2f3c48', '#b7a68a'],
    fitBox: [-4, -16, -14, 52, 24, 16],
    fg(ctx, W, Ht, o) { const p = DR.project(50, 4, -11, o); ctx.strokeStyle = 'rgba(230,230,225,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p[0], p[1]); const q = DR.project(36, 4, -2, o); ctx.lineTo(q[0], q[1]); ctx.stroke(); },
    build() {
      const v = new DR.Vox();
      cloud(v, 30, -26, -16, 6, 5); cloud(v, -6, 14, -18, 7, 6);
      DR.urubu(v, 0, 0, 2, DR.camo(['#7a8a99', '#8c9aa6', '#6b7a87'], 3, 149), RU);
      glideBomb(v, 44, 3, -12);
      return v;
    },
  };
  A['veh-pardal'] = {
    sky: ['#24343f', '#d1a978'],
    fitBox: [-8, -10, 0, 54, 14, 14],
    fg(ctx, W, Ht, o) {
      const a = DR.project(8, 9, 7, o), b = DR.project(40, 8, 9, o);
      ctx.strokeStyle = 'rgba(255,215,130,0.9)'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 8]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
      disc(ctx, o, 18.5, 3.5, 3.5, 5, 'yz', 'rgba(40,44,40,0.22)');
    },
    build() {
      const v = new DR.Vox();
      cloud(v, 20, -24, -6, 5, 7); cloud(v, -4, 16, -8, 6, 8);
      DR.pardal(v, 0, 0, 0, DR.camo(['#5d6a7a', '#6b7888', '#55606f'], 2, 151), UC);
      deltaDrone(v, 42, 4, 8);
      return v;
    },
  };
  A['veh-abelha'] = {
    sky: ['#2b3a44', '#c9b48a'],
    fitBox: [-14, -16, 0, 26, 22, 26],
    fg(ctx, W, Ht, o) { disc(ctx, o, 20.5, 3.5, 17.5, 6, 'yz', 'rgba(40,44,40,0.22)'); },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -40, -34, 90, 80, 2);
      DR.sandbags(v, -16, 18, 2, 24, 'x', 2);
      for (let i = 0; i < 4; i++) DR.crate(v, -10 + i * 5, 12, 2, i % 2 ? '#4f5a33' : undefined);
      const h = new DR.Vox();
      DR.abelha(h, 0, 0, 12, DR.camo(['#4f5a36', '#5b6236', '#454d2e'], 3, 153));
      chute(h, -14, 3, 16, '#4f5a36'); chute(h, -24, 6, 10, '#4f5a36');
      shadow(v, h, 1, 4, 4, '#3f4a22');
      merge(v, h);
      return v;
    },
  };
  A['veh-cegonha'] = {
    sky: ['#2f3c48', '#b7a68a'],
    fitBox: [-30, -28, 0, 44, 36, 26],
    fg(ctx, W, Ht, o) {
      for (const yy of [-18, -8, 17, 27]) disc(ctx, o, 28.5, yy + 0.5, 21.5, 4, 'yz', 'rgba(40,44,40,0.2)');
      const p = DR.project(-30, 6, 2, o); dust(ctx, p[0], p[1], o.s * 4, 0.6, '90,160,90');
    },
    build() {
      const v = new DR.Vox();
      farmland(v, -70, -50, 140, 110);
      const h = new DR.Vox();
      DR.cegonha(h, 0, 0, 12, DR.camo(['#6b7468', '#7a8276', '#5d665a'], 4, 155));
      chute(h, -20, 4, 16, '#5d665a'); chute(h, -30, 6, 10, '#5d665a');
      shadow(v, h, 1, 6, 6, '#3f3d22');
      merge(v, h);
      return v;
    },
  };
})();
