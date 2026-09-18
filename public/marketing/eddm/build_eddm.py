#!/usr/bin/env python3
"""Lookout USPS EDDM 6.5in x 9in at 300 DPI — host-awareness mailer."""

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
    display = font("Fraunces-Semibold.ttf", 118)
    body = font("Figtree-Regular.ttf", 40)
    btn = font("Figtree-Semibold.ttf", 36)
    d.text((pad, 110), "LOOKOUT", font=font("Figtree-Semibold.ttf", 44), fill=PARCHMENT)
    d.text((pad, 168), "FOR NEIGHBORS NEAR THE PARKS", font=font("Figtree-Medium.ttf", 28), fill=SAGE)
    headline = wrap(d, "Visitors need a 4x4. Yours is already here.", display, int(W * 0.52))
    d.multiline_text((pad, 230), headline, font=display, fill=PARCHMENT, spacing=4)
    sub = wrap(
        d,
        "List the truck, van, or overland rig in the driveway. You set the rate. Pickup stays in town.",
        body,
        int(W * 0.44),
    )
    d.multiline_text((pad, 1320), sub, font=body, fill=PARCHMENT, spacing=8)
    bx, by, bw, bh = pad, 1540, 460, 92
    rounded_rect(d, (bx, by, bx + bw, by + bh), 46, PARCHMENT)
    tw = d.textlength("List your car", font=btn)
    d.text((bx + (bw - tw) / 2, by + 24), "List your car", font=btn, fill=PINE)
    d.text((pad + 500, by + 30), "Open Lookout · go live", font=font("Figtree-Regular.ttf", 28), fill=STONE)
    return img


def back() -> Image.Image:
    img = Image.new("RGB", (W, H), PARCHMENT)
    d = ImageDraw.Draw(img)
    pad = 90
    left_w = 1180
    d.text((pad, 90), "LOOKOUT", font=font("Figtree-Semibold.ttf", 32), fill=PINE)
    d.text((pad, 132), "LIST A CAR AT THE PARKS", font=font("Figtree-Medium.ttf", 24), fill=SAGE)
    d.multiline_text(
        (pad, 186),
        "They flew in.\nThey still need your truck.",
        font=font("Fraunces-Semibold.ttf", 58),
        fill=INK,
        spacing=2,
    )

    card_w, card_h = left_w, 270
    y = 430
    cards = [
        (
            "WHY LIST",
            "Park guests land without a capable car. Airport counters don’t have one. They book the neighbor’s 4x4.",
        ),
        (
            "YOU KEEP",
            "The keys until pickup. Your own auto insurance. The calendar. You set the daily rate.",
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
        "01  Open an account     02  Six photos of the actual car     03  Go live",
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
        wrap(d, "If you live here and own a capable car, list it.", font("Figtree-Regular.ttf", 26), pw),
        font=font("Figtree-Regular.ttf", 26),
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
