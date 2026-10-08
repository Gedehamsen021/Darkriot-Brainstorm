/* DARKRIOT — veículos voxel (concept art). Todos olham para +x; (X, Y, Z) é o canto traseiro-direito-inferior.
   Escala estilizada ("chibi") para os blindados; moto e quadriciclo na escala do piloto. */
(function () {
  const DR = window.DR, H = DR.hash;
  const DARK = '#24231f', STEEL = '#3b3d2c', GLASS = '#2a3440', BLACK = '#1d1d1b';
  const UC = ['#f5c400', '#1f5fbf'], RU = ['#f2f2f2', '#c8262b'];
  const PAINT = {
    uc: DR.camo(['#5b6236', '#6b6a42', '#4a5230', '#7a7350', '#3e4429'], 3, 51),
    ucTan: DR.camo(['#857a55', '#76704c', '#918460', '#5f6040', '#6d6a48'], 3, 52),
    ru: DR.camo(['#4d5233', '#575c3a', '#43482c', '#5e5f3c'], 2, 53),
  };

  // Lagarta ao longo de x: x0..x0+L-1, largura w a partir de y0, altura h. wheels = nº de rodas na face +y.
  function track(v, x0, y0, z0, L, w, h, wheels) {
    v.box(x0 + 1, y0, z0, L - 2, w, h, DARK);
    v.box(x0, y0, z0 + 1, 1, w, h - 2, DARK);
    v.box(x0 + L - 1, y0, z0 + 1, 1, w, h - 2, DARK);
    for (let i = 1; i < L - 1; i += 2) v.box(x0 + i, y0, z0 + h - 1, 1, w, 1, '#2f2e29');
    if (!wheels) return;
    const yo = y0 + w - 1, step = (L - 5) / (wheels - 1);
    for (let k = 0; k < wheels; k++) {
      const x = Math.round(x0 + 2 + k * step);
      v.box(x, yo, z0, 2, 1, h - 1, '#4a4a40');
      v.set(x, yo, z0 + ((h - 1) >> 1), '#5d5e50');
    }
  }

  // Roda: disco no plano x-z com largura w em y. outerPlusY: a face externa (com cubo) fica no lado +y.
  function wheel(v, cx, y, cz, r, w, outerPlusY) {
    const rr = r * r + r * 0.6, hub = (r - 1.5) * (r - 1.5) + 0.3;
    for (let i = -r; i <= r; i++) for (let k = -r; k <= r; k++) {
      const d = i * i + k * k;
      if (d > rr) continue;
      for (let j = 0; j < w; j++) {
        const outer = outerPlusY ? j === w - 1 : j === 0;
        let c = (i + k) & 1 ? BLACK : '#262624';
        if (outer && d <= hub) c = d <= 0.5 ? '#2b2b25' : '#55583f';
        v.set(cx + i, y + j, cz + k, c);
      }
    }
  }

  // Suja de lama/poeira a parte de baixo do veículo.
  function dirty(v, x0, y0, x1, y1, z0, z1, amount, cols, seed) {
    v.each((x, y, z) => {
      if (x < x0 || x > x1 || y < y0 || y > y1 || z < z0 || z > z1) return;
      const fall = 1 - (z - z0) / (z1 - z0 + 1);
      if (H(x, y, z, seed) < amount * fall) v.set(x, y, z, cols[Math.floor(H(x, z, y, seed + 1) * cols.length)]);
    });
  }

  // Marcas de lagarta/pneu no chão (topo em z).
  function ruts(v, x0, x1, ys, z, cols) {
    for (let x = x0; x <= x1; x++) for (const y of ys) if (v.has(x, y, z)) v.set(x, y, z, cols[(x + y) & 1]);
  }

  /* ---------------- COALIZÃO ---------------- */

  DR.lince = function (v, X, Y, Z) {
    const P = PAINT.ucTan;
    track(v, X, Y, Z, 24, 3, 4, 0);
    track(v, X, Y + 11, Z, 24, 3, 4, 6);
    v.box(X + 1, Y + 3, Z + 1, 22, 8, 3, P);
    v.box(X, Y, Z + 4, 24, 14, 4, P);
    v.box(X + 24, Y + 1, Z + 2, 2, 12, 3, P);
    v.box(X + 24, Y + 1, Z + 5, 1, 12, 1, P);
    v.box(X + 1, Y + 14, Z + 2, 22, 1, 3, '#6e6648');
    for (let i = 2; i < 23; i += 3) v.set(X + i, Y + 14, Z + 4, '#4a4532');
    // torre deslocada, canhão 25 mm e lançador duplo de mísseis
    v.box(X + 11, Y + 3, Z + 8, 9, 8, 3, P);
    v.box(X + 12, Y + 4, Z + 11, 7, 6, 1, P);
    v.box(X + 20, Y + 5, Z + 8, 1, 4, 3, P);
    v.box(X + 21, Y + 6, Z + 9, 9, 1, 1, '#2b2d22');
    v.set(X + 30, Y + 6, Z + 9, '#151515');
    v.box(X + 12, Y + 11, Z + 9, 7, 2, 2, '#5d5840');
    v.box(X + 19, Y + 11, Z + 9, 1, 2, 2, '#151515');
    for (const yy of [Y + 3, Y + 4, Y + 9, Y + 10]) v.set(X + 20, yy, Z + 10, '#2b2b25');
    v.box(X + 13, Y + 5, Z + 12, 2, 2, 1, STEEL);
    v.box(X + 16, Y + 7, Z + 12, 2, 2, 1, STEEL);
    v.box(X + 12, Y + 10, Z + 12, 1, 1, 6, '#222');
    v.box(X + 2, Y + 12, Z + 8, 1, 1, 7, '#222');
    // rampa traseira e rede de camuflagem enrolada
    v.box(X - 1, Y + 3, Z + 2, 1, 8, 5, '#5f5a40');
    v.box(X + 1, Y + 1, Z + 8, 5, 12, 2, DR.camo(['#4b5a2e', '#3f4d27', '#56653a'], 1, 3));
    // identificação: cruz amarela + quadrado azul
    v.box(X + 6, Y + 13, Z + 5, 1, 1, 3, UC[0]); v.box(X + 5, Y + 13, Z + 6, 3, 1, 1, UC[0]);
    v.set(X + 9, Y + 13, Z + 6, UC[1]);
    v.box(X + 13, Y + 10, Z + 10, 5, 1, 1, UC[0]);
  };
  DR.ifv = DR.lince; // a vila em ruínas usa o mesmo IFV

  DR.coiote = function (v, X, Y, Z) {
    const P = PAINT.uc;
    v.box(X + 1, Y + 2, Z + 2, 18, 6, 1, '#2a2a26');
    v.box(X + 1, Y + 1, Z + 3, 10, 8, 1, '#3a3a33');
    v.box(X + 1, Y + 1, Z + 4, 10, 1, 2, P); v.box(X + 1, Y + 8, Z + 4, 10, 1, 2, P); v.box(X + 1, Y + 2, Z + 4, 1, 6, 2, P);
    v.box(X + 11, Y + 1, Z + 3, 6, 8, 5, P);
    v.box(X + 17, Y + 1, Z + 3, 3, 8, 3, P);
    v.box(X + 16, Y + 2, Z + 6, 1, 6, 2, GLASS);
    v.box(X + 12, Y + 8, Z + 6, 3, 1, 2, GLASS);
    v.box(X + 20, Y + 1, Z + 2, 1, 8, 3, '#1f1f1d');
    v.set(X + 20, Y + 2, Z + 4, '#e8e2c0'); v.set(X + 20, Y + 7, Z + 4, '#e8e2c0');
    for (const cx of [X + 4, X + 16]) { wheel(v, cx, Y + 8, Z + 2, 2, 2, true); wheel(v, cx, Y, Z + 2, 2, 2, false); }
    // metralhadora 12,7 mm com escudo, no pedestal da caçamba
    v.box(X + 6, Y + 4, Z + 4, 2, 2, 4, '#2b2b25');
    v.box(X + 5, Y + 4, Z + 8, 2, 2, 1, '#2b2b25');
    v.box(X + 7, Y + 4, Z + 8, 6, 1, 1, BLACK);
    v.box(X + 8, Y + 3, Z + 7, 1, 4, 3, '#626a4c');
    v.box(X + 7, Y + 6, Z + 7, 1, 1, 1, '#4a5230');
    // galões e mochilas
    v.box(X + 2, Y + 5, Z + 4, 2, 2, 2, '#4a5230'); v.box(X + 2, Y + 2, Z + 4, 2, 2, 2, '#5a4a32');
    // jammer anti-drone no teto
    v.box(X + 13, Y + 3, Z + 8, 3, 4, 1, '#3b3d3f');
    for (const [a, b] of [[13, 2], [13, 7], [16, 2], [16, 7]]) v.box(X + a, Y + b, Z + 8, 1, 1, 3, '#222');
    v.box(X + 12, Y + 8, Z + 5, 4, 1, 1, UC[0]); v.box(X + 12, Y + 8, Z + 4, 4, 1, 1, UC[1]);
  };

  DR.furao = function (v, X, Y, Z, rider) {
    const P = DR.camo(['#4f5a36', '#5b6236', '#454d2e'], 2, 61);
    for (const cx of [X + 3, X + 13]) { wheel(v, cx, Y + 7, Z + 3, 3, 3, true); wheel(v, cx, Y, Z + 3, 3, 3, false); }
    v.box(X + 1, Y + 3, Z + 3, 15, 4, 2, '#2f3130');
    v.box(X, Y, Z + 6, 6, 10, 1, P); v.box(X + 10, Y, Z + 6, 6, 10, 1, P);
    v.box(X + 6, Y + 2, Z + 5, 4, 6, 2, P);
    v.box(X + 4, Y + 3, Z + 7, 6, 4, 1, BLACK);
    v.box(X + 10, Y + 3, Z + 7, 3, 4, 2, P);
    v.box(X + 12, Y + 4, Z + 7, 1, 2, 4, '#222'); v.box(X + 12, Y + 1, Z + 11, 1, 8, 1, '#222');
    v.box(X + 16, Y + 3, Z + 5, 1, 4, 2, '#222'); v.set(X + 16, Y + 3, Z + 6, '#e8e2c0'); v.set(X + 16, Y + 6, Z + 6, '#e8e2c0');
    // bagageiro: caixa com 6 FPVs + mastro com antena painel
    v.box(X - 1, Y + 1, Z + 7, 4, 8, 1, '#2b2b25');
    v.box(X - 1, Y + 1, Z + 8, 4, 8, 3, '#5a6438'); v.box(X - 1, Y + 1, Z + 11, 4, 8, 1, '#4a5230');
    v.set(X + 2, Y + 4, Z + 9, '#d0c060');
    v.box(X - 1, Y + 8, Z + 12, 1, 1, 8, '#222'); v.box(X - 1, Y + 7, Z + 19, 1, 3, 3, '#3b3d3f');
    v.set(X + 14, Y + 9, Z + 6, UC[0]); v.set(X + 15, Y + 9, Z + 6, UC[1]);
    if (rider) DR.soldier(v, X + 4, Y + 3, Z + 6, DR.FACTIONS.coalizao, 'ride', { goggles: true });
  };

  DR.bruxa = function (v, cx, cy, cz) {
    const F = '#1d1f22';
    v.box(cx - 3, cy - 3, cz, 7, 7, 3, '#2a2c2e');
    v.box(cx - 2, cy - 2, cz + 3, 5, 5, 2, '#c9a227');
    v.box(cx - 2, cy - 2, cz + 5, 5, 5, 1, '#d9d9d6');
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3 + Math.PI / 6;
      const ex = Math.round(cx + Math.cos(a) * 12), ey = Math.round(cy + Math.sin(a) * 12);
      v.line(cx, cy, cz + 1, ex, ey, cz + 1, F);
      v.box(ex - 1, ey - 1, cz + 1, 3, 3, 2, '#3a3d42');
      const ax = k % 2 ? [5, 0] : [0, 5];
      v.line(ex - ax[0], ey - ax[1], cz + 3, ex + ax[0], ey + ax[1], cz + 3, '#8a8f96');
    }
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) v.line(cx + a * 2, cy + b * 2, cz - 1, cx + a * 5, cy + b * 5, cz - 6, F);
    v.box(cx - 3, cy - 3, cz - 1, 7, 7, 1, '#2b2b25');
    for (const [a, b] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) { v.box(cx + a, cy + b, cz - 4, 1, 1, 3, '#4c5a33'); v.set(cx + a, cy + b, cz - 5, '#8a8f80'); }
    v.box(cx + 4, cy - 1, cz - 1, 2, 3, 2, '#111'); v.set(cx + 6, cy, cz, '#3d6bd9');
  };

  /* ---------------- LEGIÃO ---------------- */

  DR.lobo = function (v, X, Y, Z) {
    const P = PAINT.ru;
    track(v, X, Y, Z, 23, 3, 3, 0);
    track(v, X, Y + 10, Z, 23, 3, 3, 6);
    v.box(X + 1, Y + 3, Z + 1, 21, 7, 2, P);
    v.box(X, Y, Z + 3, 23, 13, 3, P);
    // nariz em cunha com nervuras
    v.box(X + 23, Y + 1, Z + 2, 2, 11, 3, P);
    v.box(X + 25, Y + 2, Z + 2, 2, 9, 2, P);
    v.box(X + 27, Y + 4, Z + 2, 1, 5, 1, P);
    for (let j = 2; j < 11; j += 2) v.set(X + 24, Y + j, Z + 4, '#3f442b');
    for (let i = 0; i < 4; i++) v.box(X + 17 + i, Y + 8, Z + 5, 1, 4, 1, i % 2 ? '#3a3f28' : '#2f3322');
    // torre com canhão automático 30 mm e tubo de míssil
    v.box(X + 9, Y + 4, Z + 6, 7, 6, 2, P);
    v.box(X + 10, Y + 5, Z + 8, 5, 4, 1, P);
    v.box(X + 16, Y + 6, Z + 6, 1, 2, 2, P);
    v.box(X + 17, Y + 7, Z + 7, 12, 1, 1, '#2b2d22');
    v.set(X + 29, Y + 7, Z + 7, '#151515');
    v.box(X + 11, Y + 5, Z + 9, 6, 1, 1, '#5a6040');
    for (const yy of [Y + 4, Y + 9]) v.set(X + 15, yy, Z + 8, '#2b2b25');
    // escotilhas da tropa e portas traseiras
    v.box(X + 2, Y + 1, Z + 6, 6, 3, 1, STEEL); v.box(X + 2, Y + 9, Z + 6, 6, 3, 1, STEEL);
    v.box(X - 1, Y + 3, Z + 2, 1, 3, 3, '#3f442b'); v.box(X - 1, Y + 7, Z + 2, 1, 3, 3, '#3f442b');
    // carga no teto traseiro, cabo de reboque e elos de lagarta extras na frente
    DR.crate(v, X + 1, Y + 4, Z + 6, '#4f5a33');
    v.box(X + 1, Y + 8, Z + 6, 3, 1, 1, '#6b4a2b');
    for (let j = 2; j < 11; j += 3) v.box(X + 22, Y + j, Z + 5, 1, 2, 1, DARK);
    v.line(X, Y + 12, Z + 5, X + 8, Y + 12, Z + 5, '#2b2b25');
    v.box(X + 3, Y + 12, Z + 4, 6, 1, 1, RU[0]); v.box(X + 10, Y + 12, Z + 4, 2, 1, 1, RU[1]);
    v.box(X + 10, Y + 9, Z + 7, 4, 1, 1, RU[0]);
  };

  DR.tartaruga = function (v, X, Y, Z) {
    const P = PAINT.ru;
    track(v, X, Y, Z, 24, 2, 3, 0);
    track(v, X, Y + 10, Z, 24, 2, 3, 6);
    v.box(X + 1, Y + 2, Z + 1, 22, 8, 2, P);
    v.box(X, Y, Z + 3, 24, 12, 3, P);
    v.box(X + 24, Y + 1, Z + 2, 2, 10, 3, P);
    // casco de chapas: telhado em degraus com beiral, ferrugem e emendas
    const sheet = (x, y, z) => H(x >> 2, y >> 2, z, 71) < 0.18 ? '#7a4a2e' : (x % 2 ? '#7f7c70' : '#6d6a5f');
    for (let k = 0; k < 6; k++) v.box(X - 1 + k, Y - 1 + k, Z + 6 + k, 28 - 2 * k, 14 - 2 * k, 1, sheet);
    v.box(X, Y + 12, Z + 2, 26, 1, 4, sheet);
    v.box(X + 26, Y - 1, Z + 2, 1, 14, 4, sheet);
    v.carve(X + 26, Y + 2, Z + 4, 1, 4, 1);
    v.box(X + 26, Y + 3, Z + 5, 4, 1, 1, BLACK);
    v.box(X + 6, Y + 12, Z + 3, 6, 1, 1, RU[0]); v.box(X + 13, Y + 12, Z + 3, 2, 1, 1, RU[1]);
    v.box(X + 6, Y + 3, Z + 11, 12, 2, 1, RU[0]);
  };

  DR.prego = function (v, X, Y, Z) {
    const P = PAINT.ru;
    track(v, X, Y, Z, 26, 2, 3, 0);
    track(v, X, Y + 10, Z, 26, 2, 3, 7);
    v.box(X + 1, Y + 2, Z + 1, 24, 8, 2, P);
    v.box(X, Y, Z + 3, 26, 12, 3, P);
    v.box(X + 26, Y + 1, Z + 2, 2, 10, 3, P);
    v.carve(X + 27, Y + 1, Z + 4, 1, 10, 1);
    // torre traseira e obuseiro 122 mm elevado
    v.box(X + 2, Y + 2, Z + 6, 11, 8, 4, P);
    v.box(X + 3, Y + 3, Z + 10, 9, 6, 1, P);
    v.box(X + 5, Y + 6, Z + 11, 2, 2, 1, STEEL);
    v.box(X + 13, Y + 4, Z + 7, 2, 4, 3, P);
    for (const yy of [Y + 5, Y + 6]) { v.line(X + 15, yy, Z + 8, X + 33, yy, Z + 16, '#2f3423'); v.line(X + 15, yy, Z + 9, X + 33, yy, Z + 17, '#2f3423'); }
    v.box(X + 32, Y + 4, Z + 16, 2, 4, 2, '#24271b');
    v.box(X - 1, Y + 2, Z, 1, 8, 4, STEEL);
    v.box(X + 4, Y + 9, Z + 8, 6, 1, 1, RU[0]); v.box(X + 3, Y + 11, Z + 4, 4, 1, 1, RU[0]); v.set(X + 8, Y + 11, Z + 4, RU[1]);
  };

  DR.gafanhoto = function (v, X, Y, Z, rider) {
    const P = '#4b5233', fr = '#2a2c2a', fork = '#8d8f90';
    wheel(v, X + 4, Y + 1, Z + 4, 4, 2, true);
    wheel(v, X + 18, Y + 1, Z + 4, 4, 2, true);
    v.box(X + 8, Y + 1, Z + 4, 5, 2, 3, '#2f3130');
    for (const yy of [Y + 1, Y + 2]) { v.line(X + 4, yy, Z + 4, X + 9, yy, Z + 8, fr); v.line(X + 15, yy, Z + 13, X + 18, yy, Z + 4, fork); }
    v.box(X + 5, Y + 1, Z + 9, 7, 2, 1, BLACK);
    v.box(X + 11, Y + 1, Z + 8, 4, 2, 2, P);
    v.box(X + 2, Y + 1, Z + 9, 3, 2, 1, P);
    v.box(X + 15, Y - 1, Z + 13, 1, 6, 1, '#222');
    v.box(X + 17, Y + 1, Z + 9, 4, 2, 1, P);
    v.set(X + 16, Y + 1, Z + 12, '#e8e2c0'); v.set(X + 16, Y + 2, Z + 12, '#e8e2c0');
    v.line(X + 12, Y + 3, Z + 5, X + 3, Y + 3, Z + 7, '#6b6b66');
    v.set(X + 2, Y + 2, Z + 9, RU[0]); v.set(X + 3, Y + 2, Z + 9, RU[1]);
    if (rider) DR.soldier(v, X + 7, Y, Z + 8, DR.FACTIONS.legiao, 'ride');
  };

  /* ---------------- LOGÍSTICA (as duas facções) ---------------- */

  // Frente de caminhão 6×6 com capô longo: chassi, cabine (x X+16..X+20), capô e grade (x X+27).
  function uralFront(v, X, Y, Z, P) {
    v.box(X + 1, Y + 2, Z + 3, 26, 7, 1, '#2a2a26');
    v.box(X + 16, Y + 1, Z + 4, 5, 9, 6, P);
    v.box(X + 21, Y + 2, Z + 4, 6, 7, 3, P);
    v.box(X + 21, Y + 1, Z + 4, 4, 9, 2, P);
    v.box(X + 20, Y + 2, Z + 8, 1, 7, 2, GLASS);
    v.box(X + 17, Y + 9, Z + 8, 3, 1, 1, GLASS);
    v.box(X + 27, Y + 2, Z + 4, 1, 7, 3, '#1f1f1d');
    for (let j = 3; j < 9; j += 2) v.set(X + 27, Y + j, Z + 5, '#3a3a33');
    v.box(X + 27, Y + 1, Z + 3, 1, 9, 1, '#222');
    v.set(X + 25, Y + 1, Z + 6, '#e8e2c0'); v.set(X + 25, Y + 9, Z + 6, '#e8e2c0');
    v.box(X + 15, Y + 9, Z + 5, 1, 1, 6, '#2b2b25');
  }

  DR.mula = function (v, X, Y, Z, tape) {
    const P = DR.camo(['#4f5a36', '#56603a', '#48512f'], 3, 81);
    const T = DR.camo(['#5f6040', '#6b6a48', '#55573a'], 2, 82);
    tape = tape || UC;
    uralFront(v, X, Y, Z, P);
    // carroceria com lona; o lado visível está enrolado e mostra a carga
    v.box(X + 1, Y + 1, Z + 4, 14, 9, 1, '#3a3a33');
    v.box(X + 1, Y + 1, Z + 5, 14, 1, 2, P); v.box(X + 1, Y + 9, Z + 5, 14, 1, 2, P);
    v.box(X + 1, Y + 1, Z + 7, 14, 9, 4, T);
    for (let i = 2; i < 15; i += 4) v.box(X + i, Y + 1, Z + 7, 1, 9, 4, '#56583b');
    v.carve(X + 1, Y + 1, Z + 10, 14, 1, 1); v.carve(X + 1, Y + 9, Z + 10, 14, 1, 1);
    v.carve(X + 2, Y + 9, Z + 7, 12, 1, 3);
    v.box(X + 2, Y + 9, Z + 9, 12, 1, 1, '#4b4c33');
    v.carve(X + 2, Y + 2, Z + 5, 12, 7, 4);
    for (const [a, b, c] of [[2, 5, 5], [6, 5, 5], [10, 5, 5], [2, 2, 5], [6, 2, 5], [3, 5, 7], [8, 5, 7]]) DR.crate(v, X + a, Y + b, Z + c, c === 7 ? '#4f5a33' : undefined);
    for (const cx of [X + 4, X + 10, X + 22]) { wheel(v, cx, Y + 9, Z + 3, 3, 2, true); wheel(v, cx, Y, Z + 3, 3, 2, false); }
    v.box(X + 17, Y + 9, Z + 6, 3, 1, 1, tape[0]); v.box(X + 17, Y + 9, Z + 5, 3, 1, 1, tape[1]);
  };

  /* ---------------- CENAS ---------------- */

  const A = DR.ART;
  const dust = (ctx, x, y, r, a, col) => {
    for (let i = 0; i < 6; i++) {
      const px = x - i * r * 0.55, py = y - i * r * 0.12 - (i % 2) * r * 0.2, rr = r * (0.7 + i * 0.22);
      const g = ctx.createRadialGradient(px, py, 0, px, py, rr);
      g.addColorStop(0, `rgba(${col || '150,130,100'},${a * (1 - i / 7)})`); g.addColorStop(1, `rgba(${col || '150,130,100'},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, rr, 0, 7); ctx.fill();
    }
  };
  const dryField = { grass: ['#7a7446', '#6b6a3c', '#857b4a', '#5f5f36'], dirt: ['#6b4e32', '#5d432b'] };
  const mud = ['#4a3a28', '#3f3122', '#54412c'];

  A['veh-lince'] = {
    sky: ['#2b3740', '#b39c74'],
    bg(ctx, W, Ht) { dust(ctx, W * 0.22, Ht * 0.42, 34, 0.25, '90,84,78'); },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -4, -4, 38, 24, 2, dryField);
      ruts(v, -4, 3, [1, 2, 3, 12, 13, 14], 1, mud);
      for (let i = 0; i < 9; i++) { const x = -2 + i * 4, y = -3 + (i % 2); v.box(x, y, 2, 1, 1, 5, '#7a6a3a'); v.box(x + 1, y, 6, 1, 2, 2, '#4a3a20'); }
      DR.lince(v, 4, 1, 2);
      dirty(v, 3, 0, 31, 16, 2, 6, 0.55, mud, 5);
      return v;
    },
  };
  A['veh-coiote'] = {
    sky: ['#34444c', '#c9b48a'],
    fg(ctx, W, Ht, o) { const p = DR.project(0, 6, 4, o); dust(ctx, p[0], p[1], o.s * 5, 0.5); },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -3, 34, 16, 2, dryField);
      for (let x = -6; x < 28; x++) for (let y = 1; y < 10; y++) v.set(x, y, 1, ['#8f7a58', '#857052', '#9a8461'][Math.floor(H(x >> 1, y >> 1, 1, 9) * 3)]);
      ruts(v, -6, 3, [1, 2, 9, 10], 1, ['#6f5b40', '#77624a']);
      DR.coiote(v, 3, 1, 2);
      dirty(v, 3, 1, 24, 10, 2, 5, 0.45, ['#8f7a58', '#7a6648'], 7);
      return v;
    },
  };
  A['veh-furao'] = {
    sky: ['#26343a', '#8f9a86'],
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -8, 30, 24, 3);
      DR.tree(v, -4, -6, 3, 10, false); DR.tree(v, 4, -7, 3, 13, false); DR.tree(v, 14, -6, 3, 9, false);
      DR.crate(v, -5, 9, 3); DR.crate(v, -5, 12, 3, '#4f5a33'); DR.crate(v, -5, 9, 6);
      ruts(v, -6, 1, [1, 2, 8, 9], 2, mud);
      DR.furao(v, 2, 0, 3, true);
      dirty(v, 1, 0, 18, 10, 3, 6, 0.5, mud, 11);
      return v;
    },
  };
  A['veh-bruxa'] = {
    sky: ['#0b1215', '#1f2f2c'],
    opts: { tint: (r, g, b) => [r * 0.45 + 4, g * 0.55 + 10, b * 0.62 + 18] },
    bg(ctx, W, Ht) {
      ctx.fillStyle = 'rgba(220,235,225,0.75)'; ctx.beginPath(); ctx.arc(W * 0.82, Ht * 0.18, 16, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (let i = 0; i < 40; i++) ctx.fillRect(H(i, 1, 2) * W, H(i, 2, 2) * Ht * 0.5, 1, 1);
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -12, -12, 26, 26, 4);
      for (let x = -12; x < 14; x++) for (let y = -12; y < 14; y++) {
        const d = Math.hypot(x - 2, y - 2);
        if (d < 9 && H(x, y, 4, 4) < 0.85 - d / 12) v.set(x, y, 3, '#2f3a22');
      }
      for (let x = -12; x < 14; x++) { const y = 9 + (((x % 8) + 8) % 8 < 4 ? 0 : 1); v.carve(x, y, 2, 1, 2, 2); }
      DR.sandbags(v, -12, 7, 4, 26, 'x', 1);
      DR.bruxa(v, 0, 0, 24);
      v.box(1, 1, 11, 1, 1, 2, '#4c5a33'); v.set(1, 1, 10, '#8a8f80');
      return v;
    },
  };
  A['veh-urso'] = {
    sky: ['#8e9aa4', '#dfe4e8'],
    fg(ctx, W, Ht) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (let i = 0; i < 160; i++) { const s = 1 + H(i, 3, 3) * 2; ctx.fillRect(H(i, 1, 3) * W, H(i, 2, 3) * Ht, s, s); }
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -6, 42, 28, 2, { grass: ['#e9edf0', '#dde3e7', '#f4f6f7', '#d3dadf'] });
      ruts(v, -6, 1, [-1, 0, 1, 12, 13, 14], 1, ['#9aa3aa', '#8a949b']);
      DR.tank(v, 2, 0, 2, true);
      const keep = new Set(['#2a2925', '#4a4a40', '#3a3a33', '#f2f2f2', '#3b3d2c', '#2f3123', '#6b4a2b']);
      v.each((x, y, z, c) => {
        if (z < 2 || keep.has(c)) return;
        const h = H(x >> 1, y >> 1, z >> 1, 31);
        if (h < 0.5) v.set(x, y, z, h < 0.25 ? '#d9dcd6' : '#c9cdc6');
        if (!v.has(x, y, z + 1) && H(x, y, z, 32) < 0.35) v.set(x, y, z, '#eef1f2');
      });
      dirty(v, 1, -1, 30, 16, 2, 5, 0.4, ['#7d756a', '#e9edf0'], 13);
      return v;
    },
  };
  A['veh-lobo'] = {
    sky: ['#2c3236', '#7f7a6c'],
    bg(ctx, W, Ht) { dust(ctx, W * 0.86, Ht * 0.38, 30, 0.3, '60,58,54'); },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -4, 40, 22, 2, { grass: ['#5a4a33', '#4f4029', '#665238', '#4a5a2e'], dirt: mud });
      for (let i = 0; i < 6; i++) { const x = -4 + Math.floor(H(i, 1, 6) * 34), y = -3 + Math.floor(H(i, 2, 6) * 20); v.box(x, y, 1, 3, 2, 1, '#55656a'); v.set(x + 1, y, 1, '#6d7f84'); }
      ruts(v, -6, 1, [1, 2, 3, 11, 12, 13], 1, ['#2f261b', '#3a2e20']);
      DR.lobo(v, 2, 1, 2);
      dirty(v, 1, 0, 30, 14, 2, 6, 0.7, mud, 17);
      return v;
    },
  };
  A['veh-tartaruga'] = {
    sky: ['#3a3a36', '#c2ab84'],
    fg(ctx, W, Ht, o) { const p = DR.project(-1, 6, 3, o); dust(ctx, p[0], p[1], o.s * 6, 0.45); },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -4, 40, 22, 2, dryField);
      for (let x = -6; x < 34; x++) for (let y = -1; y < 13; y++) v.set(x, y, 1, ['#8f7a58', '#857052', '#9a8461'][Math.floor(H(x >> 1, y >> 1, 1, 19) * 3)]);
      DR.tartaruga(v, 2, 0, 2);
      dirty(v, 1, -1, 30, 13, 2, 5, 0.5, ['#8f7a58', '#7a6648'], 19);
      return v;
    },
  };
  A['veh-prego'] = {
    sky: ['#2a2d33', '#9a7a5a'],
    fg(ctx, W, Ht, o) {
      const p = DR.project(36.5, 6, 19, o);
      const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], o.s * 9);
      g.addColorStop(0, 'rgba(255,245,200,0.95)'); g.addColorStop(0.35, 'rgba(255,150,50,0.7)'); g.addColorStop(1, 'rgba(255,100,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], o.s * 9, 0, 7); ctx.fill();
      dust(ctx, p[0] - o.s * 2, p[1] - o.s * 3, o.s * 4, 0.35, '200,195,185');
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -4, 44, 24, 2);
      DR.crate(v, 4, 15, 2); DR.crate(v, 9, 15, 2, '#4f5a33'); DR.crate(v, 4, 15, 5);
      for (let i = 0; i < 10; i++) v.set(-2 + Math.floor(H(i, 1, 8) * 14), 13 + Math.floor(H(i, 2, 8) * 6), 2, '#c9a24a');
      DR.prego(v, 2, 0, 2);
      dirty(v, 1, -1, 30, 13, 2, 5, 0.45, mud, 23);
      return v;
    },
  };
  A['veh-gafanhoto'] = {
    sky: ['#2f3a40', '#b8a07a'],
    fg(ctx, W, Ht, o) { const p = DR.project(-2, 2, 3, o); dust(ctx, p[0], p[1], o.s * 4, 0.5); },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -8, -6, 34, 16, 2, dryField);
      for (let x = -8; x < 26; x++) for (let y = -2; y < 6; y++) v.set(x, y, 1, ['#8f7a58', '#857052', '#9a8461'][Math.floor(H(x >> 1, y >> 1, 1, 29) * 3)]);
      ruts(v, -8, 0, [1, 2], 1, ['#6f5b40', '#77624a']);
      for (let i = 0; i < 14; i++) v.set(-6 + Math.floor(H(i, 1, 5) * 30), 7 + Math.floor(H(i, 2, 5) * 3), 2, H(i, 3, 5) > 0.5 ? '#9c4a32' : '#8f8676');
      v.box(22, -4, 2, 1, 1, 7, '#8d8f90'); v.box(22, -5, 8, 1, 3, 2, '#2f5fa8'); v.box(22, -4, 9, 1, 1, 1, '#e8e2d0');
      DR.gafanhoto(v, 2, 0, 2, true);
      return v;
    },
  };
  A['veh-mula'] = {
    sky: ['#2d3a3f', '#a6a088'],
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -4, 42, 24, 2);
      for (let x = -6; x < 36; x++) for (let y = -1; y < 12; y++) v.set(x, y, 1, ['#6f6a5c', '#66614f', '#77715f'][Math.floor(H(x >> 1, y >> 1, 1, 39) * 3)]);
      for (const [a, b] of [[8, 14], [13, 14], [8, 17]]) DR.crate(v, a, b, 2);
      for (let i = 0; i < 12; i++) v.box(-5 + i * 3, 19, 2, 1, 1, 3, '#6b4a2b');
      v.line(-5, 19, 4, 28, 19, 4, '#6b4a2b');
      DR.mula(v, 2, 0, 2);
      dirty(v, 1, -1, 30, 11, 2, 5, 0.4, mud, 41);
      return v;
    },
  };

  /* ---------------- HELICÓPTEROS (as duas facções, cada uma com a sua pintura) ---------------- */

  // Pás do rotor principal saindo do cubo (cx, cy, z), no plano horizontal.
  function rotor(v, cx, cy, z, R, n, start, col) {
    for (let k = 0; k < n; k++) {
      const a = start + k * 2 * Math.PI / n;
      v.line(cx, cy, z, Math.round(cx + Math.cos(a) * R), Math.round(cy + Math.sin(a) * R), z, col);
    }
  }
  // Rotor de cauda no plano x-z (lado +y).
  function tailRotor(v, cx, y, cz, R, n, col) {
    for (let k = 0; k < n; k++) {
      const a = Math.PI / 2 + k * 2 * Math.PI / n;
      v.line(cx, y, cz, Math.round(cx + Math.cos(a) * R), y, Math.round(cz + Math.sin(a) * R), col);
    }
  }
  // Disco borrado do rotor girando (2D, por cima do render). plane: 'xy' (principal), 'xz' (cauda) ou 'yz' (hélice).
  function disc(ctx, o, cx, cy, cz, R, plane, fill) {
    ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const t = i / 48 * Math.PI * 2;
      const c = R * Math.cos(t), d = R * Math.sin(t);
      const p = plane === 'xy' ? DR.project(cx + c, cy + d, cz, o)
              : plane === 'yz' ? DR.project(cx, cy + c, cz + d, o)
              : DR.project(cx + c, cy, cz + d, o);
      if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
    }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }

  const ROTOR = '#474c47', HUB = '#2b2b25', COCKPIT = '#2a3a4a', PORT = '#1e2a33';

  // Transporte de tropas (inspirado no Mi-8). X = traseira da cabine; Z = base da fuselagem.
  DR.libelula = function (v, X, Y, Z, paint, tape) {
    const P = paint;
    // cabine com cantos chanfrados
    v.box(X, Y, Z + 1, 24, 8, 7, P);
    for (const yy of [Y, Y + 7]) { v.carve(X, yy, Z + 1, 24, 1, 1); v.carve(X, yy, Z + 7, 24, 1, 1); }
    // nariz e cabine de comando envidraçada
    v.box(X + 24, Y, Z + 1, 4, 8, 6, P);
    v.box(X + 28, Y + 1, Z + 1, 2, 6, 5, P);
    v.box(X + 30, Y + 2, Z + 2, 2, 4, 3, P);
    v.box(X + 26, Y + 1, Z + 5, 2, 6, 2, COCKPIT); v.box(X + 28, Y + 1, Z + 4, 2, 6, 2, COCKPIT); v.box(X + 30, Y + 2, Z + 3, 2, 4, 2, COCKPIT);
    v.box(X + 27, Y + 1, Z + 4, 1, 6, 1, '#5d6569');
    // janelas redondas, porta corrediça aberta e metralhadora de porta
    for (let i = 2; i < 16; i += 3) v.set(X + i, Y + 7, Z + 5, PORT);
    v.box(X + 19, Y + 7, Z + 2, 3, 1, 4, '#141714');
    v.box(X + 15, Y + 8, Z + 2, 3, 1, 4, P);
    v.box(X + 20, Y + 8, Z + 4, 1, 3, 1, BLACK);
    // tanques externos e trem de pouso fixo
    for (const yy of [Y + 8, Y - 2]) {
      v.box(X + 7, yy, Z + 1, 7, 2, 3, P);
      v.carve(X + 7, yy, Z + 1, 1, 2, 1); v.carve(X + 13, yy, Z + 3, 1, 2, 1);
      v.box(X + 4, yy, Z, 1, 2, 1, HUB); v.box(X + 3, yy, Z - 2, 3, 2, 2, BLACK);
    }
    v.box(X + 26, Y + 3, Z, 1, 2, 1, HUB); v.box(X + 25, Y + 2, Z - 2, 3, 1, 2, BLACK); v.box(X + 25, Y + 5, Z - 2, 3, 1, 2, BLACK);
    // carenagem dos motores, entradas de ar e escapes
    v.box(X + 10, Y + 1, Z + 8, 14, 6, 3, P);
    v.box(X + 24, Y + 1, Z + 8, 2, 2, 2, '#3b3d3f'); v.box(X + 24, Y + 5, Z + 8, 2, 2, 2, '#3b3d3f');
    v.box(X + 26, Y + 1, Z + 8, 1, 2, 2, '#151515'); v.box(X + 26, Y + 5, Z + 8, 1, 2, 2, '#151515');
    v.box(X + 11, Y + 7, Z + 8, 3, 2, 2, HUB);
    // mastro, cubo e 5 pás
    v.box(X + 15, Y + 3, Z + 11, 2, 2, 2, HUB);
    v.box(X + 14, Y + 2, Z + 13, 4, 4, 1, HUB);
    rotor(v, X + 16, Y + 4, Z + 14, 26, 5, 0.3, ROTOR);
    // traseira (portas em concha), cone de cauda, estabilizador, deriva e rotor de cauda
    v.box(X - 3, Y + 1, Z + 1, 3, 6, 5, P);
    v.box(X - 5, Y + 2, Z + 4, 5, 4, 3, P);
    v.box(X - 21, Y + 3, Z + 5, 16, 2, 2, P);
    v.box(X - 14, Y, Z + 5, 3, 8, 1, P);
    v.box(X - 25, Y + 3, Z + 5, 4, 2, 7, P); v.box(X - 26, Y + 3, Z + 10, 2, 2, 3, P);
    v.box(X - 24, Y + 5, Z + 10, 1, 1, 1, HUB);
    tailRotor(v, X - 24, Y + 6, Z + 10, 5, 3, ROTOR);
    // identificação
    v.box(X - 9, Y + 3, Z + 5, 1, 2, 2, tape[0]); v.box(X - 10, Y + 3, Z + 5, 1, 2, 2, tape[1]);
    v.box(X + 4, Y + 7, Z + 2, 1, 1, 3, tape[0]); v.box(X + 3, Y + 7, Z + 3, 3, 1, 1, tape[0]);
  };

  // Carga pesada (inspirado no Mi-26), com palete pendurado no cabo.
  DR.pelicano = function (v, X, Y, Z, paint, tape, load) {
    const P = paint;
    v.box(X, Y, Z + 1, 26, 10, 10, P);
    for (const yy of [Y, Y + 9]) { v.carve(X, yy, Z + 1, 26, 1, 1); v.carve(X, yy, Z + 10, 26, 1, 1); }
    // nariz alto com vidros
    v.box(X + 26, Y + 1, Z + 1, 4, 8, 8, P);
    v.box(X + 30, Y + 2, Z + 2, 2, 6, 5, P);
    v.box(X + 28, Y + 1, Z + 7, 2, 8, 2, COCKPIT); v.box(X + 30, Y + 2, Z + 5, 2, 6, 2, COCKPIT);
    v.box(X + 30, Y + 2, Z + 2, 2, 6, 1, '#5d6569');
    // janelas, porta dianteira e carenagens laterais do trem de pouso
    for (let i = 2; i < 24; i += 4) v.set(X + i, Y + 9, Z + 8, PORT);
    v.box(X + 21, Y + 9, Z + 2, 3, 1, 5, '#2b2e2a'); v.box(X + 22, Y + 9, Z + 4, 1, 1, 2, P);
    for (const yy of [Y + 10, Y - 2]) {
      v.box(X + 6, yy, Z + 1, 10, 2, 3, P);
      v.box(X + 8, yy, Z - 2, 2, 2, 3, BLACK); v.box(X + 12, yy, Z - 2, 2, 2, 3, BLACK);
    }
    v.box(X + 27, Y + 4, Z - 2, 2, 2, 3, BLACK);
    // traseira com rampa, cone de cauda grosso, deriva e rotor de cauda de 5 pás
    v.box(X - 6, Y + 1, Z + 4, 6, 8, 7, P);
    v.box(X - 6, Y + 2, Z + 3, 6, 6, 1, '#4c5357');
    v.box(X - 24, Y + 3, Z + 7, 18, 4, 3, P);
    v.box(X - 29, Y + 4, Z + 7, 5, 2, 10, P);
    v.box(X - 16, Y, Z + 8, 3, 10, 1, P);
    v.box(X - 27, Y + 6, Z + 13, 1, 1, 1, HUB);
    tailRotor(v, X - 27, Y + 7, Z + 13, 6, 5, ROTOR);
    // motores gigantes, cubo e 8 pás
    v.box(X + 8, Y + 1, Z + 11, 18, 8, 4, P);
    v.box(X + 26, Y + 1, Z + 11, 2, 3, 3, '#3b3d3f'); v.box(X + 26, Y + 6, Z + 11, 2, 3, 3, '#3b3d3f');
    v.box(X + 28, Y + 1, Z + 11, 1, 3, 3, '#151515'); v.box(X + 28, Y + 6, Z + 11, 1, 3, 3, '#151515');
    v.box(X + 9, Y + 9, Z + 12, 3, 2, 2, HUB);
    v.box(X + 14, Y + 4, Z + 15, 2, 2, 2, HUB);
    v.box(X + 13, Y + 3, Z + 17, 4, 4, 1, HUB);
    rotor(v, X + 15, Y + 5, Z + 18, 30, 8, 0.2, ROTOR);
    // identificação
    v.box(X - 14, Y + 3, Z + 7, 1, 4, 3, tape[0]); v.box(X - 15, Y + 3, Z + 7, 1, 4, 3, tape[1]);
    v.box(X + 3, Y + 9, Z + 5, 2, 1, 2, tape[0]); v.set(X + 3, Y + 9, Z + 5, tape[1]);
    if (!load) return;
    // cabo com 4 pernas e palete de suprimentos com rede
    const hx = X + 12, hy = Y + 5, lz = Z - 18;
    v.box(hx, hy, Z, 1, 1, 1, HUB);
    for (const [a, b] of [[-5, -4], [4, -4], [-5, 3], [4, 3]]) v.line(hx, hy, Z - 1, hx + a, hy + b, lz + 5, '#8d8f90');
    v.box(hx - 5, hy - 4, lz, 10, 8, 1, '#6b4a2b');
    for (const [a, b] of [[-5, -4], [-1, -4], [-5, 0], [-1, 0], [3, -4], [3, 0]]) DR.crate(v, hx + a, hy + b, lz + 1, (a + b) & 1 ? '#4f5a33' : undefined);
    DR.crate(v, hx - 3, hy - 2, lz + 4);
    for (let i = -5; i <= 4; i += 3) v.line(hx + i, hy - 4, lz + 4, hx + i, hy + 3, lz + 4, '#2f3a24');
  };

  // Liga voxels de outro Vox e projeta a sombra no chão (topo em gz).
  function shadow(v, src, gz, dx, dy, col) {
    src.each((x, y) => { if (v.has(x + dx, y + dy, gz)) v.set(x + dx, y + dy, gz, col); });
  }
  function merge(v, src) { src.each((x, y, z, c) => v.set(x, y, z, c)); }

  A['veh-libelula'] = {
    sky: ['#2b3a44', '#c4a77a'],
    fitBox: [4, 8, 0, 60, 30, 26],
    fg(ctx, W, Ht, o) {
      disc(ctx, o, 42.5, 18.5, 24.5, 26, 'xy', 'rgba(40,44,40,0.14)');
      disc(ctx, o, 2.5, 20.5, 20.5, 5, 'xz', 'rgba(40,44,40,0.2)');
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -14, -10, 92, 56, 2, { grass: ['#c9a925', '#d6b52a', '#7d963f', '#b89a22'] });
      for (let x = -14; x < 78; x += 9) for (let y = -10; y < 46; y++) v.set(x, y, 1, '#2f4a25');
      for (let i = 0; i < 6; i++) DR.tree(v, -10 + i * 3, 30 + (i % 2) * 3, 2, 6 + (i % 3), false);
      const h = new DR.Vox();
      DR.libelula(h, 26, 14, 10, DR.camo(['#5d6a3f', '#6b6f47', '#4a5434', '#7a7452'], 3, 91), UC);
      shadow(v, h, 1, 4, 4, '#4a4a26');
      merge(v, h);
      return v;
    },
  };
  A['veh-pelicano'] = {
    sky: ['#2f3840', '#a89a80'],
    fitBox: [4, 6, 0, 62, 36, 41],
    fg(ctx, W, Ht, o) {
      const p = DR.project(42.5, 21.5, 2, o);
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * Math.PI * 2, r = o.s * (10 + (i % 3) * 3);
        dust(ctx, p[0] + Math.cos(a) * r * 1.4, p[1] + Math.sin(a) * r * 0.6, o.s * 4, 0.28, '170,150,115');
      }
      disc(ctx, o, 45.5, 21.5, 42.5, 30, 'xy', 'rgba(40,44,40,0.15)');
      disc(ctx, o, 3.5, 23.5, 37.5, 6, 'xz', 'rgba(40,44,40,0.22)');
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -12, -8, 92, 60, 2, { grass: ['#7a7446', '#6b6a3c', '#857b4a', '#8f7a58'] });
      // heliponto da FOB: "H" de pedras brancas, sacos de areia, barraca e antena
      for (let i = -3; i <= 3; i++) { v.set(39, 21 + i, 1, '#e8e2d0'); v.set(45, 21 + i, 1, '#e8e2d0'); }
      for (let x = 40; x < 45; x++) v.set(x, 21, 1, '#e8e2d0');
      DR.sandbags(v, 14, 33, 2, 40, 'x', 2);
      v.box(12, 8, 2, 9, 7, 4, '#55603a'); v.box(13, 9, 6, 7, 5, 1, '#55603a'); v.box(14, 10, 7, 5, 3, 1, '#4b5533');
      v.box(24, 9, 2, 1, 1, 14, '#2b2b25'); v.box(23, 9, 15, 3, 1, 1, '#2b2b25');
      DR.crate(v, 12, 17, 2); DR.crate(v, 16, 17, 2, '#4f5a33'); DR.crate(v, 12, 17, 5);
      const h = new DR.Vox();
      DR.pelicano(h, 30, 16, 24, DR.camo(['#6b7478', '#7a8387', '#5d6569', '#848c90'], 3, 93), RU, true);
      shadow(v, h, 1, 3, 3, '#5a5233');
      merge(v, h);
      return v;
    },
  };

  DR.VH = { track, wheel, dirty, ruts, dust, rotor, tailRotor, disc, shadow, merge, uralFront,
    PAINT, UC, RU, DARK, STEEL, GLASS, BLACK, HUB, ROTOR, COCKPIT, PORT, mud, dryField };
})();
