"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart } from "recharts"
import { Calendar, TrendingUp, Zap, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { authFetch } from "@/lib/authFetch"

interface TokenUsageChartProps {
  websiteId: string
}

type TimeRange = "day" | "week" | "month"

interface ChartData {
  date: string
  usage: number
  formattedDate: string
}

export function TokenUsageChart({ websiteId }: TokenUsageChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("week")
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalUsage, setTotalUsage] = useState(0)

  // Calculate date ranges
  const getDateRange = (range: TimeRange) => {
    const endDate = new Date()
    const startDate = new Date()
    switch (range) {
      case "day":
        startDate.setDate(endDate.getDate() - 6) // Last 7 days
        break
      case "week":
        startDate.setDate(endDate.getDate() - 27) // Last 4 weeks (28 days)
        break
      case "month":
        startDate.setDate(endDate.getDate() - 89) // Last 3 months (90 days)
        break
    }
    return {
      startDate: startDate.toISOString().split("T")[0], // YYYY-MM-DD format
      endDate: endDate.toISOString().split("T")[0],
    }
  }

  // Format date for display
  const formatDateForDisplay = (dateString: string, range: TimeRange) => {
    const date = new Date(dateString)
    switch (range) {
      case "day":
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      case "week":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      case "month":
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      default:
        return dateString
    }
  }

  // Fetch token usage data
  const fetchTokenUsage = async (range: TimeRange) => {
    setLoading(true)
    setError(null)
    try {
      const { startDate, endDate } = getDateRange(range)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TOKEN_API_BASE_URL}/tokens/usage/range/${websiteId}/${startDate}/${endDate}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch token usage data")
      }
      const data = await response.json()

      // Transform data for chart
      const transformedData: ChartData[] = Object.entries(data)
        .map(([date, usage]) => ({
          date,
          usage: usage as number,
          formattedDate: formatDateForDisplay(date, range),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Calculate total usage
      const total = transformedData.reduce((sum, item) => sum + item.usage, 0)
      setChartData(transformedData)
      setTotalUsage(total)
    } catch (err) {
      console.error("Error fetching token usage:", err)
      setError(err instanceof Error ? err.message : "Failed to load token usage data")
      toast.error("Failed to load token usage data")
    } finally {
      setLoading(false)
    }
  }

  // Effect to fetch data when component mounts or range changes
  useEffect(() => {
    fetchTokenUsage(selectedRange)
  }, [selectedRange, websiteId])

  // Calculate average usage
  const averageUsage = chartData.length > 0 ? Math.round(totalUsage / chartData.length) : 0

  // Find peak usage
  const peakUsage = chartData.length > 0 ? Math.max(...chartData.map((d) => d.usage)) : 0

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
        <CardHeader className="px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <Skeleton className="h-6 w-48" />
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
        <CardContent className="px-4 md:px-6 py-6">
          <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
          <Button
            onClick={() => fetchTokenUsage(selectedRange)}
            className="mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl relative overflow-hidden">
      <CardHeader className="px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span>Token Usage Analytics</span>
          </CardTitle>
          <div className="flex space-x-2">
            {(["day", "week", "month"] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={selectedRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(range)}
                className={
                  selectedRange === range
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl shadow-md"
                    : "border-slate-200/60 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-2xl bg-white/60 shadow-sm"
                }
              >
                {range === "day" && "7 Days"}
                {range === "week" && "4 Weeks"}
                {range === "month" && "3 Months"}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Total Usage</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{totalUsage.toLocaleString()}</div>
            <div className="text-xs text-purple-700">
              {selectedRange === "day" && "Last 7 days"}
              {selectedRange === "week" && "Last 4 weeks"}
              {selectedRange === "month" && "Last 3 months"}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Daily Average</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{averageUsage.toLocaleString()}</div>
            <div className="text-xs text-blue-700">Tokens per day</div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Peak Usage</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{peakUsage.toLocaleString()}</div>
            <div className="text-xs text-green-700">Highest single day</div>
          </div>
        </div>
        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {selectedRange === "day" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [value.toLocaleString() + " tokens", "Usage"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="usage" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [value.toLocaleString() + " tokens", "Usage"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#a855f7", strokeWidth: 2, fill: "white" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        {chartData.length === 0 && (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No token usage data available for the selected period.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
