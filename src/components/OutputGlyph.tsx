import { HieroglyphModel } from '../models/Hieroglyph.type'

export interface OutputGlyphProps {
  hieroglyph: HieroglyphModel
  onHideDetails: () => void
  onShowDetails: (hieroglyph: HieroglyphModel, anchorElement: HTMLElement) => void
  onToggleDetails: (hieroglyph: HieroglyphModel, anchorElement: HTMLElement) => void
}

export function OutputGlyph({ hieroglyph, onHideDetails, onShowDetails, onToggleDetails }: OutputGlyphProps) {
  return (
    <span
      aria-label={`${hieroglyph.transliteration}, ${hieroglyph.gardiner_code}, ${hieroglyph.name}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggleDetails(hieroglyph, e.currentTarget)
      }}
      onMouseEnter={(e) => onShowDetails(hieroglyph, e.currentTarget)}
      onMouseLeave={onHideDetails}
    >
      {hieroglyph.glyph}
    </span>
  )
}
