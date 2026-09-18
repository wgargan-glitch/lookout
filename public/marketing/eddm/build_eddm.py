#!/usr/bin/env python3
"""Lookout USPS EDDM 6.5in x 9in at 300 DPI (front + back)."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/workspace/public/marketing/eddm")
FONTS = Path("/tmp/fonts")
HERO = Path("/workspace/artifacts/imagine_images/06b42d10-7b41-4e0c-b8d9-fa9ae88123b6.jpg")

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
    for x in range(0, int(W * 0.62)):
        t = 1 - (x / (W * 0.62))
        a = int(210 * (t**1.15))
        d.line([(x, 0), (x, H)], fill=(*PINE_DEEP, a))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    d = ImageDraw.Draw(img)
    pad = 120
    kicker = font("Figtree-Semibold.ttf", 36)
    display = font("Fraunces-Semibold.ttf", 128)
    body = font("Figtree-Regular.ttf", 42)
    btn = font("Figtree-Semibold.ttf", 36)
    d.text((pad, 120), "LOOKOUT", font=font("Figtree-Semibold.ttf", 44), fill=PARCHMENT)
    d.text((pad, 176), "CARS AT THE PARKS", font=font("Figtree-Medium.ttf", 30), fill=SAGE)
    headline = wrap(d, "The park car is already in town.", display, int(W * 0.50))
    d.multiline_text((pad, 240), headline, font=display, fill=PARCHMENT, spacing=6)
    sub = wrap(d, "Rent a 4x4 from a neighbor. Pickup in the gateway, not the airport.", body, int(W * 0.42))
    d.multiline_text((pad, 1380), sub, font=body, fill=PARCHMENT, spacing=8)
    bx, by, bw, bh = pad, 1540, 420, 92
    rounded_rect(d, (bx, by, bx + bw, by + bh), 46, PARCHMENT)
    tw = d.textlength("Book a trip", font=btn)
    d.text((bx + (bw - tw) / 2, by + 24), "Book a trip", font=btn, fill=PINE)
    d.text((pad + 460, by + 30), "For guests and hosts", font=font("Figtree-Regular.ttf", 28), fill=STONE)
    return img


def back() -> Image.Image:
    img = Image.new("RGB", (W, H), PARCHMENT)
    d = ImageDraw.Draw(img)
    pad = 90
    left_w = 1180
    d.text((pad, 90), "LOOKOUT", font=font("Figtree-Semibold.ttf", 32), fill=PINE)
    d.text((pad, 132), "CARS AT THE PARKS", font=font("Figtree-Medium.ttf", 24), fill=SAGE)
    d.multiline_text(
        (pad, 190),
        wrap(d, "Two ways onto the trail.", font("Fraunces-Semibold.ttf", 68), left_w),
        font=font("Fraunces-Semibold.ttf", 68),
        fill=INK,
        spacing=2,
    )

    card_w, card_h = left_w, 300
    y = 420
    cards = [
        ("GUESTS", "Book a local 4x4, van, or overland rig. Check in on your phone. Unlimited miles."),
        ("HOSTS", "List the truck already in the driveway. You set the rate. You keep the keys until pickup."),
    ]
    for title, copy in cards:
        rounded_rect(d, (pad, y, pad + card_w, y + card_h), 24, WHITE, STONE, 3)
        d.text((pad + 40, y + 32), title, font=font("Figtree-Semibold.ttf", 28), fill=SAGE)
        d.multiline_text(
            (pad + 40, y + 88),
            wrap(d, copy, font("Figtree-Regular.ttf", 36), card_w - 80),
            font=font("Figtree-Regular.ttf", 36),
            fill=INK,
            spacing=8,
        )
        y += card_h + 28

    steps = ["01  Find a park", "02  Book the car", "03  Check in at the lot"]
    d.text((pad, y + 8), "   ·   ".join(steps), font=font("Figtree-Medium.ttf", 30), fill=PINE)

    d.multiline_text(
        (pad, 1760),
        wrap(
            d,
            "Lookout Protection is a damage waiver, not an insurance policy. Hosts carry their own auto insurance. Not affiliated with the National Park Service.",
            font("Figtree-Regular.ttf", 22),
            left_w,
        ),
        font=font("Figtree-Regular.ttf", 22),
        fill=SAGE,
        spacing=4,
    )

    # USPS mail panel — 4.00 x 2.75 in, upper right of the address side
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
