import { useState, useEffect, ChangeEvent } from 'react'
import { useDatabase } from './useDatabase'
import { HieroglyphModel } from '../models/Hieroglyph.type'

export enum InputMode {
  PHONOGRAM = "Phonogram",
  GARDINER = "Gardiner Code",
  KEYWORDS = "Keywords",
}



export function useIME() {

  const { 
    lookupInputTransliterationCandidates,
    lookupInputGardinerCandidates,
    lookupInputDescriptionCandidates,
  } = useDatabase()

  const InputLookupMethodMapping = {
    [InputMode.PHONOGRAM]: lookupInputTransliterationCandidates,
    [InputMode.GARDINER]: lookupInputGardinerCandidates,
    [InputMode.KEYWORDS]: lookupInputDescriptionCandidates,
  }

  const [inputString, setInputString] = useState<string>('')
  const [outputString, setOutputString] = useState<string>('')
  const [candidates, setCandidates] = useState<HieroglyphModel[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const [selectedInputMode, setSelectedInputModeState] = useState<InputMode>(InputMode.PHONOGRAM)

  useEffect(() => {
    setSelectedIndex(0)
  }, [candidates])


  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    const inputLookupMethod = InputLookupMethodMapping[selectedInputMode]
    const candidateObjects = inputLookupMethod(e.target.value)

    setCandidates(candidateObjects)
    setInputString(value)
  }

  function clearInput() {
    setInputString('')
    setCandidates([])
  }

  function clearOutput() {
    setOutputString('')
  }

  function setSelectedInputMode(inputMode: InputMode) {
    setSelectedInputModeState(inputMode)
    setCandidates(inputString ? InputLookupMethodMapping[inputMode](inputString) : [])
    setSelectedIndex(0)
  }

  function setSelectedCandidateIndex(index: number) {
    setSelectedIndex(index)
  }

  function selectCandidate(candidate: HieroglyphModel) {
    setOutputString(outputString + candidate.glyph)
    clearInput()
    setSelectedIndex(0)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if(candidates.length === 0) return;

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % candidates.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + candidates.length) % candidates.length)
        break
      case 'Enter':
        e.preventDefault()
        if(candidates[selectedIndex]) {
          selectCandidate(candidates[selectedIndex])
        }
        break
    }

  }

  return {
    onChange,
    inputString,
    outputString,
    clearInput,
    clearOutput,
    selectCandidate,
    candidates,
    selectedIndex,
    setSelectedCandidateIndex,
    handleKeyDown,
    selectedInputMode,
    setSelectedInputMode,
  }
}
