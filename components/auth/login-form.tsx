// components/auth/login-form.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Zap, Loader2, Mail, Lock, ArrowRight, Check } from "lucide-react"
import { toast } from "sonner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setLoginSuccess(false)

    if (!email || !password) {
      setError("Email and password are required.")
      setLoading(false)
      return
    }

    const endpoint = isRegistering ? "register" : "login"
    const successMessage = isRegistering ? "Account created and logged in successfully!" : "Welcome back! Successfully logged in."

    console.log(`Attempting to ${endpoint} with email: ${email}`)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        console.error(`API Error during ${endpoint}:`, data)
        setError(data.message || `Failed to ${endpoint}.`)
        toast.error(data.message || `Failed to ${endpoint}.`)
      } else {
        console.log(`Successfully ${endpoint}. Storing minimal data.`, data)
        localStorage.setItem("userToken", data.token) // Store JWT token
        localStorage.setItem("userId", data.user.id) // FIX: Store ONLY user ID
        // localStorage.removeItem("userData"); // Optional: Ensure old userData is cleared if any was there
        toast.success(successMessage)
        setLoginSuccess(true)
        setTimeout(() => {

          window.location.href="/dashboard"
        }, 1000)
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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{isRegistering ? "Create Your Account" : "Welcome Back"}</h1>
        <p className="text-slate-600 text-sm md:text-base">{isRegistering ? "Sign up to get started with your AI dashboard" : "Sign in to access your AI dashboard"}</p>
      </div>

      <Card className="bg-white border-slate-200 shadow-xl">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="pl-10 h-11 md:h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {!loginSuccess ? (
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 md:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg transition-all duration-200 rounded-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isRegistering ? "Registering..." : "Signing in..."}</span>
                  </div>
                ) : (
                  isRegistering ? "Register Account" : "Sign In"
                )}
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button
                  className="w-full h-11 md:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg transition-all duration-200 rounded-xl"
                >
                  Success <Check className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </form>

          <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 text-center">
            <p className="text-xs md:text-sm text-slate-600">
              {isRegistering ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setIsRegistering(false);
                      setError("");
                      setLoginSuccess(false);
                    }}
                    className="text-emerald-600 hover:underline font-medium"
                    type="button"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New to our platform?{" "}
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setError("");
                      setLoginSuccess(false);
                    }}
                    className="text-emerald-600 hover:underline font-medium"
                    type="button"
                  >
                    Create an account
                  </button>{" "}
                  and get started instantly.
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}