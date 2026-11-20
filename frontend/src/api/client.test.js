import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkAnswer, getQuestion } from './client.js'

test('remote question response without answerId uses the current matching question/answer IDs', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url === '/api/question/2') {
      return Response.json({ data: { id: 2, question: 'Which device?', hint: 'Look in the box', type: 'Easy' } })
    }
    assert.equal(url, '/api/answer')
    assert.deepEqual(JSON.parse(options.body), { idAnswer: 2, userAnswer: 'router' })
    return Response.json({ message: 'correct' })
  })
  const question = await getQuestion(2)
  assert.equal(question.text, 'Which device?')
  assert.equal(question.hint, 'Look in the box')
  assert.equal((await checkAnswer(question.answerId, 'router')).correct, true)
})

test('loads question text, hint, and related answer ID from the backend envelope', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url, '/api/question/1')
    return Response.json({
      data: { id: 1, question: 'Which cable?', type: 'Medium', hint: 'Look in the box', answerId: 7 },
    })
  })

  assert.deepEqual(await getQuestion(1), {
    id: 1, text: 'Which cable?', hint: 'Look in the box', answerId: 7,
  })
})

test('missing question data raises an error instead of rendering a blank card', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Invalid question request' }))
  await assert.rejects(getQuestion(99), /Question not found/)
})

test('submits the related answer ID and recognizes a correct answer', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/answer')
    assert.equal(options.method, 'POST')
    assert.deepEqual(JSON.parse(options.body), { idAnswer: 7, userAnswer: 'blue' })
    return Response.json({ message: 'correct' })
  })

  assert.deepEqual(await checkAnswer(7, 'blue'), { correct: true })
})

test('an incorrect answer does not unlock the next question', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'incorrect' }))
  assert.deepEqual(await checkAnswer(7, 'wrong'), { correct: false })
})

test('backend failures are surfaced to the caller', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Error from server' }, { status: 500 }))
  await assert.rejects(getQuestion(1), /API error: 500/)
})

test('feedback sends the five numeric fields expected by the existing controller', async (t) => {
  const { sendFeedback } = await import('./client.js')
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/feedback')
    assert.equal(options.method, 'POST')
    assert.deepEqual(JSON.parse(options.body), { satisfaction: 5, enjoyment: 4, easeOfUse: 3, learning: 4, interest: 5 })
    return Response.json({ message: 'Thank for your feedback' })
  })
  await sendFeedback({ satisfaction: '5', enjoyment: 4, easeOfUse: 3, learning: 4, interest: 5, message: 'not supported' })
})

test('incomplete ratings never reach the backend, and a failed save is not reported as success', async (t) => {
  const { sendFeedback } = await import('./client.js')
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Sorry We cannot insert these values' }))
  await assert.rejects(sendFeedback({ satisfaction: 5 }), /every category/)
  assert.equal(fetch.mock.callCount(), 0)
  await assert.rejects(sendFeedback({ satisfaction: 5, enjoyment: 5, easeOfUse: 5, learning: 5, interest: 5 }), /not saved/)
})

test('feedback summary handles an empty database and preserves route-unavailable status', async (t) => {
  const { getFeedbackChart, FEEDBACK_CRITERIA } = await import('./client.js')
  const fetch = t.mock.method(globalThis, 'fetch', async url => {
    assert.equal(url, '/api/drawChart')
    return Response.json({ totalResponses: 0, metrics: FEEDBACK_CRITERIA.map(([key, label]) => ({ key, label, average: null })) })
  })
  const data = await getFeedbackChart()
  assert.equal(data.totalResponses, 0)
  assert.ok(data.metrics.every(metric => metric.average === null))
  fetch.mock.mockImplementation(async () => new Response('Cannot GET /drawChart', { status: 404 }))
  await assert.rejects(getFeedbackChart(), error => error.status === 404)
})
