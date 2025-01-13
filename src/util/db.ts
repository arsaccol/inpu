import initSqlJs from 'sql.js'
import { Database } from 'sql.js'

async function loadSqlJs() {
  const SQL = await initSqlJs({
    locateFile: (_) => '/sql-wasm.wasm',
  })

  return SQL
}

const schema = `
  CREATE TABLE IF NOT EXISTS hieroglyph (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    glyph TEXT NOT NULL, 
    transliteration TEXT NOT NULL, 
    visual_description TEXT, 
    category TEXT NOT NULL CHECK (category IN ('uniliteral', 'biliteral', 'triliteral', 'determinative', 'ideographic', 'other')), 
    gardiner_code TEXT NOT NULL, 
    composing_elements TEXT 
  );
`

const dataInsertion = `
  INSERT INTO hieroglyph (glyph, transliteration, visual_description, category, gardiner_code, composing_elements)
  VALUES
  -- Example 1: Uniliteral (single sound)
  ('𓅱', 'w', 'bird;reed', 'uniliteral', 'G43', NULL),

  -- Example 2: Biliteral (two uniliteral hieroglyphs)
  ('𓃀', 'b', 'ram;curved horns', 'biliteral', 'E11', '𓅱;𓃀'),

  -- Example 3: Triliteral (three uniliteral hieroglyphs)
  ('𓏏𓈇', 't', 'land;flat terrain', 'triliteral', 'N16', '𓅱;𓃀;𓏏'),

  -- Example 4: Ideographic (no composing elements needed)
  ('𓆗', 'xpr', 'scarab;beetle', 'ideographic', 'L1', NULL),

  -- Example 5: Determinative (no composing elements needed)
  ('𓀀', 'z', 'seated man;human figure', 'determinative', 'A1', NULL),

  -- Example 6: Another composite (biliteral made of two uniliterals)
  ('𓆑𓄿𓇋', 'fai', 'snake;looped body', 'triliteral', 'I10', '𓅱;𓃀;𓆑');
`

function lookupTransliteration(db: Database, transliteration: string) {
  const result = db.exec(`select * from hieroglyph where transliteration like '${transliteration}'`)
  //const statement = db.prepare(`
  //  select * from hieroglyph
  //`)

  //const result = statement.getAsObject({ ':translit': transliteration })

  return result
}

const SQL = await loadSqlJs()
const database = new SQL.Database()



database.run(schema)
database.run(dataInsertion)



export {
  lookupTransliteration,
}

export default database


