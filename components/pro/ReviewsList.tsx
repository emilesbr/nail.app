'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Review } from '@/lib/types'
import StarRating from '@/components/ui/StarRating'

interface ReviewsListProps {
  reviews: (Review & { cliente?: { full_name: string } })[]
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function toggleVisibility(reviewId: string, isVisible: boolean) {
    setLoadingId(reviewId)

    await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id: reviewId, is_visible: !isVisible }),
    })

    router.refresh()
    setLoadingId(null)
  }

  if (reviews.length === 0) {
    return (
      <div className="card text-center text-gray-400 py-8">
        Aucun avis reçu
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className={`card ${!review.is_visible ? 'opacity-50' : ''}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">
                  {review.cliente?.full_name ?? 'Cliente'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                </span>
                {!review.is_visible && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    masqué
                  </span>
                )}
              </div>
              <StarRating value={review.rating} readonly size="sm" />
              {review.comment && (
                <p className="text-gray-600 text-sm mt-2 italic">"{review.comment}"</p>
              )}
            </div>
            <button
              onClick={() => toggleVisibility(review.id, review.is_visible)}
              disabled={loadingId === review.id}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-1"
              title={review.is_visible ? 'Masquer' : 'Afficher'}
            >
              {review.is_visible ? '🙈 Masquer' : '👁 Afficher'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
