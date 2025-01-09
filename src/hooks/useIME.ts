import { useState, useMemo } from 'react'
import { characterMapping } from '../assets/characters'
import { Trie } from '../util/Trie'


export function useIME() {
  const [inputString, setInputString] = useState('')
  const [outputString, setOutputString] = useState('')
  const trie = useMemo(() => new Trie(characterMapping), [] )

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    //setInputString(e.target.value)
    //
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

  return {
    inputString,
    setInputString,
    handleInput,
    handleKeyDown,
    outputString,
  }
}

