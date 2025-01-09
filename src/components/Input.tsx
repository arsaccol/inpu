import { useIME } from '../hooks/useIME'

function Input() {
  const { handleInput, handleKeyDown, outputString } = useIME()

  return (
    <div>
      <h1>{ outputString }</h1>
      <input onChange={handleInput} onKeyDown={handleKeyDown}>
      </input>
    </div>
  )
}

export {
  Input,
}

