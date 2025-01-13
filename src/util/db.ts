import initSqlJs from 'sql.js'
import { Database } from 'sql.js'
import schema from '../assets/schema.sql?raw'
import hieroglyph_data from '../assets/hieroglyph_data.sql?raw'

async function loadSqlJs() {
  const SQL = await initSqlJs({
    locateFile: (_) => '/sql-wasm.wasm',
  })

  return SQL
}


function lookupTransliteration(db: Database, inputTransliteration: string) {
  const result = db.exec(`select * from hieroglyphs where input_transliteration = '${inputTransliteration}'`)
  //const statement = db.prepare(`
  //  select * from hieroglyph
  //`)

  //const result = statement.getAsObject({ ':translit': transliteration })

  return result
}

const SQL = await loadSqlJs()
const database = new SQL.Database()



database.run(schema)
database.run(hieroglyph_data)



export {
  lookupTransliteration,
}

export default database


