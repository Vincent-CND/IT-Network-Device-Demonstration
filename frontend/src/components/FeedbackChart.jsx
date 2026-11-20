import { useEffect, useState } from 'react'
import { getFeedbackChart } from '../api/client.js'

export default function FeedbackChart() {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ data: null, loading: true, error: false })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: null, loading: true, error: false })
    getFeedbackChart({ signal: controller.signal }).then(
      data => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: false })
      },
      () => {
        if (!controller.signal.aborted) setState({ data: null, loading: false, error: true })
      },
    )
    return () => controller.abort()
  }, [attempt])

  const { data, loading, error } = state
  const maximum = Math.max(5, ...data?.metrics.map(metric => Math.ceil(metric.average ?? 0)) ?? [])

  return (
    <section aria-labelledby="feedback-chart-title" className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink/70">Community feedback</p>
          <h2 id="feedback-chart-title" className="text-2xl font-bold tracking-wide">HOW PLAYERS RATE THE QUEST</h2>
          <p className="mt-2 text-sm text-ink/70">Average scores across five parts of the experience.</p>
        </div>
        <button
          type="button"
          onClick={() => setAttempt(value => value + 1)}
          disabled={loading}
          className="rounded border border-ink/30 px-4 py-2 text-sm font-semibold hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-50"
        >
          {loading ? 'Loading…' : error ? 'Try again' : 'Refresh'}
        </button>
      </div>

      <div aria-busy={loading} className="rounded-xl border border-lime/50 bg-panel p-5 text-white sm:p-8">
        {loading && <p role="status" className="py-10 text-center text-sm text-gray-300">Loading player feedback…</p>}
        {error && <p role="alert" className="py-10 text-center text-sm text-gray-300">Could not load feedback. Please try again.</p>}
        {data?.totalResponses === 0 && (
          <p role="status" className="py-10 text-center text-sm text-gray-300">No feedback yet. Player ratings will appear here after the first submission.</p>
        )}
        {data?.totalResponses > 0 && (
          <figure>
            <figcaption className="mb-6 text-sm text-gray-300">
              Based on <strong className="text-lime">{data.totalResponses.toLocaleString()}</strong> {data.totalResponses === 1 ? 'response' : 'responses'}
            </figcaption>
            <ul aria-label="Average feedback scores" className="space-y-5">
              {data.metrics.map(({ key, label, average }) => (
                <li key={key}>
                  <div className="mb-2 flex justify-between gap-4 text-sm">
                    <span>{label}</span>
                    <span className="font-semibold tabular-nums text-lime">{average.toFixed(2)}</span>
                  </div>
                  <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-lime" style={{ width: `${average / maximum * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <div aria-hidden="true" className="mt-3 flex justify-between text-xs tabular-nums text-gray-400">
              <span>0</span><span>{maximum} points</span>
            </div>
          </figure>
        )}
      </div>
    </section>
  )
}
