'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Cliente {
  id: string
  full_name: string
}

interface CreditPointsModalProps {
  cliente: Cliente
  onClose: () => void
}

export default function CreditPointsModal({ cliente, onClose }: CreditPointsModalProps) {
  const router = useRouter()
  const [points, setPoints] = useState(10)
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente_id: cliente.id, points, label }),
    })

    if (res.ok) {
      setSuccess(true)
      router.refresh()
      setTimeout(onClose, 1500)
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 px-4 pb-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Créditer des points</h2>
        <p className="text-gray-500 text-sm mb-4">{cliente.full_name}</p>

        {success ? (
          <div className="text-center py-4 text-green-600 font-semibold">
            ✓ Points crédités !
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Prestation</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="input-field"
                placeholder="Ex : Pose gel, Manucure..."
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="label">Points à créditer</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="input-field"
                min={1}
                max={1000}
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Envoi...' : 'Confirmer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
