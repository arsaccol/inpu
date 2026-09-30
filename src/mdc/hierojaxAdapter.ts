import { syntax } from './vendor/hierojax/runtime.js'
import fontUrl from './vendor/hierojax/NewGardiner.otf?url'
import './vendor/hierojax/hierojax.css'

let fontReady: Promise<void> | undefined

export function loadHieroglyphicFont(): Promise<void> {
  if (!fontReady) {
    fontReady = (async () => {
      // CSS and FontFace use the same Vite-managed asset, including on relative deployments.
      const loaded = await document.fonts.load('48px Hieroglyphic', '𓀀')
      // check() alone may succeed when no matching face exists (system fallback).
      if (loaded.length === 0) {
        const font = new FontFace('Hieroglyphic', `url("${fontUrl}")`)
        document.fonts.add(await font.load())
      }
    })().catch(error => {
      fontReady = undefined
      throw error
    })
  }
  return fontReady
}

/** Called only after the bundled font is ready. Owns children of the passed host. */
export function renderHieroglyphicUnicode(host: HTMLElement, unicode: string) {
  host.replaceChildren()
  const content = document.createDocumentFragment()
  for (const line of unicode.split('\n')) {
    const row = document.createElement('div')
    row.style.minHeight = '1.5em'
    if (line) {
      syntax.parse(line).print(row, {
        type: 'svg',
        dir: 'hlr',
        fontsize: 48,
        signcolor: 'currentColor',
        bracketcolor: 'currentColor',
        separated: 'true',
      })
    }
    content.appendChild(row)
  }
  host.appendChild(content)
}
