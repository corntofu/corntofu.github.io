#!/usr/bin/env python3
"""Write a RenderCV-compatible copy of _data/cv.yml.

_data/cv.yml feeds two consumers. The site's CV page (al_folio_cv) reads
`label`, `image`, `summary` and `address`, but RenderCV 2.x rejects any field
it does not know, so `rendercv render _data/cv.yml` fails validation. This
script maps those fields onto RenderCV's schema in a separate file and leaves
_data/cv.yml untouched:

  label   -> headline
  image   -> photo (copied next to the output as <output stem>-photo.<ext>,
             with <ext> taken from the file's real format: a PNG saved as
             .jpg makes Typst fail with "Error parsing image")
  summary -> a "Summary" section placed first
  address -> dropped (RenderCV has no field for it; `location` already covers it)

Usage: prepare_rendercv_input.py <input cv.yml> <output .yml>
The output must sit in the same directory as the input, because the paths in
assets/rendercv/settings.yaml are resolved relative to it.
"""

import os
import shutil
import sys

import yaml


SIGNATURES = {
    b"\x89PNG\r\n\x1a\n": ".png",
    b"\xff\xd8\xff": ".jpg",
    b"GIF8": ".gif",
}


def real_extension(path: str) -> str:
    with open(path, "rb") as handle:
        head = handle.read(8)
    for signature, extension in SIGNATURES.items():
        if head.startswith(signature):
            return extension
    return os.path.splitext(path)[1]


def main(source: str, target: str) -> None:
    with open(source, encoding="utf-8") as handle:
        data = yaml.safe_load(handle)

    cv = data["cv"]

    label = cv.pop("label", None)
    if label and not cv.get("headline"):
        cv["headline"] = label

    image = cv.pop("image", None)
    if image and not cv.get("photo"):
        target_dir = os.path.dirname(os.path.abspath(target))
        image_path = os.path.join(target_dir, "..", "assets", "img", image)
        if os.path.isfile(image_path):
            stem = os.path.splitext(os.path.basename(target))[0]
            photo = stem + "-photo" + real_extension(image_path)
            shutil.copyfile(image_path, os.path.join(target_dir, photo))
            cv["photo"] = photo

    summary = cv.pop("summary", None)
    sections = cv.get("sections") or {}
    if summary and "Summary" not in sections:
        cv["sections"] = {"Summary": [summary], **sections}

    cv.pop("address", None)

    with open(target, "w", encoding="utf-8") as handle:
        yaml.safe_dump(data, handle, allow_unicode=True, sort_keys=False)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
