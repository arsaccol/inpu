# MdC quadrat integration

## Source review

Inpu currently has three candidate-based modes in `useIME`, selected in
`MaterialIME`. The output is an array of database signs. MdC needs a separate
source string and last valid Unicode value: a composition cannot be represented
by that array without losing format controls. Preserve the existing candidate
input and output when entering or leaving MdC mode.

Reuse the mode selector, input styling, and output utilities. MdC must bypass
candidate shortcuts (especially spaces and digits). The existing global copy
shortcut currently copies the output, so its MdC value must be canonical Unicode.
Add a preview copy handler for selection/context-menu copying as well.

## Licensing

Inpu is licensed under GPL-3.0-only, with root LICENSE, package metadata, and
source notices. HieroJax's GPL-3.0 and NewGardiner's SIL OFL 1.1 notices remain
intact. The deployed License & source page links to the full licenses and a
source archive generated for each build. See `THIRD_PARTY.md`.

## Reviewed upstream

HieroJax commit: `da318801e00b10b4b5c5ec8d9cc6f8fddcc9eb5a`.
Repository: <https://github.com/nederhof/hierojax>.

Reviewed the MdC grammar, generated parser, conversion page controller,
conversion structures, sign and mnemonic tables, ligature tables, renderer entry
point, formatting, insertions, and standardized variants.

The upstream Makefile concatenates shared renderer structures, parsers, and MdC
tables. The conversion-page controller is tied to its own DOM and is not suitable
as the Inpu API. Its useful conversion path is `mdcsyntax.parse`, followed by
the resulting fragments' `toString` methods.

Avoid importing upstream main.js unchanged: its top-level instance immediately
loads a font from a document-relative URL and retries with an alert on failure.
Instead expose a narrow conversion/rendering bridge, load the bundled font once
with an asset URL resolved by Vite, and report loading/rendering errors in React.
The renderer uses canvas internally for glyph measurement, even when producing
SVG. SVG remains the preview output.

## Implementation steps

1. Retain all required source/font notices. Pin upstream files and document
   assembly modifications and distribution terms.
2. Expose a synchronous conversion API returning Unicode and warnings. Keep
   parsing independent of DOM/font initialization. Validate unknown signs and
   prevent private-use placeholders from becoming silently accepted output.
3. Add isolated MdC state with empty, valid, and invalid states. Invalid input
   retains the last valid Unicode and clearly labels the preview as stale.
4. Add MdC to the existing selector and branch the existing input/output UI.
   Preserve source and mode state across switches; clearing MdC resets both its
   source and output.
5. Render Unicode through a font-ready SVG adapter. React owns only the wrapper;
   the adapter owns its children. Cancel stale async work on change/unmount so
   Strict Mode cannot duplicate output. Use the current left-to-right convention.
6. Copy directly from Unicode through both the existing Copy button and preview
   copy events. Initial selection support copies the complete preview fragment;
   arbitrary partial selection is a future editor feature.
7. Add conversion, state, adapter, and clipboard tests. Run static checks/build
   within repository permissions; record runtime verification separately.

## Loss and compatibility boundaries found in source

- `:` and `*` map to vertical/horizontal joins; nested groups use segments where
  required. Sign names, aliases, enclosures, blanks, loss, shading, and mirroring
  have conversion paths.
- Arbitrary scaling, elongation, gray styling, and generic ignored modifiers are
  discarded by grammar actions. Color is separate metadata, not plain Unicode.
- Absolute placement is approximated through insertion heuristics. General
  ligatures also use fallback placement heuristics.
- Rotations are rounded to 45-degree increments. Do not promise exact arbitrary
  rotations or universally supported standardized variants.
- Some sign aliases explicitly map to non-equivalent signs (for example A133,
  R16B, T63B). Unknown names become upstream placeholders and need explicit
  handling.
- Page/zone/tab directives can be discarded. Embedded text and line numbering
  are separate upstream parts and must be handled or rejected explicitly.
- Overlay conversion does not preserve all individual sign modifiers.

These findings are from source inspection, not executed behavior. Warn on known
lossy constructs and describe compatibility as the upstream MdC/JSesh subset.

## Verification targets

- `A1:O1`: U+13000 U+13430 U+13250.
- `W24*Z7`: U+133CC U+13431 U+133F2.
- Nested groups, a mnemonic, incomplete input, unknown signs, and lossy inputs.
- Switching modes preserves their independent source/output state.
- Copy preserves exact controls; renderer receives canonical Unicode unchanged.
- Production output contains the font and resolves its relative deployment URL.
- Browser checks still required for actual layout, selection, font loading,
  Strict Mode lifecycle, and clipboard behavior. Repository instructions prohibit
  running these without explicit runtime-investigation authorization.
