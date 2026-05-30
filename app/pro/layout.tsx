// Layout espace prothésiste — vérifie l'authentification et le rôle 'pro'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import ProNav from '@/components/pro/ProNav'

export default async function ProLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'pro') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProNav proName={profile.full_name} />
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
