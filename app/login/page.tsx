// Page de connexion — email/password pour la pro, Google pour les deux
import LoginForm from '@/components/pro/LoginForm'
import GoogleButton from '@/components/ui/GoogleButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NailApp</h1>
          <p className="text-gray-500 mt-2">Espace prothésiste</p>
        </div>
        <div className="card space-y-4">
          <LoginForm />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <GoogleButton />
        </div>
      </div>
    </div>
  )
}
