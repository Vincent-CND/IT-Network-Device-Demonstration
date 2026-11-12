// All backend calls live in this one file, so when the backend developer
// changes a route or a response shape you only need to edit it here.
//
// In development BASE is "/api" and the Vite dev server proxies it to
// http://localhost:3000 (see vite.config.js). For production set VITE_API_URL.
const BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

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

// GET /question/:id  ->  { message: "<question text>" }
// ASSUMPTION: from the handwritten notes ("get /question"). Confirm with the backend dev.
export function getQuestion(id) {
  return request(`/question/${encodeURIComponent(id)}`)
}

// GET /hint/:id  ->  { message: "<hint text>" }
// ASSUMPTION: from the handwritten notes ("get /hint/{id}"). Confirm with the backend dev.
export function getHint(id) {
  return request(`/hint/${encodeURIComponent(id)}`)
}

// POST /answer  body: { id, answer }  ->  { correct: boolean, message?: string }
// ASSUMPTION: the notes only say "post /answer". Confirm body + response with the backend dev.
export function checkAnswer(id, answer) {
  return request('/answer', {
    method: 'POST',
    body: JSON.stringify({ id, answer }),
  })
}

// POST /feedback  body: { name, age, message, rating }
// ASSUMPTION: the Rate & Feedback form is in the design but was not in the notes.
export function sendFeedback({ name, age, message, rating }) {
  return request('/feedback', {
    method: 'POST',
    body: JSON.stringify({ name, age: Number(age) || age, message, rating }),
  })
}
