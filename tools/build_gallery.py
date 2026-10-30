#!/usr/bin/env python3
"""
Build the photo gallery for sanjaybenjam.in.

Put your original photos into category folders, e.g.

    photos-originals/
        speaking/       IMG_1234.jpg ...
        workshops/      ...
        leaders/        ...
        media/          ...
        music/          ...
        portraits/      ...
        personal/       ...

Then run (from the repo root):

    pip install pillow pillow-heif      # pillow-heif only needed for iPhone .HEIC files
    python tools/build_gallery.py photos-originals

It will:
  * fix rotation, strip GPS/location data, resize, and save WebP copies
      images/gallery/full/<name>.webp    (max 1600px, for the full-screen view)
      images/gallery/thumbs/<name>.webp  (max 640px, for the grid)
  * write gallery-data.js, which gallery.html reads.

Captions: open gallery-data.js and fill in "title" / "caption" for any photo.
Re-running the script keeps the captions you've written and the order you set.

Keep the originals folder OUT of the repo (it's in .gitignore).
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps

try:  # optional iPhone HEIC support
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

ROOT = Path(__file__).resolve().parent.parent
FULL_DIR = ROOT / "images" / "gallery" / "full"
THUMB_DIR = ROOT / "images" / "gallery" / "thumbs"
DATA_FILE = ROOT / "gallery-data.js"

FULL_MAX = 1600
THUMB_MAX = 640
FULL_QUALITY = 80
THUMB_QUALITY = 72
NAME_PREFIX = "sanjay-benjamin"

# Folder name -> label shown on the filter buttons (order = button order)
CATEGORIES = {
    "speaking": "Speaking & Keynotes",
    "workshops": "Workshops",
    "leaders": "With Leaders",
    "media": "Media",
    "music": "Music & Studio",
    "portraits": "Portraits",
    "lifestyle": "City & Lifestyle",
    "creative": "Creative",
    "personal": "Personal",
}

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"}


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text or "photo"


def load_existing():
    """Read captions/order from an existing gallery-data.js so re-runs keep edits."""
    if not DATA_FILE.exists():
        return []
    raw = DATA_FILE.read_text(encoding="utf-8")
    m = re.search(r"window\.GALLERY_PHOTOS\s*=\s*(\[.*?\]);", raw, re.S)
    if not m:
        return []
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        print("! Could not parse existing gallery-data.js; captions will start blank.")
        return []


def save_webp(img, path, max_side, quality):
    copy = img.copy()
    copy.thumbnail((max_side, max_side), Image.LANCZOS)
    copy.save(path, "WEBP", quality=quality, method=6)
    return copy.size


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    src_root = Path(sys.argv[1]).resolve()
    if not src_root.is_dir():
        sys.exit(f"Folder not found: {src_root}")

    FULL_DIR.mkdir(parents=True, exist_ok=True)
    THUMB_DIR.mkdir(parents=True, exist_ok=True)

    existing = {p["id"]: p for p in load_existing()}
    order = list(existing.keys())
    photos = dict(existing)
    used = set(existing)

    files = sorted(
        f for f in src_root.rglob("*")
        if f.is_file() and f.suffix.lower() in EXTS and not f.name.startswith(".")
    )
    if not files:
        sys.exit("No photos found. Put them in category subfolders (speaking/, workshops/ ...).")

    new_count = 0
    for f in files:
        rel = f.relative_to(src_root)
        category = slugify(rel.parts[0]) if len(rel.parts) > 1 else "personal"
        if category not in CATEGORIES:
            CATEGORIES[category] = category.replace("-", " ").title()

        # Stable id from category + original file name, so re-runs don't duplicate.
        base = f"{NAME_PREFIX}-{category}-{slugify(f.stem)}"
        pid = base
        if pid in photos and photos[pid].get("source") != str(rel):
            n = 2
            while f"{base}-{n}" in used:
                n += 1
            pid = f"{base}-{n}"

        full_path = FULL_DIR / f"{pid}.webp"
        thumb_path = THUMB_DIR / f"{pid}.webp"

        if pid in photos and full_path.exists() and thumb_path.exists():
            continue  # already processed

        try:
            with Image.open(f) as im:
                im = ImageOps.exif_transpose(im)  # fix phone rotation
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert("RGB")
                # Saving without exif= drops all metadata, including GPS location.
                w, h = save_webp(im, full_path, FULL_MAX, FULL_QUALITY)
                save_webp(im, thumb_path, THUMB_MAX, THUMB_QUALITY)
        except Exception as e:  # noqa: BLE001
            print(f"! Skipped {rel}: {e}")
            continue

        prev = photos.get(pid, {})
        photos[pid] = {
            "id": pid,
            "source": str(rel),
            "category": category,
            "full": f"images/gallery/full/{pid}.webp",
            "thumb": f"images/gallery/thumbs/{pid}.webp",
            "width": w,
            "height": h,
            "title": prev.get("title", ""),
            "caption": prev.get("caption", ""),
            "alt": prev.get("alt", ""),
        }
        if pid not in order:
            order.append(pid)
        used.add(pid)
        new_count += 1
        print(f"+ {rel}  ->  {pid}.webp  ({w}x{h})")

    # Drop entries whose files were deleted by hand.
    order = [pid for pid in order if (ROOT / photos[pid]["full"]).exists()]
    ordered = [photos[pid] for pid in order]
    cats_in_use = [c for c in CATEGORIES if any(p["category"] == c for p in ordered)]

    js = (
        "// Generated by tools/build_gallery.py — safe to edit titles, captions,\n"
        "// alt text and the order of photos. Re-running the script keeps your edits.\n"
        f"window.GALLERY_CATEGORIES = {json.dumps({c: CATEGORIES[c] for c in cats_in_use}, indent=2, ensure_ascii=False)};\n\n"
        f"window.GALLERY_PHOTOS = {json.dumps(ordered, indent=2, ensure_ascii=False)};\n"
    )
    DATA_FILE.write_text(js, encoding="utf-8")

    total = sum((ROOT / p["full"]).stat().st_size + (ROOT / p["thumb"]).stat().st_size for p in ordered)
    print(f"\nDone: {new_count} new, {len(ordered)} total photos, {total / 1_048_576:.1f} MB on the site.")
    print("Next: add captions in gallery-data.js, then commit and push.")


if __name__ == "__main__":
    main()
