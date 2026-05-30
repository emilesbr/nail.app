// Page cliente — accès par lien unique /cliente/[id]
// Pas d'authentification requise : le lien UUID sert de jeton d'accès
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import FidelityCard from '@/components/cliente/FidelityCard'
import VisitHistory from '@/components/cliente/VisitHistory'
import ReviewForm from '@/components/cliente/ReviewForm'

interface PageProps {
  params: { id: string }
}

export default async function ClientePage({ params }: PageProps) {
  const supabase = await createSupabaseServerClient()

  // Vérifie que l'ID est valide et correspond à une cliente
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', params.id)
    .eq('role', 'cliente')
    .single()

  if (!profile) notFound()

  // Paramètres de fidélité du salon
  const { data: settings } = await supabase
    .from('salon_settings')
    .select('*')
    .single()

  // Historique des points
  const { data: pointsHistory } = await supabase
    .from('fidelity_points')
    .select('*')
    .eq('cliente_id', params.id)
    .order('created_at', { ascending: false })

  const totalPoints = (pointsHistory ?? []).reduce((sum, p) => sum + p.points, 0)
  const pointsForReward = settings?.points_for_reward ?? 100
  const progressPercent = Math.min(100, Math.round((totalPoints / pointsForReward) * 100))

  // Vérifie si la cliente a déjà laissé un avis aujourd'hui
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: todayReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('cliente_id', params.id)
    .gte('created_at', today.toISOString())
    .limit(1)

  const hasReviewedToday = (todayReview?.length ?? 0) > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">

        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {profile.full_name} 👋
          </h1>
          {settings?.salon_name && (
            <p className="text-gray-500 mt-1">{settings.salon_name}</p>
          )}
        </div>

        {/* Carte de fidélité */}
        <FidelityCard
          totalPoints={totalPoints}
          pointsForReward={pointsForReward}
          progressPercent={progressPercent}
          rewardDescription={settings?.reward_description ?? '1 soin offert'}
        />

        {/* Historique des visites */}
        <VisitHistory history={pointsHistory ?? []} />

        {/* Formulaire d'avis */}
        {!hasReviewedToday && (
          <ReviewForm clienteId={params.id} />
        )}
      </div>
    </div>
  )
}
