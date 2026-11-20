import { useEffect, useState } from 'react'
import { getFeedbackChart } from '../api/client.js'

export default function FeedbackChart() {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ data: null, loading: true, error: false })

  // Fetch anew on each visit to Home, including the return from feedback.
  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, loading: true, error: false })
    getFeedbackChart({ signal: controller.signal, cache: 'no-store' }).then(data => {
      if (!controller.signal.aborted) setState({ data, loading: false, error: false })
    }).catch(() => {
      if (!controller.signal.aborted) setState({ data: null, loading: false, error: true })
    })
    return () => controller.abort()
  }, [attempt])

  const { data, loading, error } = state
  return <section className="panel feedback-summary" aria-labelledby="feedback-chart-title" aria-busy={loading}>
    <p className="eyebrow">Community feedback</p>
    <h2 id="feedback-chart-title">How players rate the quest</h2>
    {loading && <p role="status">Loading player ratings…</p>}
    {error && <p role="alert">Could not load player ratings. Please try again.</p>}
    {data && (data.totalResponses === 0
      ? <p>No feedback yet. Be the first to rate your experience.</p>
      : <><p>Based on {data.totalResponses.toLocaleString()} {data.totalResponses === 1 ? 'response' : 'responses'}.</p>
        <ul className="feedback-metrics">{data.metrics.map(({ key, label, average }) => <li key={key}>
          <div><label htmlFor={`average-${key}`}>{label}</label><span>{average.toFixed(2)} / 5</span></div>
          <meter id={`average-${key}`} min="0" max="5" value={average}>{average.toFixed(2)} out of 5</meter>
        </li>)}</ul></>)}
    <button type="button" className="button secondary" disabled={loading} onClick={() => setAttempt(value => value + 1)}>
      {loading ? 'Loading…' : error ? 'Try again' : 'Refresh ratings'}
    </button>
  </section>
}
