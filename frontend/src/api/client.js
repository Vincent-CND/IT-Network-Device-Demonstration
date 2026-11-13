// All backend calls live in this one file, so when the backend developer
// changes a route or a response shape you only need to edit it here.
//
// In development BASE is "/api" and the Vite dev server proxies it to
// http://localhost:3000 (see vite.config.js). For production set VITE_API_URL.
const BASE = (import.meta.env?.VITE_API_URL ?? '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// GET /step/:id  ->  { message: "<step text>" }
// (confirmed by the backend code: returns "There are no more steps" for unknown ids)
export function getStep(id) {
  return request(`/step/${encodeURIComponent(id)}`)
}

// GET /question/:id returns { data: { id, question, hint, type } }.
export async function getQuestion(id) {
  const { data } = await request(`/question/${encodeURIComponent(id)}`)
  if (!data || typeof data.question !== 'string' || !data.question.trim()) {
    throw new Error('Question not found')
  }
  // The remote API omits answerId. The current four question/answer pairs
  // have matching IDs; prefer an explicit answerId if the API later exposes it.
  return { id: data.id, text: data.question, hint: data.hint, answerId: data.answerId ?? data.id }
}

// POST /answer uses the question's related answer ID, not its question ID.
export async function checkAnswer(answerId, answer) {
  const result = await request('/answer', {
    method: 'POST',
    body: JSON.stringify({ idAnswer: answerId, userAnswer: answer }),
  })
  return { correct: result.message === 'correct' }
}

// POST /feedback  body: { name, age, message, rating }
// ASSUMPTION: the Rate & Feedback form is in the design but was not in the notes.
export function sendFeedback({ name, age, message, rating }) {
  return request('/feedback', {
    method: 'POST',
    body: JSON.stringify({ name, age: Number(age) || age, message, rating }),
  })
}
