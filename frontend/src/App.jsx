import { useEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Mission from './pages/Mission.jsx'
import Game from './pages/Game.jsx'
import Feedback from './pages/Feedback.jsx'
import { networkRoutes } from './network/routes.jsx'

function SiteLayout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else {
      window.scrollTo(0, 0)
      document.getElementById('content')?.focus({ preventScroll: true })
    }
  }, [pathname, hash])
  return <div className="app-shell">
    <a className="skip" href="#content">Skip to content</a>
    <Navbar />
    <main id="content" tabIndex={-1}><Outlet /></main>
    <Footer />
  </div>
}

export default function App() {
  return <Routes>
    <Route element={<SiteLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/mission" element={<Mission />} />
      <Route path="/game" element={<Game />} />
      <Route path="/feedback" element={<Feedback />} />
      {networkRoutes}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
}
