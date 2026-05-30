// Types TypeScript partagés entre l'espace pro et cliente

export type Role = 'pro' | 'cliente'

export interface Profile {
  id: string
  role: Role
  full_name: string
  email: string
  created_at: string
}

export interface FidelityPoint {
  id: string
  cliente_id: string
  points: number
  label: string
  created_by: string
  created_at: string
  // Relations jointes
  cliente?: Pick<Profile, 'id' | 'full_name' | 'email'>
  created_by_profile?: Pick<Profile, 'id' | 'full_name'>
}

export interface Review {
  id: string
  cliente_id: string
  rating: number
  comment: string | null
  is_visible: boolean
  created_at: string
  // Relation jointe
  cliente?: Pick<Profile, 'id' | 'full_name'>
}

export interface SalonSettings {
  salon_name: string
  points_per_visit: number
  points_for_reward: number
  reward_description: string
}

// Statistiques dashboard pro
export interface ProDashboardStats {
  active_clients_count: number
  points_distributed_this_month: number
  recent_reviews: Review[]
}

// Résumé fidélité d'une cliente
export interface ClienteFidelitySummary {
  total_points: number
  points_for_reward: number
  progress_percent: number
  visits_history: FidelityPoint[]
}
