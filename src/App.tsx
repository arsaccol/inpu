import './App.css'
import { MaterialIME } from './components/MaterialIME'
import { Typography } from '@mui/material'


function App() {
  return (
    <>
      <div>
        <h1>𓇋𓈖𓊪𓅱 (α)</h1>
        Hieroglyph input for the modern scribe.
      </div>
          <Typography sx={{fontSize: '12px'}}>
            <a 
              href="https://forms.gle/iGvfAd5toML9Gxt57" 
              target="blank"

            >
              Feedback? Tell us your thoughts!
            </a>
        </Typography>
      <MaterialIME/>
    </>

  )
}

export default App
