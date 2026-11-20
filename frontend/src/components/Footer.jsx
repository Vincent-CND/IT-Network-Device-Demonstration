import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer className="site-footer"><div className="wrap footer-inner">
    <strong>CYBER QUEST<span>.</span></strong>
    <p>Made for curious minds.</p>
    <Link to="/#missions">Explore missions</Link>
  </div></footer>
}
