#!/usr/bin/env python3
"""
Annotate a screenshot with highlight boxes and/or arrows so it visually
points at the UI element the step instruction refers to.

Usage:
    python annotate_screenshot.py input.png output.png \
        --boxes '[[400,120,560,150]]' \
        --arrows '[[300,400,410,300]]' \
        --color "#FF6A00" --width 4

- --boxes: JSON list of [x1,y1,x2,y2] rectangles drawn around an element.
- --arrows: JSON list of [x_start,y_start,x_tip,y_tip] -- an arrow drawn
  from the start point to the tip, with the arrowhead at the tip (put the
  tip near the element being pointed at).
- --color: hex color for both boxes and arrows. Default is the official
  Rous Vibrant Orange (#F95623), matching the brand accent used everywhere
  else in the guides.
- --width: line thickness in pixels.

Coordinates are pixels, top-left origin, matching the input image's own
resolution. Estimate them by looking at the image; check the output before
using it -- if the box/arrow lands on the wrong element, adjust and rerun.
"""
import argparse
import json
from PIL import Image, ImageDraw


def draw_arrow(draw, x1, y1, x2, y2, color, width):
    draw.line([x1, y1, x2, y2], fill=color, width=width)
    # Arrowhead: a small triangle at the tip, oriented along the line.
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    head_len = max(14, width * 4)
    head_angle = math.radians(28)
    left = (
        x2 - head_len * math.cos(angle - head_angle),
        y2 - head_len * math.sin(angle - head_angle),
    )
    right = (
        x2 - head_len * math.cos(angle + head_angle),
        y2 - head_len * math.sin(angle + head_angle),
    )
    draw.polygon([(x2, y2), left, right], fill=color)


def annotate(input_path, output_path, boxes, arrows, color, width):
    img = Image.open(input_path).convert("RGB")
    draw = ImageDraw.Draw(img)
    for (x1, y1, x2, y2) in boxes:
        draw.rectangle([x1, y1, x2, y2], outline=color, width=width)
    for (x1, y1, x2, y2) in arrows:
        draw_arrow(draw, x1, y1, x2, y2, color, width)
    img.save(output_path)
    print(f"Added {len(boxes)} box(es), {len(arrows)} arrow(s) -> {output_path}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("input")
    p.add_argument("output")
    p.add_argument("--boxes", default="[]", help="JSON list of [x1,y1,x2,y2]")
    p.add_argument("--arrows", default="[]", help="JSON list of [x1,y1,x2,y2] start->tip")
    p.add_argument("--color", default="#F95623")
    p.add_argument("--width", type=int, default=4)
    args = p.parse_args()
    annotate(
        args.input, args.output,
        json.loads(args.boxes), json.loads(args.arrows),
        args.color, args.width,
    )
