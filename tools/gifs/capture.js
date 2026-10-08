// Exporta cada animação de assets/js/anims.js como PNGs em tools/gifs/frames/<id>/.
// Uso: node tools/gifs/capture.js [destroy,dig,...]   (requer: npm i playwright)
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const FPS = 12.5;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 480, height: 300 } });
  page.on('pageerror', (e) => console.error('erro na página:', e.message));
  await page.goto('file://' + path.join(__dirname, 'capture.html'));
  const ids = process.argv[2] ? process.argv[2].split(',') : await page.evaluate(() => animIds());
  for (const id of ids) {
    const T = await page.evaluate((i) => animT(i), id);
    const dir = path.join(__dirname, 'frames', id);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const n = Math.round(T * FPS);
    for (let i = 0; i < n; i++) {
      const data = await page.evaluate(([a, t]) => grab(a, t), [id, i / FPS]);
      fs.writeFileSync(path.join(dir, String(i).padStart(3, '0') + '.png'), Buffer.from(data.split(',')[1], 'base64'));
    }
    console.log(id, n, 'quadros');
  }
  await browser.close();
})();
