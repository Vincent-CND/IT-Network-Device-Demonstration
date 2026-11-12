// One row of the Game screen: question text on the left, answer box with
// Hint / Done buttons on the right. Locked rows are blurred like in the design.
export default function QuestionCard({
  question,
  answer,
  solved,
  locked,
  busy,
  error,
  onAnswerChange,
  onHint,
  onDone,
}) {
  return (
    <div
      inert={locked}
      aria-hidden={locked}
      className={`rounded-sm border p-6 transition duration-300 ${
        locked
          ? 'select-none border-white/5 bg-panel/40 opacity-50 blur-[3px]'
          : solved
            ? 'border-lime/60 bg-panel/90'
            : 'border-lime bg-panel/95'
      }`}
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_minmax(0,16rem)] sm:items-center">
        <p className="text-sm leading-relaxed text-white">{question.text}</p>

        <div className="space-y-3">
          <input
            type="text"
            value={answer}
            disabled={solved || busy}
            onChange={(e) => onAnswerChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onDone()}
            aria-label="Your answer"
            className="w-full rounded-lg bg-white px-3 py-2 text-sm text-ink outline-none ring-lime focus:ring-2 disabled:bg-gray-200"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onHint}
              className="rounded-md bg-amber py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Hint
            </button>
            <button
              type="button"
              onClick={onDone}
              disabled={solved || busy}
              className="rounded-md bg-brand py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {busy ? '…' : solved ? '✓ Done' : 'Done'}
            </button>
          </div>
          {error && (
            <p key={error} role="alert" className="animate-shake text-xs text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
