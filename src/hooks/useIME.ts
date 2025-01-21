import { useState } from 'react'
import { useDatabase } from './useDatabase'
import { HieroglyphModel } from '../models/Hieroglyph.type'

//enum InputModes {
//  PHONOGRAM,
//  GARDINER,
//  KEYWORDS,
//}


export function useIME() {

  const { 
    lookupInputTransliterationCandidates,
  } = useDatabase()

  const [inputString, setInputString] = useState<string>('')
  const [outputString, setOutputString] = useState<string>('')
  const [candidates, setCandidates] = useState<HieroglyphModel[]>([])


  function onChange(e: any) {
    e.preventDefault()

    const candidateObjects = lookupInputTransliterationCandidates(e.target.value)
    setCandidates(candidateObjects)
    setInputString(e.target.value)
  }

  function clearInput() {
    setInputString('')
    setCandidates([])
  }

  function selectCandidate(candidate: HieroglyphModel) {
    setOutputString(outputString + candidate.glyph)
    clearInput()
  }

  return {
    onChange,
    inputString,
    outputString,
    clearInput,
    selectCandidate,
    candidates,
  }
}

