interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            How Dishdle Works
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>Guess the hidden dish in 6 tries.</li>
          <li>Pick guesses from the autocomplete list of valid dishes.</li>
          <li>Each guess shows if its attributes match the target.</li>
          <li>Green means an exact match, gray means not a match.</li>
          <li>Daily mode gives one shared dish per day.</li>
          <li>Practice mode gives unlimited fresh games.</li>
        </ul>
      </div>
    </div>
  );
}
