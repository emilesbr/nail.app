interface StatCardProps {
  title: string
  value: number
  icon: string
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="card flex flex-col items-center text-center gap-1">
      <span className="text-3xl">{icon}</span>
      <span className="text-2xl font-bold text-gray-900">{value.toLocaleString('fr-FR')}</span>
      <span className="text-sm text-gray-500">{title}</span>
    </div>
  )
}
