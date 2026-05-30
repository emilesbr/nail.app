'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase'

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createSupabaseBrowserClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (resetError) {
      setError('Une erreur est survenue. Vérifiez l\'email saisi.')
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center py-4 space-y-3">
        <p className="text-2xl">📬</p>
        <p className="font-semibold text-gray-800">Email envoyé !</p>
        <p className="text-gray-500 text-sm">
          Consultez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
        </p>
        <Link href="/login" className="text-pink-500 text-sm hover:underline block mt-4">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-gray-500 text-sm">
        Saisissez votre email — vous recevrez un lien pour réinitialiser votre mot de passe.
      </p>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="votre@email.com"
          required
          autoComplete="email"
        />
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer le lien'}
      </button>
      <Link href="/login" className="block text-center text-sm text-gray-400 hover:text-gray-600">
        Retour à la connexion
      </Link>
    </form>
  )
}
