'use client'

import { useState } from 'react'
import { SalonSettings } from '@/lib/types'

interface SettingsFormProps {
  initialSettings: SalonSettings
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<SalonSettings>(initialSettings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Nom du salon</label>
        <input
          type="text"
          value={settings.salon_name}
          onChange={(e) => setSettings({ ...settings, salon_name: e.target.value })}
          className="input-field"
          placeholder="Mon Salon"
          required
          maxLength={100}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Points par visite</label>
          <input
            type="number"
            value={settings.points_per_visit}
            onChange={(e) => setSettings({ ...settings, points_per_visit: Number(e.target.value) })}
            className="input-field"
            min={1}
            max={500}
            required
          />
        </div>
        <div>
          <label className="label">Points pour récompense</label>
          <input
            type="number"
            value={settings.points_for_reward}
            onChange={(e) => setSettings({ ...settings, points_for_reward: Number(e.target.value) })}
            className="input-field"
            min={1}
            max={10000}
            required
          />
        </div>
      </div>

      <div>
        <label className="label">Description de la récompense</label>
        <input
          type="text"
          value={settings.reward_description}
          onChange={(e) => setSettings({ ...settings, reward_description: e.target.value })}
          className="input-field"
          placeholder="Ex : 1 soin offert"
          required
          maxLength={150}
        />
        <p className="text-xs text-gray-400 mt-1">
          Affiché aux clientes dans leur espace fidélité
        </p>
      </div>

      <div className="pt-2">
        {saved && (
          <p className="text-green-600 text-sm text-center mb-2">✓ Paramètres enregistrés</p>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
