// Paramètres du salon — nom, règle de fidélité
import { createSupabaseServerClient } from '@/lib/supabase'
import SettingsForm from '@/components/pro/SettingsForm'

export default async function ParametresPage() {
  const supabase = await createSupabaseServerClient()

  const { data: settings } = await supabase
    .from('salon_settings')
    .select('*')
    .single()

  const defaultSettings = {
    salon_name: '',
    points_per_visit: 10,
    points_for_reward: 100,
    reward_description: '1 soin offert',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      <div className="card">
        <SettingsForm initialSettings={settings ?? defaultSettings} />
      </div>
    </div>
  )
}
