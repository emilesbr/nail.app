'use client'

import { useState } from 'react'
import StarRating from '@/components/ui/StarRating'

interface ReviewFormProps {
  clienteId: string
}

export default function ReviewForm({ clienteId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return

    setLoading(true)

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente_id: clienteId, rating, comment }),
    })

    if (res.ok) setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="card text-center py-6">
        <p className="text-2xl mb-2">🙏</p>
        <p className="font-semibold text-gray-800">Merci pour votre avis !</p>
        <p className="text-gray-500 text-sm mt-1">Votre retour compte beaucoup</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="font-semibold text-gray-800 mb-4">Laisser un avis</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Votre note</p>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        <div>
          <label className="label">Commentaire (facultatif)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input-field resize-none"
            rows={3}
            placeholder="Partagez votre expérience..."
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || rating === 0}
        >
          {loading ? 'Envoi...' : 'Envoyer mon avis'}
        </button>
      </form>
    </div>
  )
}
