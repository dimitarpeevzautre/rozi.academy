# rozi.academy

Static site for **Академия Рози**, served by GitHub Pages from the `main` branch at
<https://rozi.academy> (`CNAME`). `.nojekyll` stops Pages from running Jekyll.

## How the site is built

The page is a website export from **Canva**. Canva does not produce plain HTML: `index.html`
contains an empty `<div id="root">` plus a large inline `window['bootstrap'] = JSON.parse("...")`
blob that describes every section, text box and image. About 5.6 MB of hashed `*.js` / `*.css`
files in the repo root render that JSON in the browser.

| Path | What it is |
| --- | --- |
| `index.html` | The page: `<head>` meta tags, the bootstrap JSON, script tags, plus our hand-made additions (see below) |
| `*.js`, `*.ltr.css`, `*.rtl.css` | Canva runtime bundles (hashed names, loaded with SRI `integrity` attributes, do not edit) |
| `media/` | Photos and illustrations used by the design. Each photo has 1x / 2x / 3x variants (800, 1600, 2400 px) |
| `fonts/`, `images/*.woff*` | Web fonts referenced by the bootstrap JSON and the Canva CSS |
| `images/` (png/jpg) | Favicons, apple-touch-icon and the social preview image `og-image.jpg` |
| `tools/apply_changes.js` | One-off script that patched texts/layout inside the bootstrap JSON (schedule, address, age range, reviews) |
| `robots.txt`, `sitemap.xml` | Crawling hints, not produced by Canva |

## Editing content

Preferred: change the design in Canva and re-export (below). For small text fixes without Canva,
`tools/apply_changes.js` shows how to decode the bootstrap JSON, change a text run and write it back
(run with `node tools/apply_changes.js` from the repo root). Whenever texts change, update the
static fallback content too (see "Hand-made additions").

## Re-exporting from Canva

1. Publish/export the Canva website and download the generated files.
2. Replace the hashed `*.js`, `*.css`, `media/`, `fonts/`, `images/*.woff*` and `index.html` with the
   new export. Keep `CNAME`, `.nojekyll`, `README.md`, `robots.txt`, `sitemap.xml` and `tools/`.
3. Delete hashed files that the new `index.html` no longer references (`grep` for each name first).
4. Re-apply the post-export patches below; Canva overwrites all of them.
5. Open the page locally (`python -m http.server` in the repo root, then http://localhost:8000) and
   check it renders, both with JavaScript on and off.

## Post-export patches (re-apply after every export)

All hand-made additions in `index.html` are wrapped in `<!-- rozi:... -->` / `<!-- /rozi:... -->`
comments, so they can be copied from the previous version of the file:

```sh
git show HEAD~1:index.html | grep -o '<!-- rozi:[a-z-]* -->.*<!-- /rozi:[a-z-]* -->'
```

1. **Language**: change `<html dir="ltr" lang="en" ...>` to `lang="bg"`. The content is Bulgarian;
   Canva always writes `en`.
2. **Meta tags**: check `<title>`, `meta name="description"`, the `og:*` / `twitter:*` tags and
   `og:image` (`https://rozi.academy/images/og-image.jpg`, 1200x630). Canva may reset them.
3. **Canonical** (`rozi:canonical`): `<link rel="canonical" href="https://rozi.academy/">` in `<head>`.
4. **Structured data** (`rozi:jsonld`): the LocalBusiness JSON-LD block in `<head>`. Update it if the
   address, phone or email change.
5. **Icons**: keep one `<link>` per icon size (`favicon.ico`, `favicon-16x16.png`,
   `favicon-32x32.png`, 192x192 icon, `apple-touch-icon.png`). Canva adds duplicate hashed copies
   (`rel="shortcut icon"` and a second `apple-touch-icon`); drop those links and the hashed files.
6. **Static fallback content** (`rozi:fallback`): a `<noscript>` block at the start of `<body>` with
   the page text as real HTML (headings, paragraphs, images with `alt`, contact links). Search
   engines and link previews that do not run JavaScript only see this. Keep it in sync with the
   texts in Canva; do not add copy that is not on the visual page.
7. **Photos**: Canva exports large, lightly compressed JPEGs. Recompress `media/*.jpg` over ~100 KB
   at JPEG quality ~82 (progressive, same pixel size and file name, because the bootstrap JSON
   declares the size of every file). For example with Pillow, for each large file `F`:
   `python -c "import sys; from PIL import Image; f=sys.argv[1]; im=Image.open(f); im.save(f, quality=82, optimize=True, progressive=True, icc_profile=im.info.get('icc_profile'))" F`
   Keep the result only if it is clearly smaller and looks the same.
   Do not rename files or convert them to another format; the bootstrap JSON references them by
   name and MIME type.
