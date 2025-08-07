"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, Clock, Users, AlertTriangle, CheckCircle, Workflow, BarChart3, Zap } from "lucide-react";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LabelList, CartesianGrid } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  chatbotPerformance: {
    totalChats: number;
    chatStatus: {
      open: number;
      closed: number;
    };
    interactionRate: {
      aiHandledChats: number;
      humanHandledChats: number;
    };
    averageDuration: number;
    topQueries: { query: string; count: number }[];
    workflowCompletionRate: number;
    workflowBottlenecks: { blockId: string; blockName: string; count: number }[];
  };
  staffPerformance: { staffId: string; handledChats: number }[];
}

interface WebsiteAnalyticsProps {
  websiteId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-3xl" />
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-md text-sm text-slate-700">
        <p className="font-bold mb-1">{`${label}`}</p>
        <p className="font-medium">Queries: <span className="text-emerald-500">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export function WebsiteAnalytics({ websiteId }: WebsiteAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await authFetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ websiteId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch analytics.");
        }

        const data: AnalyticsData = await res.json();
        setAnalytics(data);

      } catch (error: any) {
        toast.error(error.message || "Failed to fetch analytics data.");
        setAnalytics(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [websiteId]);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl text-center text-slate-500 min-h-[300px]">
        <AlertTriangle className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold">No Analytics Data Available</h2>
        <p className="mt-2 text-sm">Failed to fetch data. Please check your service connection and try again.</p>
      </div>
    );
  }

  const chatStatusData = [
    { name: 'Open', value: analytics.chatbotPerformance.chatStatus.open },
    { name: 'Closed', value: analytics.chatbotPerformance.chatStatus.closed },
  ];

  const topQueriesData = analytics.chatbotPerformance.topQueries.map(item => ({
    name: item.query,
    count: item.count,
  }));
  
  const workflowBottlenecksData = analytics.chatbotPerformance.workflowBottlenecks.map(item => ({
    name: item.blockName,
    count: item.count,
  }));

  return (
    <div className="space-y-6">
      {/* Top-level metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Total Chats
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-slate-900">{analytics.chatbotPerformance.totalChats}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Avg. Chat Duration
            </CardTitle>
            <Clock className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-slate-900">
              {analytics.chatbotPerformance.averageDuration}s
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Workflow Completion
            </CardTitle>
            <Workflow className="h-5 w-5 text-pink-600" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-slate-900">
              {analytics.chatbotPerformance.workflowCompletionRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Chat Status & Interaction</CardTitle>
            <CardDescription>Breakdown of conversation status and how they were handled.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center md:justify-around p-6">
            <div className="w-full md:w-1/2 h-[200px] md:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chatStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chatStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center items-center mt-2 space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-[#0088FE]" />
                  <span className="text-xs text-slate-600">Open</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-[#00C49F]" />
                  <span className="text-xs text-slate-600">Closed</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-8">
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Interaction Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    <CheckCircle className="h-4 w-4 mr-1" /> AI Handled
                  </Badge>
                  <span className="text-sm text-slate-700 font-medium">{analytics.chatbotPerformance.interactionRate.aiHandledChats} chats</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Users className="h-4 w-4 mr-1" /> Staff Handled
                  </Badge>
                  <span className="text-sm text-slate-700 font-medium">{analytics.chatbotPerformance.interactionRate.humanHandledChats} chats</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Top User Queries</CardTitle>
            <CardDescription>The most common questions asked by your visitors.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topQueriesData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  stroke="#64748b"
                  interval={0}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#4ade80" minPointSize={2} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed insights section */}
      <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Workflow & Staff Insights</CardTitle>
          <CardDescription>Identify drop-off points and review staff chat performance.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Workflow Bottlenecks</h3>
              {workflowBottlenecksData.length > 0 ? (
                <div className="space-y-3">
                  {workflowBottlenecksData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      <Badge variant="outline" className="border-red-200 text-red-700">
                        {item.count} drop-offs
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No workflow bottlenecks identified.</p>
              )}
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Staff Performance</h3>
              {analytics.staffPerformance.length > 0 ? (
                <div className="space-y-3">
                  {analytics.staffPerformance.map((staff, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Staff Member #{index + 1}</span>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {staff.handledChats} chats
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No staff-handled chats found.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}