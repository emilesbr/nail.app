// Page de demande de réinitialisation de mot de passe
import ResetPasswordForm from '@/components/pro/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NailApp</h1>
          <p className="text-gray-500 mt-2">Réinitialiser le mot de passe</p>
        </div>
        <div className="card">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
