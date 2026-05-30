// Liste des avis reçus avec contrôle de visibilité
import { createSupabaseServerClient } from '@/lib/supabase'
import ReviewsList from '@/components/pro/ReviewsList'

export default async function AvisPage() {
  const supabase = await createSupabaseServerClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, cliente:profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Avis reçus</h1>
      <ReviewsList reviews={reviews ?? []} />
    </div>
  )
}
