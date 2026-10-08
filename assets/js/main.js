/* DARKRIOT — conteúdo do brainstorm (dados) + montagem da página.
   As artes e animações são imagens pré-renderizadas (tools/render), para a página rolar leve. */
(function () {
  const DR = window.DR;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /* ======================= DADOS ======================= */

  const MODES = [
    { n: 'Linha de Frente', tag: 'MVP', p: '32 × 32', d: '60–90 min', m: '4 × 4 km',
      t: 'O modo principal. Setores em cadeia (A→E): só dá para atacar o próximo setor da linha. Cada lado tem tickets e uma rede de FOBs que precisa ser abastecida. Trincheiras, crateras e ruínas persistem a partida inteira — no fim, o mapa conta a história da batalha.' },
    { n: 'Fortaleza', tag: 'Alpha', p: '16 × 16', d: '10 + 20 min', m: '1 × 1 km',
      t: 'O lado “Minecraft” no volume máximo. 10 minutos de construção (cavar, erguer bunkers, minar estradas) com um orçamento de suprimentos; depois 20 minutos de assalto. Inverte os lados e soma o tempo.' },
    { n: 'Blackout', tag: 'Beta', p: '24 × 24', d: '45 min', m: 'Noite',
      t: 'Operação noturna sem marcadores no HUD. Só alguns kits têm visão noturna, o resto depende de sinalizadores, lasers IR e de reconhecer silhuetas. Drones térmicos viram rei — mantas anti-térmicas viram contra-jogada.' },
    { n: 'Caçada de Drones', tag: 'Alpha', p: '8 × 8', d: '15 min', m: 'Vila',
      t: 'Arena pequena e rápida: operadores de FPV contra caçadores com jammers, espingardas e redes. Ótimo modo de entrada para aprender a pilotar.' },
    { n: 'Patrulha (Co-op PvE)', tag: 'Beta', p: '1–8', d: '20–40 min', m: 'Setor',
      t: 'Missões contra IA: limpar trincheira, escoltar comboio, resgatar ferido. Serve de tutorial, de modo solo e de banco de testes para os bots.' },
    { n: 'Campanha Dinâmica', tag: 'Pós', p: 'Servidor', d: 'Semanas', m: 'Oblast inteiro',
      t: 'Guerra persistente em servidores da comunidade: um mapa estratégico de hexágonos, logística entre partidas, a destruição de uma batalha continua na próxima. A meta de longo prazo do DARKRIOT.' },
  ];

  const MECHS = [
    { n: 'Destruição por material', tag: 'MVP', t: 'Todo bloco tem material e HP: terra 10, madeira 20, saco de areia 35, tijolo 40, concreto 80, aço 150. Explosões aplicam dano em esfera com queda; estruturas sem apoio desabam como um corpo só.', f: 'Nenhuma cobertura é eterna — um RPG abre uma janela nova na sua parede.' },
    { n: 'Pá de sapador e trincheiras', tag: 'MVP', t: 'Cavar consome stamina e tempo por material. Cada 2 blocos de terra = 1 saco de areia no inventário. Revestir paredes com tábuas aumenta o HP; cobertura de toras protege de drones.', f: 'A defesa é construída com as próprias mãos, bloco a bloco.' },
    { n: 'Balística e penetração', tag: 'MVP', t: 'Projéteis físicos com queda e tempo de voo. Penetração depende do material do bloco: um 7.62 atravessa 2 blocos de madeira, mas para no concreto. Estalo supersônico indica de onde vem o tiro.', f: 'Saber em que se esconder vira habilidade.' },
    { n: 'Supressão e ferimentos', tag: 'MVP', t: 'Tiros próximos borram a visão e aumentam o recuo. Sangramento por membro, torniquete, estado incapacitado (rastejar e pedir socorro) e evacuação (CASEVAC) que rende pontos.', f: 'Fogo de supressão funciona de verdade, e salvar alguém é uma jogada.' },
    { n: 'Drones FPV kamikaze', tag: 'Alpha', t: 'Pilotagem em 1ª pessoa com física de quadricóptero (modos “estável” e “acro”), bateria, alcance e vídeo que degrada com distância e obstáculos. O corpo do operador fica no mundo, vulnerável.', f: 'Momentos de filme: perseguir um blindado a 120 km/h até o impacto.' },
    { n: 'Guerra Eletrônica (EW)', tag: 'Alpha', t: 'Jammers criam bolhas que derrubam o sinal em certas frequências (3 canais). Detectores fazem bip quando um drone se aproxima. Rádios usados demais podem ser triangulados pela EW inimiga.', f: 'Pedra-papel-tesoura entre drone, jammer e caçador.' },
    { n: 'Observador e artilharia', tag: 'Alpha', t: 'Um drone de observação marca o alvo com coordenadas de grade. O artilheiro ajusta azimute e elevação pela tabela de tiro e corrige com o observador (“curto 50, acrescente 50”).', f: 'Trabalho em equipe que dá muito prazer quando acerta.' },
    { n: 'Rádio e voz por proximidade', tag: 'Alpha', t: 'Voz local (todos ouvem, inclusive o inimigo), rádio do esquadrão e rádio de comando entre líderes. Rádio danificado = só voz local.', f: 'Gritos na trincheira, ordens com ruído de estática — imersão.' },
    { n: 'Fortificação por blueprint', tag: 'Alpha', t: 'Planos prontos encaixados na grade: bunker, ninho de metralhadora, posto médico, ponto de remuniciamento, obstáculos anti-tanque (“dentes de dragão”). Exigem sapador, tempo e suprimentos.', f: 'Construir rápido sem perder a liberdade bloco a bloco.' },
    { n: 'Logística e FOBs', tag: 'Beta', t: 'Munição, materiais e combustível saem do QG em caminhões. FOBs sem suprimento param de dar respawn. Cortar a estrada inimiga (ou explodir a ponte) é estratégia legítima.', f: 'Tem papel até para quem não gosta de atirar: motorista é herói.' },
    { n: 'Bancada de campo (crafting)', tag: 'Beta', t: 'Crafting leve e diegético: soldar gaiola anti-drone num veículo, improvisar granada de drone, armar mina, camuflar blindado com galhos (reduz detecção térmica).', f: 'A gambiarra criativa da linha de frente, com sabor de Minecraft.' },
    { n: 'Clima e estações', tag: 'Beta', t: 'Rasputitsa (lama): veículos atolam e deixam rastros. Inverno: neve mostra pegadas para drones. Neblina derruba a observação aérea. Estação muda a cada atualização sazonal.', f: 'O mesmo mapa vira outro jogo a cada estação.' },
    { n: 'Helicópteros e apoio aéreo', tag: 'Beta', t: 'Helicópteros de transporte, carga e evacuação são pilotáveis com o kit Piloto. Voar acima de 150 m aparece no radar e libera a defesa antiaérea inimiga. Aviões chegam como apoio chamado pelo comandante nos mapas de 4×4 km.', f: 'Pilotar rente às árvores com o esquadrão inteiro a bordo: a FOB depende de você chegar.' },
    { n: 'Veículos civis e reboque', tag: 'Beta', t: 'Carros, vans, ônibus e tratores ficam espalhados pelas cidades e vilas, e qualquer facção pode pegar. O trator reboca veículos abandonados até a base, e eles passam para o seu lado.', f: 'Roubar um blindado inimigo com um trator vira lenda no Discord.' },
    { n: 'Visão térmica e noite', tag: 'Beta', t: 'Drones térmicos e miras térmicas mostram calor (corpos, motores, canos quentes). Contra: mantas anti-térmicas, fumaça, ficar parado em ruínas frias.', f: 'Gato e rato com assinatura de calor.' },
    { n: 'Túneis e subsolo', tag: 'Pós', t: 'Cavar túneis sob a linha inimiga e combater dentro da mina de sal, com escoras de madeira (sem escora, o túnel desaba).', f: 'O DNA de Minecraft no ponto mais tático: a guerra também acontece embaixo da terra.' },
    { n: 'Editor e mods', tag: 'Pós', t: 'Editor de cenários usando o próprio motor voxel; mods em .pck do Godot; workshop da Steam.', f: 'A comunidade estende o jogo por anos.' },
  ];

  const VEHICLES = window.DR_VEHICLES || [];

  // Cronograma — semana 0 = segunda, 12/10/2026
  const W0 = new Date(2026, 9, 12);
  const PHASES = [
    { id: 'F0', n: 'Pré-produção', s: 0, w: 4, c: '#8a9480',
      goal: 'Ferramentas, regras do jogo e a fábrica de modelos voxel (script → Godot) funcionando.',
      out: ['Repositório do jogo + CLAUDE.md', 'GDD v0.2 (a partir deste site)', 'Fábrica de modelos + blocos v1 + soldado base', 'Primeiro bloco cavado no Godot'],
      cut: 'Nada — fase curta e obrigatória.' },
    { id: 'F1', n: 'Protótipo do núcleo', s: 4, w: 8, c: '#ffb000',
      goal: 'Diversão em solo: andar, atirar, cavar e explodir num mundo de blocos.',
      out: ['Terreno em chunks', 'Controlador FPS milsim', 'Destruição por material', 'Trincheiras e sacos de areia', 'FPV jogável', 'Bots simples'],
      cut: 'Integridade estrutural complexa → desabamento simples por coluna.' },
    { id: 'F2', n: 'Fundação multiplayer', s: 12, w: 8, c: '#5fb3a3',
      goal: 'Servidor dedicado autoritativo com 16 jogadores e mundo destrutível sincronizado.',
      out: ['Servidor headless', 'Predição + reconciliação', 'Deltas de chunk', 'Lobby por IP', 'Teste de carga com bots'],
      cut: 'Integração Steam → fica para a F4.' },
    { id: 'F3', n: 'Vertical slice', s: 20, w: 12, c: '#e0723a',
      goal: 'Uma fatia “como no jogo final”: 1 mapa 2×2 km, 2 facções, Linha de Frente.',
      out: ['Mapa Sonyashnyk (2×2 km)', '6 armas, 1 veículo por lado', 'Kits/classes', 'HUD e mapa tático', 'Áudio base', 'Primeiro trailer de gameplay'],
      cut: 'Veículos → só um tanque; segundo lado usa IFV no Alpha.' },
    { id: 'F4', n: 'Alpha fechado', s: 32, w: 12, c: '#c05050',
      goal: 'Sistemas completos e 32×32 estável com testadores convidados.',
      out: ['Artilharia + observador', 'EW e rádio', 'Fortificação por blueprint', 'Steam (página + build privada)', 'Modo Fortaleza', 'Anti-cheat básico'],
      cut: 'Logística completa → só caixas de suprimento no Alpha.' },
    { id: 'F5', n: 'Conteúdo e Beta', s: 44, w: 12, c: '#7b6bd6',
      goal: 'Mapa completo 4×4 km, demo pública e Steam Next Fest.',
      out: ['Mapa Vorsk completo', 'Logística e FOBs', 'Helicópteros de tropa e de carga', 'Blackout + Patrulha', 'Demo do Next Fest', 'Wishlists > 20 mil (meta)'],
      cut: 'Clima sazonal → só lama no Beta.' },
    { id: 'F6', n: 'Polimento → Early Access', s: 56, w: 17, c: '#3d6fd6',
      goal: 'Performance, onboarding e lançamento em Acesso Antecipado na Steam.',
      out: ['Tutorial jogável', 'Otimização (LOD de chunks, pooling)', 'Servidores alugados + comunitários', 'Trailer de lançamento', 'Lançamento EA'],
      cut: 'Campanha Dinâmica e túneis → pós-lançamento.' },
  ];

  const STREAMS = [
    { n: 'Código (IA)', who: 'ia', bars: [[0, 4, 'Estrutura'], [4, 12, 'Voxel + FPS + destruição'], [12, 20, 'Rede'], [20, 32, 'Vertical slice'], [32, 44, 'Sistemas Alpha'], [44, 56, 'Conteúdo + otimização'], [56, 73, 'Polimento']] },
    { n: 'Modelos voxel (IA)', who: 'ia', bars: [[0, 4, 'Fábrica + blocos + soldado'], [4, 12, 'Armas, uniformes, props'], [12, 22, 'Veículos I'], [22, 34, 'Mapa: vila + cidade'], [34, 46, 'Veículos II + drones'], [46, 60, 'Helicópteros + civis'], [60, 73, 'Aviões + LODs']] },
    { n: 'Direção de arte', who: 'voce', bars: [[0, 4, 'Estilo + paleta'], [4, 56, 'Aprovar as prévias toda semana'], [56, 73, 'Polimento visual']] },
    { n: 'Game design', who: 'voce', bars: [[0, 6, 'GDD + regras'], [6, 32, 'Kits, armas, economia'], [32, 73, 'Balanceamento por dados']] },
    { n: 'Rede & servidores', who: 'ia', bars: [[12, 20, 'Fundação'], [32, 44, 'Escala 64p'], [56, 73, 'Hospedagem + anti-cheat']] },
    { n: 'Áudio', who: 'voce', bars: [[16, 32, 'SFX base'], [32, 56, 'Ambiente + rádio'], [56, 73, 'Mix final + música']] },
    { n: 'Comunidade', who: 'voce', bars: [[8, 40, 'Devlogs + Discord'], [40, 56, 'Página Steam + wishlists'], [56, 73, 'Trailer + imprensa']] },
    { n: 'Playtests', who: 'voce', bars: [[12, 32, 'Internos'], [32, 44, 'Alpha fechado'], [48, 56, 'Beta / Next Fest'], [56, 73, 'Testes de carga']] },
  ];

  const MILESTONES = [
    { w: 4, n: 'M0', t: 'Primeiro bloco cavado' },
    { w: 12, n: 'M1', t: 'Protótipo solo jogável' },
    { w: 20, n: 'M2', t: '16 jogadores online' },
    { w: 32, n: 'M3', t: 'Vertical slice' },
    { w: 44, n: 'M4', t: 'Alpha + página Steam' },
    { w: 53, n: 'M5', t: 'Steam Next Fest (demo)', label: 'out 2027*' },
    { w: 73, n: 'M6', t: 'Early Access', label: 'mar 2028' },
  ];

  const SPRINTS = [
    { ia: 'Estrutura do projeto Godot, pastas, CLAUDE.md, CI de export (GitHub Actions).', mdl: 'Fábrica de modelos voxel (script → .vox/.glb), paleta e blocos: grama, terra, pedra, areia, madeira, tábua, tijolo, concreto.', voce: 'Instalar Godot e MagicaVoxel; aprovar a paleta e o estilo dos blocos.', out: 'Projeto abre e roda uma cena vazia.' },
    { ia: 'Controlador FPS milsim: posturas, inclinar, correr com stamina, peso.', mdl: 'Soldado base em partes rígidas, no padrão do guia de estilo.', voce: 'Comparar o soldado com as concept arts e pedir ajustes.', out: 'Andar num plano cinza com o soldado.' },
    { ia: 'Terreno voxel em chunks 16³ com greedy meshing e atlas.', mdl: 'Girassol, trigo, árvore, arbusto; atlas de blocos v1.', voce: 'Andar na estepe e dar notas de cor e clima.', out: 'Andar na estepe de blocos.' },
    { ia: 'Quebrar/colocar blocos (raycast), salvar/carregar chunks modificados.', mdl: 'Pá de sapador, saco de areia, caixa de munição.', voce: 'Cavar e construir por 30 min e listar o que irrita.', out: 'M0 — primeiro bloco cavado.' },
    { ia: 'Armas: projétil com balística, recuo, mira, recarga.', mdl: 'Fuzil AR (Coalizão) e fuzil AK (Legião), mundo + 1ª pessoa.', voce: 'Definir a sensação das armas: recuo, som, cadência.', out: 'Atirar em alvos de bloco.' },
    { ia: 'Dano por material + explosões com queda + detritos (pooling).', mdl: 'Granada, lança-foguetes, efeitos de explosão e fumaça.', voce: 'Ajustar o HP dos materiais até explodir parede ficar gostoso.', out: 'Explodir paredes.' },
    { ia: 'Integridade estrutural (desabamento por grupo).', mdl: 'Casa de vila modular (paredes, janelas, telhado).', voce: 'Derrubar casas e apontar desabamentos estranhos.', out: 'Derrubar uma casa.' },
    { ia: 'Ferramenta de trincheira: cavar, revestir, sacos de areia, preview fantasma.', mdl: 'Toras, tábuas, arame farpado, ouriço tcheco.', voce: 'Cronometrar: 10 m de trincheira tem que levar uns 2 min.', out: 'Cavar 10 m de trincheira em 2 min.' },
    { ia: 'Vida, sangramento, torniquete, supressão.', mdl: 'Uniformes das 2 facções, capacetes, coletes, fitas.', voce: 'Aprovar as silhuetas: dá para diferenciar as facções de longe?', out: 'Soldados das 2 facções no jogo.' },
    { ia: 'Drone FPV: física, controle, bateria, feed com ruído, explosão.', mdl: 'Drone FPV + ogiva + óculos.', voce: 'Pilotar o FPV e dar notas de controle.', out: 'Kamikaze num alvo.' },
    { ia: 'Bots simples (patrulha, cobertura, atirar) + HUD mínimo.', mdl: 'Animações por partes: andar, correr, mirar, cavar, rastejar, morrer.', voce: 'Jogar contra os bots e anotar o que não diverte.', out: 'Combate contra bots.' },
    { ia: 'Integração, correção de bugs, perfilamento.', mdl: 'LODs e revisão de todos os modelos do protótipo.', voce: 'Gravar o devlog #1 e fazer playtest com amigos.', out: 'M1 — protótipo solo jogável.' },
  ];


  const ASSETS = [
    { g: 'F0 — Fundação', items: [
      ['blk_pack_v1', 'Pack de blocos v1 (grama, terra, pedra, areia, madeira, tábua, tijolo, concreto, asfalto, aço)', '16×16 voxels de face'],
      ['chr_soldier_base', 'Soldado base em partes rígidas (cabeça, tronco, braços, pernas)', '≈29 voxels de altura'],
    ] },
    { g: 'F1 — Protótipo', items: [
      ['wpn_rifle_ar', 'Fuzil estilo AR (Coalizão) — mundo + 1ª pessoa', '1ª pessoa a 32 voxels/m'],
      ['wpn_rifle_ak', 'Fuzil estilo AK (Legião) — mundo + 1ª pessoa', 'carregador cor ameixa'],
      ['wpn_explosives', 'Granada, lança-foguetes, ogiva', 'pivô no grip'],
      ['tool_shovel', 'Pá de sapador', 'animação dig_loop'],
      ['chr_uniforms', 'Uniformes Coalizão (manchas) e Legião (digital) + capacetes + coletes + fitas', '5–6 tons por camuflagem'],
      ['prop_trench', 'Saco de areia, tora, tábua de revestimento, arame farpado, ouriço tcheco', 'meio-bloco quando fizer sentido'],
      ['drn_fpv', 'Drone FPV + ogiva + óculos', '32 voxels/m'],
      ['bld_village', 'Casa de vila modular (paredes, janelas, portas, telhado, chaminé)', 'peças de 1 bloco'],
      ['veg_pack', 'Girassol, trigo, bétula, álamo, arbusto', 'variações de altura'],
      ['anim_core', 'Animações: idle, walk, run, crouch, prone, aim, reload, dig, throw, death', 'animação por partes'],
    ] },
    { g: 'F2–F3 — Vertical slice', items: [
      ['wpn_support', 'Metralhadora, DMR, pistola, espingarda anti-drone', ''],
      ['veh_tank_urso', 'Tanque “Urso T-7B” + gaiola anti-drone (peça separada)', 'pivôs turret/gun'],
      ['veh_ifv_lince', 'IFV “Lince” (Coalizão)', 'rodas/esteiras nomeadas'],
      ['veh_truck', 'Caminhão “Mula” + pick-up técnica “Coiote”', 'rodas nomeadas wheel_*'],
      ['drn_recon', 'Drone de observação + jammer portátil + antena EW', ''],
      ['bld_city', 'Prédio soviético modular de 5 andares + ruínas', 'módulos 4×4 blocos'],
      ['art_howitzer', 'Obuseiro “Prego” e morteiro', 'animação de recuo'],
    ] },
    { g: 'F4–F6 — Alpha → EA', items: [
      ['veh_bmp_lobo', 'BMP “Lobo”, MT-LB “Tartaruga”, quadriciclo “Furão”, moto “Gafanhoto”', 'casco da Tartaruga em chapas destrutíveis'],
      ['drn_bruxa', 'Hexacóptero bombardeiro “Bruxa” (com térmica)', ''],
      ['prop_city', 'Carros destruídos, ponto de ônibus, postes, cercas, dentes de dragão', ''],
      ['season_pack', 'Variações de neve e lama para blocos e veículos', ''],
      ['cosm_pack', 'Cosméticos: patches, capacetes alternativos, pinturas', 'nada que dê vantagem'],
      ['ui_icons', 'Ícones de UI, marcadores do mapa, logos das facções', 'SVG/PNG pixel'],
      ['lod_pass', 'Versões LOD (> 150 m) dos modelos principais', ''],
      ['veh_blindados2', 'Tanque “Bisão” e blindados leves “Tatu” e “Javali”', ''],
      ['veh_apoio', 'Apoio: “Martelo”, “Granizo”, “Guepardo”, “Ouriço” e “Toupeira”', 'pivôs de lançadores, radares e braço'],
      ['veh_civis', 'Civis: “Tijolinho”, “Pão de Forma”, “Sardinha”, “Teimoso”, “Socorro” e “Cabrito”', 'portas e capôs separados'],
      ['veh_lontra', 'Barco “Lontra”', 'motor de popa giratório'],
      ['veh_helis', 'Helicópteros “Libélula”, “Pelicano” e “Anjo”', 'pivôs rotor_main e rotor_tail'],
    ] },
    { g: 'Pós-lançamento', items: [
      ['veh_eng', 'Lança-pontes “Castor” e desminagem “Serpente”', ''],
      ['veh_ataque', 'Helicópteros de ataque “Marimbondo” e “Jacaré”', ''],
      ['veh_avioes', 'Aviões “Gralha”, “Falcão”, “Urubu”, “Pardal”, “Abelha” e “Cegonha”', 'trem de pouso, flaps e hélices separados'],
    ] },
  ];

  const PROMPTS = [
    { n: '00 · Contexto mestre (CLAUDE.md)', d: 'Cole na raiz do repositório do jogo. A IA lê isso em toda sessão.',
      p: `# DARKRIOT — contexto do projeto
Você é o engenheiro principal do DARKRIOT, um milsim tático (estilo Arma/Squad) num mundo voxel destrutível (estilo Minecraft), feito em Godot 4.x.

- Linguagem: GDScript tipado para gameplay. C++ (GDExtension) apenas para hot paths (meshing, destruição) quando o profiler pedir.
- Escala: 1 bloco = 1 m. Chunks 16×16×16. Y para cima.
- Rede: servidor autoritativo desde o dia 1. Nenhuma lógica de gameplay confia no cliente.
- Pastas: res://core (voxel, rede), res://gameplay (armas, drones, construção), res://ui, res://assets (modelos .glb exportados de tools/models), res://sandbox (cenas de teste), res://tests (GUT).
- Convenções: snake_case nos arquivos, PascalCase no class_name, sinais no passado (block_destroyed).
- Toda feature: (1) plano curto antes de codar, (2) testes GUT, (3) cena demo em res://sandbox, (4) entrada em docs/CHANGELOG.md.
- Modelos voxel: cada modelo é um script em tools/models/ (a fonte). O exportador gera .vox e .glb em res://assets/models/. Nunca edite os arquivos exportados: mude o script e reexporte.
- Todo modelo segue docs/estilo-voxel.md (16 voxels por metro, paleta fixa, partes e pivôs nomeados) e gera uma prévia em docs/previews/ para eu aprovar antes de entrar no jogo.` },
    { n: '01 · Terreno voxel em chunks', d: 'Semana 3. O coração do jogo.',
      p: `Implemente o terreno voxel em res://core/voxel:
- VoxelWorld (Node3D) gerencia chunks 16×16×16 ao redor do jogador (raio configurável), gerando e remeshando em threads (WorkerThreadPool).
- Geração: FastNoiseLite para a altura (estepe suave, 20–40 blocos), camadas grama/terra/pedra.
- Meshing: greedy meshing, face culling, oclusão ambiente por vértice, atlas 16×16 em res://assets/blocks/atlas.png com filtro Nearest.
- API: get_block(pos: Vector3i) -> int e set_block(pos, id), que remesha só o chunk afetado (+ vizinhos na borda).
- Colisão: shape por chunk gerada junto com a malha.
Aceite: 60 FPS com raio de 8 chunks num PC médio; teste GUT de set/get; cena res://sandbox/voxel_demo.tscn.
Antes de codar, me mostre o plano de classes.` },
    { n: '02 · Destruição por material', d: 'Semanas 6–7.',
      p: `Adicione destruição por material:
- res://core/voxel/block_types.tres: id, nome, material, hp, resistência a explosão, penetração.
- Valores iniciais: terra 10, grama 10, madeira 20, saco de areia 35, tijolo 40, concreto 80, aço 150.
- apply_explosion(center: Vector3, radius: float, damage: float): dano com queda linear; blocos com HP <= 0 viram detritos (RigidBody3D pequenos, vida de 4 s, máximo 64 ativos, com pooling).
- Integridade: depois da explosão, flood fill limitado (máx. 4096 blocos) a partir dos vizinhos; grupos sem ligação com o chão caem como um corpo só.
- Sinal block_destroyed(pos, type) para áudio e partículas.
Aceite: testes GUT do falloff e do desabamento de uma ponte simples; benchmark no console.` },
    { n: '03 · Pá de sapador e trincheiras', d: 'Semana 8.',
      p: `Implemente a ferramenta "pá de sapador":
- Cava o bloco mirado (alcance 3 m): 0,6 s na terra, 1,2 s na pedra; não cava concreto nem aço.
- Cada 2 blocos de terra cavados = 1 saco de areia no inventário (máx. 20).
- Colocar saco de areia: preview fantasma (verde = válido / vermelho = inválido), encaixe na grade, rotação com R.
- "Revestir" uma parede de trincheira com tábuas custa suprimento e dá +50% de HP ao bloco.
- Use a animação dig_loop do soldado; se ainda não existir, crie a animação por partes (o soldado é feito de partes rígidas) e me mostre uma prévia.
Aceite: cena sandbox onde dá para cavar 10 m de trincheira e cobrir com sacos.` },
    { n: '04 · Drone FPV + guerra eletrônica', d: 'Semana 10.',
      p: `Crie o drone FPV kamikaze (res://gameplay/drones/fpv_drone.gd):
- Física simplificada de quadricóptero: throttle, pitch, roll, yaw; modos "estável" e "acro".
- Bateria de 4 min; alcance de 2 km; a qualidade do vídeo cai com distância e obstruções (raycasts até a antena do operador).
- Shader de tela res://gameplay/drones/fpv_feed.gdshader com signal_quality 0..1: ruído, linhas, perda de quadros.
- Jammers: Area3D com raio e frequência (3 canais); se a frequência bate, o signal_quality despenca.
- Carga útil: ao colidir acima de 8 m/s, chama apply_explosion.
- O operador fica parado e vulnerável enquanto pilota.
Aceite: cena sandbox com tanque-alvo e um jammer; OSD com bateria, altitude, velocidade e RSSI.` },
    { n: '05 · Multiplayer autoritativo', d: 'Fase F2.',
      p: `Estruture o multiplayer:
- Servidor dedicado headless (export preset "Server") com ENetMultiplayerPeer.
- Tick do servidor a 30 Hz; clientes mandam inputs numerados; predição + reconciliação no jogador local; interpolação de 100 ms para os outros.
- Blocos: o servidor valida e transmite deltas por chunk (comprimidos); quem entra recebe um snapshot dos chunks modificados.
- Lobby simples por IP (depois trocamos por Steam via GodotSteam).
Aceite: 2 clientes + servidor locais; cavar num cliente aparece no outro; script tools/run_local_match.sh.
Explique os trade-offs antes de implementar.` },
    { n: '06 · Fábrica de modelos voxel', d: 'Semana 1. Daqui em diante a IA gera qualquer veículo, prop ou personagem a partir de código.',
      p: `Crie a fábrica de modelos voxel em tools/models/:
- Um modelo = um script que preenche uma grade de voxels com cores da paleta fixa (docs/paleta.png, 256 cores). Funções de apoio: box, carve, line, sphere, wheel, track, mirror, camo.
- Exportadores: .vox (MagicaVoxel, para eu abrir e conferir) e .glb com greedy meshing e cor por vértice (para o Godot). Cada parte móvel vira um nó separado com o pivô certo (turret, gun, wheel_l_01, rotor_main...).
- LOD automático: versão com voxels 2× maiores para mais de 150 m.
- Prévia: um PNG isométrico de cada modelo em docs/previews/ para eu aprovar.
- Um comando só: tools/models/build.sh [nome] exporta tudo ou só um modelo.
Aceite: gerar veh_tank_urso (gaiola como peça separada) e chr_soldier_base e importar no Godot sem nenhum ajuste manual.` },
    { n: '07 · Revisor / QA', d: 'Use depois de cada feature, antes do merge.',
      p: `Aja como revisor sênior do DARKRIOT. Revise o diff da branch atual:
1) bugs e casos de borda; 2) rede: algo confia no cliente?; 3) performance: alocações por frame, loops pesados em chunks; 4) testes que faltam.
Liste por ordem de gravidade com arquivo:linha e proponha a correção. Não altere nada ainda.` },
    { n: '08 · Gerar um modelo voxel', d: 'Use para cada veículo, prop ou personagem novo, com a ficha do site.',
      p: `Gere o modelo voxel do Tanque “Urso T-7B” (veh_tank_urso) seguindo docs/estilo-voxel.md:
- Escala real: 9,5 × 3,6 × 2,2 m → 152 × 58 × 35 voxels (16 por metro).
- Referência: a concept art e a ficha do site de brainstorm (blindagem reativa, gaiola anti-drone, tora de desatolamento atrás, tambores extras, fita branca de identificação).
- Peças separadas com pivô: turret, gun, cage (destrutível em 4 partes), hatch.
- Paleta: camuflagem da Legião (5 tons) + metal escuro das lagartas.
- Exporte .vox e .glb, gere a prévia e me mostre lado a lado com a concept art. Não coloque no jogo antes de eu aprovar a prévia.` },
    { n: '09 · Referência visual (IA de imagem)', d: 'Para explorar um visual antes de pedir o modelo.',
      p: `Voxel art, isometric diorama, Minecraft-style blocky military scene, eastern european steppe, sunflower field, zigzag trench with sandbags and wooden revetments, soldiers with yellow and blue armband tape, overcast autumn light, muddy ground, 16x16 pixel textures, tilt-shift, cinematic --ar 3:2` },
  ];

  const DECISIONS = [
    ['Quem faz os modelos', 'A IA gera todos os modelos voxel por código: veículos, props, personagens e blocos. Você dirige e aprova pelas prévias; retoques à mão no MagicaVoxel quando quiser.', 'IA + sua aprovação'],
    ['Escala do bloco', '1 bloco = 1 m (padrão Minecraft, mais leve). Alternativa: 0,5 m — trincheiras e destruição mais finas, mas 8× mais voxels.', '1 m'],
    ['Nomes das facções', '“Coalizão Kalyna” × “Legião Boreal”, num país fictício. Mantém o DNA UC × RU sem usar bandeiras e unidades reais.', 'Fictícios'],
    ['Câmera', 'Só 1ª pessoa a pé (milsim). 3ª pessoa opcional dentro de veículos.', '1ª pessoa'],
    ['Tamanho da partida', '32×32 no Early Access; 50×50 quando a rede aguentar.', '32×32'],
    ['Modelo de negócio', 'Premium (≈ US$ 19,99 no EA) + cosméticos que não dão vantagem. Nada de pay-to-win.', 'Premium'],
    ['Respawn', 'Em FOBs e pontos de reagrupamento abastecidos. Modo hardcore com vida única por rodada.', 'FOB / rally'],
    ['Mods', 'Abrir para mods desde o EA (Godot carrega .pck com facilidade).', 'Sim, no EA'],
  ];

  const RISKS = [
    ['Escopo gigante (milsim + voxel + rede)', 'MVP rigoroso, lista “o que cortar” em cada fase, uma feature por vez.'],
    ['Rede com mundo destrutível', 'Servidor autoritativo e deltas por chunk desde a F2; testes de carga com bots cedo.'],
    ['Performance com 64 jogadores + destruição', 'Núcleo em C++ (GDExtension), limite de detritos, LOD de chunks, perfilar toda semana.'],
    ['Tema sensível (guerra real)', 'Facções e lugares fictícios, sem crimes de guerra; foco na tática e no soldado comum.'],
    ['Código de IA virar “espaguete”', 'CLAUDE.md, testes obrigatórios, prompt de revisão, PR pequeno, você aprova tudo.'],
    ['Modelos da IA com estilo desigual', 'Guia de estilo e paleta fixos, funções de modelagem compartilhadas e prévia obrigatória para você aprovar antes de entrar no jogo.'],
    ['Esgotamento (dev solo)', 'Semanas de folga embutidas, devlog curto a cada 2 semanas, comunidade cedo.'],
  ];

  /* ======================= RENDER ======================= */

  const fmt = (d) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  const wk = (w) => new Date(W0.getTime() + w * 7 * 864e5);
  const endOf = (p) => new Date(wk(p.s + p.w).getTime() - 864e5);

  function renderModes() {
    const box = $('#modes-grid');
    MODES.forEach((m) => {
      const c = el('article', 'card mode');
      c.innerHTML = `<header><h3>${m.n}</h3><span class="tag tag-${m.tag.toLowerCase()}">${m.tag}</span></header>
        <dl class="specs"><div><dt>Jogadores</dt><dd>${m.p}</dd></div><div><dt>Duração</dt><dd>${m.d}</dd></div><div><dt>Mapa</dt><dd>${m.m}</dd></div></dl>
        <p>${m.t}</p>`;
      box.appendChild(c);
    });
  }

  function renderVehicles() {
    const box = $('#veh-grid');
    const FAC = { uc: 'Coalizão', ru: 'Legião', both: 'As duas' };
    const m = (x) => String(x).replace('.', ',');
    VEHICLES.forEach((v) => {
      const ppm = v.ppm || 16, px = v.size.map((x) => Math.round(x * ppm));
      const rotor = v.rotor ? ` · rotor Ø ${m(v.rotor)} m → ${Math.round(v.rotor * ppm)} voxels` : '';
      const cost = typeof v.cost === 'number' ? `${v.cost} suprimentos` : v.cost;
      const c = el('article', 'card veh');
      c.id = 'veh-' + v.id; c.dataset.f = v.f; c.dataset.t = v.t;
      c.innerHTML = `<img src="assets/img/veh-${v.id}.webp" width="1200" height="800" loading="lazy" decoding="async" alt="Concept art voxel: ${v.n}">
        <div class="veh-body">
          <header><h3>${v.n}</h3><span class="fac fac-${v.f}">${FAC[v.f]}</span></header>
          <p class="cls">${v.cls} · ${v.phase === 'Pós' ? 'pós-lançamento' : 'jogável na ' + v.phase}</p>
          <p>${v.d}</p>
          <details class="vdet"><summary>Ficha técnica</summary>
            <dl class="vspecs">
              <div><dt>Tripulação</dt><dd>${v.crew}</dd></div>
              <div><dt>Custo</dt><dd>${cost}</dd></div>
              <div class="wide"><dt>Armas</dt><dd>${v.arm}</dd></div>
              <div><dt>Blindagem</dt><dd>${v.armor}</dd></div>
              <div><dt>Velocidade</dt><dd>${v.speed}</dd></div>
            </dl>
            <p class="weak"><b>Ponto fraco:</b> ${v.weak}</p>
            <p class="mdl"><b>Para a IA modelar:</b> ${v.size.map(m).join(' × ')} m → ${px.join(' × ')} voxels (${ppm} por metro)${rotor} · peças móveis: ${v.pivots}</p>
          </details>
        </div>`;
      box.appendChild(c);
    });
    // contagem por tipo no cabeçalho dos filtros
    $$('#veh-type button').forEach((b) => {
      const n = b.dataset.t === 'all' ? VEHICLES.length : VEHICLES.filter((v) => v.t === b.dataset.t).length;
      b.insertAdjacentHTML('beforeend', ` <small>${n}</small>`);
    });
    const state = { t: 'all', f: 'all' };
    const apply = () => {
      let shown = 0;
      $$('#veh-grid .veh').forEach((c) => {
        const okT = state.t === 'all' || c.dataset.t === state.t;
        const okF = state.f === 'all' || c.dataset.f === state.f || (state.f !== 'both' && c.dataset.f === 'both');
        c.hidden = !(okT && okF);
        if (!c.hidden) shown++;
      });
      $('#veh-count').textContent = `${shown} de ${VEHICLES.length} veículos`;
    };
    for (const [group, key] of [['#veh-type', 't'], ['#veh-fac', 'f']]) {
      $$(group + ' button').forEach((b) => b.addEventListener('click', () => {
        $$(group + ' button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        state[key] = b.dataset[key];
        apply();
      }));
    }
    apply();
  }

  function renderFactionVehicles() {
    const shared = VEHICLES.filter((v) => v.f === 'both').length;
    $$('ul[data-veh]').forEach((ul) => {
      VEHICLES.filter((v) => v.f === ul.dataset.veh).forEach((v) => ul.appendChild(el('li', '', `<a href="#veh-${v.id}">${v.n}</a>`)));
      ul.appendChild(el('li', 'more', `<a href="#veiculos">+ ${shared} compartilhados</a>`));
    });
  }

  function renderMechs() {
    const box = $('#mech-grid');
    MECHS.forEach((m, i) => {
      const c = el('article', 'card mech');
      c.dataset.tag = m.tag;
      c.innerHTML = `<header><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${m.n}</h3><span class="tag tag-${m.tag.toLowerCase()}">${m.tag}</span></header>
        <p>${m.t}</p><p class="fun"><b>Por que é divertido:</b> ${m.f}</p>`;
      box.appendChild(c);
    });
    $$('#mech-filter button').forEach((b) => b.addEventListener('click', () => {
      $$('#mech-filter button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      const f = b.dataset.f;
      $$('#mech-grid .mech').forEach((c) => { c.hidden = f !== 'all' && c.dataset.tag !== f; });
    }));
  }

  function renderGantt() {
    const start = new Date(2026, 9, 1), months = 19, end = new Date(2028, 4, 1);
    const span = end - start;
    const pos = (w) => ((wk(w) - start) / span) * 100;
    const g = $('#gantt');
    const head = el('div', 'g-row g-head');
    head.appendChild(el('div', 'g-label', ''));
    const track = el('div', 'g-track');
    for (let i = 0; i < months; i++) {
      const d = new Date(2026, 9 + i, 1);
      const m = el('div', 'g-month', d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '') + (d.getMonth() === 0 || i === 0 ? `<b>${d.getFullYear()}</b>` : ''));
      m.style.left = (((d - start) / span) * 100) + '%';
      track.appendChild(m);
    }
    head.appendChild(track); g.appendChild(head);

    const addRow = (label, cls, bars) => {
      const r = el('div', 'g-row ' + (cls || ''));
      r.appendChild(el('div', 'g-label', label));
      const t = el('div', 'g-track');
      bars(t);
      r.appendChild(t); g.appendChild(r);
    };
    addRow('<b>Fases</b>', 'g-phases', (t) => PHASES.forEach((p) => {
      const b = el('div', 'g-bar phase', `<span>${p.id} · ${p.n}</span>`);
      b.style.left = pos(p.s) + '%'; b.style.width = (pos(p.s + p.w) - pos(p.s)) + '%'; b.style.background = p.c;
      b.title = `${p.id} ${p.n}: ${fmt(wk(p.s))} → ${fmt(wk(p.s + p.w - 1))}`;
      t.appendChild(b);
    }));
    STREAMS.forEach((s) => addRow(`${s.n}<small class="who who-${s.who}">${s.who === 'ia' ? 'IA' : 'você'}</small>`, '', (t) => s.bars.forEach(([a, z, n]) => {
      const b = el('div', 'g-bar ' + s.who, `<span>${n}</span>`);
      b.style.left = pos(a) + '%'; b.style.width = (pos(z) - pos(a)) + '%'; b.title = n;
      t.appendChild(b);
    })));
    addRow('<b>Marcos</b>', 'g-ms', (t) => MILESTONES.forEach((m) => {
      const d = el('div', 'g-diamond', `<i></i><span>${m.n}</span>`);
      d.style.left = pos(m.w) + '%'; d.title = `${m.n} — ${m.t}`;
      t.appendChild(d);
    }));
    // "hoje"
    const today = new Date(2026, 9, 8);
    const line = el('div', 'g-today', '<span>hoje</span>');
    line.style.setProperty('--x', String((today - start) / span));
    g.appendChild(line);

    const ml = $('#milestones');
    MILESTONES.forEach((m) => {
      const d = new Date(wk(m.w).getTime() - 864e5);
      ml.appendChild(el('li', '', `<b>${m.n}</b><span>${m.t}</span><time>${m.label || fmt(d) + ' ' + d.getFullYear()}</time>`));
    });

    const pc = $('#phase-cards');
    PHASES.forEach((p) => {
      const c = el('article', 'card phase-card');
      c.style.setProperty('--pc', p.c);
      c.innerHTML = `<header><span class="pid">${p.id}</span><h3>${p.n}</h3><time>${fmt(wk(p.s))} ${wk(p.s).getFullYear()} → ${fmt(endOf(p))} ${endOf(p).getFullYear()} · ${p.w} sem</time></header>
        <p class="goal">${p.goal}</p><ul>${p.out.map((o) => `<li>${o}</li>`).join('')}</ul>
        <p class="cut"><b>Se atrasar, corte:</b> ${p.cut}</p>`;
      pc.appendChild(c);
    });

    const sp = $('#sprints');
    SPRINTS.forEach((s, i) => {
      const a = wk(i), z = new Date(wk(i + 1).getTime() - 864e5);
      const c = el('article', 'sprint' + (i === 3 || i === 11 ? ' ms' : ''));
      c.innerHTML = `<header><b>S${String(i + 1).padStart(2, '0')}</b><time>${fmt(a)} – ${fmt(z)}</time><span>${i < 4 ? 'F0' : 'F1'}</span></header>
        <div class="lane ia"><small>IA · código</small><p>${s.ia}</p></div>
        <div class="lane mdl"><small>IA · modelos voxel</small><p>${s.mdl}</p></div>
        <div class="lane voce"><small>Você · direção</small><p>${s.voce}</p></div>
        <div class="lane out"><small>Entregável</small><p>${s.out}</p></div>`;
      sp.appendChild(c);
    });
  }

  function renderAssets() {
    const box = $('#asset-list');
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('dr-assets') || '{}'); } catch (e) { saved = {}; }
    const total = ASSETS.reduce((n, g) => n + g.items.length, 0);
    const upd = () => {
      const done = $$('#asset-list input:checked').length;
      $('#asset-progress').textContent = `${done}/${total} modelos prontos`;
      $('#asset-bar').style.width = (done / total * 100) + '%';
    };
    ASSETS.forEach((g) => {
      const f = el('fieldset', 'asset-group');
      f.appendChild(el('legend', '', g.g));
      g.items.forEach(([id, n, spec]) => {
        const l = el('label', 'asset');
        l.innerHTML = `<input type="checkbox" data-id="${id}"${saved[id] ? ' checked' : ''}><span class="box"></span><span class="an"><code>${id}</code> ${n}${spec ? `<small>${spec}</small>` : ''}</span>`;
        f.appendChild(l);
      });
      box.appendChild(f);
    });
    box.addEventListener('change', (e) => {
      if (!e.target.dataset.id) return;
      saved[e.target.dataset.id] = e.target.checked;
      try { localStorage.setItem('dr-assets', JSON.stringify(saved)); } catch (err) { /* sem storage: segue sem salvar */ }
      upd();
    });
    upd();
  }

  function renderPrompts() {
    const box = $('#prompt-list');
    PROMPTS.forEach((p) => {
      const d = el('details', 'prompt');
      d.innerHTML = `<summary><b>${p.n}</b><span>${p.d}</span></summary><div class="pbody"><button class="copy" type="button">Copiar</button><pre><code></code></pre></div>`;
      $('code', d).textContent = p.p;
      $('.copy', d).addEventListener('click', async (e) => {
        const b = e.currentTarget;
        try { await navigator.clipboard.writeText(p.p); b.textContent = 'Copiado ✓'; }
        catch (err) { const r = document.createRange(); r.selectNodeContents($('code', d)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selecionado — Ctrl+C'; }
        setTimeout(() => { b.textContent = 'Copiar'; }, 1800);
      });
      box.appendChild(d);
    });
    $('#prompt-list details').open = true;
  }

  function renderDecisions() {
    const tb = $('#decisions tbody');
    DECISIONS.forEach(([a, b, c]) => tb.appendChild(el('tr', '', `<th scope="row">${a}</th><td>${b}</td><td><span class="rec">${c}</span></td>`)));
    const rl = $('#risks');
    RISKS.forEach(([a, b]) => rl.appendChild(el('li', '', `<b>${a}</b><span>${b}</span>`)));
  }

  /* ======================= NAVEGAÇÃO ======================= */

  // Destaca a seção atual no menu. Só rola o próprio menu (na horizontal) e só quando o link
  // está fora da área visível dele — nunca a página, para não brigar com a rolagem de quem lê.
  function nav() {
    const bar = $('.nav');
    const links = $$('.nav a[href^="#"]');
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const show = (a) => {
      const left = a.offsetLeft - bar.offsetLeft, right = left + a.offsetWidth;
      if (left < bar.scrollLeft || right > bar.scrollLeft + bar.clientWidth) {
        bar.scrollTo({ left: left - (bar.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    const obs = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const a = map.get(e.target.id); // o hero não tem link: limpa o destaque
        if (a && a.classList.contains('on')) return;
        links.forEach((l) => l.classList.remove('on'));
        if (a) { a.classList.add('on'); show(a); } else if (bar.scrollLeft) bar.scrollTo({ left: 0, behavior: 'smooth' });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    obs.observe($('.hero'));
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderVehicles(); renderFactionVehicles(); renderModes(); renderMechs(); renderGantt(); renderAssets(); renderPrompts(); renderDecisions();
    nav();
  });
})();
