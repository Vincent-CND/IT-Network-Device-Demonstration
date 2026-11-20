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
    const error = new Error(`API error: ${response.status}`)
    error.status = response.status
    throw error
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

// Match the existing feedback controller's five numeric fields.
export const FEEDBACK_CRITERIA = [
  ['satisfaction', 'Overall satisfaction'],
  ['enjoyment', 'Enjoyment'],
  ['easeOfUse', 'Ease of use'],
  ['learning', 'Learning'],
  ['interest', 'Interest'],
]

export async function sendFeedback(ratings) {
  const payload = Object.fromEntries(FEEDBACK_CRITERIA.map(([key]) => [key, Number(ratings[key])]))
  if (Object.values(payload).some(value => !Number.isInteger(value) || value < 1 || value > 5)) {
    throw new Error('Choose a rating from 1 to 5 for every category.')
  }
  const result = await request('/feedback', { method: 'POST', body: JSON.stringify(payload) })
  if (result.message !== 'Thank for your feedback') throw new Error('Feedback was not saved. Please try again.')
  return result
}

export async function getFeedbackChart(options = {}) {
  const data = await request('/drawChart', options)
  if (!Number.isInteger(data.totalResponses) || data.totalResponses < 0 || !Array.isArray(data.metrics)) {
    throw new Error('Invalid feedback summary')
  }
  const metrics = FEEDBACK_CRITERIA.map(([key, label]) => {
    const metric = data.metrics.find(item => item.key === key)
    if (!metric || (data.totalResponses > 0 && (typeof metric.average !== 'number' || !Number.isFinite(metric.average)))) {
      throw new Error('Invalid feedback summary')
    }
    return { key, label, average: data.totalResponses === 0 ? null : metric.average }
  })
  return { totalResponses: data.totalResponses, metrics }
}
