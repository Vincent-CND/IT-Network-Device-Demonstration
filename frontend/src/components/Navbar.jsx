import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Navbar() {
  const { pathname } = useLocation()
  return <header className="site-header"><div className="wrap header-inner">
    <Link to="/" className="brand" aria-label="Cyber Quest home"><img src={logo} alt="" /><span>CYBER QUEST</span></Link>
    <nav className="site-nav" aria-label="Main navigation">
      {[
        ['/mission', 'Cyber Quiz', pathname === '/mission' || pathname === '/game'],
        ['/network/1', 'Network Builder', pathname.startsWith('/network')],
        ['/feedback', 'Feedback', pathname === '/feedback'],
      ].map(([to, label, active]) => <Link key={to} to={to} aria-current={active ? 'page' : undefined}>{label}</Link>)}
    </nav>
  </div></header>
}
