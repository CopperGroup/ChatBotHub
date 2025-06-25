// components/auth/login-form.tsx
"use client"

import { useState } from "react"
import Link from "next/link" // Re-import Link for Next.js App Router
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Zap, Loader2, Mail, Lock, ArrowRight, Check } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation" // Import useRouter for client-side navigation

export function LoginForm() {
  const router = useRouter(); // Initialize router
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)
  // New state for forgot password flow
  const [isForgotPasswordFlow, setIsForgotPasswordFlow] = useState(false)
  const [forgotPasswordEmailSent, setForgotPasswordEmailSent] = useState(false)


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
        localStorage.setItem("userId", data.user.id) // Store ONLY user ID
        toast.success(successMessage)
        setLoginSuccess(true)
        setTimeout(() => {
          router.push("/dashboard") // Use Next.js router for navigation
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

  // New function to handle forgot password request
  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setForgotPasswordEmailSent(false)

    if (!email) {
      setError("Please enter your email address.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        console.error("API Error during forgot password:", data)
        setError(data.message || "Failed to send password reset email.")
        toast.error(data.message || "Failed to send password reset email.")
      } else {
        toast.success(data.message || "If a user with that email exists, a password reset link has been sent.")
        setForgotPasswordEmailSent(true)
      }
    } catch (err) {
      console.error("Network or unexpected error during forgot password:", err)
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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          {isForgotPasswordFlow ? "Reset Your Password" : isRegistering ? "Create Your Account" : "Welcome Back"}
        </h1>
        <p className="text-slate-600 text-sm md:text-base">
          {isForgotPasswordFlow
            ? "Enter your email to receive a password reset link."
            : isRegistering
            ? "Sign up to get started with your AI dashboard"
            : "Sign in to access your AI dashboard"}
        </p>
      </div>

      <Card className="bg-white border-slate-200 shadow-xl">
        <CardContent className="p-6 md:p-8">
          {!isForgotPasswordFlow ? ( // Conditional rendering for login/register vs forgot password
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

              {/* Forgot password link */}
              {!isRegistering && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordFlow(true);
                      setError(""); // Clear any previous errors
                      setEmail(""); // Clear email field
                      setPassword(""); // Clear password field
                    }}
                    className="text-sm text-emerald-600 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

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
                <Link href="/dashboard"> {/* Use Next.js Link here */}
                  <Button
                    className="w-full h-11 md:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg transition-all duration-200 rounded-xl"
                  >
                    Success <Check className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </form>
          ) : ( // Forgot password form
            <form onSubmit={handleForgotPasswordRequest} className="space-y-6">
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

              {error && (
                <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {forgotPasswordEmailSent && (
                <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    If a user with that email exists, a password reset link has been sent to your inbox. Please check your email.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading || forgotPasswordEmailSent}
                className="w-full h-11 md:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg transition-all duration-200 rounded-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Link...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsForgotPasswordFlow(false);
                  setError("");
                  setForgotPasswordEmailSent(false);
                }}
                className="w-full h-11 md:h-12 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-all duration-200 rounded-xl"
              >
                Back to Login
              </Button>
            </form>
          )}

          {!isForgotPasswordFlow && ( // Hide this section when in forgot password flow
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
                        setEmail(""); // Clear fields on toggle
                        setPassword("");
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
                        setEmail(""); // Clear fields on toggle
                        setPassword("");
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}