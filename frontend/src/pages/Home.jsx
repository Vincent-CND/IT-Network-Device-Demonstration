import { Link } from 'react-router-dom'
import FeedbackChart from '../components/FeedbackChart.jsx'
import robot from '../network/assets/robot.png'
import boxImage from '../assets/boxA.png'
import './home.css'

export default function Home() {
  return <div className="home-page">
    <section className="wrap hero" aria-labelledby="hero-title">
      <div>
      <div className="eyebrow">
      <span className="dot">
      </span> Your next adventure starts here</div>
      <h1 id="hero-title">Small quests.<br />Big <em>cyber skills.</em>
      </h1>
      <p className="lead">Step into the world of cybersecurity. Solve challenges, connect the dots, and learn something new with every mission.</p>
      <div className="actions">
      <a href="#missions" className="button">Explore missions </a>
      <a href="#about" className="button secondary">How it works</a>
      </div>
      <div className="micro">
      <span>Learn by doing</span>
      <span>Hints along the way</span>
      </div>
      </div>
      <div className="visual" role="img" aria-label="Cyber Quest’s friendly robot surrounded by an orbit and encouraging messages">
      <div className="orbit">
      </div>
      <img className="robot" src={robot} alt="" />
      <div className="float-label top">
      <b>
      <span className="symbol">✧</span> A little curiosity goes a long way.</b>
      <small>Ready when you are.</small>
      </div>
      <div className="float-label bottom">
      <b>Hey, explorer! 👋</b>
      <small>Let’s figure it out together.</small>
      </div>
      <span className="visual-tag">EXPLORE / EXPERIMENT / LEVEL UP</span>
      </div>
    </section>
    <div className="wrap">
      <div className="strip">
      <div className="strip-item">
      <span className="strip-num">01 /</span>
      <div>
      <strong>Choose your challenge</strong>
      <p>Find a mission that sparks your curiosity.</p>
      </div>
      </div>
      <div className="strip-item">
      <span className="strip-num">02 /</span>
      <div>
      <strong>Give it a go</strong>
      <p>Experiment, solve, and ask for a hint.</p>
      </div>
      </div>
      <div className="strip-item">
      <span className="strip-num">03 /</span>
      <div>
      <strong>Build your confidence</strong>
      <p>Take what you learn into the next quest.</p>
      </div>
      </div>
      </div>
      </div>
    <section id="missions" className="wrap" aria-labelledby="missions-title">
      <div className="section-top">
      <div>
      <div className="eyebrow">Choose your adventure</div>
      <h2 id="missions-title">Two ways to get curious.</h2>
      </div>
      <p>A challenge for your mind. A playground for your ideas. Where will you start?</p>
      </div>
      <div className="mission-grid">
      <article className="mission">
      <div className="mission-art">
      <span className="tag">QUEST / 01</span>
      <img className="chest" src={boxImage} alt="Glowing treasure chest" />
      <span className="art-caption">CURIOSITY IS THE KEY</span>
      </div>
      <div className="mission-body">
      <div className="mission-meta">
      <span className="level">Cybersecurity</span>
      <span>Question-based adventure</span>
      </div>
      <h3>Unlock the challenge.</h3>
      <p>Put your knowledge to the test, work through questions, and discover what’s inside the box.</p>
      <Link className="draft-route" to="/mission">Explore Cyber Quest</Link>
      </div>
      </article>
      <article className="mission">
      <div className="mission-art orange">
      <span className="tag">QUEST / 02</span>
      <svg className="network-diagram" viewBox="0 0 280 150" fill="none" aria-hidden="true">
      <path d="M140 47V80H45V108M140 80V108M140 80H235V108" stroke="#ffb078" strokeWidth="2"/>
      <circle cx="140" cy="80" r="4" fill="#ffb078"/>
      <rect x="105" y="15" width="70" height="33" rx="7" fill="#333d31" stroke="#ffb078"/>
      <path d="M119 31h26m7 0h8" stroke="#ffb078" strokeWidth="3"/>
      <path d="M116 15V5m48 10V5" stroke="#ffb078" strokeWidth="2"/>
      <g stroke="#c2ed69" fill="#27372c">
      <rect x="24" y="108" width="42" height="28" rx="4"/>
      <rect x="119" y="108" width="42" height="28" rx="4"/>
      <rect x="214" y="108" width="42" height="28" rx="4"/>
      <path d="M45 136v7m-12 0h24m83-7v7m-12 0h24m83-7v7m-12 0h24"/>
      </g>
      <circle cx="61" cy="70" r="3" fill="#ffb078"/>
      <circle cx="218" cy="46" r="3" fill="#c2ed69"/>
      </svg>
      <span className="art-caption">MAKE THE CONNECTION</span>
      </div>
      <div className="mission-body">
      <div className="mission-meta">
      <span className="level warm">Networking</span>
      <span>Hands-on building</span>
      </div>
      <h3>Connect your world.</h3>
      <p>Build a network, choose your connections, and bring it all together in the cable challenge.</p>
      <Link className="draft-route orange-link" to="/network/1">Explore Network Builder</Link>
      </div>
      </article>
    </div>
      </section>
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap about-grid">
      <div>
      <div className="eyebrow">A little play. A lot to discover.</div>
      <h2 id="about-title">Complex ideas.<br />Lightbulb moments.</h2>
      <p>Cyber Quest turns technical topics into small, approachable challenges. Bring your curiosity. We’ll bring the adventure.</p>
      </div>
      <div>
      <div className="about-detail">
      <span>01</span>
      <div>
      <h3>Learn through exploration.</h3>
      <p>Go beyond reading about technology. Answer questions and build connections to see ideas in action.</p>
      </div>
      </div>
      <div className="about-detail">
      <span>02</span>
      <div>
      <h3>You don’t have to know it all.</h3>
      <p>Take it one step at a time. Use hints when you need them and give yourself room to figure things out.</p>
      </div>
      </div>
      </div>
      </div>
      </section>
    <div className="wrap" id="player-ratings">
      <FeedbackChart />
    </div>
    <section className="wrap team-section" id="team" aria-labelledby="team-title">
      <div className="team-top">
      <h2 id="team-title">The people behind the quest.</h2>
      <p>Team details to be added before launch.</p>
      </div>
      <div className="team-grid">
      <div className="member">
      <span className="avatar" aria-hidden="true">01</span>
      <div>
      <b>Team member</b>
      <small>Name &amp; role coming soon</small>
      </div>
      </div>
      <div className="member">
      <span className="avatar" aria-hidden="true">02</span>
      <div>
      <b>Team member</b>
      <small>Name &amp; role coming soon</small>
      </div>
      </div>
      <div className="member">
      <span className="avatar" aria-hidden="true">03</span>
      <div>
      <b>Team member</b>
      <small>Name &amp; role coming soon</small>
      </div>
      </div>
      </div>
      </section>
  </div>
}
