import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gameLogo from '../assets/game-logo.png'
import MatrixBackground from '../components/MatrixBackground.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import HintModal from '../components/HintModal.jsx'
import CongratsModal from '../components/CongratsModal.jsx'
import { checkAnswer, getHint, getQuestion } from '../api/client.js'

// The handwritten notes list Q1-Q4 (the design also shows 4 cards).
const QUESTION_IDS = [1, 2, 3, 4]

export default function Game() {
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([]) // [{ id, text }]
  const [loadError, setLoadError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Per-question UI state, indexed like `questions`
  const [answers, setAnswers] = useState(QUESTION_IDS.map(() => ''))
  const [solved, setSolved] = useState(QUESTION_IDS.map(() => false))
  const [busy, setBusy] = useState(QUESTION_IDS.map(() => false))
  const [errors, setErrors] = useState(QUESTION_IDS.map(() => ''))

  const [hint, setHint] = useState(null) // { loading, text } | null
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all(
      QUESTION_IDS.map((id) =>
        getQuestion(id).then((data) => ({ id, text: data.message ?? data.question ?? '' })),
      ),
    )
      .then((list) => !cancelled && setQuestions(list))
      .catch(() => !cancelled && setLoadError(true))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [])

  const setAt = (setter, index, value) =>
    setter((prev) => prev.map((item, i) => (i === index ? value : item)))

  // The first unsolved question is the "current" one; later ones stay blurred.
  const firstUnsolved = solved.indexOf(false)
  const allSolved = firstUnsolved === -1

  async function handleDone(i) {
    const answer = answers[i].trim()
    if (!answer) {
      setAt(setErrors, i, 'Type your answer first.')
      return
    }

    setAt(setBusy, i, true)
    setAt(setErrors, i, '')
    try {
      const result = await checkAnswer(questions[i].id, answer)
      const correct = result.correct ?? result.isCorrect ?? result.success ?? false
      if (correct) {
        setAt(setSolved, i, true)
      } else {
        setAt(setErrors, i, result.message || 'Not quite. Try again or use the hint.')
      }
    } catch {
      setAt(setErrors, i, 'Could not reach the server.')
    } finally {
      setAt(setBusy, i, false)
    }
  }

  async function handleHint(i) {
    setHint({ loading: true, text: '' })
    try {
      const data = await getHint(questions[i].id)
      setHint({ loading: false, text: data.message ?? data.hint ?? '' })
    } catch {
      setHint({ loading: false, text: 'Could not load the hint. Please try again.' })
    }
  }

  return (
    <div className="relative min-h-screen bg-matrix">
      <MatrixBackground />

      <div className="relative mx-auto max-w-3xl px-6 py-6">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <img src={gameLogo} alt="" className="h-10 w-auto" />
          <span className="text-lg font-bold uppercase leading-4 text-white">
            Cyber
            <br />
            Quest
          </span>
        </div>

        {loading && <p className="text-center text-white">Loading questions…</p>}

        {loadError && (
          <p role="alert" className="rounded-md bg-red-950/70 px-4 py-3 text-center text-sm text-red-200">
            Could not load the questions. Make sure the backend is running on port 3000.
          </p>
        )}

        <div className="space-y-3">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              answer={answers[i]}
              solved={solved[i]}
              locked={!allSolved && i > firstUnsolved}
              busy={busy[i]}
              error={errors[i]}
              onAnswerChange={(value) => setAt(setAnswers, i, value)}
              onHint={() => handleHint(i)}
              onDone={() => handleDone(i)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={!allSolved || questions.length === 0}
            onClick={() => setShowCongrats(true)}
            className="w-56 rounded-xl bg-brand py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300 disabled:hover:brightness-100"
          >
            Submit
          </button>
        </div>
      </div>

      <HintModal open={hint !== null} hint={hint} onClose={() => setHint(null)} />

      <CongratsModal
        open={showCongrats}
        onClose={() => setShowCongrats(false)}
        onContinue={() => navigate('/network/1')}
        message="You solved every question! One more challenge is waiting for you."
      />
    </div>
  )
}