"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, Trash2, Mail, Crown, AlertTriangle, Info, Loader2, UserCheck } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { authFetch } from "@/lib/authFetch"

interface StaffManagementProps {
  website?: any
  websiteId?: string
  userId?: string
}

function StaffLoadingSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function StaffManagement({ website, websiteId, userId }: StaffManagementProps) {
  const [staffData, setStaffData] = useState({ staffMembers: [], planInfo: null })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Use websiteId from props or website object
  const currentWebsiteId = websiteId || website?._id
  const currentUserId = userId

  useEffect(() => {
    if (currentWebsiteId && currentUserId) {
      loadStaffMembers()
    }
  }, [currentWebsiteId, currentUserId])

  const loadStaffMembers = async () => {
    try {
      const res = await authFetch(`http://192.168.32.1:3001/api/staff/${currentWebsiteId}?userId=${currentUserId}`)
      const data = await res.json()
      if (res.ok) {
        setStaffData(data)
      }
    } catch (err) {
      console.error("Failed to load staff members:", err)
      toast.error("Failed to load staff members")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleAddStaff = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await authFetch(`http://192.168.32.1:3001/api/staff/${currentWebsiteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStaff,
          userId: currentUserId,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.planLimitation) {
          toast.error(data.message, {
            description: `Current plan: ${data.currentPlan} (${data.currentStaff}/${data.maxStaff} staff members)`,
          })
        } else {
          toast.error(data.message || "Failed to add staff member.")
        }
      } else {
        toast.success("Staff member added successfully!")
        setNewStaff({ name: "", email: "", password: "" })
        setShowAddForm(false)
        loadStaffMembers()
      }
    } catch (err) {
      toast.error("Failed to connect to server.")
    }
    setLoading(false)
  }

  const handleDeleteStaff = async (staffId) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return

    try {
      const res = await authFetch(`http://192.168.32.1:3001/api/staff/${staffId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to delete staff member.")
      } else {
        toast.success("Staff member deleted successfully!")
        loadStaffMembers()
      }
    } catch (err) {
      toast.error("Failed to connect to server.")
    }
  }

  const { staffMembers, planInfo } = staffData

  if (initialLoading) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <StaffLoadingSkeleton />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <CardTitle className="text-xl text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Staff Management</span>
            {planInfo && (
              <Badge
                variant="outline"
                className="ml-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 rounded-lg"
              >
                {planInfo.planName} Plan
              </Badge>
            )}
          </CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={planInfo && !planInfo.canAddMore}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6">
        {/* Plan Information */}
        {planInfo && (
          <Alert
            className={`rounded-xl shadow-sm ${
              planInfo.canAddMore
                ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100"
                : "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100"
            }`}
          >
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <span className="text-sm">
                  Staff Members:{" "}
                  <span className="font-semibold">
                    {planInfo.current}/{planInfo.max}
                  </span>{" "}
                  used
                </span>
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-sm">{planInfo.planName} Plan</span>
                </div>
              </div>
              {!planInfo.canAddMore && (
                <div className="mt-2 text-amber-700 text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  You've reached the maximum number of staff members for your plan. Upgrade to add more staff.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Add Staff Form */}
        {showAddForm && (
          <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 shadow-sm">
            <CardContent className="p-4 md:p-6">
              {planInfo && !planInfo.canAddMore ? (
                <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Cannot add more staff members. Your {planInfo.planName} plan allows maximum of {planInfo.max} staff
                    members. Currently using {planInfo.current}/{planInfo.max}.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                        placeholder="john@example.com"
                        className="bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                      placeholder="Enter password"
                      className="bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Staff Member"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Staff List */}
        <div className="space-y-4">
          {staffMembers.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No staff members yet</h3>
              <p className="text-slate-600 mb-4">Add staff members to help manage customer conversations</p>
              {planInfo && (
                <p className="text-sm text-slate-500">
                  Your {planInfo.planName} plan allows up to {planInfo.max} staff members
                </p>
              )}
            </div>
          ) : (
            staffMembers.map((staff) => (
              <Card key={staff._id} className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 truncate">{staff.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <p className="text-sm text-slate-600 truncate">{staff.email}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Added {new Date(staff.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-start sm:self-center">
                      <Badge
                        variant="outline"
                        className="bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 rounded-lg"
                      >
                        Active
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStaff(staff._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Plan Upgrade Suggestion */}
        {planInfo && !planInfo.canAddMore && (
          <Alert className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl shadow-sm">
            <Crown className="h-4 w-4 text-emerald-600" />
            <AlertDescription>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <p className="font-medium text-emerald-800">Need more staff members?</p>
                  <p className="text-sm text-emerald-700">
                    Upgrade your plan to add more team members and unlock additional features.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-sm w-full sm:w-auto"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
