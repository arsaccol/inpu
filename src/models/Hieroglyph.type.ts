export enum HieroglyphCategory {
  UNILITERAL = 'uniliteral', 
  BILITERAL = 'biliteral',
  TRILITERAL = 'triliteral',
  DETERMINATIVE = 'determinative',
  IDEOGRAPHIC = 'ideographic',
  OTHER = 'other',
}

export type HieroglyphModel = {
  id: number;
  glyph: string;
  transliteration: string;
  input_transliteration: string;
  description_words?: string;
  name: string;
  category: HieroglyphCategory;
  gardiner_code: string;
  gardiner_group: string;
  composing_glyphs?: string;
}

