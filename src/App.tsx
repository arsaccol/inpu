import './App.css'
import { MaterialIME } from './components/MaterialIME'
import { Link, Route, Routes } from 'react-router-dom'
import { Button, Stack, Typography } from '@mui/material'
import { ReviewPage } from './pages/ReviewPage'

function HomePage() {
  return (
    <>
      <div>
        <h1>𓇋𓈖𓊪𓅱𓏟 (α)</h1>
        Hieroglyphic computer input for the modern scribe.
      </div>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 0.5 }}>
          <Typography sx={{fontSize: '12px'}}>
            <a 
              href="https://forms.gle/iGvfAd5toML9Gxt57" 
              target="blank"

            >
              Feedback? Tell us your thoughts!
            </a>
          </Typography>
          <Typography color="text.secondary" aria-hidden="true">·</Typography>
          <Button component={Link} to="/review" size="small" variant="text" sx={{ fontSize: '12px', minWidth: 0, p: 0 }}>
            Review database
          </Button>
        </Stack>
      <MaterialIME/>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/review" element={<ReviewPage />} />
    </Routes>
  )
}

export default App
