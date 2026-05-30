// Route API — soumettre un avis (POST) ou modifier la visibilité (PATCH)
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

// Soumission d'un avis par une cliente (pas d'auth requise — UUID cliente comme accès)
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  const body = await request.json()
  const { cliente_id, rating, comment } = body

  if (!cliente_id || !rating) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Note invalide (1-5 requis)' }, { status: 400 })
  }

  // Vérifie que la cliente existe
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', cliente_id)
    .eq('role', 'cliente')
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Cliente introuvable' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({ cliente_id, rating, comment: comment || null })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}

// Masquer/afficher un avis — réservé à la pro
export async function PATCH(request: Request) {
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
  const { review_id, is_visible } = body

  if (!review_id || typeof is_visible !== 'boolean') {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  const { error } = await supabase
    .from('reviews')
    .update({ is_visible })
    .eq('id', review_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
