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
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import BlurText from "@/components/ui/blur-text"

export function LoginForm() {
  const router = useRouter()
  const pathname = usePathname()
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
    const successMessage = isRegistering
      ? "Account created and logged in successfully!"
      : "Welcome back! Successfully logged in."

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
        localStorage.setItem("userToken", data.token)
        localStorage.setItem("userId", data.user.id)
        toast.success(successMessage)
        setLoginSuccess(true)
        setTimeout(() => {
          console.log(pathname)
          if(pathname.includes("dashboard")) {
            console.log("Refreshing")
            window.location.reload()
          } else {
            router.push("/dashboard")
          }
        }, 500)
      }
    } catch (err) {
      console.error("Network or unexpected error:", err)
      setError("Failed to connect to server or unexpected error occurred.")
      toast.error("Failed to connect to server or unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20" />
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-300/30 to-emerald-500/30 rounded-full blur-xl group-hover:scale-105 transition-transform duration-400" />
          <Zap className="w-8 h-8 text-white relative z-10" />
        </div>

        <div className="w-full inline-flex justify-center">
          <BlurText
            text={isForgotPasswordFlow ? "Reset Your Password" : isRegistering ? "Create Your Account" : "Welcome Back"}
            delay={150}
            animateBy="words"
            direction="top"
            className="text-3xl font-bold text-slate-900 mb-3"
          />
        </div>

        <p className="text-slate-600 text-base font-medium">
          {isForgotPasswordFlow
            ? "Enter your email to receive a password reset link."
            : isRegistering
              ? "Sign up to get started with your AI dashboard"
              : "Sign in to access your AI dashboard"}
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.002 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-green-50/20" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-500/10 rounded-full blur-2xl" />

          <CardContent className="p-8 relative z-10">
            {!isForgotPasswordFlow ? (
              // Login/Register Form
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 text-sm font-semibold">
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
                      className="pl-10 h-12 bg-white/60 border-slate-200/60 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 text-sm font-semibold">
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
                      className="pl-10 h-12 bg-white/60 border-slate-200/60 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Forgot password link */}
                {!isRegistering && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordFlow(true)
                        setError("")
                        setEmail("")
                        setPassword("")
                      }}
                      className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-semibold transition-colors duration-200"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-red-200/60 bg-gradient-to-r from-red-50/80 to-red-100/60 rounded-xl backdrop-blur-sm">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {!loginSuccess ? (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isRegistering ? "Creating Account..." : "Signing In..."}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>{isRegistering ? "Create Account" : "Sign In"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                ) : (
                  <Link href="/dashboard">
                    <Button className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                      <div className="flex items-center justify-center space-x-2">
                        <span>Success</span>
                        <Check className="w-4 h-4" />
                      </div>
                    </Button>
                  </Link>
                )}
              </form>
            ) : (
              // Forgot Password Form
              <form onSubmit={handleForgotPasswordRequest} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 text-sm font-semibold">
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
                      className="pl-10 h-12 bg-white/60 border-slate-200/60 text-slate-900 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-red-200/60 bg-gradient-to-r from-red-50/80 to-red-100/60 rounded-xl backdrop-blur-sm">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {forgotPasswordEmailSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-emerald-200/60 bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 rounded-xl backdrop-blur-sm">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-700 font-medium">
                        If a user with that email exists, a password reset link has been sent to your inbox. Please
                        check your email.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading || forgotPasswordEmailSent}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Link...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordFlow(false)
                    setError("")
                    setForgotPasswordEmailSent(false)
                  }}
                  variant="outline"
                  className="w-full h-12 border-slate-200/60 bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900 font-semibold shadow-sm hover:shadow-md transition-all duration-300 rounded-xl"
                >
                  Back to Login
                </Button>
              </form>
            )}

            {/* Toggle Section */}
            {!isForgotPasswordFlow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 p-4 bg-gradient-to-r from-slate-50/80 to-slate-100/60 rounded-xl border border-slate-200/60 text-center backdrop-blur-sm"
              >
                <p className="text-sm text-slate-600 font-medium">
                  {isRegistering ? (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          setIsRegistering(false)
                          setError("")
                          setLoginSuccess(false)
                          setEmail("")
                          setPassword("")
                        }}
                        className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold transition-colors duration-200"
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
                          setIsRegistering(true)
                          setError("")
                          setLoginSuccess(false)
                          setEmail("")
                          setPassword("")
                        }}
                        className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold transition-colors duration-200"
                        type="button"
                      >
                        Create an account
                      </button>{" "}
                      and get started instantly.
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
