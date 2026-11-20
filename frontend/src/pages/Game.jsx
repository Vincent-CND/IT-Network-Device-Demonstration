import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getQuestion, checkAnswer } from '../api/client.js'
import useResource from '../hooks/useResource.js'
import LoadState from '../components/LoadState.jsx'
import MessageDialog from '../components/MessageDialog.jsx'

const QUESTION_IDS = [1, 2, 3, 4]
const loadQuestions = () => Promise.all(QUESTION_IDS.map(getQuestion))

export default function Game() {
  const resource = useResource(loadQuestions)
  const [solved, setSolved] = useState(0)
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState(null)
  const question = resource.data?.[solved]
  const complete = solved === QUESTION_IDS.length

  async function submit(event) {
    event.preventDefault()
    if (!question || !answer.trim() || pending.current) return
    pending.current = true
    setBusy(true)
    setStatus('')
    try {
      const result = await checkAnswer(question.answerId, answer.trim())
      if (result.correct) {
        setSolved(value => value + 1)
        setAnswer('')
        setStatus('Correct! The next question is ready.')
      } else setStatus('Not quite. Try again, or use a hint for a clue.')
    } catch { setStatus('Could not check your answer. Please try again.') }
    finally { pending.current = false; setBusy(false) }
  }

  return <section className="wrap page" aria-labelledby="game-title">
    <Link className="back" to="/mission">← Mission briefing</Link>
    <div className="page-heading"><div><p className="eyebrow">Cyber Quiz</p><h1 id="game-title">Unlock the challenge.</h1><p className="intro">Answer one question at a time. Each correct answer unlocks the next.</p></div>
      <div className="progress-card"><label htmlFor="quiz-progress">Quiz progress <span>{solved} of 4 solved</span></label><progress id="quiz-progress" value={solved} max="4" /></div>
    </div>
    <div className="game-grid">
      <article className="panel question" aria-busy={resource.loading || busy}>
        <LoadState {...resource} />
        {question && <><p className="eyebrow">Question {solved + 1} of 4</p><h2 id="question-text">{question.text}</h2>
          <form onSubmit={submit}><label htmlFor="answer">Your answer</label>
            <input id="answer" type="text" placeholder="Type your answer" aria-describedby="question-text quiz-status" value={answer} onChange={event => setAnswer(event.target.value)} required disabled={busy} autoComplete="off" />
            <p className="status" id="quiz-status" role="status">{status}</p>
            <div className="actions"><button className="button secondary" type="button" onClick={() => setMessage({ title: 'A little hint', text: question.hint || 'No hint is available for this question.' })}>Show hint</button>
              <button className="button primary" disabled={busy || !answer.trim()}>{busy ? 'Checking…' : 'Check answer'}</button></div>
          </form></>}
        {complete && <div id="quiz-complete" role="status"><p className="eyebrow">Mission complete</p><h2>All four answers are correct.</h2><p>You’re ready for the next mission.</p><button className="button primary" onClick={() => setMessage({ title: 'Congratulations!', text: 'You solved every question. Build your network in the next quest.', to: '/network/1', action: 'Continue to Network Builder' })}>Submit quiz</button></div>}
      </article>
      <aside className="panel quiz-path" aria-labelledby="quiz-path-title"><h2 id="quiz-path-title">Questions</h2><ol>{QUESTION_IDS.map((id, i) => <li key={id} aria-current={i === solved ? 'step' : undefined} data-solved={i < solved ? '' : undefined}><span>0{id}</span>Question {id}<small>{i < solved ? 'Solved' : i === solved ? 'In progress' : 'Locked'}</small></li>)}</ol></aside>
    </div>
    <MessageDialog message={message} onClose={() => setMessage(null)} />
  </section>
}
