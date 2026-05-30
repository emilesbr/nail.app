import { FidelityPoint } from '@/lib/types'

interface VisitHistoryProps {
  history: FidelityPoint[]
}

export default function VisitHistory({ history }: VisitHistoryProps) {
  return (
    <div className="card">
      <h2 className="font-semibold text-gray-800 mb-3">Historique des visites</h2>

      {history.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">
          Votre historique apparaîtra ici après votre première visite
        </p>
      ) : (
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-gray-800 text-sm font-medium">{entry.label}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(entry.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span className="text-pink-600 font-semibold text-sm shrink-0 ml-3">
                +{entry.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
