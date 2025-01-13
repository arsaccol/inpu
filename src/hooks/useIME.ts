import { useState, useMemo } from 'react'
import { characterMapping } from '../assets/characters'
import { Trie } from '../util/Trie'
import database, { lookupTransliteration } from '../util/db'



export function useIME() {
  const [inputString, setInputString] = useState('')
  const [outputString, setOutputString] = useState('')
  const [candidates, _] = useState(['option 0', 'option 1', 'option 2', 'option 3'])
  const trie = useMemo(() => new Trie(characterMapping), [] )


  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInputString(e.target.value)

    const result = lookupTransliteration(database, e.target.value.slice(-1))[0]

    console.log(JSON.stringify(result?.values, null, 2))
    //console.log('number of results: ', result?.values?.length)
    
    const newInput = e.target.value
    const newOutput = trie.transliterate(newInput)
    setInputString(newInput)
    setOutputString(newOutput)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.key == 'Backspace') {
      const newInput = inputString.slice(0, -1)
      const newOutput = trie.transliterate(newInput)
      setInputString(newInput)
      setOutputString(newOutput)
    }
  }

  function selectCandidate(candidate: string) {
    console.log(`Candidate "${candidate}" selected`)
    setInputString(candidate)
    setOutputString(candidate)
    //setCandidates([])
  }

  return {
    inputString,
    setInputString,
    handleInput,
    handleKeyDown,
    outputString,
    candidates,
    selectCandidate,
  }
}

