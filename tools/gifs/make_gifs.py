"""Junta os PNGs de tools/gifs/frames/<id>/ em assets/gifs/<id>.gif (requer Pillow)."""
import glob
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'assets', 'gifs')
NOISY = {'fpv'}  # ruído de estática: menos cores deixa o arquivo menor

ids = sys.argv[1].split(',') if len(sys.argv) > 1 else sorted(os.listdir(os.path.join(HERE, 'frames')))
for gid in ids:
    files = sorted(glob.glob(os.path.join(HERE, 'frames', gid, '*.png')))
    if not files:
        print(gid, 'sem quadros — rode capture.js antes')
        continue
    frames = [Image.open(f).convert('RGB').quantize(colors=64 if gid in NOISY else 96,
                                                    method=Image.Quantize.MEDIANCUT,
                                                    dither=Image.Dither.NONE) for f in files]
    path = os.path.join(OUT, gid + '.gif')
    frames[0].save(path, save_all=True, append_images=frames[1:], duration=80, loop=0, optimize=True, disposal=1)
    print(gid, len(frames), 'quadros,', round(os.path.getsize(path) / 1024), 'KB')
