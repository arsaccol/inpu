// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
import {
  mdcsyntax, MdcFragment, MdcSign, mdcNames, mdcNamesUniKemet, Shapes, syntax,
} from './vendor/hierojax/runtime.js'

export interface MdcConversion {
  unicode: string
  warnings: string[]
}

class MdcInputError extends Error {}

const tokenWarnings: Record<string, string> = {
  'SCALE-PERCENTAGE': 'Explicit scaling is omitted from Unicode.',
  'GRAY-GLYPH': 'Gray styling is omitted from Unicode.',
  'ELONGATE-GLYPH': 'Explicit elongation is omitted from Unicode.',
  'IGNORED-MODIFIER': 'An unsupported modifier is omitted from Unicode.',
  ABSOLUTE: 'Absolute positioning and sizing are approximated using Unicode insertions.',
  'ABSOLUTE-CONTINUATION': 'Absolute positioning and sizing are approximated using Unicode insertions.',
  LIGATURE: 'Ligature placement follows HieroJax mappings and heuristics; exact MdC geometry may differ.',
  'ZONE-PRE': 'Insertion placement is approximated using Unicode insertion positions.',
  'ZONE-POST': 'Insertion placement is approximated using Unicode insertion positions.',
  'ROTATE-DEGREES': 'Rotations are rounded to 45° increments; not every sign has a standardized rotated variant.',
  'ROTATE-90': 'Not every sign has a standardized rotated variant.',
  'ROTATE-180': 'Not every sign has a standardized rotated variant.',
  'ROTATE-270': 'Not every sign has a standardized rotated variant.',
  'ROTATE-90-MIRROR': 'Not every sign has a standardized rotated variant.',
  'ROTATE-180-MIRROR': 'Not every sign has a standardized rotated variant.',
  'ROTATE-270-MIRROR': 'Not every sign has a standardized rotated variant.',
  'RED-GLYPH': 'Color instructions are omitted from the Unicode output and preview.',
  'COLOR-TOGGLE': 'Color instructions are omitted from the Unicode output and preview.',
  RED: 'Color instructions are omitted from the Unicode output and preview.',
  BLACK: 'Color instructions are omitted from the Unicode output and preview.',
  BREAK: 'MdC layout breaks are simplified; use newlines to separate lines.',
  TAB: 'Tab and spacing directives are omitted from Unicode.',
  ZONE: 'Zone directives are omitted from Unicode.',
  ARROW: 'Arrow directives are omitted from Unicode.',
  LACUNA: 'The ? lacuna marker is omitted upstream; use / or // for Unicode lost signs.',
  OMIT: 'Omission markers are omitted from Unicode.',
  EQUALS: 'Grammatical markers are omitted from Unicode.',
  'BRACKET-OPEN': 'Editorial brackets may be simplified or discarded by the converter.',
  'BRACKET-CLOSE': 'Editorial brackets may be simplified or discarded by the converter.',
}

// Inspect actual upstream tokens, not regex matches inside annotations/sign names.
function inspectTokens(source: string, warnings: Set<string>) {
  const lexer = Object.create(mdcsyntax.lexer) as typeof mdcsyntax.lexer
  lexer.setInput(source, {})
  let hasOverlay = false
  let hasModifier = false
  for (;;) {
    const token = lexer.lex()
    const kind = typeof token === 'number' ? mdcsyntax.terminals_[token] : token
    if (token === lexer.EOF || kind === 'EOF') break
    if (kind === 'TEXT' || kind === 'LINE-NUMBER') {
      throw new MdcInputError('Text annotations and line numbers are not supported in this MdC mode.')
    }
    if (kind === 'SIGN') {
      const name = lexer.yytext
      if (!Object.prototype.hasOwnProperty.call(mdcNames, name) && !Object.prototype.hasOwnProperty.call(mdcNamesUniKemet, name)
        && MdcSign.nameToChar(name) === Shapes.PLACEHOLDER) {
        throw new MdcInputError(`Unknown sign “${name}”.`)
      }
      if (['A133', 'A58B', 'R16B', 'T63B'].includes(name)) {
        warnings.add(`“${name}” maps to an approximate Unicode sign.`)
      }
    }
    if (tokenWarnings[kind]) warnings.add(tokenWarnings[kind])
    hasOverlay ||= kind === 'OVERLAY-SINGLE' || kind === 'OVERLAY-DOUBLE'
    hasModifier ||= kind === 'MIRROR' || kind.startsWith('ROTATE-') || kind === 'GLYPH-SHADE'
  }
  if (hasOverlay && hasModifier) {
    warnings.add('Individual sign modifiers may be discarded inside overlays.')
  }
}

/** Pure, synchronous conversion. No font, browser DOM, or preview is needed. */
export function convertMdcToUnicode(source: string): MdcConversion {
  if (!source.trim()) return { unicode: '', warnings: [] }
  const warnings = new Set<string>()
  try {
    const lines = source.replace(/\r\n?/g, '\n').split('\n')
    const converted = lines.map((line, index) => {
      if (!line.trim()) return ''
      try {
        inspectTokens(line, warnings)
        const parsed = mdcsyntax.parse(`${line}\n`)
        return parsed.parts.map(part => {
          if (!(part instanceof MdcFragment)) {
            throw new MdcInputError('Only hieroglyphic MdC fragments are supported.')
          }
          const unicode = part.toString()
          if (/[\uFFFD\uE000-\uF8FF\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]/u.test(unicode)) {
            throw new MdcInputError('This composition contains a sign without a supported Unicode mapping.')
          }
          // Reject upstream output that cannot be consumed by the Unicode renderer.
          // This parses structure only; it does not measure or render glyphs.
          if (unicode) syntax.parse(unicode)
          return unicode
        }).join('\n')
      } catch (error) {
        const message = error instanceof MdcInputError
          ? error.message
          : 'Incomplete or invalid MdC. Check sign codes, operators, and closing brackets.'
        throw new MdcInputError(`Line ${index + 1}: ${message}`)
      }
    })
    return { unicode: converted.join('\n'), warnings: [...warnings] }
  } catch (error) {
    if (error instanceof MdcInputError) throw error
    throw new MdcInputError('Could not convert this MdC composition.')
  }
}
