export default function LoadState({ loading, error, retry }) {
  if (loading) return <p className="status loading-state" role="status">Loading mission content…</p>
  if (!error) return null
  return <div className="load-error"><p role="alert">{error}</p><button className="button secondary" onClick={retry}>Try again</button></div>
}
