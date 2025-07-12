"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  Bell,
  Save,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Mail,
  DollarSign,
  CalendarDays,
  Check,
  ChevronDown,
} from "lucide-react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch"
import { Badge } from "../ui/badge"

interface UserPreferences {
  telegram?: boolean
  toasts?: boolean
  sound?: boolean
}

// Interface for Payment objects fetched from the main service (which gets them from payment service)
interface Payment {
  id: string
  userId: string
  websiteId: string
  type: "SUBSCRIPTION" | "TOKEN_PURCHASE"
  amount: number // in smallest currency unit (cents)
  currency: string
  stripePaymentIntentId?: string
  stripeSubscriptionId?: string
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELED"
  createdAt: string // Date string
  updatedAt: string // Date string
  description?: string
}

interface UserSettingsProps {
  user: {
    _id: string
    email: string
    preferences?: UserPreferences
  }
}

function SettingsLoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl space-y-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="px-4 md:px-6">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4 px-4 md:px-6">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Skeleton for transactions section */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="px-4 md:px-6">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3 px-4 md:px-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export function UserSettings({ user }: UserSettingsProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({ ...user.preferences })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [initialPreferences, setInitialPreferences] = useState<UserPreferences>({})
  const [payments, setPayments] = useState<Payment[] | null>(null)
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [paymentsError, setPaymentsError] = useState<string | null>(null)
  const [displayedPayments, setDisplayedPayments] = useState<Payment[]>([])
  const [currentDisplayCount, setCurrentDisplayCount] = useState(5)

  useEffect(() => {
    // Initialize preferences when user data is available
    if (user && user.preferences) {
      setPreferences(user.preferences)
      setInitialPreferences(user.preferences)
    }
  }, [user])

  useEffect(() => {
    const hasChanged = JSON.stringify(preferences) !== JSON.stringify(initialPreferences)
    setHasChanges(hasChanged)
  }, [preferences, initialPreferences])

  // Effect to fetch user payments
  useEffect(() => {
    const fetchUserPayments = async () => {
      if (!user?._id) {
        setPaymentsLoading(false)
        return
      }
      setPaymentsLoading(true)
      setPaymentsError(null)
      try {
        // Fetch payments from the main service's route
        const response = await authFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user._id.toString()}/payments`,
        )
        if (response.ok) {
          const data: Payment[] = await response.json()
          setPayments(data)
          // Show only first 5 initially
          setDisplayedPayments(data.slice(0, 5))
          setCurrentDisplayCount(5)
        } else {
          const errorData = await response.json()
          setPaymentsError(errorData.message || "Failed to fetch payments.")
          toast.error(errorData.message || "Failed to load payment history.")
        }
      } catch (err: any) {
        setPaymentsError(err.message || "An unexpected error occurred while fetching payments.")
        toast.error(err.message || "An unexpected error occurred while loading payment history.")
      } finally {
        setPaymentsLoading(false)
      }
    }

    fetchUserPayments()
  }, [user?._id])

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user._id.toString()}/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ preferences }),
        },
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update preferences")
      }
      const data = await response.json()
      setInitialPreferences(preferences)
      setHasChanges(false)
      toast.success("Settings saved successfully!")
    } catch (error: any) {
      console.error("Error saving preferences:", error)
      toast.error(error.message || "Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setPreferences(initialPreferences)
    setHasChanges(false)
    toast.info("Settings reset to last saved values")
  }

  const handleLoadMore = () => {
    if (payments) {
      const newCount = currentDisplayCount + 5
      setDisplayedPayments(payments.slice(0, newCount))
      setCurrentDisplayCount(newCount)
    }
  }

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case "SUBSCRIPTION":
        return <User className="w-4 h-4" />
      case "TOKEN_PURCHASE":
        return <DollarSign className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "SUBSCRIPTION":
        return "Plan Subscription"
      case "TOKEN_PURCHASE":
        return "Token Purchase"
      default:
        return "Payment"
    }
  }

  const remainingPayments = payments ? payments.length - currentDisplayCount : 0

  if (loading) {
    return <SettingsLoadingSkeleton />
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account preferences and dashboard settings</p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Account Information */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="flex items-center space-x-2 text-slate-900">
              <User className="w-5 h-5 text-emerald-600" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 md:px-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  value={user.email}
                  disabled
                  className="pl-10 bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed rounded-xl"
                />
              </div>
              <p className="text-xs text-slate-500">Contact support to change your email address</p>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">User ID</Label>
              <Input
                value={user._id.toString()}
                disabled
                className="bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed font-mono text-sm rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="flex items-center space-x-2 text-slate-900">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700 font-medium">Telegram Notifications</Label>
                <p className="text-sm text-slate-500">Receive notifications via telegram</p>
              </div>
              <Switch
                checked={preferences.telegram}
                onCheckedChange={(checked) => handlePreferenceChange("telegram", checked)}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700 font-medium">Push Notifications</Label>
                <p className="text-sm text-slate-500">Browser push notifications</p>
              </div>
              <Switch
                checked={preferences.toasts}
                onCheckedChange={(checked) => handlePreferenceChange("toasts", checked)}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700 font-medium">Sound Notifications</Label>
                <p className="text-sm text-slate-500">Play sound for new messages</p>
              </div>
              <Switch
                checked={preferences.sound}
                onCheckedChange={(checked) => handlePreferenceChange("sound", checked)}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button Section - Before Transactions */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasChanges || saving}
          className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl bg-transparent"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Changes
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Transactions History - Styled to Match App */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center space-x-2 text-slate-900">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span>Transaction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {paymentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paymentsError ? (
            <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{paymentsError}</AlertDescription>
            </Alert>
          ) : payments && payments.length > 0 ? (
            <div className="relative">
              {/* Transaction List - Height for exactly 5 items */}
              <div className="h-80 overflow-y-auto space-y-3 pr-2">
                {displayedPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                            payment.status === "SUCCEEDED"
                              ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                              : payment.status === "PENDING"
                                ? "bg-gradient-to-br from-amber-500 to-amber-600"
                                : "bg-gradient-to-br from-red-500 to-red-600"
                          }`}
                        >
                          {payment.status === "SUCCEEDED" ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : payment.status === "PENDING" ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center ${
                                payment.type === "SUBSCRIPTION"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              {getPaymentTypeIcon(payment.type)}
                            </div>
                            <p className="font-semibold text-slate-900 truncate text-sm">
                              {payment.description || getPaymentTypeLabel(payment.type)}
                            </p>
                          </div>
                          <div className="flex items-center text-xs text-slate-500">
                            <CalendarDays className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span>
                              {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              at{" "}
                              {new Date(payment.createdAt).toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p
                          className={`font-bold text-lg mb-1 ${
                            payment.status === "SUCCEEDED"
                              ? "text-emerald-700"
                              : payment.status === "PENDING"
                                ? "text-amber-700"
                                : "text-red-700"
                          }`}
                        >
                          ${(payment.amount / 100).toFixed(2)}
                        </p>
                        <Badge
                          className={`text-xs px-2 py-1 rounded-lg border ${
                            payment.status === "SUCCEEDED"
                              ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200"
                              : payment.status === "PENDING"
                                ? "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200"
                                : "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {payment.status.charAt(0) + payment.status.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Section with Improved Styling */}
              {remainingPayments > 0 && (
                <div className="relative mt-6 pt-4">
                  {/* Load More Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      onClick={handleLoadMore}
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl px-4 py-2 transition-all duration-200 font-medium"
                    >
                      <span>Load {Math.min(remainingPayments, 5)} more</span>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <DollarSign className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">No transactions yet</h3>
                <p className="text-slate-500 text-sm">Your payment history will appear here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
