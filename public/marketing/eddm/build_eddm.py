#!/usr/bin/env python3
"""Lookout USPS EDDM 6.5in x 9in at 300 DPI — RV guests + any-car hosts."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/workspace/public/marketing/eddm")
FONTS = Path("/tmp/fonts")
HERO = Path("/workspace/artifacts/imagine_images/40efd824-eac9-42f8-8a4a-c4e1a52f34b2.jpg")

DPI = 300
W, H = 9 * DPI, int(6.5 * DPI)  # 2700 x 1950 landscape
PINE = (47, 74, 56)
PINE_DEEP = (24, 40, 30)
PARCHMENT = (244, 239, 228)
INK = (26, 25, 21)
SAGE = (107, 127, 110)
STONE = (196, 184, 165)
WHITE = (255, 255, 255)


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> str:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def cover(src: Path, size: tuple[int, int]) -> Image.Image:
    im = Image.open(src).convert("RGB")
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return im.crop((left, top, left + tw, top + th))


def rounded_rect(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def front() -> Image.Image:
    img = cover(HERO, (W, H))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for x in range(0, int(W * 0.64)):
        t = 1 - (x / (W * 0.64))
        a = int(220 * (t**1.1))
        d.line([(x, 0), (x, H)], fill=(*PINE_DEEP, a))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    d = ImageDraw.Draw(img)
    pad = 120
    display = font("Fraunces-Semibold.ttf", 112)
    body = font("Figtree-Regular.ttf", 40)
    btn = font("Figtree-Semibold.ttf", 34)
    d.text((pad, 110), "LOOKOUT", font=font("Figtree-Semibold.ttf", 44), fill=PARCHMENT)
    d.text((pad, 168), "CARS AT THE PARKS", font=font("Figtree-Medium.ttf", 28), fill=SAGE)
    headline = wrap(d, "Leave the motorhome. Take the car.", display, int(W * 0.50))
    d.multiline_text((pad, 230), headline, font=display, fill=PARCHMENT, spacing=4)
    sub = wrap(
        d,
        "Keep camp set up. Rent a local car for the sites, the overlooks, and town — then come back to a camp that’s still yours.",
        body,
        int(W * 0.46),
    )
    d.multiline_text((pad, 1280), sub, font=body, fill=PARCHMENT, spacing=8)
    bx, by, bw, bh = pad, 1540, 520, 92
    rounded_rect(d, (bx, by, bx + bw, by + bh), 46, PARCHMENT)
    tw = d.textlength("Find or list a car", font=btn)
    d.text((bx + (bw - tw) / 2, by + 26), "Find or list a car", font=btn, fill=PINE)
    d.text((pad + 560, by + 32), "Any car. Any host.", font=font("Figtree-Regular.ttf", 28), fill=STONE)
    return img


def back() -> Image.Image:
    img = Image.new("RGB", (W, H), PARCHMENT)
    d = ImageDraw.Draw(img)
    pad = 90
    left_w = 1180
    d.text((pad, 90), "LOOKOUT", font=font("Figtree-Semibold.ttf", 32), fill=PINE)
    d.text((pad, 132), "TWO SIDES OF THE SAME TOWN", font=font("Figtree-Medium.ttf", 24), fill=SAGE)
    d.multiline_text(
        (pad, 186),
        "Unhook once.\nTour in a car.",
        font=font("Fraunces-Semibold.ttf", 58),
        fill=INK,
        spacing=2,
    )

    card_w, card_h = left_w, 270
    y = 430
    cards = [
        (
            "RV & MOTORHOME GUESTS",
            "Leave the coach set up. Rent a local car for the park roads, the village, and the trailhead lots the motorhome will not fit.",
        ),
        (
            "HOSTS — ANY CAR",
            "Sedan, van, truck, 4x4, or the daily driver. If it is in a gateway town, list it. You set the rate and keep the keys until pickup.",
        ),
    ]
    for title, copy in cards:
        rounded_rect(d, (pad, y, pad + card_w, y + card_h), 24, WHITE, STONE, 3)
        d.text((pad + 40, y + 28), title, font=font("Figtree-Semibold.ttf", 26), fill=SAGE)
        d.multiline_text(
            (pad + 40, y + 78),
            wrap(d, copy, font("Figtree-Regular.ttf", 34), card_w - 80),
            font=font("Figtree-Regular.ttf", 34),
            fill=INK,
            spacing=6,
        )
        y += card_h + 24

    d.text(
        (pad, y + 10),
        "01  Find a park     02  Book or list a car     03  Camp stays put",
        font=font("Figtree-Medium.ttf", 26),
        fill=PINE,
    )

    d.multiline_text(
        (pad, 1760),
        wrap(
            d,
            "Hosts carry their own auto insurance. Lookout Protection is a trip damage waiver, not a policy. Not affiliated with the National Park Service.",
            font("Figtree-Regular.ttf", 22),
            left_w,
        ),
        font=font("Figtree-Regular.ttf", 22),
        fill=SAGE,
        spacing=4,
    )

    pw, ph = 4 * DPI, int(2.75 * DPI)
    px, py = W - 90 - pw, 90
    rounded_rect(d, (px, py, px + pw, py + ph), 8, WHITE, PINE, 4)
    indicia = font("Figtree-Semibold.ttf", 28)
    small = font("Figtree-Regular.ttf", 24)
    lines = [
        "EDDM RETAIL",
        "U.S. POSTAGE PAID",
        "[CITY, ST]",
        "PERMIT NO. [    ]",
    ]
    ty = py + 80
    for i, line in enumerate(lines):
        fnt = indicia if i == 0 else small
        tw = d.textlength(line, font=fnt)
        d.text((px + (pw - tw) / 2, ty), line, font=fnt, fill=INK)
        ty += 72
    d.text((px + 36, py + 18), "KEEP THIS BOX CLEAR", font=font("Figtree-Medium.ttf", 18), fill=SAGE)

    d.text((px, py + ph + 48), "LOCAL POSTAL CUSTOMER", font=font("Figtree-Semibold.ttf", 34), fill=PINE)
    d.multiline_text(
        (px, py + ph + 110),
        "LOOKOUT\n[Your gateway town]\n[ST]  [ZIP]",
        font=font("Figtree-Regular.ttf", 26),
        fill=INK,
        spacing=6,
    )
    d.multiline_text(
        (px, py + ph + 280),
        wrap(d, "Any car. RV guests and neighbors both use Lookout.", font("Figtree-Regular.ttf", 24), pw),
        font=font("Figtree-Regular.ttf", 24),
        fill=PINE,
        spacing=4,
    )
    return img


def main() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    f = front()
    b = back()
    f.save(ROOT / "lookout-eddm-front.png", dpi=(DPI, DPI))
    b.save(ROOT / "lookout-eddm-back.png", dpi=(DPI, DPI))
    f.save(
        ROOT / "lookout-eddm-6.5x9.pdf",
        save_all=True,
        append_images=[b],
        resolution=DPI,
        dpi=(DPI, DPI),
    )
    print("wrote", ROOT)


if __name__ == "__main__":
    main()
