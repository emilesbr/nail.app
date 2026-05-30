import ProgressBar from '@/components/ui/ProgressBar'

interface FidelityCardProps {
  totalPoints: number
  pointsForReward: number
  progressPercent: number
  rewardDescription: string
}

export default function FidelityCard({
  totalPoints,
  pointsForReward,
  progressPercent,
  rewardDescription,
}: FidelityCardProps) {
  const pointsLeft = Math.max(0, pointsForReward - totalPoints)

  return (
    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-pink-200 text-sm">Votre solde</p>
          <p className="text-4xl font-bold">{totalPoints}</p>
          <p className="text-pink-100 text-sm">points fidélité</p>
        </div>
        <div className="text-5xl">💅</div>
      </div>

      <div className="space-y-2">
        <ProgressBar percent={progressPercent} colorClass="bg-white" />
        <div className="flex justify-between text-sm text-pink-100">
          <span>{progressPercent}% vers la récompense</span>
          {pointsLeft > 0 ? (
            <span>encore {pointsLeft} pts</span>
          ) : (
            <span className="text-white font-semibold">🎉 Récompense disponible !</span>
          )}
        </div>
      </div>

      {pointsLeft === 0 && (
        <div className="mt-3 bg-white/20 rounded-xl p-3 text-center">
          <p className="font-semibold">{rewardDescription}</p>
          <p className="text-pink-100 text-xs mt-0.5">Mentionnez-le lors de votre prochaine visite</p>
        </div>
      )}
    </div>
  )
}
