// Liste des clientes avec solde de points et date de dernière visite
import { createSupabaseServerClient } from '@/lib/supabase'
import ClientesList from '@/components/pro/ClientesList'

export default async function ClientesPage() {
  const supabase = await createSupabaseServerClient()

  // Récupère toutes les clientes avec leur solde de points agrégé
  const { data: clientes } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      created_at,
      fidelity_points(points, created_at)
    `)
    .eq('role', 'cliente')
    .order('full_name', { ascending: true })

  // Calcule le solde et la dernière visite pour chaque cliente
  const clientesWithStats = (clientes ?? []).map((c) => {
    const points = c.fidelity_points ?? []
    const totalPoints = points.reduce((sum: number, p: any) => sum + p.points, 0)
    const lastVisit = points.length > 0
      ? points.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0].created_at
      : null

    return { ...c, totalPoints, lastVisit }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
      <ClientesList clientes={clientesWithStats} />
    </div>
  )
}
