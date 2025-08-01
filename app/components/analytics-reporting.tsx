
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Target,
  Zap,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Users,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const emailVolumeData = [
  { date: '2024-01-01', received: 45, processed: 42, classified: 40, replied: 12 },
  { date: '2024-01-02', received: 67, processed: 65, classified: 62, replied: 18 },
  { date: '2024-01-03', received: 89, processed: 85, classified: 82, replied: 25 },
  { date: '2024-01-04', received: 123, processed: 118, classified: 115, replied: 34 },
  { date: '2024-01-05', received: 98, processed: 95, classified: 91, replied: 28 },
  { date: '2024-01-06', received: 156, processed: 152, classified: 148, replied: 45 },
  { date: '2024-01-07', received: 134, processed: 130, classified: 125, replied: 38 },
];

const classificationDistribution = [
  { name: 'Important', value: 342, color: '#EF4444', percentage: 28.5 },
  { name: 'Promotional', value: 456, color: '#8B5CF6', percentage: 38.0 },
  { name: 'Social', value: 234, color: '#3B82F6', percentage: 19.5 },
  { name: 'Spam', value: 123, color: '#F59E0B', percentage: 10.2 },
  { name: 'Other', value: 45, color: '#10B981', percentage: 3.8 },
];

const responseTimeData = [
  { hour: '00-04', avgTime: 850, emails: 20 },
  { hour: '04-08', avgTime: 920, emails: 35 },
  { hour: '08-12', avgTime: 1250, emails: 145 },
  { hour: '12-16', avgTime: 1180, emails: 167 },
  { hour: '16-20', avgTime: 1050, emails: 89 },
  { hour: '20-24', avgTime: 780, emails: 44 },
];

const accuracyTrendData = [
  { date: '2024-01-01', accuracy: 94.2, confidence: 87.3 },
  { date: '2024-01-02', accuracy: 95.1, confidence: 88.9 },
  { date: '2024-01-03', accuracy: 96.8, confidence: 91.2 },
  { date: '2024-01-04', accuracy: 95.5, confidence: 89.7 },
  { date: '2024-01-05', accuracy: 97.2, confidence: 92.4 },
  { date: '2024-01-06', accuracy: 96.1, confidence: 90.8 },
  { date: '2024-01-07', accuracy: 98.1, confidence: 94.1 },
];

export function AnalyticsReporting() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalEmails: 1200,
    processedEmails: 1156,
    avgAccuracy: 96.8,
    avgResponseTime: 1050,
    smartReplies: 289,
    errorRate: 2.1,
    uptime: 99.7,
    throughput: 156.2
  });

  const [realtimeStats, setRealtimeStats] = useState({
    emailsToday: 89,
    currentTrend: 'up',
    peakHour: '14:00',
    systemLoad: 23
  });

  useEffect(() => {
    fetchAnalytics();
    
    // Update real-time stats
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        emailsToday: prev.emailsToday + Math.floor(Math.random() * 3),
        systemLoad: Math.floor(Math.random() * 40) + 10
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await fetch(`/api/analytics/export?range=${timeRange}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gmail-management-report-${timeRange}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Report exported successfully');
      }
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics & Reporting</h1>
          <p className="text-slate-400 mt-2">
            Comprehensive insights into email processing performance and trends
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={fetchAnalytics}
            variant="outline" 
            size="sm"
            disabled={loading}
            className="border-slate-600 text-slate-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            onClick={exportReport}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Processed</CardTitle>
            <Mail className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.processedEmails.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-400 mt-1">
              {getTrendIcon(realtimeStats.currentTrend)}
              <span className="ml-1">+12% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Classification Accuracy</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.avgAccuracy}%</div>
            <div className="flex items-center text-xs text-green-400 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+0.8% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.avgResponseTime}ms</div>
            <div className="flex items-center text-xs text-green-400 mt-1">
              <TrendingDown className="w-3 h-3 mr-1" />
              <span>-50ms faster</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.uptime}%</div>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              <span>Excellent performance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Dashboard */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-3 text-green-400" />
            Real-time Dashboard
          </CardTitle>
          <CardDescription className="text-slate-400">
            Live system performance and activity metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{realtimeStats.emailsToday}</div>
              <div className="text-sm text-slate-400">Emails Today</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{realtimeStats.peakHour}</div>
              <div className="text-sm text-slate-400">Peak Hour</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{realtimeStats.systemLoad}%</div>
              <div className="text-sm text-slate-400">System Load</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{metrics.smartReplies}</div>
              <div className="text-sm text-slate-400">Smart Replies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Volume Trends */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Email Volume Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Email processing volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emailVolumeData}>
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="received" 
                    stackId="1"
                    stroke="#64748B" 
                    fill="#64748B" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="processed" 
                    stackId="2"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="classified" 
                    stackId="3"
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="replied" 
                    stackId="4"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Classification Distribution */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Classification Distribution</CardTitle>
            <CardDescription className="text-slate-400">
              Email categories breakdown for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classificationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {classificationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {classificationDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-300">{item.name}</span>
                  <span className="text-sm text-slate-400">({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Time Analysis */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Response Time Analysis</CardTitle>
            <CardDescription className="text-slate-400">
              Average processing time by hour of day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeData}>
                  <XAxis 
                    dataKey="hour" 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                  />
                  <Bar 
                    dataKey="avgTime" 
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Trends */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Accuracy Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Classification accuracy and confidence over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyTrendData}>
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    domain={[85, 100]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-300">Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-blue-500 border-dashed rounded-full"></div>
                <span className="text-sm text-slate-300">Confidence</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-3 text-blue-400" />
            Performance Summary
          </CardTitle>
          <CardDescription className="text-slate-400">
            Key performance indicators for the selected time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-slate-700 rounded-lg">
              <div className="text-lg font-semibold text-green-400">
                {((metrics.processedEmails / metrics.totalEmails) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-400 mt-1">Processing Success Rate</div>
              <div className="text-xs text-slate-500 mt-2">
                {metrics.processedEmails.toLocaleString()} / {metrics.totalEmails.toLocaleString()} emails
              </div>
            </div>
            
            <div className="text-center p-4 border border-slate-700 rounded-lg">
              <div className="text-lg font-semibold text-blue-400">{metrics.throughput.toFixed(1)}</div>
              <div className="text-sm text-slate-400 mt-1">Emails per Hour</div>
              <div className="text-xs text-slate-500 mt-2">Average throughput</div>
            </div>
            
            <div className="text-center p-4 border border-slate-700 rounded-lg">
              <div className="text-lg font-semibold text-red-400">{metrics.errorRate}%</div>
              <div className="text-sm text-slate-400 mt-1">Error Rate</div>
              <div className="text-xs text-slate-500 mt-2">System reliability</div>
            </div>
            
            <div className="text-center p-4 border border-slate-700 rounded-lg">
              <div className="text-lg font-semibold text-purple-400">{metrics.smartReplies}</div>
              <div className="text-sm text-slate-400 mt-1">AI Replies Generated</div>
              <div className="text-xs text-slate-500 mt-2">Automation efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
