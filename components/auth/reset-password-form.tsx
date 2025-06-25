// components/auth/reset-password-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation" // Use Next.js specific hook for App Router
import Link from "next/link" // Re-import Link for Next.js App Router
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Zap, Loader2, Lock, Check } from "lucide-react"
import { toast } from "sonner"

export function ResetPasswordForm({ token }: { token: string }) {

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [tokenValidated, setTokenValidated] = useState(false) // State to check if token is present

  useEffect(() => {
    // Check if a token is present in the URL on component mount
    if (token) {
      setTokenValidated(true);
    } else {
      setError("No reset token found in the URL. Please use the link from your email.")
      setTokenValidated(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResetSuccess(false)

    if (!token) {
      setError("No reset token found. Please use the link from your email.")
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.")
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        console.error("API Error during password reset:", data)
        setError(data.message || "Failed to reset password.")
        toast.error(data.message || "Failed to reset password.")
      } else {
        toast.success(data.message || "Your password has been successfully reset.")
        setResetSuccess(true)
      }
    } catch (err) {
      console.error("Network or unexpected error:", err)
      setError("Failed to connect to server or unexpected error occurred.")
      toast.error("Failed to connect to server or unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 md:mb-6 shadow-lg">
          <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Reset Your Password</h1>
        <p className="text-slate-600 text-sm md:text-base">
          {tokenValidated
            ? "Enter your new password below."
            : "Invalid or missing token. Please use the link provided in your email."}
        </p>
      </div>

      <Card className="bg-white border-slate-200 shadow-xl">
        <CardContent className="p-6 md:p-8">
          {!tokenValidated || resetSuccess ? (
            <div className="text-center">
              {resetSuccess ? (
                <>
                  <p className="text-lg text-emerald-700 font-semibold mb-4">Password reset successful!</p>
                  <Link href="/login"> {/* Use Next.js Link here */}
                    <Button
                      className="w-full h-11 md:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg transition-all duration-200 rounded-xl"
                    >
                      Go to Login
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {error && (
                    <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-xl mb-4">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}
                  <p className="text-slate-600">Please return to the login page or request a new reset link.</p>
                  <Link href="/login"> {/* Use Next.js Link here */}
                    <Button
                      className="w-full h-11 md:h-12 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-all duration-200 rounded-xl mt-4"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-slate-700 text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    className="pl-10 h-11 md:h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    className="pl-10 h-11 md:h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 md:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg transition-all duration-200 rounded-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}