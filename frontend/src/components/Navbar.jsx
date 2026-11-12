import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import { navLinks } from '../data/content.js'

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link to="/" aria-label="Cyber Quest home">
          <img src={logo} alt="Cyber Quest" className="h-10 w-auto" />
        </Link>
        <nav className="flex gap-5 text-sm">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `border-b-2 pb-0.5 transition-colors ${
                  isActive
                    ? 'border-lime font-semibold text-black'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
