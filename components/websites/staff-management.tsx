import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Plus,
  Trash2,
  Mail,
  Crown,
  AlertTriangle,
  Info,
  Loader2,
  UserCheck,
  Shield,
  Calendar,
  Settings,
  UserPlus,
  Building2,
  Copy, // Import the Copy icon
} from "lucide-react"
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
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

  // Staff Login URL
  const staffLoginUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/staff/login`;

  useEffect(() => {
    if (currentWebsiteId && currentUserId) {
      loadStaffMembers()
    }
  }, [currentWebsiteId, currentUserId])

  const loadStaffMembers = async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/${currentWebsiteId}?userId=${currentUserId}`,
      )
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
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/${currentWebsiteId}`, {
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
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/staff/${staffId}`, {
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

  const handleCopyStaffLoginUrl = () => {
    navigator.clipboard.writeText(staffLoginUrl);
    toast.success("Staff Login URL copied to clipboard!");
  };

  const { staffMembers, planInfo } = staffData
  if (initialLoading) {
    return <StaffLoadingSkeleton />
  }

  // Determine if the plan is Enterprise and if the staff limit is reached
  const isEnterpriseAndFull = planInfo?.planName === "Enterprise"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">Manage your team members and their access permissions</p>
        </div>
        {/* Stats Cards */}
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Staff List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Staff Login URL Card (MOVED TO TOP LEFT) */}
            <Card className="border-0 shadow-lg rounded-2xl bg-blue-600">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-100">Staff Login Portal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Share this link with your staff members</p>
                      <p className="text-xs text-gray-500 break-all">{staffLoginUrl}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyStaffLoginUrl}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg p-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Staff Members Card */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">Team Members</CardTitle>
                      <p className="text-gray-500 text-sm">Manage your team access and permissions</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    disabled={planInfo && !planInfo.canAddMore}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg font-semibold px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Staff Form */}
                {showAddForm && (
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    {planInfo && !planInfo.canAddMore ? (
                      <Alert className="border-red-200 bg-red-50 rounded-xl">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Cannot add more staff members. Your {planInfo.planName} plan allows maximum of {planInfo.max}{" "}
                          staff members. Currently using {planInfo.current}/{planInfo.max}.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <form onSubmit={handleAddStaff} className="space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-emerald-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Add New Team Member</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
                              Full Name
                            </Label>
                            <Input
                              id="name"
                              value={newStaff.name}
                              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                              placeholder="John Doe"
                              className="h-12 bg-white border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={newStaff.email}
                              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                              placeholder="john@example.com"
                              className="h-12 bg-white border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={newStaff.password}
                            onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                            placeholder="Enter secure password"
                            className="h-12 bg-white border-gray-200 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                            required
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg font-semibold h-12 px-6"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Adding Member...
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add Team Member
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddForm(false)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 px-6"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
                {/* Staff List */}
                <div className="space-y-4">
                  {staffMembers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No team members yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Add team members to help manage customer conversations and provide better support.
                      </p>
                      {planInfo && (
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-xl">
                          <Crown className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700">
                            Your {planInfo.planName} plan allows up to {planInfo.max} team members
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    staffMembers.map((staff) => (
                      <Card
                        key={staff._id}
                        className="border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <UserCheck className="w-6 h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{staff.name}</h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <p className="text-sm text-gray-600">{staff.email}</p>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Added {new Date(staff.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 rounded-lg px-3 py-1">
                                Active
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteStaff(staff._id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg p-2"
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
              </CardContent>
            </Card>
          </div>
          {/* Right Column - Plan Info & Actions */}
          <div className="space-y-8">
            {/* Upgrade Plan Card - Only show if NOT Enterprise plan OR (if it's Enterprise and not full) */}
            {planInfo && !isEnterpriseAndFull && (
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden p-0">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <Crown className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Need More Team Members?</h3>
                  </div>
                  <p className="text-emerald-100 text-sm mb-6">
                    Upgrade your plan to add more team members and unlock additional features for better team
                    collaboration.
                  </p>
                  <Button className="bg-white text-emerald-600 hover:bg-gray-50 font-semibold rounded-xl w-full shadow-lg">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
              </Card>
            )}

            {/* Plan Information */}
            {planInfo && (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900">Plan Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Staff Limit</p>
                          <p className="text-xs text-gray-500">Maximum team members</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">
                          {planInfo.current}/{planInfo.max}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Crown className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Plan</p>
                          <p className="text-xs text-gray-500">Active subscription</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-600">{planInfo.planName}</p>
                      </div>
                    </div>
                  </div>
                  {/* Plan Status Alert */}
                  {planInfo.canAddMore ? (
                    <Alert className="border-emerald-200 bg-emerald-50 rounded-xl">
                      <Info className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        <p className="font-medium mb-1">You can add more team members</p>
                        <p className="text-sm">
                          {planInfo.max - planInfo.current} slots remaining on your {planInfo.planName} plan.
                        </p>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-amber-200 bg-amber-50 rounded-xl">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        <p className="font-medium mb-1">Plan limit reached</p>
                        <p className="text-sm">
                          You've reached the maximum number of staff members for your {planInfo.planName} plan.
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
            {/* Quick Actions */}
          </div>
        </div>
      </div>
    </div>
  )
}