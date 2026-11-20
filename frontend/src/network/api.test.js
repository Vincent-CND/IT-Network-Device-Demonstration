import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getMissionInstructions, validateBuilder, validateCable } from './api.js'

test('loads all four instructions from individual mission endpoints in step order', async (t) => {
  const calls = []
  const messages = [
    'Welcome to Network Builder!',
    'Use the router, switch, PC, and internet.',
    'Connect everything in the correct order.',
    'Use a hint if you need help.',
  ]
  t.mock.method(globalThis, 'fetch', async (url) => {
    calls.push(url)
    const index = Number(url.split('/').at(-1)) - 1
    return Response.json({ message: messages[index] })
  })

  assert.deepEqual(await getMissionInstructions(), messages)
  assert.deepEqual(calls, ['/api/mission/1', '/api/mission/2', '/api/mission/3', '/api/mission/4'])
})

test('missing instruction text triggers an error instead of empty rows', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({}))
  await assert.rejects(getMissionInstructions(), /Missing instruction/)
})

test('an endpoint failure is surfaced to the page', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Error from server' }, { status: 500 }))
  await assert.rejects(getMissionInstructions(), /Error from server/)
})

test('builder sends connected devices in backend format and recognizes success', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/validate/builder')
    assert.deepEqual(JSON.parse(options.body), { userAnswer: ['INTERNET', 'ROUTER'] })
    return Response.json({ message: 'CONGRATULATIONS !!!' })
  })
  const result = await validateBuilder({
    nodes: [{ id: 5, type: 'router' }, { id: 9, type: 'cloud' }],
    links: [{ from: 5, to: 9 }],
  })
  assert.equal(result.success, true)
})

test('unconnected devices get a useful validation message without submitting', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected request') })
  const result = await validateBuilder({
    nodes: [{ id: 1, type: 'cloud' }, { id: 2, type: 'router' }], links: [],
  })
  assert.equal(result.success, false)
  assert.match(result.message, /Connect every device/)
  assert.equal(fetch.mock.callCount(), 0)
})

test('cable validation translates wire IDs into backend color names', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/validate/cable')
    assert.deepEqual(JSON.parse(options.body), {
      userAnswer: ['White/Orange', 'Orange', 'White/Green', 'Blue', 'White/Blue', 'Green', 'White/Brown', 'Brown'],
    })
    return Response.json({ message: 'CONGRATULATIONS !!!' })
  })
  const result = await validateCable({ order: ['wo', 'o', 'wg', 'b', 'wb', 'g', 'wbr', 'br'] })
  assert.equal(result.success, true)
})

test('wrong cable answers remain unsuccessful', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'WRONG ANSWER FROM USER' }))
  assert.equal((await validateCable({ order: ['br'] })).success, false)
})

test('validation displays backend errors instead of reporting a lost connection', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Challenge not found' }, { status: 404 }))
  await assert.rejects(validateCable({ order: ['br'] }), /Challenge not found/)
})

test('hints use the backend message envelope and missing database hints become unavailable', async (t) => {
  const { getBuilderHint, getCableHint } = await import('./api.js')
  t.mock.method(globalThis, 'fetch', async url => Response.json({ message: url.endsWith('/4') ? 'There are no more hint' : `Hint from ${url}` }))
  assert.equal(await getBuilderHint(1), 'Hint from /api/hint/builder/1')
  assert.equal(await getCableHint(2), 'Hint from /api/hint/cable/2')
  assert.equal(await getCableHint(4), '')
})
