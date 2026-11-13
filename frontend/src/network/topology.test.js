import assert from 'node:assert/strict'
import { test } from 'node:test'
import { topologyAnswer } from './topology.js'

const nodes = ['cloud', 'router', 'switch', 'switch', 'switch', 'pc', 'pc', 'pc', 'pc']
  .map((type, id) => ({ id, type }))
const links = [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [3, 6], [4, 7], [4, 8]]
  .map(([from, to]) => ({ from, to }))
const expected = ['INTERNET', 'ROUTER', 'SWITCH', 'SWITCH', 'SWITCH', 'SERVER', 'SERVER', 'SERVER', 'SERVER']

test('serializes the linked topology independently of placement order and cable direction', () => {
  assert.deepEqual(topologyAnswer(nodes, links), expected)
  assert.deepEqual(topologyAnswer([...nodes].reverse(), [...links].reverse().map(({ from, to }) => ({ from: to, to: from }))), expected)
})

test('a changed connection changes the answer even with the same device inventory', () => {
  const changed = links.map((link) => link.to === 1 ? { from: 2, to: 1 } : link.to === 2 ? { from: 0, to: 2 } : link)
  assert.notDeepEqual(topologyAnswer(nodes, changed), expected)
})

test('empty, disconnected, cyclic, and invalid networks are rejected', () => {
  assert.throws(() => topologyAnswer([], []), /Add devices/)
  assert.throws(() => topologyAnswer(nodes, links.slice(1)), /Connect every device/)
  assert.throws(() => topologyAnswer(nodes, [...links, { from: 3, to: 4 }]), /loops/)
  assert.throws(() => topologyAnswer(nodes, [...links, { from: 1, to: 0 }]), /duplicate/)
  assert.throws(() => topologyAnswer(nodes, [...links, { from: 0, to: 99 }]), /invalid/)
  assert.throws(() => topologyAnswer(nodes.slice(1), []), /Internet device/)
})
