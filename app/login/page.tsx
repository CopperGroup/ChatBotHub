"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import Waves from "@/components/ui/waves"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const userEmail = localStorage.getItem("userEmail")
    if (userEmail) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="max-h-screen bg-gradient-to-br from-slate-50/50 via-white to-slate-100/50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
