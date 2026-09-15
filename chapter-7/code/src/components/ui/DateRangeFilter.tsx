import { useState } from 'react'

interface DateRangeFilterProps {
  onChange: (from: Date, to: Date) => void
}

function toInputValue(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function DateRangeFilter({ onChange }: DateRangeFilterProps) {
  const [from, setFrom] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 90)
    return toInputValue(date)
  })
  const [to, setTo] = useState(() => toInputValue(new Date()))

  function handleFromChange(value: string) {
    setFrom(value)
    onChange(new Date(value), new Date(to))
  }

  function handleToChange(value: string) {
    setTo(value)
    onChange(new Date(from), new Date(value))
  }

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1 text-xs text-gray-400">
        From
        <input
          type="date"
          value={from}
          onChange={(e) => handleFromChange(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
        />
      </label>
      <label className="flex items-center gap-1 text-xs text-gray-400">
        To
        <input
          type="date"
          value={to}
          onChange={(e) => handleToChange(e.target.value)}
          className="rounded-lg border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
        />
      </label>
    </div>
  )
}
