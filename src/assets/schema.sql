DROP TABLE IF EXISTS hieroglyphs;
CREATE TABLE hieroglyphs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  glyph TEXT NOT NULL, 
  transliteration TEXT NOT NULL, 
  input_transliteration TEXT NOT NULL,
  description_words TEXT, 
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('uniliteral', 'biliteral', 'triliteral', 'determinative', 'ideographic', 'other')), 
  gardiner_code TEXT NOT NULL, 
  gardiner_group TEXT NOT NULL,
  composing_glyphs TEXT 
);

