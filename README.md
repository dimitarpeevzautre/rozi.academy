# rozi.academy

Static site for **Академия Рози**, served by GitHub Pages from the `main` branch at
<https://rozi.academy> (`CNAME`). `.nojekyll` stops Pages from running Jekyll. There is no build
step: what is in the repository is what gets served.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole page: `<head>` (title, description, Open Graph, canonical, JSON-LD) and the eight sections as plain HTML |
| `assets/css/site.css` | Fonts (`@font-face`), base styles and the position/size of every element for each screen size |
| `assets/img/` | Photos as WebP (`name.webp` for normal screens, `name@2x.webp` for retina) and the decorative shapes as SVG |
| `fonts/` | The seven web fonts used by the design (WOFF2) |
| `images/` | Favicons, `apple-touch-icon.png` and the social preview image `og-image.jpg` (1200x630) |
| `robots.txt`, `sitemap.xml` | Crawling hints |

## How the page is laid out

The page used to be a Canva website export (about 5.6 MB of JavaScript that drew the page from a JSON
blob). It was rebuilt as static HTML/CSS by capturing what the Canva renderer produced and keeping the
same positions, fonts, colours and images, so it looks the same as before.

- Every section (`<section id="nachalo">`, `za-men`, `igri`, `grafik`, `polzi`, `poveche`, `mnenia`,
  `kontakt`) contains one `.cv` box. Elements inside it are absolutely positioned, like in the original
  design.
- There are four layouts, switched by media queries in `site.css`: desktop (1108px and wider, a
  1366x768 design per section), and three stacked layouts for 760-1107px, 480-759px and below 480px.
- A tiny inline script in `<head>` sets the CSS variables `--zd/--zw/--zt/--zm`, which scale (`zoom`)
  each layout to the window width. Without JavaScript the page still renders at its designed size.
- Classes such as `DF_utQ`, `cgHgbA`, `OYPEnA` come from Canva's CSS and are kept as-is. Classes `z1`,
  `z2`, ... hold per-layout positions. Elements with class `x-d`, `x-m`, `x-wt`, ... exist only for the
  listed layouts (d = desktop, w = wide tablet, t = tablet, m = mobile); they repeat the same text with
  different line breaks, because the text boxes do not wrap automatically (`text-wrap: nowrap`).

## Editing text

Search `index.html` for the sentence and change it. If it appears more than once (in `x-...` copies),
change every copy. Keep the line length similar: text boxes do not re-wrap, so a much longer line
will stick out of its box. Check the result at desktop and phone width (see below).

Contact details also live in the JSON-LD block in `<head>` (`rozi:jsonld`); update both.

## Replacing a photo

Export the new photo as WebP in the same size as the existing file (and twice that size for `@2x`),
for example with Pillow:
`python -c "from PIL import Image; im=Image.open('new.jpg'); im.thumbnail((700, 99999)); im.save('assets/img/deca-zalez.webp', quality=80)"`

## Checking locally

Run `python -m http.server` in the repository root and open <http://localhost:8000>. Check at least a
desktop width and a phone width (375px) in the browser's device toolbar.
