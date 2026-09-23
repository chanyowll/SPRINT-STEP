STEP Groups — institution watermarks
====================================

The STEP Groups stage shows the host institution's logo washed into the card
behind each team. All eight files are in place, supplied by AIPO. If a school sends an updated
mark, replace the file under the same name. Any file that goes missing simply
falls back to the running number, so the page keeps working either way.

    usc.png         University of San Carlos                    → POSTE, BRICKS
    usm.png         University of Southern Mindanao             → SINAG
    usep.png        University of Southeastern Philippines      → Halal Blockchain
    slu.png         Saint Louis University                      → Zeoskin
    msu-iit.png     MSU – Iligan Institute of Technology        → CAPPS, SPArC
    dlsu.png        De La Salle University                      → meSHM
    feu-tech.png    FEU – Institute of Technology               → SFRSCC
    dost-pnri.png   DOST – Philippine Nuclear Research Institute → LASER

Each file was trimmed of its transparent margin, centred on a square canvas and
capped at 512 px, so every mark occupies the same box on the card.

The wm/ subfolder
-----------------
wm/ holds the version the page actually draws: a white-on-transparent crest built
from each seal's own ink, where dark artwork becomes solid white and light
knockouts (the DLSU lettering, the USM banner, the PNRI centre square) stay open
so the card shows through them. That is what keeps the inner detail legible at
low opacity — a flat silhouette would show these seals as empty shapes.

Regenerating wm/ after replacing a logo:

    python3 - <<'EOF'
    from PIL import Image; import numpy as np, pathlib
    src = pathlib.Path("assets/logos"); out = src / "wm"
    for f in src.glob("*.png"):
        im = Image.open(f).convert("RGBA")
        a = np.asarray(im).astype(np.float32) / 255.0
        lum = 0.2126*a[...,0] + 0.7152*a[...,1] + 0.0722*a[...,2]
        na = np.clip(a[...,3] * np.clip(1-lum, 0, 1)**0.85, 0, 1)
        L = Image.fromarray(np.full(lum.shape, 255, "uint8"))
        Image.merge("LA", [L, Image.fromarray((na*255).astype("uint8"))]).save(out / f.name, optimize=True)
    EOF

What a replacement file should be
---------------------------------
  * PNG with a transparent background — a white or solid background will show
    as a visible square behind the mark.
  * Square-ish, at least 400 x 400 px. Bigger is fine; the page scales it down.
  * The plain logo or seal on its own, with no wordmark banner or tagline, since
    it renders small and heavily faded.

How it is rendered
------------------
The crest sits in the top-right corner of the stage at 19% opacity with a 1.1px
blur, so it reads as a watermark rather than a badge. To bring the marks up
further, add the class "bold-crest" to the <section class="showcase"> element in
groups.html — 27% opacity and almost no blur.

Permission
----------
Institution logos are trademarks. Confirm with each partner that AIPO may use
their mark on the STEP site, and whether the faded white treatment is acceptable
to them, before this page goes public.
