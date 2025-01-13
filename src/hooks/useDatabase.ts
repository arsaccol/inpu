import initSqlJs from 'sql.js';
import { Database } from 'sql.js'
import schema from '../assets/schema.sql?raw';
import hieroglyph_data from '../assets/hieroglyph_data.sql?raw';

import { useState, useEffect } from 'react'

export function useDatabase() {
  const [database, setDatabase] = useState<Database | null>(null)



  useEffect(() => {
    (async function() {
      const SQL = await initSqlJs({
        locateFile: (_) => '/sql-wasm.wasm'
      })

      const db = new SQL.Database()
      if(!db) throw new Error("Could not initialize database");
      setDatabase(db)

      db.run(schema)
      db.run(hieroglyph_data)
    })()

  }, [])

  function lookupInputTransliteration(inputTransliteration: string) {
    if(!database) throw new Error("Database not initialized before performing query")
    const result = database.exec(`select * from hieroglyphs where input_transliteration = '${inputTransliteration}'`)
    return result
  }

  return {
    lookupInputTransliteration,
  }


}
