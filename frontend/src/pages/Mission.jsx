import { Link } from 'react-router-dom'
import boxImage from '../assets/boxA.png'
import { getStep } from '../api/client.js'
import useResource from '../hooks/useResource.js'
import LoadState from '../components/LoadState.jsx'

const TITLES = ['Read the mission', 'Start at question one', 'Use a hint if you get stuck', 'Unlock the next question', 'Finish the quiz']
const loadSteps = () => Promise.all([1, 2, 3, 4, 5].map(async id => (await getStep(id)).message))

export default function Mission() {
  const resource = useResource(loadSteps)
  return <section className="wrap page" aria-labelledby="mission-title">
    <Link className="back" to="/#missions">← All missions</Link>
    <div className="brief-hero">
      <div><p className="eyebrow">Cyber Quiz · Mission briefing</p><h1 id="mission-title">Unlock the challenge.</h1>
        <p className="intro">Two boxes stand between you and the next quest. Review the steps, then put your cybersecurity knowledge to the test.</p>
        <Link className="button primary" to="/game">Start the quiz</Link>
      </div>
      <div className="chest-stage" aria-hidden="true">{['BOX A', 'BOX B'].map(label => <div className="chest-unit" key={label}><img src={boxImage} alt="" /><span>{label}</span></div>)}</div>
    </div>
    <div className="brief-details">
      <div><h2>Five steps to get ready</h2><p>Open each step to see what to do.</p></div>
      <div className="steps"><LoadState {...resource} />{resource.data?.map((text, i) => <details key={i} open={i === 0}><summary><span>0{i + 1}</span>{TITLES[i]}</summary><p>{text}</p></details>)}</div>
    </div>
  </section>
}
