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
    """Address side. Postal matter stays in the top 3.25 in (half of 6.5)."""
    img = Image.new("RGB", (W, H), PARCHMENT)
    d = ImageDraw.Draw(img)
    pad = 90
    top_half = H // 2  # 3.25 in — USPS: entire mailing label above this line

    d.text((pad, 56), "LOOKOUT", font=font("Figtree-Semibold.ttf", 28), fill=PINE)
    d.multiline_text(
        (pad, 96),
        "[Street]\n[City ST  ZIP]",
        font=font("Figtree-Regular.ttf", 24),
        fill=INK,
        spacing=4,
    )

    # Official Retail indicia: no city, no permit number.
    iw, ih = int(1.55 * DPI), int(1.22 * DPI)
    ix, iy = W - pad - iw, 38
    rounded_rect(d, (ix, iy, ix + iw, iy + ih), 4, WHITE, PINE, 4)
    indicia_font = font("Figtree-Semibold.ttf", 26)
    indicia_lines = [
        "PRSRT STD",
        "ECRWSS",
        "U.S. POSTAGE",
        "PAID",
        "EDDM RETAIL",
    ]
    ty = iy + 18
    for line in indicia_lines:
        tw = d.textlength(line, font=indicia_font)
        d.text((ix + (iw - tw) / 2, ty), line, font=indicia_font, fill=INK)
        ty += 66

    addr = font("Figtree-Semibold.ttf", 32)
    d.text((ix, iy + ih + 28), "LOCAL POSTAL", font=addr, fill=PINE)
    d.text((ix, iy + ih + 72), "CUSTOMER", font=addr, fill=PINE)

    # Headline sits in the top half, left of the mail column
    d.text((pad, 220), "TWO SIDES OF THE SAME TOWN", font=font("Figtree-Medium.ttf", 22), fill=SAGE)
    d.multiline_text(
        (pad, 258),
        "Unhook once.\nTour in a car.",
        font=font("Fraunces-Semibold.ttf", 64),
        fill=INK,
        spacing=4,
    )

    d.line([(pad, top_half), (W - pad, top_half)], fill=STONE, width=2)

    gap = 28
    card_y = top_half + 40
    card_h = 430
    card_w = (W - pad * 2 - gap) // 2
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
    for i, (title, copy) in enumerate(cards):
        x = pad + i * (card_w + gap)
        rounded_rect(d, (x, card_y, x + card_w, card_y + card_h), 24, WHITE, STONE, 3)
        d.text((x + 36, card_y + 28), title, font=font("Figtree-Semibold.ttf", 24), fill=SAGE)
        d.multiline_text(
            (x + 36, card_y + 78),
            wrap(d, copy, font("Figtree-Regular.ttf", 32), card_w - 72),
            font=font("Figtree-Regular.ttf", 32),
            fill=INK,
            spacing=6,
        )

    d.text(
        (pad, card_y + card_h + 28),
        "01  Find a park      02  Book or list a car      03  Camp stays put",
        font=font("Figtree-Medium.ttf", 26),
        fill=PINE,
    )

    d.multiline_text(
        (pad, 1780),
        wrap(
            d,
            "Hosts carry their own auto insurance. Lookout Protection is a trip damage waiver, not a policy. Not affiliated with the National Park Service.",
            font("Figtree-Regular.ttf", 22),
            W - pad * 2,
        ),
        font=font("Figtree-Regular.ttf", 22),
        fill=SAGE,
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
