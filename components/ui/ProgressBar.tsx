interface ProgressBarProps {
  percent: number
  colorClass?: string
}

export default function ProgressBar({
  percent,
  colorClass = 'bg-pink-500',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent))

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`${colorClass} h-3 rounded-full transition-all duration-500`}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
