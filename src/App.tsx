import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Input } from './components/Input'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1> 𓇋𓈖𓊪𓅱</h1>
      <h1>Hieroglyphics keyboard (pre-alpha I guess) </h1>
      <div>Only uniliterals are implemented for now, and not quite completely, but do look forward for more updates!</div>
      <Input/>
    </>
  )
}

export default App
