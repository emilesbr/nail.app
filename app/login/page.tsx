// Page de connexion pour la prothésiste
import LoginForm from '@/components/pro/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NailApp</h1>
          <p className="text-gray-500 mt-2">Espace prothésiste</p>
        </div>
        <div className="card">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
