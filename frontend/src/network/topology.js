// The backend stores device names in breadth-first order from the Internet.
// Its legacy SERVER label represents the PC endpoints in the canvas.
const DEVICE_NAMES = { cloud: 'INTERNET', router: 'ROUTER', switch: 'SWITCH', pc: 'SERVER' }
const DEVICE_ORDER = ['INTERNET', 'ROUTER', 'SWITCH', 'SERVER']

export function topologyAnswer(nodes, links) {
  if (!nodes.length) throw new Error('Add devices and connect them before validating.')
  const devices = new Map(nodes.map((node) => [node.id, node]))
  if (devices.size !== nodes.length || nodes.some((node) => !DEVICE_NAMES[node.type])) {
    throw new Error('The network contains an invalid device.')
  }
  const roots = nodes.filter((node) => node.type === 'cloud')
  if (roots.length !== 1) throw new Error('Your network needs exactly one Internet device.')

  const neighbors = new Map(nodes.map((node) => [node.id, new Set()]))
  for (const { from, to } of links) {
    if (!devices.has(from) || !devices.has(to) || from === to || neighbors.get(from).has(to)) {
      throw new Error('Remove invalid or duplicate cable connections.')
    }
    neighbors.get(from).add(to)
    neighbors.get(to).add(from)
  }

  const visited = new Set([roots[0].id])
  let level = [roots[0].id]
  const answer = []
  while (level.length) {
    // Devices at the same depth have no left/right ordering in the diagram.
    answer.push(...level.map((id) => DEVICE_NAMES[devices.get(id).type])
      .sort((a, b) => DEVICE_ORDER.indexOf(a) - DEVICE_ORDER.indexOf(b)))
    const next = []
    for (const id of level) {
      for (const neighbor of neighbors.get(id)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          next.push(neighbor)
        }
      }
    }
    level = next
  }
  if (visited.size !== nodes.length) throw new Error('Connect every device to the network before validating.')
  if (links.length !== nodes.length - 1) throw new Error('Remove cable loops from your network.')
  return answer
}
