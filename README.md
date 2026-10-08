# DARKRIOT — Brainstorm

Site de brainstorm do **DARKRIOT**: um milsim tático no estilo *Arma*, inspirado no conflito UC × RU (com facções fictícias), num mundo de blocos destrutível no estilo *Minecraft*.

**Site:** https://gedehamsen021.github.io/Darkriot-Brainstorm/ (depois de ativar o GitHub Pages, veja abaixo)

| Destruição | Trincheira | FPV vs EW |
|---|---|---|
| ![Destruição](assets/gifs/destroy.gif) | ![Trincheira](assets/gifs/dig.gif) | ![FPV](assets/gifs/fpv.gif) |
| **Artilharia** | **Fortaleza** | **Blackout** |
| ![Artilharia](assets/gifs/artillery.gif) | ![Fortaleza](assets/gifs/build.gif) | ![NVG](assets/gifs/nvg.gif) |

## O que tem no site

1. **Visão**: pilares, ficha técnica, loops de jogo
2. **Engine**: por que Godot 4, comparativo com Unity e Unreal, stack e arquitetura de rede
3. **Facções e mundo**: Coalizão Kalyna × Legião Boreal, kits, veículos e o mapa tático procedural do Oblast de Vorsk
4. **Concept arts**: renderizadas ao vivo por um mini motor voxel isométrico (`assets/js/voxel.js`)
5. **Modos de jogo**: Linha de Frente, Fortaleza, Blackout, Caçada de Drones, Patrulha e Campanha Dinâmica
6. **Mecânicas**: 15 sistemas com filtro por fase (MVP, Alpha, Beta, Pós)
7. **GIFs de gameplay**: loops ao vivo em canvas e `.gif` para baixar
8. **Cronograma**: Gantt de out/2026 até o Early Access (mar/2028), marcos, fases e as 12 primeiras semanas sprint a sprint
9. **Orquestração**: fluxo de trabalho com IA, guia do modelador (Blockbench), checklist de modelos, biblioteca de prompts, decisões e riscos

## Ativar o GitHub Pages

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
3. Em **Branch**, escolha a branch com o site (por exemplo `main` depois do merge, ou `claude/gifted-tesla-28e5uq`) e a pasta **/ (root)**. Clique em **Save**.
4. Em 1–2 minutos o site sai em `https://gedehamsen021.github.io/Darkriot-Brainstorm/`.

O site é estático (HTML, CSS e JS puros, sem build). O arquivo `.nojekyll` faz o Pages servir tudo como está.

## Ver localmente

Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Estrutura

```
index.html              página única com todas as seções
assets/css/style.css    visual (tema escuro militar, fonte pixel Silkscreen)
assets/js/voxel.js      mini motor voxel isométrico (canvas 2D)
assets/js/models.js     modelos voxel: soldados, tanque, IFV, drone, casa, girassol…
assets/js/art.js        concept arts + mapa tático procedural
assets/js/anims.js      animações de gameplay (funções puras do tempo → loops perfeitos)
assets/js/main.js       dados do brainstorm (modos, mecânicas, cronograma, prompts…) e montagem
assets/gifs/*.gif       GIFs exportados das animações
tools/gifs/             scripts para regenerar os GIFs
```

Para mudar o conteúdo (cronograma, mecânicas, prompts, checklist), edite os arrays no topo de `assets/js/main.js`.

## Regenerar os GIFs

Depois de editar `assets/js/anims.js`:

```bash
npm i playwright            # uma vez
pip install pillow          # uma vez
node tools/gifs/capture.js            # todas as animações (ou: node tools/gifs/capture.js fpv,dig)
python3 tools/gifs/make_gifs.py       # gera assets/gifs/*.gif
```
