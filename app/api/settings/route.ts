// Route API — lire et mettre à jour les paramètres du salon
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { data: proProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (proProfile?.role !== 'pro') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await request.json()
  const { salon_name, points_per_visit, points_for_reward, reward_description } = body

  if (!salon_name || !points_per_visit || !points_for_reward || !reward_description) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  // Upsert : crée si inexistant, met à jour sinon
  const { error } = await supabase
    .from('salon_settings')
    .upsert({
      salon_name,
      points_per_visit: Number(points_per_visit),
      points_for_reward: Number(points_for_reward),
      reward_description,
      updated_by: user.id,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
