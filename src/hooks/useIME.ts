import { useState, useEffect } from 'react'
import { useDatabase } from './useDatabase'

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
  const [candidates, setCandidates] = useState<any[]>([])

  useEffect(() => {console.log({candidates: JSON.stringify(candidates, null, 2)})}, [candidates])
  useEffect(() => {console.log({inputString})}, [inputString])
  useEffect(() => {console.log({outputString})}, [outputString])

  function onChange(e: any) {
    e.preventDefault()

    const candidateObjects = lookupInputTransliterationCandidates(e.target.value).map(candidate => candidate.glyph)
    setCandidates(candidateObjects)
    setInputString(e.target.value)
  }

  function clearInput() {
    setInputString('')
    setCandidates([])
  }

  function selectCandidate(candidate: string) {
    console.log('candidate selected: ', candidate)
    setOutputString(outputString + candidate)
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

