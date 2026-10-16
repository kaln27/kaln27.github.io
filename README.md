# Juncheng Liao · Academic homepage

Academic homepage for Juncheng Liao (廖俊程), with research, publications, education, experience, and open-source contributions.

**Website:** https://kaln27.github.io/

## Local preview

Requires Node.js 18 or later. No dependency installation is needed.

```sh
git clone https://github.com/kaln27/kaln27.github.io.git
cd kaln27.github.io
npm run dev
```

Open the local address printed by the server, normally `http://127.0.0.1:4173/`.
After editing source files, run `npm run build` and refresh the browser. The build checks internal links, anchors, and assets, then writes the static site to `dist/`.

## GitHub Pages

GitHub Pages publishes the **root of the `master` branch**. The `.nojekyll` file enables direct static publishing. The HTML, CSS, JavaScript, and image assets in the repository root are the published source; `dist/` is a local build output and is not committed.

Before pushing updates:

```sh
npm run build
git diff --check
```

## Main files

- `index.html`: academic homepage with separate Education and Experience sections.
- `introduction/index.html`: 研究与项目, a Chinese presentation page for interview screen sharing. The italic introduction link opens it in a separate tab.
- `cv/index.html`: CV with browser printing / PDF export.
- `publication/`: AWARe and OmniKey research details.
- `assets/styles.css`: shared layout and styling.
- `assets/introduction.css`: presentation page layout.
- `assets/site.js`: repeatable cat / portrait toggle, enlarged research figures, BibTeX copy, navigation, and CV printing.
- `files/`: AWARe paper, method figure PDF, and the supplied arXiv BibTeX entry.
- `scripts/`: dependency-free build and local preview server.

Legacy `/about/`, `/about.html`, `/publications/`, and `/resume/` addresses remain available as redirects. AWARe keeps its existing publication URL.

## Content and image credits

Content is based on the author's existing academic website, résumé, and interview presentation. OmniKey is listed as second-author work submitted to AAAI 2027, with experimental conditions preserved. The robotic door-opening result is explicitly a simulation result without real-robot validation. Open-source entries link to their original pull requests and distinguish merged work from a proposed fix.

The author supplied the portrait, cat avatar, Zhejiang University and Harbin Institute of Technology PNG emblems, and OmniKey method figure. The Uni-Ubi logo is the original SVG from [the company website](https://www.uniubi.com/logo.svg). The pixel-cat favicon is drawn for this website.

The design takes inspiration from [Mi Yan's homepage](https://miyandoris.github.io/) and [repository](https://github.com/MiYanDoris/MiYanDoris.github.io), whose original template credits [Jon Barron](https://jonbarron.info/). The implementation preserves the sage and forest-green palette, academic layout, and design attribution without copying the reference author's personal content.
