// Route API — créditer des points à une cliente (POST)
// Accessible uniquement par la prothésiste (rôle 'pro' vérifié)
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Vérifie que l'utilisateur est bien une pro
  const { data: proProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (proProfile?.role !== 'pro') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await request.json()
  const { cliente_id, points, label } = body

  if (!cliente_id || !points || !label) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  if (typeof points !== 'number' || points <= 0 || points > 1000) {
    return NextResponse.json({ error: 'Valeur de points invalide' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('fidelity_points')
    .insert({
      cliente_id,
      points,
      label,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}
