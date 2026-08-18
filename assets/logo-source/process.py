from PIL import Image
import numpy as np

SRC = "."
OUT = ".."

def make_transparent(path, out, pad=14, threshold=248, feather=18):
    im = Image.open(path).convert("RGB")
    arr = np.array(im).astype(np.int16)
    # "distance" from white per pixel (min channel is enough since bg is near-neutral white)
    brightness = arr.min(axis=2)
    alpha = np.clip((threshold - brightness) / feather * 255, 0, 255).astype(np.uint8)
    # keep alpha at 255 wherever brightness is clearly below threshold-feather
    alpha[brightness < threshold - feather] = 255
    rgba = np.dstack([arr.astype(np.uint8), alpha])
    out_im = Image.fromarray(rgba, mode="RGBA")

    bbox = out_im.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        left = max(0, left - pad)
        top = max(0, top - pad)
        right = min(out_im.width, right + pad)
        bottom = min(out_im.height, bottom + pad)
        out_im = out_im.crop((left, top, right, bottom))

    out_im.save(out)
    print(out, out_im.size)


def trim_opaque(path, out, threshold=248, pad=10):
    im = Image.open(path).convert("RGB")
    arr = np.array(im).astype(np.int16)
    brightness = arr.min(axis=2)
    mask = brightness < threshold
    ys, xs = np.where(mask)
    if len(xs) == 0:
        Image.open(path).save(out)
        return
    left, right = max(0, xs.min() - pad), min(im.width, xs.max() + pad)
    top, bottom = max(0, ys.min() - pad), min(im.height, ys.max() + pad)
    cropped = im.crop((left, top, right, bottom))
    cropped.save(out)
    print(out, cropped.size)


# 1) Navbar logo: transparent background, trimmed
make_transparent(f"{SRC}/novo_elemento_logo_lateral_NE.png", f"{OUT}/logo.png")

# 2) Footer / favicon badge: solid brown square, just trimmed (keep its own bg)
trim_opaque(f"{SRC}/novo_elemento_monograma_NE_marrom.png", f"{OUT}/logo-badge.png")

# 3) Circular seal for the "Sobre" page: keep its own soft linen bg, just trimmed
trim_opaque(f"{SRC}/novo_elemento_logo_redonda_bege.png", f"{OUT}/logo-seal.png")

# 4) Transparent circular monogram (alternative mark, e.g. favicon fallback / decorative use)
make_transparent(f"{SRC}/novo_elemento_monograma_circular.png", f"{OUT}/logo-mark.png")
