import { ResetPasswordForm } from "../../components/auth/reset-password-form"

export default function ResetPasswordPage({ searchParams }: { searchParams: { token: any }}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <ResetPasswordForm token={searchParams.token} />
    </div>
  )
}