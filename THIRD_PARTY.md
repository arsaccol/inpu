# Third-party components for MdC quadrats

Inpu's original code and included database snapshot are licensed under
GPL-3.0-only; see the root LICENSE and README. The combined application is
distributed under GPLv3. The third-party licenses below remain in effect.

## HieroJax

- Author/project: Mark-Jan Nederhof, <https://github.com/nederhof/hierojax>
- Pinned commit: `da318801e00b10b4b5c5ec8d9cc6f8fddcc9eb5a`
- License: GNU General Public License version 3; full upstream text in
  `src/mdc/vendor/hierojax/LICENSE` and `public/licenses/HieroJax-GPL-3.0.txt`.
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
  `src/mdc/vendor/hierojax/OFL.txt` and `public/licenses/NewGardiner-OFL-1.1.txt`.
- Font: unchanged `docs/NewGardiner.otf` from the pinned HieroJax checkout.
- License text source: NewGardiner commit
  `a377a60086b2c3ad9098788515d1fa1caa4ad9ba`, `fonts/OFL.txt`.

Vite emits the font as a hashed asset, referenced by both the CSS and the adapter.
The entire MdC editor is loaded on demand. Browser font loading occurs before
glyph measurement/rendering; a local system font is not required.

## Distribution and corresponding source

Inpu is licensed under GPL-3.0-only by its owner's direction. Existing copyright
notices and third-party licenses are preserved. This does not relicense npm
dependencies or NewGardiner, nor change the separate inpu-db repository's metadata.

The application's License & source link opens `license.html`. Each production
build includes `source/inpu-source.zip`, generated from the same application and
database files used in that build. It contains the preferred application source,
HieroJax source and grammars, source assembly script, font, lockfile, configuration,
and build instructions. `SOURCE-SNAPSHOT.json` records the included file hashes.
The archive is served alongside the app without a fee or authentication.

`licenses/npm-notices.txt` preserves installed production dependency license and
copyright files. Dependencies are obtained using the exact versions and package
URLs in package-lock.json. These third-party components retain their own licenses.
The license texts and source archive must remain accessible when deploying dist.
