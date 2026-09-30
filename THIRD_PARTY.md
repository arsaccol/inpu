# Third-party components for MdC quadrats

Inpu is licensed under GPL-3.0-only; see the root `LICENSE`. These third-party
components retain their own licenses.

## HieroJax

- Author/project: Mark-Jan Nederhof, <https://github.com/nederhof/hierojax>
- Pinned commit: `da318801e00b10b4b5c5ec8d9cc6f8fddcc9eb5a`
- License: GNU General Public License version 3; full text in
  `src/mdc/vendor/hierojax/LICENSE`.
- Location: `src/mdc/vendor/hierojax/runtime.js`, grammar files, and CSS.

`scripts/vendor-hierojax.mjs` concatenates the original source files in upstream
build order, removes only the generated parsers' CommonJS command-line footers,
and appends named ESM exports. Source boundaries and comments remain in the
assembled file. The original `.jison` grammars are retained. No converter or
layout algorithm is replaced. Upstream `main.js` (automatic font loading and
global instance) and `mdcconvert.js` (conversion-page DOM handlers) are excluded;
Inpu's adapter manages the font, errors, React lifecycle, and SVG rendering.

To regenerate using the pinned checkout:

```sh
node scripts/vendor-hierojax.mjs /path/to/hierojax
```

## NewGardiner

- Copyright (c) 2020, Mark-Jan Nederhof. Reserved Font Name: NewGardiner.
- Project: <https://github.com/nederhof/newgardiner>
- License: SIL Open Font License 1.1; full notice and text in
  `src/mdc/vendor/hierojax/OFL.txt`.
- Font: unchanged `docs/NewGardiner.otf` from the pinned HieroJax checkout.
- License text source: NewGardiner commit
  `a377a60086b2c3ad9098788515d1fa1caa4ad9ba`, `fonts/OFL.txt`.

Vite emits the font as a hashed asset, referenced by both the CSS and the adapter.
The entire MdC editor is loaded on demand. Browser font loading occurs before
glyph measurement/rendering; a local system font is not required.
