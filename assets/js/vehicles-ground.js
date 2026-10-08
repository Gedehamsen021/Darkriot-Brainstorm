/* DARKRIOT — frota terrestre extra: blindados, apoio, engenharia, barco e veículos civis.
   Mesmas convenções de vehicles.js: olhando para +x, (X, Y, Z) = canto traseiro-direito-inferior. */
(function () {
  const DR = window.DR, H = DR.hash, A = DR.ART;
  const { track, wheel, dirty, ruts, dust, uralFront, PAINT, UC, RU, STEEL, GLASS, BLACK, HUB, mud, dryField } = DR.VH;
  const LIGHT = '#e8e2c0', GRILLE = '#1f1f1d', CHROME = '#b8b8b0';
  const NATO = (seed) => DR.camo(['#4a5a36', '#5a4a32', '#2e2f2a', '#55623d'], 3, seed);

  // Par de rodas por eixo: esquerda (visível) em y = Y+W-w, direita em y = Y.
  function axles(v, xs, Y, W, cz, r, w) {
    for (const cx of xs) { wheel(v, cx, Y + W - w, cz, r, w, true); wheel(v, cx, Y, cz, r, w, false); }
  }
  // Casco de lagarta: lagartas de 3, casco baixo e casco alto de largura W. Topo do casco em Z+h+2.
  function tankHull(v, X, Y, Z, L, W, P, wheels, h) {
    h = h || 4;
    track(v, X, Y, Z, L, 3, h, 0);
    track(v, X, Y + W - 3, Z, L, 3, h, wheels || 6);
    v.box(X + 1, Y + 3, Z + 1, L - 2, W - 6, h - 1, P);
    v.box(X, Y, Z + h, L, W, 3, P);
    v.box(X + L, Y + 1, Z + 2, 2, W - 2, h - 1, P);
    v.box(X + L, Y + 1, Z + h + 1, 1, W - 2, 1, P);
  }
  // Cruz amarela de identificação da Coalizão num plano y fixo.
  function ucCross(v, x, y, z) { v.box(x, y, z - 1, 1, 1, 3, UC[0]); v.box(x - 1, y, z, 3, 1, 1, UC[0]); }

  /* ---------------- BLINDADOS ---------------- */

  DR.bisao = function (v, X, Y, Z) {
    const P = NATO(101);
    tankHull(v, X, Y, Z, 28, 16, P, 7);
    v.box(X + 1, Y + 16, Z + 2, 26, 1, 3, '#4c573a');
    for (let i = 4; i < 27; i += 5) v.box(X + i, Y + 16, Z + 2, 1, 1, 3, '#3b4430');
    // torre em cunha, cesto traseiro e canhão longo
    v.box(X + 7, Y + 2, Z + 7, 15, 12, 3, P);
    v.box(X + 22, Y + 3, Z + 7, 2, 10, 3, P);
    v.box(X + 24, Y + 5, Z + 7, 2, 6, 2, P);
    v.box(X + 26, Y + 7, Z + 7, 1, 2, 1, P);
    v.box(X + 5, Y + 3, Z + 7, 2, 10, 3, '#3f4232');
    v.box(X + 24, Y + 7, Z + 9, 17, 2, 1, '#2f3123'); v.box(X + 41, Y + 7, Z + 9, 1, 2, 1, '#1a1a1a');
    // mira giratória do comandante, fumígenos e antena
    v.box(X + 11, Y + 3, Z + 10, 2, 2, 2, HUB); v.set(X + 13, Y + 3, Z + 11, '#3d6bd9');
    v.box(X + 19, Y + 1, Z + 8, 3, 1, 1, HUB); v.box(X + 19, Y + 14, Z + 8, 3, 1, 1, HUB);
    v.box(X + 8, Y + 11, Z + 10, 1, 1, 6, '#222');
    ucCross(v, X + 16, Y + 13, Z + 8); v.set(X + 19, Y + 13, Z + 9, UC[1]);
  };

  DR.tatu = function (v, X, Y, Z) {
    const P = PAINT.ucTan;
    v.box(X + 2, Y + 2, Z + 2, 16, 5, 2, '#4a4632');
    v.box(X, Y + 1, Z + 4, 20, 7, 6, P);
    v.carve(X + 17, Y + 1, Z + 8, 3, 7, 2);
    for (const yy of [Y + 1, Y + 7]) v.carve(X, yy, Z + 9, 17, 1, 1);
    v.box(X + 16, Y + 2, Z + 8, 1, 5, 2, GLASS);
    v.box(X + 12, Y + 7, Z + 7, 2, 1, 2, GLASS); v.box(X + 7, Y + 7, Z + 7, 2, 1, 2, GLASS);
    v.box(X + 19, Y + 2, Z + 4, 1, 5, 3, GRILLE); v.set(X + 19, Y + 1, Z + 7, LIGHT); v.set(X + 19, Y + 7, Z + 7, LIGHT);
    // estação de armas remota
    v.box(X + 7, Y + 3, Z + 10, 4, 3, 2, HUB); v.box(X + 11, Y + 4, Z + 11, 6, 1, 1, BLACK); v.set(X + 10, Y + 3, Z + 11, '#3d6bd9');
    v.box(X + 10, Y + 7, Z + 4, 1, 1, 4, '#5f5a40');
    v.box(X + 3, Y + 8, Z + 3, 4, 1, 1, HUB);
    axles(v, [X + 4, X + 15], Y, 9, Z + 3, 3, 2);
    ucCross(v, X + 13, Y + 7, Z + 5);
  };

  DR.javali = function (v, X, Y, Z) {
    const P = PAINT.ru;
    v.box(X + 1, Y + 2, Z + 2, 18, 5, 2, '#3b4029');
    v.box(X, Y + 1, Z + 4, 13, 7, 6, P);
    v.box(X + 13, Y + 1, Z + 4, 7, 7, 3, P);
    for (const yy of [Y + 1, Y + 7]) v.carve(X, yy, Z + 9, 13, 1, 1);
    v.box(X + 12, Y + 2, Z + 7, 1, 5, 2, GLASS);
    v.box(X + 8, Y + 7, Z + 7, 3, 1, 2, GLASS); v.box(X + 3, Y + 7, Z + 7, 3, 1, 2, GLASS);
    v.box(X + 19, Y + 2, Z + 4, 1, 5, 2, GRILLE);
    for (let j = 2; j < 7; j += 2) v.set(X + 19, Y + j, Z + 5, '#3a3a33');
    v.set(X + 19, Y + 1, Z + 6, LIGHT); v.set(X + 19, Y + 7, Z + 6, LIGHT);
    // metralhadora com escudo no teto
    v.box(X + 4, Y + 3, Z + 10, 3, 3, 1, HUB); v.box(X + 7, Y + 2, Z + 10, 1, 5, 2, P); v.box(X + 7, Y + 4, Z + 11, 6, 1, 1, BLACK);
    axles(v, [X + 4, X + 15], Y, 9, Z + 3, 3, 2);
    v.box(X + 2, Y + 7, Z + 5, 8, 1, 1, RU[0]); v.set(X + 10, Y + 7, Z + 5, RU[1]);
  };

  /* ---------------- APOIO E ENGENHARIA ---------------- */

  DR.martelo = function (v, X, Y, Z) {
    const P = PAINT.ucTan;
    v.box(X + 1, Y + 2, Z + 3, 25, 5, 1, '#2a2a26');
    v.box(X + 19, Y + 1, Z + 4, 7, 7, 6, P);
    for (const yy of [Y + 1, Y + 7]) v.carve(X + 19, yy, Z + 9, 7, 1, 1);
    v.box(X + 25, Y + 2, Z + 7, 1, 5, 2, GLASS); v.box(X + 21, Y + 7, Z + 7, 2, 1, 2, GLASS);
    v.box(X + 25, Y + 2, Z + 4, 1, 5, 2, GRILLE); v.set(X + 25, Y + 1, Z + 5, LIGHT); v.set(X + 25, Y + 7, Z + 5, LIGHT);
    // plataforma e casulo de seis foguetes, elevado
    v.box(X + 1, Y + 1, Z + 4, 17, 7, 1, '#3a3a33');
    v.box(X + 3, Y + 3, Z + 5, 3, 3, 2, HUB);
    for (let yy = Y + 2; yy <= Y + 6; yy++) for (let j = 0; j < 4; j++) v.line(X + 3, yy, Z + 6 + j, X + 15, yy, Z + 12 + j, P);
    for (let yy = Y + 2; yy <= Y + 6; yy += 2) for (let j = 0; j < 4; j += 2) v.set(X + 15, yy, Z + 12 + j, '#151515');
    v.line(X + 10, Y + 4, Z + 5, X + 11, Y + 4, Z + 8, HUB);
    axles(v, [X + 4, X + 10, X + 21], Y, 9, Z + 3, 3, 2);
    v.box(X + 21, Y + 7, Z + 5, 3, 1, 1, UC[0]); v.box(X + 21, Y + 7, Z + 4, 3, 1, 1, UC[1]);
  };

  DR.granizo = function (v, X, Y, Z) {
    const P = PAINT.ru;
    uralFront(v, X, Y, Z, P);
    v.box(X + 1, Y + 1, Z + 4, 14, 9, 1, '#3a3a33');
    v.box(X + 3, Y + 3, Z + 5, 4, 5, 2, HUB);
    // bloco de 40 tubos elevado para a frente
    for (let yy = Y + 2; yy <= Y + 8; yy++) for (let j = 0; j < 4; j++) v.line(X + 2, yy, Z + 7 + j, X + 15, yy, Z + 11 + j, '#4b5233');
    for (let yy = Y + 2; yy <= Y + 8; yy++) for (let j = 0; j < 4; j++) if ((yy + j) % 2 === 0) v.set(X + 15, yy, Z + 11 + j, '#151515');
    axles(v, [X + 4, X + 10, X + 22], Y, 11, Z + 3, 3, 2);
    v.box(X + 17, Y + 9, Z + 6, 3, 1, 1, RU[0]); v.set(X + 18, Y + 9, Z + 5, RU[1]);
  };

  DR.guepardo = function (v, X, Y, Z) {
    const P = NATO(103);
    tankHull(v, X, Y, Z, 26, 15, P, 6);
    v.box(X + 7, Y + 3, Z + 7, 11, 9, 5, P);
    v.box(X + 8, Y + 4, Z + 12, 9, 7, 1, P);
    for (const yy of [Y + 1, Y + 12]) {
      v.box(X + 12, yy, Z + 8, 5, 2, 3, P);
      v.box(X + 17, yy + (yy > Y + 6 ? 0 : 1), Z + 9, 12, 1, 1, BLACK);
    }
    // radar de busca girando atrás e radar de tiro na frente
    v.box(X + 8, Y + 6, Z + 13, 1, 3, 2, HUB);
    v.box(X + 6, Y + 2, Z + 15, 3, 11, 2, '#5d6569'); v.box(X + 7, Y + 2, Z + 16, 1, 11, 1, '#7a8387');
    v.box(X + 18, Y + 5, Z + 8, 1, 5, 4, '#3b3d3f'); v.box(X + 18, Y + 6, Z + 9, 1, 3, 2, '#5d6569');
    ucCross(v, X + 10, Y + 11, Z + 9);
  };

  DR.ourico = function (v, X, Y, Z) {
    const P = PAINT.ru;
    v.box(X + 1, Y + 2, Z + 3, 30, 6, 1, '#2a2a26');
    v.box(X + 24, Y + 1, Z + 4, 7, 8, 6, P);
    for (const yy of [Y + 1, Y + 8]) v.carve(X + 24, yy, Z + 9, 7, 1, 1);
    v.box(X + 30, Y + 2, Z + 7, 1, 6, 2, GLASS); v.box(X + 26, Y + 8, Z + 7, 2, 1, 2, GLASS);
    v.box(X + 30, Y + 2, Z + 4, 1, 6, 2, GRILLE); v.set(X + 30, Y + 1, Z + 5, LIGHT); v.set(X + 30, Y + 8, Z + 5, LIGHT);
    v.box(X + 1, Y + 1, Z + 4, 22, 8, 1, '#3a3a33');
    v.box(X + 6, Y + 2, Z + 5, 11, 6, 5, P);
    // dois blocos de 6 mísseis inclinados nas laterais do módulo
    for (const yb of [Y, Y + 8]) for (let yy = yb; yy <= yb + 1; yy++) for (let j = 0; j < 3; j++) {
      v.line(X + 5, yy, Z + 8 + j, X + 17, yy, Z + 11 + j, '#56603a');
      v.set(X + 17, yy, Z + 11 + j, j % 2 ? '#2b2b25' : '#151515');
    }
    // radares: painel de busca no topo, prato de tiro na frente; canhões gêmeos
    v.box(X + 10, Y + 4, Z + 10, 2, 2, 2, HUB);
    v.box(X + 8, Y + 2, Z + 12, 2, 6, 3, '#5d6569'); v.box(X + 9, Y + 2, Z + 13, 1, 6, 1, '#7a8387');
    v.box(X + 17, Y + 3, Z + 6, 1, 4, 4, '#3b3d3f'); v.box(X + 17, Y + 4, Z + 7, 1, 2, 2, '#5d6569');
    v.box(X + 15, Y + 3, Z + 10, 6, 1, 1, BLACK); v.box(X + 15, Y + 6, Z + 10, 6, 1, 1, BLACK);
    axles(v, [X + 4, X + 9, X + 20, X + 25], Y, 10, Z + 3, 3, 2);
    v.box(X + 26, Y + 8, Z + 5, 3, 1, 1, RU[0]); v.set(X + 27, Y + 8, Z + 4, RU[1]);
  };

  DR.toupeira = function (v, X, Y, Z) {
    const P = DR.camo(['#5b6236', '#4a5230', '#6b6a42'], 3, 105);
    const hazard = (x, y, z) => ((y + z) % 4 < 2 ? '#ffb000' : '#1a1a1a');
    tankHull(v, X, Y, Z, 24, 14, P, 6);
    // lâmina frontal com faixas de alerta
    v.box(X + 27, Y - 1, Z, 2, 16, 4, '#5d5a40');
    v.box(X + 28, Y - 1, Z + 3, 1, 16, 1, hazard);
    v.line(X + 22, Y + 2, Z + 4, X + 27, Y + 2, Z + 2, HUB); v.line(X + 22, Y + 11, Z + 4, X + 27, Y + 11, Z + 2, HUB);
    // cabine blindada
    v.box(X + 3, Y + 2, Z + 7, 7, 5, 4, P);
    v.box(X + 9, Y + 3, Z + 8, 1, 3, 2, GLASS); v.box(X + 5, Y + 6, Z + 8, 3, 1, 2, GLASS);
    // braço escavador com caçamba cheia de terra
    v.box(X + 12, Y + 8, Z + 7, 3, 4, 2, HUB);
    for (const yy of [Y + 9, Y + 10]) { v.line(X + 13, yy, Z + 8, X + 20, yy, Z + 16, '#c9a227'); v.line(X + 20, yy, Z + 16, X + 27, yy, Z + 10, '#c9a227'); }
    v.box(X + 26, Y + 8, Z + 6, 3, 4, 4, '#4a4a40'); v.box(X + 26, Y + 9, Z + 9, 3, 2, 2, '#6b4e32');
    v.box(X + 29, Y + 8, Z + 6, 1, 4, 1, '#8d8f90');
  };

  DR.castor = function (v, X, Y, Z, bankZ) {
    const P = NATO(107);
    tankHull(v, X, Y, Z, 24, 15, P, 6);
    v.box(X + 4, Y + 3, Z + 7, 8, 9, 3, P);
    v.box(X + 11, Y + 4, Z + 8, 1, 3, 1, GLASS);
    v.box(X + 18, Y + 5, Z + 7, 7, 5, 2, HUB);
    // ponte sendo apoiada na outra margem
    const deck = (x, y) => ((x + y) % 3 === 0 ? '#6f716a' : '#7d7f78');
    for (let yy = Y + 1; yy <= Y + 13; yy++) v.line(X + 24, yy, Z + 8, X + 55, yy, bankZ, deck);
    for (const yy of [Y + 1, Y + 13]) v.line(X + 24, yy, Z + 9, X + 55, yy, bankZ + 1, '#5d6569');
    ucCross(v, X + 8, Y + 14, Z + 5);
  };

  DR.serpente = function (v, X, Y, Z) {
    const P = PAINT.ru;
    track(v, X, Y, Z, 24, 2, 3, 0); track(v, X, Y + 10, Z, 24, 2, 3, 6);
    v.box(X + 1, Y + 2, Z + 1, 22, 8, 2, P); v.box(X, Y, Z + 3, 24, 12, 3, P); v.box(X + 24, Y + 1, Z + 2, 2, 10, 3, P);
    v.box(X + 18, Y + 1, Z + 6, 4, 3, 2, P); v.box(X + 22, Y + 2, Z + 7, 3, 1, 1, BLACK);
    // lançador traseiro elevado (dois trilhos) e a carga linear em arco: a "serpente"
    v.box(X + 1, Y + 2, Z + 6, 9, 8, 2, '#4b5233');
    for (const yy of [Y + 4, Y + 8]) v.line(X + 2, yy, Z + 8, X + 12, yy, Z + 15, HUB);
    v.box(X + 11, Y + 4, Z + 14, 2, 5, 1, HUB);
    const x0 = X + 12, z0 = Z + 15;
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const x = Math.round(x0 + t * 40), z = Math.round(z0 + 18 * t - 16 * t * t), y = Math.round(Y + 6 + Math.sin(t * 9) * 1.5);
      v.set(x, y, z, i % 6 < 4 ? '#3f4a2c' : '#8a8f70');
    }
    v.box(x0 + 40, Y + 6, z0 + 2, 3, 1, 1, '#d9d9d6');
    v.box(X + 4, Y + 11, Z + 4, 5, 1, 1, RU[0]); v.set(X + 10, Y + 11, Z + 4, RU[1]);
  };

  DR.lontra = function (v, X, Y, Z) {
    const T = '#3b3f42', hull = '#4a4f44';
    v.box(X + 1, Y + 2, Z, 15, 4, 1, hull);
    v.box(X, Y + 1, Z + 1, 17, 6, 1, '#2f3332');
    v.box(X, Y, Z + 1, 17, 1, 2, T); v.box(X, Y + 7, Z + 1, 17, 1, 2, T);
    v.box(X + 17, Y + 1, Z + 1, 2, 6, 2, T); v.box(X + 19, Y + 2, Z + 2, 1, 4, 1, T);
    v.box(X + 8, Y + 3, Z + 2, 2, 2, 2, '#2b2b25');
    v.box(X + 3, Y + 2, Z + 2, 2, 2, 1, '#4a5230'); v.box(X + 3, Y + 5, Z + 2, 3, 1, 1, '#5a4a32');
    v.box(X - 2, Y + 3, Z + 1, 2, 2, 4, BLACK); v.box(X - 3, Y + 3, Z + 4, 1, 2, 1, BLACK);
    v.box(X + 15, Y + 3, Z + 2, 1, 1, 2, HUB); v.box(X + 16, Y + 3, Z + 4, 4, 1, 1, BLACK);
  };

  /* ---------------- CIVIS ---------------- */

  DR.tijolinho = function (v, X, Y, Z, colors) {
    const P = DR.camo(colors || ['#5f86a8', '#56799a', '#6990b0'], 2, 111);
    v.box(X, Y + 1, Z + 2, 19, 6, 2, P);
    v.box(X + 6, Y + 1, Z + 4, 8, 6, 3, P);
    v.box(X + 7, Y + 6, Z + 4, 3, 1, 2, GLASS); v.box(X + 11, Y + 6, Z + 4, 2, 1, 2, GLASS);
    v.box(X + 13, Y + 2, Z + 4, 1, 4, 2, GLASS);
    v.box(X, Y + 6, Z + 3, 19, 1, 1, '#9aa3a8');
    v.box(X + 18, Y + 2, Z + 3, 1, 4, 1, GRILLE); v.set(X + 18, Y + 1, Z + 3, LIGHT); v.set(X + 18, Y + 6, Z + 3, LIGHT);
    v.box(X + 19, Y + 1, Z + 2, 1, 6, 1, CHROME); v.box(X - 1, Y + 1, Z + 2, 1, 6, 1, CHROME);
    for (let i = 0; i < 8; i++) v.set(X + Math.floor(H(i, 1, 11) * 19), Y + 6, Z + 2, '#6b3a22');
    axles(v, [X + 4, X + 15], Y, 8, Z + 2, 2, 2);
  };

  DR.paoDeForma = function (v, X, Y, Z) {
    const P = DR.camo(['#97a46e', '#8f9c66', '#a0ad76'], 3, 113);
    v.box(X, Y + 1, Z + 2, 18, 6, 6, P);
    for (const yy of [Y + 1, Y + 6]) v.carve(X, yy, Z + 7, 18, 1, 1);
    v.carve(X, Y + 1, Z + 7, 1, 6, 1); v.carve(X + 17, Y + 1, Z + 7, 1, 6, 1);
    v.box(X + 17, Y + 2, Z + 5, 1, 4, 2, GLASS);
    for (const i of [2, 6, 10]) v.box(X + i, Y + 6, Z + 5, 3, 1, 2, GLASS);
    v.box(X + 14, Y + 6, Z + 5, 2, 1, 2, GLASS);
    v.box(X + 9, Y + 6, Z + 2, 1, 1, 3, '#5f6a44');
    v.box(X + 17, Y + 3, Z + 3, 1, 2, 1, GRILLE); v.set(X + 17, Y + 2, Z + 3, LIGHT); v.set(X + 17, Y + 5, Z + 3, LIGHT);
    v.box(X + 18, Y + 1, Z + 2, 1, 6, 1, '#2b2b25');
    v.box(X + 3, Y + 2, Z + 8, 11, 4, 1, '#2b2b25'); v.carve(X + 4, Y + 3, Z + 8, 9, 2, 1);
    v.box(X + 4, Y + 2, Z + 8, 2, 2, 2, '#4a5230'); v.box(X + 8, Y + 3, Z + 8, 3, 3, 1, '#1d1d1b');
    axles(v, [X + 3, X + 15], Y, 8, Z + 2, 2, 2);
  };

  DR.sardinha = function (v, X, Y, Z) {
    v.box(X, Y + 1, Z + 2, 32, 7, 4, '#d9962a');
    v.box(X, Y + 1, Z + 6, 32, 7, 4, '#e8e0c8');
    for (const yy of [Y + 1, Y + 7]) v.carve(X, yy, Z + 9, 32, 1, 1);
    for (let i = 2; i < 30; i += 4) v.box(X + i, Y + 7, Z + 6, 3, 1, 3, GLASS);
    // chapas de aço improvisadas em algumas janelas
    for (const i of [6, 14, 22]) v.box(X + i, Y + 8, Z + 6, 3, 1, 3, (x, y, z) => (H(x, z, 1, 7) < 0.3 ? '#7a4a2e' : '#6d6a5f'));
    v.box(X + 31, Y + 2, Z + 5, 1, 5, 4, GLASS);
    v.box(X + 31, Y + 2, Z + 9, 1, 5, 1, '#151515'); v.set(X + 31, Y + 3, Z + 9, '#ffb000'); v.set(X + 31, Y + 5, Z + 9, '#ffb000');
    v.set(X + 31, Y + 2, Z + 3, LIGHT); v.set(X + 31, Y + 6, Z + 3, LIGHT);
    v.box(X + 32, Y + 1, Z + 2, 1, 7, 1, '#2b2b25');
    DR.sandbags(v, X + 26, Y + 2, Z + 10, 4, 'y', 1);
    axles(v, [X + 6, X + 25], Y, 9, Z + 3, 3, 2);
  };

  DR.teimoso = function (v, X, Y, Z) {
    const R = '#b8382a';
    wheel(v, X + 3, Y + 7, Z + 4, 4, 2, true); wheel(v, X + 3, Y, Z + 4, 4, 2, false);
    wheel(v, X + 12, Y + 6, Z + 2, 2, 2, true); wheel(v, X + 12, Y + 1, Z + 2, 2, 2, false);
    v.box(X + 2, Y + 3, Z + 3, 12, 3, 2, '#2f3130');
    v.box(X + 6, Y + 3, Z + 5, 8, 3, 3, R);
    v.box(X + 14, Y + 3, Z + 4, 1, 3, 3, GRILLE); v.set(X + 14, Y + 3, Z + 7, LIGHT); v.set(X + 14, Y + 5, Z + 7, LIGHT);
    v.box(X + 11, Y + 4, Z + 8, 1, 1, 3, '#2b2b25');
    // cabine envidraçada com teto branco
    v.box(X + 1, Y + 2, Z + 6, 5, 5, 1, R);
    v.box(X + 1, Y + 2, Z + 7, 5, 5, 4, GLASS);
    for (const [a, b] of [[1, 2], [5, 2], [1, 6], [5, 6]]) v.box(X + a, Y + b, Z + 7, 1, 1, 4, R);
    v.box(X + 1, Y + 2, Z + 11, 5, 5, 1, '#e8e0c8');
    v.box(X + 1, Y, Z + 9, 4, 2, 1, R); v.box(X + 1, Y + 7, Z + 9, 4, 2, 1, R);
    v.box(X - 1, Y + 4, Z + 2, 1, 1, 1, HUB);
  };

  DR.socorro = function (v, X, Y, Z) {
    const W = DR.camo(['#e8e8e2', '#dcdcd5', '#f0f0ea'], 2, 115), G = '#1f8a4c';
    v.box(X, Y + 1, Z + 2, 13, 6, 8, W);
    v.box(X + 13, Y + 1, Z + 2, 4, 6, 6, W);
    v.box(X + 17, Y + 1, Z + 2, 2, 6, 3, W);
    v.box(X + 16, Y + 2, Z + 5, 1, 4, 3, GLASS); v.box(X + 14, Y + 6, Z + 5, 2, 1, 2, GLASS);
    v.box(X + 18, Y + 2, Z + 3, 1, 4, 1, GRILLE); v.set(X + 18, Y + 1, Z + 4, LIGHT); v.set(X + 18, Y + 6, Z + 4, LIGHT);
    v.box(X, Y + 6, Z + 3, 19, 1, 1, G);
    v.box(X + 6, Y + 6, Z + 5, 1, 1, 3, G); v.box(X + 5, Y + 6, Z + 6, 3, 1, 1, G);
    v.box(X + 13, Y + 2, Z + 8, 3, 4, 1, '#2f5fa8'); v.set(X + 14, Y + 3, Z + 8, '#6fa0ff');
    axles(v, [X + 3, X + 14], Y, 8, Z + 2, 2, 2);
  };

  DR.cabrito = function (v, X, Y, Z) {
    const P = DR.camo(['#56603a', '#4a5230', '#6b6a42', '#3e4429'], 2, 117);
    v.box(X, Y + 1, Z + 3, 14, 6, 3, P);
    v.box(X + 1, Y + 1, Z + 6, 9, 6, 2, P);
    v.box(X + 9, Y + 2, Z + 6, 1, 4, 2, GLASS);
    v.box(X + 2, Y + 6, Z + 6, 3, 1, 2, GLASS); v.box(X + 6, Y + 6, Z + 6, 2, 1, 2, GLASS);
    v.box(X + 13, Y + 2, Z + 4, 1, 4, 1, GRILLE); v.set(X + 13, Y + 1, Z + 4, LIGHT); v.set(X + 13, Y + 6, Z + 4, LIGHT);
    v.box(X + 14, Y + 1, Z + 3, 1, 6, 1, '#2b2b25'); v.box(X - 1, Y + 1, Z + 3, 1, 6, 1, '#2b2b25');
    v.box(X + 1, Y + 1, Z + 8, 8, 6, 1, '#2b2b25'); v.carve(X + 2, Y + 2, Z + 8, 6, 4, 1);
    v.box(X + 2, Y + 2, Z + 8, 2, 2, 2, '#4a5230'); v.box(X + 5, Y + 4, Z + 8, 3, 2, 1, '#6b4a2b');
    v.box(X + 3, Y + 6, Z + 4, 3, 1, 1, UC[0]); v.box(X + 3, Y + 6, Z + 3, 3, 1, 1, UC[1]);
    axles(v, [X + 3, X + 11], Y, 8, Z + 2, 2, 2);
  };

  /* ---------------- CENÁRIOS ---------------- */

  // Rua: asfalto entre ry0..ry1 (em y), calçada elevada no resto, faixa central tracejada.
  function street(v, x0, y0, W, D, ry0, ry1) {
    for (let i = 0; i < W; i++) for (let j = 0; j < D; j++) {
      const x = x0 + i, y = y0 + j, road = y >= ry0 && y <= ry1;
      v.set(x, y, 0, '#5d432b');
      v.set(x, y, 1, road ? ['#3a3c3e', '#424446', '#35373a'][Math.floor(H(x >> 1, y >> 1, 1, 9) * 3)] : '#8f8b82');
      if (!road) v.set(x, y, 2, (y === ry0 - 1 || y === ry1 + 1) ? '#a6a296' : ['#8f8b82', '#9a968c'][(x + y) & 1]);
    }
    for (let x = x0; x < x0 + W; x++) if (((x % 6) + 6) % 6 < 3) v.set(x, (ry0 + ry1) >> 1, 1, '#d9d4c0');
  }
  // Prédio de painéis de 5 andares (com janelas acesas e um rombo).
  DR.panelBlock = function (v, x, y, z, w, d, floors, hole) {
    const wall = DR.camo(['#c9c4b8', '#bdb8ac', '#d4cfc3'], 2, 121);
    v.box(x, y, z, w, d, floors * 3 + 1, wall);
    for (let f = 0; f < floors; f++) {
      for (let i = 1; i < w - 1; i += 3) v.box(x + i, y + d - 1, z + f * 3 + 1, 2, 1, 2, H(i, f, 3) < 0.15 ? '#e8d9a0' : '#2a3440');
      for (let j = 1; j < d - 1; j += 3) v.box(x + w - 1, y + j, z + f * 3 + 1, 1, 2, 2, '#2a3440');
    }
    v.box(x, y, z + floors * 3 + 1, w, d, 1, '#6d6a5f');
    if (hole) v.sphere(hole[0], hole[1], hole[2], hole[3], null, 1.5);
  };
  function lamp(v, x, y, z) { v.box(x, y, z, 1, 1, 10, '#3b3d3f'); v.box(x, y - 2, z + 9, 1, 2, 1, '#3b3d3f'); v.set(x, y - 2, z + 8, '#e8d9a0'); }
  function hazardSign(v, x, y, z) { v.box(x, y, z, 1, 1, 5, '#6b4a2b'); v.box(x, y - 1, z + 4, 1, 3, 2, '#c8262b'); v.set(x, y, z + 5, '#f2f2f2'); }
  function water(v, x0, y0, W, D, zTop) {
    for (let i = 0; i < W; i++) for (let j = 0; j < D; j++) for (let k = 0; k <= zTop; k++) {
      const x = x0 + i, y = y0 + j;
      v.set(x, y, k, k === zTop ? ['#3d6a8a', '#466f8f', '#36607e'][Math.floor(H(x >> 1, y >> 1, 3, 3) * 3)] : '#2c4a5e');
    }
  }
  const asphaltDust = ['#5a5a58', '#6b6a66'];

  A['veh-bisao'] = {
    sky: ['#2c3640', '#b9a179'],
    fg(ctx, W, Ht, o) {
      const p = DR.project(46.5, 9, 11.5, o);
      const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], o.s * 7);
      g.addColorStop(0, 'rgba(255,245,200,0.95)'); g.addColorStop(0.4, 'rgba(255,150,50,0.6)'); g.addColorStop(1, 'rgba(255,100,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], o.s * 7, 0, 7); ctx.fill();
      dust(ctx, p[0] - o.s * 4, p[1] + o.s * 6, o.s * 4, 0.35);
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -4, -4, 50, 26, 2, dryField);
      ruts(v, -4, 3, [1, 2, 3, 15, 16, 17], 1, mud);
      DR.bisao(v, 4, 1, 2);
      dirty(v, 3, 0, 33, 18, 2, 6, 0.5, mud, 3);
      return v;
    },
  };
  A['veh-tatu'] = {
    sky: ['#2b333a', '#9a9486'],
    build() {
      const v = new DR.Vox();
      street(v, -6, -10, 40, 30, 2, 12);
      DR.panelBlock(v, -4, -10, 3, 26, 7, 3, [6, -4, 9, 3]);
      for (let i = 0; i < 4; i++) v.box(24 + i * 3, 14, 3, 2, 3, 3, '#a6a296');
      DR.sandbags(v, -4, 15, 3, 10, 'x', 2);
      DR.tatu(v, 4, 3, 2);
      dirty(v, 3, 2, 25, 12, 2, 5, 0.3, asphaltDust, 5);
      return v;
    },
  };
  A['veh-javali'] = {
    sky: ['#2c3236', '#8a8270'],
    fg(ctx, W, Ht, o) { const p = DR.project(0, 6, 4, o); dust(ctx, p[0], p[1], o.s * 5, 0.45); },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -14, 36, 28, 2, dryField);
      for (let x = -6; x < 30; x++) for (let y = 1; y < 12; y++) v.set(x, y, 1, ['#8f7a58', '#857052', '#9a8461'][Math.floor(H(x >> 1, y >> 1, 1, 51) * 3)]);
      for (let i = 0; i < 6; i++) DR.tree(v, -4 + i * 6, -12 + (i % 2), 2, 6 + (i % 3), false);
      DR.javali(v, 4, 2, 2);
      dirty(v, 3, 2, 25, 11, 2, 5, 0.5, ['#8f7a58', '#7a6648'], 7);
      return v;
    },
  };
  A['veh-martelo'] = {
    sky: ['#252d33', '#a88c68'],
    fg(ctx, W, Ht, o) {
      const a = DR.project(18, 6, 17, o), b = DR.project(30, 6, 46, o), r = DR.project(5, 6, 8, o);
      dust(ctx, r[0], r[1], o.s * 4, 0.45, '200,195,185');
      ctx.strokeStyle = 'rgba(235,230,220,0.6)'; ctx.lineWidth = o.s * 1.4;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      const g = ctx.createRadialGradient(b[0], b[1], 0, b[0], b[1], o.s * 3);
      g.addColorStop(0, 'rgba(255,240,190,1)'); g.addColorStop(1, 'rgba(255,140,40,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b[0], b[1], o.s * 3, 0, 7); ctx.fill();
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -4, 40, 20, 2, dryField);
      DR.martelo(v, 3, 2, 2);
      dirty(v, 2, 2, 30, 11, 2, 5, 0.4, mud, 9);
      return v;
    },
  };
  A['veh-granizo'] = {
    sky: ['#24282c', '#9a7a5a'],
    fg(ctx, W, Ht, o) {
      const a = DR.project(18, 7, 15, o), r = DR.project(4, 7, 9, o);
      dust(ctx, r[0], r[1], o.s * 5, 0.45, '190,185,175');
      for (let k = 0; k < 5; k++) {
        const b = DR.project(22 + k * 4, 4 + k * 1.5, 24 + k * 6, o);
        ctx.strokeStyle = 'rgba(230,225,215,0.45)'; ctx.lineWidth = o.s * 0.9;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        ctx.fillStyle = 'rgba(255,220,150,0.95)'; ctx.beginPath(); ctx.arc(b[0], b[1], o.s * 0.9, 0, 7); ctx.fill();
      }
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -4, 42, 22, 2);
      DR.granizo(v, 3, 2, 2);
      dirty(v, 2, 2, 32, 13, 2, 5, 0.45, mud, 11);
      return v;
    },
  };
  A['veh-guepardo'] = {
    sky: ['#1f2a33', '#8a9aa0'],
    fg(ctx, W, Ht, o) {
      const d = DR.project(70, 6, 52, o);
      ctx.fillStyle = '#2a2c2e'; ctx.fillRect(d[0] - 6, d[1] - 2, 12, 3); ctx.fillRect(d[0] - 2, d[1] - 4, 3, 7);
      for (const yy of [2, 12]) for (let k = 0; k < 6; k++) {
        const t0 = 0.08 + k * 0.15, a = DR.project(30 + t0 * 40, yy - t0 * (yy - 6), 10 + t0 * 42, o), b = DR.project(30 + (t0 + 0.06) * 40, yy - (t0 + 0.06) * (yy - 6), 10 + (t0 + 0.06) * 42, o);
        ctx.strokeStyle = 'rgba(255,210,120,0.95)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -4, -4, 44, 26, 2);
      DR.guepardo(v, 4, 2, 2);
      dirty(v, 3, 1, 31, 17, 2, 6, 0.4, mud, 13);
      return v;
    },
  };
  A['veh-ourico'] = {
    sky: ['#1f262c', '#7d8a90'],
    fg(ctx, W, Ht, o) {
      const a = DR.project(19, 10, 14, o), b = DR.project(34, 14, 40, o);
      dust(ctx, a[0], a[1] + o.s * 2, o.s * 3, 0.35, '200,200,195');
      ctx.strokeStyle = 'rgba(235,235,230,0.65)'; ctx.lineWidth = o.s * 1.2;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(a[0] + (b[0] - a[0]) * 0.2, b[1] + (a[1] - b[1]) * 0.4, b[0], b[1]); ctx.stroke();
      const g = ctx.createRadialGradient(b[0], b[1], 0, b[0], b[1], o.s * 2.5);
      g.addColorStop(0, 'rgba(255,240,190,1)'); g.addColorStop(1, 'rgba(255,140,40,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b[0], b[1], o.s * 2.5, 0, 7); ctx.fill();
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -4, 46, 22, 2, dryField);
      DR.ourico(v, 3, 2, 2);
      dirty(v, 2, 2, 34, 12, 2, 5, 0.4, mud, 15);
      return v;
    },
  };
  A['veh-toupeira'] = {
    sky: ['#2f3a40', '#b8a07a'],
    build() {
      const v = new DR.Vox();
      DR.ground(v, -4, -6, 52, 28, 5);
      for (let x = 30; x < 46; x++) v.carve(x, 10, 2, 1, 5, 3);
      for (let x = 30; x < 46; x++) for (let y = 10; y < 15; y++) v.set(x, y, 1, '#5d432b');
      for (let i = 0; i < 18; i++) v.set(30 + Math.floor(H(i, 1, 4) * 16), 16 + Math.floor(H(i, 2, 4) * 3), 5 + Math.floor(H(i, 3, 4) * 2), '#6b4e32');
      v.box(31, 16, 5, 14, 3, 1, '#6b4e32');
      DR.toupeira(v, 2, 1, 5);
      dirty(v, 1, 0, 30, 15, 5, 8, 0.6, mud, 17);
      return v;
    },
  };
  A['veh-castor'] = {
    sky: ['#2b3a44', '#a9b0a0'],
    build() {
      const v = new DR.Vox();
      DR.ground(v, -4, -4, 74, 24, 5, { height: (x) => (x >= 32 && x <= 52 ? 1 : 5) });
      water(v, 32, -4, 21, 24, 2);
      for (let i = 0; i < 14; i++) { const x = 30 + (i % 2) * 24, y = -3 + i * 1.6 | 0; v.box(x, y, 5, 1, 1, 3, '#5f7a33'); }
      DR.castor(v, 2, 1, 5, 5);
      dirty(v, 1, 0, 28, 16, 5, 8, 0.45, mud, 19);
      return v;
    },
  };
  A['veh-serpente'] = {
    sky: ['#2a2d33', '#a08a68'],
    fg(ctx, W, Ht, o) {
      const p = DR.project(53.5, 7.5, 19.5, o);
      const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], o.s * 3);
      g.addColorStop(0, 'rgba(255,240,190,1)'); g.addColorStop(1, 'rgba(255,140,40,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], o.s * 3, 0, 7); ctx.fill();
      const q = DR.project(13, 7, 17, o); dust(ctx, q[0], q[1], o.s * 4, 0.45, '200,195,185');
    },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -4, -6, 64, 26, 2, dryField);
      for (let i = 0; i < 5; i++) hazardSign(v, 30 + i * 6, -4, 2);
      for (let i = 0; i < 12; i++) v.set(30 + Math.floor(H(i, 1, 6) * 30), 0 + Math.floor(H(i, 2, 6) * 14), 1, '#3b3d2c');
      DR.serpente(v, 2, 1, 2);
      dirty(v, 1, 0, 27, 13, 2, 5, 0.45, mud, 21);
      return v;
    },
  };
  A['veh-lontra'] = {
    sky: ['#1f2a33', '#6f8796'],
    build() {
      const v = new DR.Vox();
      water(v, -10, -4, 46, 20, 2);
      DR.ground(v, -10, -10, 46, 6, 4); DR.ground(v, -10, 16, 46, 5, 4);
      for (let i = 0; i < 20; i++) v.box(-9 + i * 2 + (i % 3), -5 + (i % 2), 4, 1, 1, 3 + (i % 3), '#6b8a3a');
      const foam = ['#e8f0f2', '#c8d8de'];
      for (let x = -9; x < 4; x++) { const d = Math.round((4 - x) * 0.35); for (const y of [3 - d, 10 + d]) if (y > -4 && y < 16) v.set(x, y, 2, foam[(x + y) & 1]); }
      for (let x = -2; x < 4; x++) for (let y = 4; y < 10; y++) if (H(x, y, 2, 2) < 0.6) v.set(x, y, 2, foam[(x + y) & 1]);
      DR.lontra(v, 6, 3, 2);
      return v;
    },
  };
  A['veh-tijolinho'] = {
    sky: ['#2b333a', '#b4a78f'],
    build() {
      const v = new DR.Vox();
      street(v, -6, -10, 34, 28, 3, 12);
      DR.panelBlock(v, -5, -10, 3, 30, 6, 4, [14, -4, 12, 3]);
      lamp(v, 24, 1, 3);
      v.box(-2, 15, 3, 6, 2, 1, '#6b4a2b'); v.box(-2, 16, 4, 6, 1, 2, '#6b4a2b');
      DR.tijolinho(v, 4, 4, 2);
      return v;
    },
  };
  A['veh-pao'] = {
    sky: ['#2f3a40', '#c2ab84'],
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -16, 32, 32, 2);
      for (let x = -6; x < 26; x++) for (let y = 1; y < 11; y++) v.set(x, y, 1, ['#8f7a58', '#857052', '#9a8461'][Math.floor(H(x >> 1, y >> 1, 1, 61) * 3)]);
      DR.house(v, -4, -15, 2, false);
      for (let i = 0; i < 10; i++) v.box(-5 + i * 3, 13, 2, 1, 1, 3, '#6b4a2b');
      v.line(-5, 13, 4, 23, 13, 4, '#6b4a2b');
      DR.paoDeForma(v, 6, 2, 2);
      dirty(v, 5, 2, 22, 10, 2, 5, 0.45, ['#8f7a58', '#7a6648'], 23);
      return v;
    },
  };
  A['veh-sardinha'] = {
    sky: ['#2b333a', '#a7a291'],
    build() {
      const v = new DR.Vox();
      street(v, -6, -10, 48, 30, 3, 13);
      DR.panelBlock(v, -4, -10, 3, 20, 6, 4, null); DR.panelBlock(v, 20, -10, 3, 18, 6, 3, [30, -4, 10, 3]);
      // ponto de ônibus
      v.box(14, 15, 3, 1, 1, 6, '#3b3d3f'); v.box(20, 15, 3, 1, 1, 6, '#3b3d3f'); v.box(14, 15, 9, 7, 3, 1, '#5d8aa8'); v.box(15, 17, 3, 5, 1, 2, '#6b4a2b');
      DR.sardinha(v, 2, 4, 2);
      return v;
    },
  };
  A['veh-teimoso'] = {
    sky: ['#2b3740', '#c9b48a'],
    build() {
      const v = new DR.Vox();
      DR.ground(v, -40, -6, 64, 26, 2, dryField);
      for (let x = -40; x < 24; x++) for (let y = 0; y < 13; y++) v.set(x, y, 1, ['#8f7a58', '#857052', '#9a8461'][Math.floor(H(x >> 1, y >> 1, 1, 71) * 3)]);
      DR.teimoso(v, 6, 2, 2);
      // BMP da Legião abandonado sendo rebocado pela corrente
      DR.lobo(v, -31, 0, 2);
      v.line(5, 6, 4, -2, 6, 3, '#8d8f90'); v.line(5, 7, 4, -2, 7, 3, '#5d6569');
      v.each((x, y, z, c) => { if (x < -2 && z > 4 && H(x, y, z, 77) < 0.15) v.set(x, y, z, '#1f1d1a'); });
      dirty(v, -32, 0, 20, 13, 2, 6, 0.5, ['#8f7a58', '#7a6648'], 25);
      return v;
    },
  };
  A['veh-socorro'] = {
    sky: ['#2c3a40', '#a9a48c'],
    build() {
      const v = new DR.Vox();
      DR.ground(v, -8, -10, 36, 28, 2);
      const tent = (x, y) => {
        v.box(x, y, 2, 10, 7, 4, '#55603a'); v.box(x + 1, y + 1, 6, 8, 5, 1, '#55603a'); v.box(x + 2, y + 2, 7, 6, 3, 1, '#4b5533');
        v.box(x + 4, y + 6, 3, 1, 1, 3, '#f2f2f2'); v.box(x + 3, y + 6, 4, 3, 1, 1, '#f2f2f2');
        v.box(x + 4, y + 6, 4, 1, 1, 1, '#1f8a4c');
      };
      tent(-6, -9); tent(8, -9);
      DR.sandbags(v, -7, 15, 2, 30, 'x', 1);
      DR.socorro(v, 4, 3, 2);
      return v;
    },
  };
  A['veh-cabrito'] = {
    sky: ['#26343a', '#8f9a86'],
    fg(ctx, W, Ht, o) { const p = DR.project(1, 5, 3, o); dust(ctx, p[0], p[1], o.s * 3, 0.4, '90,70,50'); },
    build() {
      const v = new DR.Vox();
      DR.ground(v, -6, -8, 30, 22, 2);
      for (let x = -6; x < 24; x++) for (let y = 1; y < 10; y++) v.set(x, y, 1, mud[Math.floor(H(x >> 1, y >> 1, 1, 81) * 3)]);
      for (let i = 0; i < 5; i++) DR.tree(v, -5 + i * 6, -7 + (i % 2), 2, 9 + (i % 3) * 2, false);
      DR.cabrito(v, 5, 1, 2);
      dirty(v, 4, 1, 20, 9, 2, 5, 0.65, mud, 27);
      return v;
    },
  };
})();
