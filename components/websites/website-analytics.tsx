"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, Clock, Users, AlertTriangle, CheckCircle, Workflow, Zap, Globe } from "lucide-react";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
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
    topQueries: { query: string; count: number }[];
    workflowCompletionRate: number;
    workflowBottlenecks: { blockId: string; blockName: string; count: number }[];
    chatDuration: {
      avgAiMessages: number;
      avgStaffMessages: number;
    };
    timeDuration: {
      avgAiDuration: number;
      avgStaffDuration: number;
    };
    chatHandoffRate: number;
    chatVolumeOverTime: { date: string; count: number }[];
  };
  staffPerformance: { staffId: string; name: string; email: string; handledChats: number }[];
  geographicDistribution: { country: string; countryCode: string; flag: string; count: number }[];
}

interface WebsiteAnalyticsProps {
  websiteId: string;
}

const PIE_COLORS = ['#34d399', '#6ee7b7'];

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-md text-sm text-slate-700 max-w-sm">
        <p className="font-bold mb-1 break-words">{`${label}`}</p>
        <p className="font-medium">Queries: <span className="text-emerald-500">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

const CustomTick = ({ x, y, payload }: any) => {
  const maxLength = 25;
  const label = payload.value.length > maxLength ? `${payload.value.substring(0, maxLength)}...` : payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#64748b" transform="rotate(-45)" className="text-xs">
        {label}
      </text>
    </g>
  );
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

  const chatVolumeData = analytics.chatbotPerformance.chatVolumeOverTime;

  return (
    <div className="space-y-6">
      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Chat Handoff
            </CardTitle>
            <Zap className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-slate-900">
              {analytics.chatbotPerformance.chatHandoffRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Avg. Duration
            </CardTitle>
            <Clock className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-slate-900">
              {analytics.chatbotPerformance.timeDuration?.avgAiDuration}s
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Avg. Staff Duration
            </CardTitle>
            <Clock className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-slate-900">
              {analytics.chatbotPerformance.timeDuration?.avgStaffDuration}s
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Avg. AI Messages
            </CardTitle>
            <Zap className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-slate-900">
              {analytics.chatbotPerformance.chatDuration?.avgAiMessages}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Avg. Staff Messages
            </CardTitle>
            <Zap className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent className="px-6">
            <div className="text-2xl font-bold text-slate-900">
              {analytics.chatbotPerformance.chatDuration?.avgStaffMessages}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
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
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    cornerRadius={5} // Added for smoother corners
                  >
                    {chatStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center items-center mt-2 space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-[#34d399]" />
                  <span className="text-xs text-slate-600">Open</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-[#6ee7b7]" />
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
            <CardDescription>The most common questions asked after a bot response.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topQueriesData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  stroke="#64748b"
                  interval={0}
                  tick={<CustomTick />}
                />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomTooltip />} />
                <Bar dataKey="count" fill="url(#emeraldGradient)" minPointSize={2} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Workflow Bottlenecks</CardTitle>
            <CardDescription>Chats that did not reach a final 'end' block.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={workflowBottlenecksData} margin={{ left: 80, right: 20 }}>
                <defs>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="name" stroke="#64748b" />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" fill="url(#redGradient)" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Geographic Distribution</CardTitle>
            <CardDescription>Chats by country.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {analytics.geographicDistribution.length > 0 ? (
              <div className="space-y-3">
                {analytics.geographicDistribution.map((geo, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {geo.flag && (
                        <img 
                          src={geo.flag} 
                          alt={`${geo.country} flag`} 
                          className="h-4 w-6 rounded border border-slate-200" 
                        />
                      )}
                      <span className="text-sm font-medium text-slate-700">{geo.country} ({geo.countryCode})</span>
                    </div>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                      {geo.count} chats
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No geographic data available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Chat Volume Over Time</CardTitle>
            <CardDescription>Trend of daily chat initiations.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chatVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fill="url(#volumeGradient)"
                  activeDot={{ r: 8 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-slate-50 to-white border-slate-200/60 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Staff Performance</CardTitle>
            <CardDescription>Chat volume handled by each staff member.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {analytics.staffPerformance.length > 0 ? (
              <div className="space-y-3">
                {analytics.staffPerformance.map((staff, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{staff.name || 'Unknown Staff'}</h4>
                      <p className="text-xs text-slate-500 truncate">{staff.email || 'No email provided'}</p>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {staff.handledChats} chats
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No staff-handled chats found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}