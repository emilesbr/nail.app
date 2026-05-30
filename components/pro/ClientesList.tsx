'use client'

import { useState } from 'react'
import CreditPointsModal from './CreditPointsModal'

interface ClienteWithStats {
  id: string
  full_name: string
  email: string
  totalPoints: number
  lastVisit: string | null
}

interface ClientesListProps {
  clientes: ClienteWithStats[]
}

export default function ClientesList({ clientes }: ClientesListProps) {
  const [selectedCliente, setSelectedCliente] = useState<ClienteWithStats | null>(null)

  if (clientes.length === 0) {
    return (
      <div className="card text-center text-gray-400 py-8">
        Aucune cliente enregistrée
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{cliente.full_name}</p>
              <p className="text-sm text-gray-500">
                {cliente.lastVisit
                  ? `Dernière visite : ${new Date(cliente.lastVisit).toLocaleDateString('fr-FR')}`
                  : 'Aucune visite'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-pink-600 font-bold text-lg">
                {cliente.totalPoints} pts
              </span>
              <button
                onClick={() => setSelectedCliente(cliente)}
                className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                Créditer
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCliente && (
        <CreditPointsModal
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
        />
      )}
    </>
  )
}
