import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import robot from '../network/assets/robot.png'
import { FEEDBACK_CRITERIA, sendFeedback } from '../api/client.js'

const RATINGS = [['☹', 'Very poor'], ['☹', 'Poor'], ['⊖', 'Okay'], ['☺', 'Good'], ['☻', 'Excellent']]

export default function Feedback() {
  const [ratings, setRatings] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const pending = useRef(false)
  const complete = FEEDBACK_CRITERIA.every(([key]) => ratings[key])

  async function submit(event) {
    event.preventDefault()
    if (pending.current || !complete) return
    pending.current = true
    setStatus('sending')
    setError('')
    try {
      await sendFeedback(ratings)
      setStatus('sent')
    } catch (failure) {
      setStatus('idle')
      setError(failure.status === 404 ? 'Feedback submission is currently unavailable. Your ratings were not sent.' : 'Could not send your feedback. Please try again.')
    } finally { pending.current = false }
  }

  return <section className="wrap page" aria-labelledby="feedback-title">
    <Link className="back" to="/">← Home</Link>
    <div className="feedback-grid">
      <div className="feedback-intro"><p className="eyebrow">Cyber Quest feedback</p><h1 id="feedback-title">How was the quest?</h1><p className="intro">Rate five parts of your experience to help us improve the next adventure.</p><img src={robot} alt="" /></div>
      <div className="panel feedback-card">
        {status === 'sent' ? <div id="feedback-done" role="status"><h2>Thanks for taking the quest.</h2><p>Your ratings have been sent.</p><Link className="button primary" to="/">Back to home</Link></div>
          : <form onSubmit={submit} aria-describedby="feedback-note">
            {FEEDBACK_CRITERIA.map(([key, label]) => <fieldset key={key} disabled={status === 'sending'}><legend>{label}</legend><div className="ratings">{RATINGS.map(([face, description], i) => <label key={description}>
              <input name={key} type="radio" value={i + 1} checked={ratings[key] === i + 1} onChange={() => setRatings(previous => ({ ...previous, [key]: i + 1 }))} required />
              <span className="rating-face" aria-hidden="true">{face}</span><span>{i + 1}<span className="sr-only"> — {description}</span></span>
            </label>)}</div><div className="rating-scale" aria-hidden="true"><span>Very poor</span><span>Excellent</span></div></fieldset>)}
            <p className="form-note" id="feedback-note">Choose a rating for each category, then send your feedback.</p>
            {error && <p className="status" data-error="" role="alert">{error}</p>}
            <div className="actions"><button className="button primary" type="submit" disabled={!complete || status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send feedback'}</button></div>
          </form>}
      </div>
    </div>
  </section>
}
