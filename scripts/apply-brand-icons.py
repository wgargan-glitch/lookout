#!/usr/bin/env python3
"""Resize concept A into app icons and concept B into the official lockup / OG card."""
from pathlib import Path

from PIL import Image

ROOT = Path("/workspace")
A = ROOT / "artifacts/imagine_images/8a1f81de-5ea0-4283-a67b-55eed6b17f05.jpg"
B = ROOT / "artifacts/imagine_images/6be89789-06e4-449d-8f13-07aa49ec8f75.jpg"
PINE = (47, 74, 56)


def square(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return im.crop((left, top, left + side, top + side))


def save_resized(src: Image.Image, dest: Path, size: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    out = src.resize((size, size), Image.Resampling.LANCZOS)
    out.save(dest, "PNG", optimize=True)


def main() -> None:
    icon = square(Image.open(A))
    lockup = Image.open(B).convert("RGB")

    brand = ROOT / "public/brand"
    brand.mkdir(parents=True, exist_ok=True)
    lockup.save(brand / "logo-lockup.jpg", "JPEG", quality=88, optimize=True)

    sizes = {
        ROOT / "public/images/app/icon.png": 512,
        ROOT / "public/images/app/icon-180.png": 180,
        ROOT / "public/images/app/icon-192.png": 192,
        ROOT / "public/images/app/icon-512.png": 512,
        ROOT / "public/images/app/icon-1024.png": 1024,
        ROOT / "public/icon-192.png": 192,
        ROOT / "public/icon-512.png": 512,
        ROOT / "store/icon-1024.png": 1024,
        ROOT / "native/www/icon-192.png": 192,
        ROOT / "native/www/icon-512.png": 512,
        ROOT / "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png": 1024,
    }
    for path, size in sizes.items():
        save_resized(icon, path, size)

    android = {
        "mdpi": (48, 108),
        "hdpi": (72, 162),
        "xhdpi": (96, 216),
        "xxhdpi": (144, 324),
        "xxxhdpi": (192, 432),
    }
    for density, (launcher, foreground) in android.items():
        folder = ROOT / f"android/app/src/main/res/mipmap-{density}"
        save_resized(icon, folder / "ic_launcher.png", launcher)
        save_resized(icon, folder / "ic_launcher_round.png", launcher)
        pad = Image.new("RGBA", (foreground, foreground), (0, 0, 0, 0))
        inner = int(foreground * 0.72)
        glyph = icon.resize((inner, inner), Image.Resampling.LANCZOS).convert("RGBA")
        pad.paste(glyph, ((foreground - inner) // 2, (foreground - inner) // 2))
        pad.save(folder / "ic_launcher_foreground.png", "PNG", optimize=True)

    # Official lockup on a 1200×630 pine field for share cards.
    og = Image.new("RGB", (1200, 630), PINE)
    target_h = 520
    scale = target_h / lockup.size[1]
    target_w = int(lockup.size[0] * scale)
    placed = lockup.resize((target_w, target_h), Image.Resampling.LANCZOS)
    og.paste(placed, ((1200 - target_w) // 2, (630 - target_h) // 2))
    og.save(ROOT / "public/og.jpg", "JPEG", quality=90, optimize=True)

    print("brand icons written")


if __name__ == "__main__":
    main()
