// Dashboard principal de la prothésiste
import { createSupabaseServerClient } from '@/lib/supabase'
import StatCard from '@/components/pro/StatCard'
import RecentReviews from '@/components/pro/RecentReviews'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Nombre de clientes actives (au moins une visite)
  const { count: activeClients } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'cliente')

  // Points distribués ce mois-ci
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: monthlyPoints } = await supabase
    .from('fidelity_points')
    .select('points')
    .gte('created_at', startOfMonth.toISOString())

  const totalMonthlyPoints = monthlyPoints?.reduce((sum, row) => sum + row.points, 0) ?? 0

  // Derniers avis visibles
  const { data: recentReviews } = await supabase
    .from('reviews')
    .select('*, cliente:profiles(full_name)')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Clientes actives"
          value={activeClients ?? 0}
          icon="👩"
        />
        <StatCard
          title="Points ce mois"
          value={totalMonthlyPoints}
          icon="⭐"
        />
      </div>

      {/* Derniers avis */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Derniers avis</h2>
        <RecentReviews reviews={recentReviews ?? []} />
      </div>
    </div>
  )
}
