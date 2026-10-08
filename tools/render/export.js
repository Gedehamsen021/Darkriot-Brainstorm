// Renderiza as concept arts, o hero, o mapa e os quadros das animações em PNG (tools/render/out/).
// Depois rode encode.py para gerar os .webp e .gif usados pelo site.
// Uso: node tools/render/export.js [arts|map|anims ...]   (requer: npm i playwright)
// FONT_CSS=caminho/fonte.css injeta uma @font-face local (útil sem internet).
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const OUT = path.join(__dirname, 'out');
const FPS = 12.5;
const ARTS = ['coalizao', 'legiao', 'tank', 'trench', 'village', 'fpv'];
const save = (name, dataUrl) => {
  fs.mkdirSync(path.dirname(path.join(OUT, name)), { recursive: true });
  fs.writeFileSync(path.join(OUT, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
};

async function open(browser, scale) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: scale });
  page.on('pageerror', (e) => console.error('erro na página:', e.message));
  await page.goto('file://' + path.join(__dirname, 'render.html'));
  if (process.env.FONT_CSS) await page.addStyleTag({ path: process.env.FONT_CSS });
  await page.evaluate(() => Promise.all([document.fonts.load('12px "JetBrains Mono"'), document.fonts.load('bold 12px "JetBrains Mono"')]).catch(() => {}));
  return page;
}

(async () => {
  const want = process.argv.slice(2);
  const all = want.length === 0;
  const browser = await chromium.launch();

  if (all || want.includes('arts')) {
    const page = await open(browser, 2);
    for (const id of ARTS) save(`art-${id}.png`, await page.evaluate(([i]) => exportArt(i, 600, 400), [id]));
    save('hero.png', await page.evaluate(() => exportArt('hero', 900, 760, { pad: 8 })));
    console.log('artes ok');
    await page.close();
  }
  if (all || want.includes('map')) {
    const wide = await open(browser, 2);
    save('map-wide.png', await wide.evaluate(() => exportMap(1150, 719)));
    await wide.close();
    const narrow = await open(browser, 3);
    save('map-narrow.png', await narrow.evaluate(() => exportMap(420, 263)));
    await narrow.close();
    console.log('mapa ok');
  }
  if (all || want.includes('anims')) {
    const page = await open(browser, 1);
    for (const a of await page.evaluate(() => animInfo())) {
      fs.rmSync(path.join(OUT, 'frames', a.id), { recursive: true, force: true });
      const n = Math.round(a.T * FPS);
      for (let i = 0; i < n; i++) {
        save(`frames/${a.id}/${String(i).padStart(3, '0')}.png`, await page.evaluate(([id, t]) => exportFrame(id, t, 480, 300), [a.id, i / FPS]));
      }
      save(`anim-${a.id}-still.png`, await page.evaluate(([id, t]) => exportFrame(id, t, 480, 300), [a.id, a.poster]));
      console.log(a.id, n, 'quadros');
    }
    await page.close();
  }
  await browser.close();
})();
