import { useState } from 'react'

function Input() {
  const [inputState, setInputState] = useState('')

  function inputHandler(e) {
    setInputState(e.target.value)
  }

  return (
    <div>
      <h1>{ inputState }</h1>
      <input onChange={inputHandler}>
      </input>
    </div>
  )
}

export {
  Input,
}

