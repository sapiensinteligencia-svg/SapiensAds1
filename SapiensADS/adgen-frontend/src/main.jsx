import { StrictMode, useState } from 'react'
import { createRoot }           from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App              from './App.jsx'
import LoginPage        from './pages/LoginPage.jsx'
import AuthCallbackPage from './pages/AuthCallbackPage.jsx'
import SplashScreen     from './components/SplashScreen.jsx'

function Root() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <div className="relative">
      {/* App siempre renderizada detrás */}
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<App />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </BrowserRouter>

      {/* Splash encima hasta que termina */}
      {!splashDone && (
        <SplashScreen onFinish={() => setSplashDone(true)} />
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)