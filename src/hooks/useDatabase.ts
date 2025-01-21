import initSqlJs from 'sql.js';
import { Database } from 'sql.js'
import schema from '../assets/schema.sql?raw';
import hieroglyph_data from '../assets/hieroglyph_data.sql?raw';
import { useState, useEffect } from 'react'
import { HieroglyphModel } from '../models/Hieroglyph.type';

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

  function databaseLookup(query: string) {
    if(!database) throw new Error("Database not initialized before performing query")
    const results = database.exec(query)
    if(results.length === 0) return []

    // massage data into proper objects before returning
    const { columns, values } = results[0]
    const objects = []

    for(const val of values) {
      const object: any = {}
      for(let i = 0; i < columns.length; i++) {
        object[columns[i]] = val[i]
      }

      objects.push(object)
    }

    return objects
  }

  function lookupInputTransliteration(inputTransliteration: string) {
    if(!database) throw new Error("Database not initialized before performing query")
    const result = database.exec(`select * from hieroglyphs where input_transliteration = '${inputTransliteration}'`)
    return result
  }

  function lookupInputTransliterationCandidates(input: string): HieroglyphModel[] {
    if(input.trim() === '') return []
    const query = `select * from hieroglyphs where input_transliteration like '${input}%'`
    const result: HieroglyphModel[] = databaseLookup(query)
    return result
  }

  return {
    lookupInputTransliteration,
    lookupInputTransliterationCandidates,
  }


}
