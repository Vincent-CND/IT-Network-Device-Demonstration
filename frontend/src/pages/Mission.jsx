import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import boxImage from '../assets/boxA.png'
import { boxes } from '../data/content.js'
import { getStep } from '../api/client.js'

const STEP_IDS = [1, 2, 3, 4, 5]

// Step 1 is dark, the circles get greener towards step 5 (like the design).
const STEP_COLORS = ['#0f1a12', '#14291a', '#1a3a20', '#215226', '#1f6b2b']

export default function Mission() {
  // messages[i] is the text for STEP_IDS[i]; null = failed, undefined = loading
  const [messages, setMessages] = useState([])
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all(
      STEP_IDS.map((id) =>
        getStep(id)
          .then((data) => data.message)
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return
      setMessages(results)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const backendDown = !loading && messages.every((m) => m === null)

  function textFor(i) {
    if (loading) return 'Loading…'
    return messages[i] ?? 'Could not load this step.'
  }

  return (
    <>
      {/* Boxes */}
      <section className="bg-panel px-6 py-12">
        <div className="mx-auto grid max-w-3xl gap-10 sm:grid-cols-2">
          {boxes.map(({ label, text }) => (
            <div key={label} className="text-center">
              <img
                src={boxImage}
                alt={`${label} treasure chest`}
                className="mx-auto h-40 w-auto object-contain drop-shadow-[0_0_24px_rgba(61,255,122,0.35)]"
              />
              <h2 className="mt-2 text-xl font-bold text-white">{label}</h2>
              <p className="mx-auto mt-1 max-w-[14rem] text-xs text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-8">
        {backendDown && (
          <p role="alert" className="mb-2 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
            Could not reach the server. Make sure the backend is running on port 3000.
          </p>
        )}

        {STEP_IDS.map((id, i) => {
          const isActive = i === active
          const style = { backgroundColor: STEP_COLORS[i] }

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(i)}
              aria-expanded={isActive}
              style={style}
              className={`flex flex-col items-center justify-center text-white transition-all duration-300 ${
                isActive
                  ? 'w-full rounded-full px-8 py-5'
                  : 'h-[72px] w-[72px] rounded-full hover:scale-105'
              }`}
            >
              <span className="text-sm font-bold uppercase tracking-wide">Step {id}</span>
              {isActive && <span className="mt-0.5 text-xs text-gray-200">{textFor(i)}</span>}
            </button>
          )
        })}

        <Link
          to="/game"
          className="mt-6 rounded-xl bg-brand px-8 py-2.5 font-semibold text-white transition hover:brightness-110"
        >
          Go to game
        </Link>
      </section>
    </>
  )
}
