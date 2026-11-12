import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Mission from './pages/Mission.jsx'
import Game from './pages/Game.jsx'
import Feedback from './pages/Feedback.jsx'
import { networkRoutes } from './network/routes.jsx'

// Pages that share the navbar + footer.
function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/feedback" element={<Feedback />} />
      </Route>
      {/* The game screen has its own full-screen layout (no navbar/footer) */}
      <Route path="/game" element={<Game />} />
      {/* Network Builder game (src/network) */}
      {networkRoutes}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}