import logo from '../assets/logo.png'
import { footerLinks } from '../data/content.js'

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <img src={logo} alt="Cyber Quest" className="h-10 w-auto" />
        <nav className="flex flex-wrap justify-end gap-4 text-sm text-gray-600">
          {footerLinks.map(({ label, href }) => (
            <a key={label} href={href} className="hover:text-black">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
