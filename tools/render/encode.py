"""Converte os PNGs de tools/render/out/ nos arquivos do site (requer Pillow).

- Estáticos (artes, hero, mapa, pôsteres) -> assets/img/*.webp
- Animações -> assets/img/anim-<id>.webp (usado na página, leve)
              assets/gifs/<id>.gif      (para baixar / mandar no Discord)
"""
import glob
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
IMG = os.path.join(ROOT, 'assets', 'img')
GIFS = os.path.join(ROOT, 'assets', 'gifs')
NOISY = {'fpv'}  # estática de rádio: comprime mal, então usa menos cores / qualidade
FRAME_MS = 80     # 12,5 quadros por segundo


def kb(path):
    return f'{round(os.path.getsize(path) / 1024)} KB'


os.makedirs(IMG, exist_ok=True)
os.makedirs(GIFS, exist_ok=True)

for png in sorted(glob.glob(os.path.join(OUT, '*.png'))):
    name = os.path.splitext(os.path.basename(png))[0]
    im = Image.open(png)
    im = im.convert('RGBA') if name == 'hero' else im.convert('RGB')
    dst = os.path.join(IMG, name + '.webp')
    im.save(dst, 'WEBP', quality=86, method=6)
    print(f'{name}.webp', im.size, kb(dst))

for d in sorted(glob.glob(os.path.join(OUT, 'frames', '*'))):
    gid = os.path.basename(d)
    frames = [Image.open(f).convert('RGB') for f in sorted(glob.glob(os.path.join(d, '*.png')))]
    if not frames:
        continue
    webp = os.path.join(IMG, f'anim-{gid}.webp')
    frames[0].save(webp, 'WEBP', save_all=True, append_images=frames[1:], duration=FRAME_MS, loop=0,
                   quality=50 if gid in NOISY else 72, method=6)
    pal = [f.quantize(colors=64 if gid in NOISY else 96, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE) for f in frames]
    gif = os.path.join(GIFS, gid + '.gif')
    pal[0].save(gif, save_all=True, append_images=pal[1:], duration=FRAME_MS, loop=0, optimize=True, disposal=1)
    print(gid, len(frames), 'quadros —', 'webp', kb(webp), '| gif', kb(gif))
