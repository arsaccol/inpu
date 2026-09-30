// Rebuild the isolated ESM bundle from a local checkout of the pinned upstream.
// This script assembles source files; it does not execute HieroJax.
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

const revision = 'da318801e00b10b4b5c5ec8d9cc6f8fddcc9eb5a'
const upstream = process.argv[2]
if (!upstream) throw new Error('Usage: node scripts/vendor-hierojax.mjs /path/to/hierojax')
if (execFileSync('git', ['-C', upstream, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() !== revision) {
  throw new Error(`Expected HieroJax revision ${revision}`)
}

const destination = resolve('src/mdc/vendor/hierojax')
await mkdir(destination, { recursive: true })
const files = [
  'util.js', 'syntax.js', 'formatting.js', 'insertions.js',
  'standardizedvariants.js', 'ligatures.js', 'unipoints.js', 'extpoints.js',
  'mdcnames.js', 'mdcnamesunikemet.js', 'mdcmnemonics.js', 'mdcligatures.js',
  'mdcstructure.js', 'mdcsyntax.js',
]
const sections = [`/*! HieroJax — GPL-3.0; https://github.com/nederhof/hierojax
 * Upstream: ${revision}
 * Assembled for Inpu by scripts/vendor-hierojax.mjs. See THIRD_PARTY.md.
 * Original source retained below; CommonJS CLI footers removed for ESM.
 */`]
for (const file of files) {
  let source = await readFile(resolve(upstream, 'src', file), 'utf8')
  if (file === 'syntax.js' || file === 'mdcsyntax.js') {
    const marker = "if (typeof require !== 'undefined' && typeof exports !== 'undefined')"
    if (!source.includes(marker)) throw new Error(`Missing expected CLI footer: ${file}`)
    source = source.slice(0, source.indexOf(marker))
  }
  sections.push(`// Upstream src/${file}\n${source}`)
}
sections.push(`// Inpu ESM bridge; upstream's auto-starting main.js and page controller are excluded.
export { mdcsyntax, syntax, MdcFragment, MdcSign, mdcNames, mdcNamesUniKemet, Shapes };
`)
await writeFile(resolve(destination, 'runtime.js'), sections.join('\n\n'))
await copyFile(resolve(upstream, 'LICENSE'), resolve(destination, 'LICENSE'))
await copyFile(resolve(upstream, 'docs/hierojax.css'), resolve(destination, 'hierojax.css'))
await copyFile(resolve(upstream, 'docs/NewGardiner.otf'), resolve(destination, 'NewGardiner.otf'))
for (const grammar of ['syntax.jison', 'mdcsyntax.jison']) {
  await copyFile(resolve(upstream, 'src', grammar), resolve(destination, grammar))
}
