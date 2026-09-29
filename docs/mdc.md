# Manuel de Codage mode

Choose **Manuel de Codage** from the input selector (or cycle modes with Tab).
Type MdC and the output updates as Unicode composed into quadrats:

| Source | Meaning | Unicode output |
| --- | --- | --- |
| `A1:O1` | Vertical composition | U+13000 U+13430 U+13250 |
| `W24*Z7` | Horizontal composition | U+133CC U+13431 U+133F2 |
| `A1*(W24:Z7)` | Horizontal composition with a nested vertical group | U+13000 U+13431 U+13437 U+133CC U+13430 U+133F2 U+13438 |
| `anx` | Phonetic alias for S34 | U+132F9 |

Newlines separate lines. Common upstream syntax includes Gardiner codes,
mnemonics, `*`, `:`, parentheses, `&` ligatures, `#` overlays, `<-A1->` cartouches,
`\h` mirroring, rotations, blanks (`.` / `..`), lost signs (`/` / `//`), and shading.
Compatibility follows the pinned HieroJax MdC/JSesh subset, not every MdC dialect.

The source and canonical Unicode are stored separately. The SVG preview is only
visual output. Incomplete input retains the last valid Unicode and labels the
preview accordingly. Clearing resets the MdC source and output. Switching modes
preserves both the MdC draft and the existing candidate-mode input/output.

The Copy button and the output shortcut write canonical Unicode, including
format controls. Selecting/copying the preview writes the **whole preview**,
including all lines. Arbitrary partial composition selection is not implemented.
Selecting text in the MdC input allows normal source copying.

## Conversion limits

The UI warns when recognized syntax has known losses:

- Explicit scaling, elongation, gray/color styling, and ignored modifiers are
  omitted from the output/preview.
- Absolute placement, insertion zones, and ligatures use upstream mappings and
  heuristics; exact MdC geometry is not guaranteed.
- Rotations round to 45° increments, and standardized rotated variants are not
  available for every sign. Overlay conversion can discard sign modifiers.
- Certain upstream aliases (A133, A58B, R16B, T63B) use approximate equivalents.
- Layout/page directives and editorial brackets can be simplified or omitted.
  Unknown signs, unsupported text annotations/line numbers, private-use output,
  replacement characters, and invalid Unicode structures are rejected.

Warnings describe known losses, not a proof that every unwarned construct is
lossless. No proprietary characters are added to preserve unsupported geometry.

## Integration

- `convertMdcToUnicode.ts`: synchronous conversion with Unicode/warnings as its
  output; no browser, font, or generated DOM is needed for conversion.
- `mdcState.ts`: editing transitions, including last-valid-output retention.
- `MdcEditor.tsx`: mode UI, copy/clear actions, errors, and warnings.
- `MdcPreview.tsx` / `hierojaxAdapter.ts`: font readiness, SVG rendering, cleanup,
  and cancellation of stale asynchronous work. The adapter owns only its host's
  children. Display uses Inpu's existing left-to-right convention.
- `vendor/hierojax`: pinned upstream implementation, font, licenses and grammars.

HieroJax uses canvas internally to measure glyphs; the produced preview is SVG.
A future PDF exporter can use the Unicode conversion API without reading the
preview DOM. See [third-party notices](../THIRD_PARTY.md) for licensing and the
reproducible source assembly command.

## Validation

`npm test` runs conversion/state tests and jsdom UI tests for adapter lifecycle,
mode isolation, errors, and copying. Rendering is mocked in jsdom: those tests
cannot establish actual font shaping, SVG layout, or browser clipboard behavior.

The implementation was checked with TypeScript, ESLint, and a production build.
The emitted font and stylesheet/JavaScript asset references were inspected
statically. Behavioral tests and browser checks have not been run, in accordance
with this repository's static-first instructions.

Before calling browser compatibility verified, manually check vertical/horizontal
and nested quadrats, invalid-input recovery, mode switching, Ctrl/Cmd+C and
context-menu copying (including format controls), light/dark colors, font loading
failure, and the production deployment's asset paths in supported browsers.
