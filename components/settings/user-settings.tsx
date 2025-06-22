"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Bell, Palette, Save, RefreshCw, AlertTriangle, Loader2, Mail, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch"

interface UserPreferences {
  telegram?: boolean
  toasts?: boolean
  sound?: boolean
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
    <div className="space-y-6 p-4 md:p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white border-slate-200">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
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
    </div>
  )
}

export function UserSettings({ user }: UserSettingsProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({...user.preferences})

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [initialPreferences, setInitialPreferences] = useState<UserPreferences>({})

  useEffect(() => {
    const hasChanged = JSON.stringify(preferences) !== JSON.stringify(initialPreferences)
    setHasChanges(hasChanged)
  }, [preferences, initialPreferences])

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user._id.toString()}/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      })

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

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl ">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account preferences and dashboard settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900">
              <User className="w-5 h-5 text-emerald-600" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  value={user.email}
                  disabled
                  className="pl-10 bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500">Contact support to change your email address</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">User ID</Label>
              <Input
                value={user._id.toString()}
                disabled
                className="bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-700 font-medium">Telegram Notifications</Label>
                <p className="text-sm text-slate-500">Receive notifications via telegram</p>
              </div>
              <Switch
                checked={preferences.telegram}
                onCheckedChange={(checked) => handlePreferenceChange("telegram", checked)}
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
              />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Save Button at Bottom */}
      <div className="mt-8 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasChanges || saving}
          className="border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Changes
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
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
    </div>
  )
}
