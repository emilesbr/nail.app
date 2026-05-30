import { Review } from '@/lib/types'
import StarRating from '@/components/ui/StarRating'

interface RecentReviewsProps {
  reviews: (Review & { cliente?: { full_name: string } })[]
}

export default function RecentReviews({ reviews }: RecentReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="card text-center text-gray-400 py-8">
        Aucun avis pour le moment
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="card">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-800">
              {review.cliente?.full_name ?? 'Cliente'}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(review.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <StarRating value={review.rating} readonly size="sm" />
          {review.comment && (
            <p className="text-gray-600 text-sm mt-2 italic">&ldquo;{review.comment}&rdquo;</p>
          )}
        </div>
      ))}
    </div>
  )
}
