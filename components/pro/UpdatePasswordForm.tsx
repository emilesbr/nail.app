'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('Une erreur est survenue. Le lien a peut-être expiré.')
    } else {
      setDone(true)
      setTimeout(() => {
        window.location.href = '/pro/dashboard'
      }, 2000)
    }

    setLoading(false)
  }

  if (done) {
    return (
      <div className="text-center py-4 space-y-2">
        <p className="text-2xl">✅</p>
        <p className="font-semibold text-gray-800">Mot de passe mis à jour !</p>
        <p className="text-gray-500 text-sm">Redirection en cours...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="label">Nouveau mot de passe</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="8 caractères minimum"
          required
          autoComplete="new-password"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="label">Confirmer le mot de passe</label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input-field"
          placeholder="Répétez le mot de passe"
          required
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Mise à jour...' : 'Enregistrer le mot de passe'}
      </button>
    </form>
  )
}
