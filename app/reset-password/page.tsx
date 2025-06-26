import { ResetPasswordForm } from "../../components/auth/reset-password-form"

export default async function ResetPasswordPage({ searchParams }: { searchParams: { token: any }}) {

  const { token } = await searchParams;
     
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <ResetPasswordForm token={token} />
    </div>
  )
}