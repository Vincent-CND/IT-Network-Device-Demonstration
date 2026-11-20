import { useEffect, useState } from 'react'

// Load a stable API function, discard stale responses, and expose an explicit retry.
export default function useResource(load) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  useEffect(() => {
    let active = true
    setState({ data: null, loading: true, error: '' })
    load().then(
      data => active && setState({ data, loading: false, error: '' }),
      () => active && setState({ data: null, loading: false, error: 'Could not load this content. Check your connection and try again.' }),
    )
    return () => { active = false }
  }, [load, attempt])
  return { ...state, retry: () => setAttempt(value => value + 1) }
}
