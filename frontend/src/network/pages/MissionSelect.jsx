import { Link } from 'react-router-dom'
import robot from '../assets/robot.png'
import { getMissionInstructions } from '../api.js'
import useResource from '../../hooks/useResource.js'
import LoadState from '../../components/LoadState.jsx'

const TITLES = ['Explore the mission', 'Choose your devices', 'Connect your network', 'Take on the challenge']

export default function MissionSelect() {
  const resource = useResource(getMissionInstructions)
  return <section className="wrap page" aria-labelledby="network-title">
    <Link className="back" to="/#missions">← All missions</Link>
    <div className="page-heading"><div><p className="eyebrow warm">Network Builder · Mission briefing</p><h1 id="network-title">Connect your world.</h1><p className="intro">Build a network and check how the devices connect. Then take on the cable challenge.</p></div><Link className="button primary" to="/network/1/build">Start mission</Link></div>
    <div className="game-grid network-brief">
      <div className="steps" aria-label="Mission steps"><LoadState {...resource} />{resource.data?.map((text, i) => <details key={i} open={i === 0}><summary><span>0{i + 1}</span>{TITLES[i]}</summary><p>{text}</p></details>)}</div>
      <aside className="panel guide"><img src={robot} alt="" /><div><h2>Need a hand?</h2><p>Look for the hint button while you’re building.</p></div></aside>
    </div>
  </section>
}
