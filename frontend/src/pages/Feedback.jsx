import { useState } from 'react'
import { Link } from 'react-router-dom'
import FaceIcon from '../components/FaceIcon.jsx'
import { sendFeedback } from '../api/client.js'

const inputClass =
  'w-full rounded-lg bg-white px-3 py-2 text-sm text-ink outline-none ring-lime focus:ring-2'

export default function Feedback() {
  const [form, setForm] = useState({ name: '', age: '', message: '', rating: 0 })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendFeedback(form)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="flex justify-center px-6 py-12">
      <div className="w-full max-w-xs border border-lime bg-panel p-6 text-white">
        <h1 className="mb-4 text-center text-base font-semibold">Rate &amp; Feedback</h1>

        {status === 'sent' ? (
          <div className="py-6 text-center">
            <p className="text-lg font-semibold text-lime">Thank you!</p>
            <p className="mt-1 text-sm text-gray-300">Your feedback was sent.</p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-xl bg-brand px-6 py-2 font-semibold text-white hover:brightness-110"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-[11px] font-semibold">
              Message:
              <textarea
                rows={5}
                value={form.message}
                onChange={update('message')}
                className={`${inputClass} mt-1 resize-none`}
              />
            </label>

            <div>
              <p className="mb-1 text-[11px] font-semibold">Rate Us:</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <FaceIcon
                    key={level}
                    level={level}
                    selected={form.rating === level}
                    onClick={() => setForm((f) => ({ ...f, rating: level }))}
                  />
                ))}
              </div>
            </div>

            {status === 'error' && (
              <p role="alert" className="text-xs text-red-400">
                Could not send your feedback. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || form.rating === 0}
              className="w-full rounded-xl bg-brand py-2.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
