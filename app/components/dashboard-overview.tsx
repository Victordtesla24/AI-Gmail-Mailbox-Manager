
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Mail,
  PlayCircle,
  PauseCircle,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Bell,
  Zap,
  BarChart3,
  Shield
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const emailProcessingData = [
  { time: '00:00', processed: 12, classified: 11 },
  { time: '04:00', processed: 8, classified: 8 },
  { time: '08:00', processed: 45, classified: 43 },
  { time: '12:00', processed: 67, classified: 65 },
  { time: '16:00', processed: 38, classified: 36 },
  { time: '20:00', processed: 23, classified: 22 },
];

const classificationData = [
  { name: 'Important', value: 156, color: '#3B82F6' },
  { name: 'Promotional', value: 89, color: '#8B5CF6' },
  { name: 'Social', value: 67, color: '#10B981' },
  { name: 'Spam', value: 34, color: '#EF4444' },
  { name: 'Other', value: 78, color: '#F59E0B' },
];

const performanceData = [
  { metric: 'Response Time', value: 245, unit: 'ms' },
  { metric: 'Accuracy', value: 96.8, unit: '%' },
  { metric: 'Uptime', value: 99.2, unit: '%' },
  { metric: 'Success Rate', value: 98.7, unit: '%' },
];

export function DashboardOverview() {
  const [systemStats, setSystemStats] = useState({
    totalEmails: 2140,
    processedToday: 245,
    smartReplies: 89,
    activeAccounts: 2,
    workflowStatus: 'running',
    lastSync: new Date(),
    errorCount: 3,
    avgProcessingTime: 1250
  });

  const [realtimeData, setRealtimeData] = useState({
    emailsPerMinute: 0,
    currentLoad: 23,
    queueSize: 12
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        emailsPerMinute: Math.floor(Math.random() * 8) + 2,
        currentLoad: Math.floor(Math.random() * 30) + 15,
        queueSize: Math.floor(Math.random() * 20) + 5
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-2">Real-time monitoring of your Gmail Mailbox Management System</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="border-green-500/50 text-green-400">
            <Activity className="w-3 h-3 mr-1" />
            System Active
          </Badge>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Full Reports
          </Button>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.totalEmails.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+245</span> processed today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Smart Replies</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.smartReplies}</div>
            <p className="text-xs text-slate-400">
              Generated today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Accounts</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.activeAccounts}</div>
            <p className="text-xs text-slate-400">
              Gmail accounts connected
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Response</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemStats.avgProcessingTime}ms</div>
            <p className="text-xs text-slate-400">
              Processing time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-400" />
              Real-time Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Emails/min</span>
              <span className="text-2xl font-bold text-green-400">{realtimeData.emailsPerMinute}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Current Load</span>
                <span className="text-sm text-white">{realtimeData.currentLoad}%</span>
              </div>
              <Progress value={realtimeData.currentLoad} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Queue Size</span>
              <span className="text-sm text-white">{realtimeData.queueSize} emails</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PlayCircle className="w-5 h-5 mr-2 text-blue-400" />
              Workflow Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Status</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Running
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Execution Count</span>
              <span className="text-sm text-white">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Last Error</span>
              <span className="text-sm text-orange-400">3 errors</span>
            </div>
            <Button size="sm" variant="outline" className="w-full border-slate-600">
              <PauseCircle className="w-4 h-4 mr-2" />
              Pause Workflow
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-400" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{item.metric}</span>
                <span className="text-sm font-semibold text-white">
                  {item.value}{item.unit}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Email Processing Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Processed vs Classified emails over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emailProcessingData}>
                  <XAxis 
                    dataKey="time" 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="processed" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="classified" 
                    stackId="2"
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Email Classification</CardTitle>
            <CardDescription className="text-slate-400">
              Distribution of classified emails by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {classificationData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-300">{item.name}</span>
                  <span className="text-sm text-slate-400">({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-slate-400">
            Latest system events and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: 'success',
                icon: CheckCircle2,
                message: 'Successfully processed 45 emails from melbvicduque@gmail.com',
                time: '2 minutes ago',
                color: 'text-green-400'
              },
              {
                type: 'info',
                icon: MessageSquare,
                message: 'Generated 12 smart replies with 96% confidence',
                time: '5 minutes ago',
                color: 'text-blue-400'
              },
              {
                type: 'warning',
                icon: AlertTriangle,
                message: 'Gmail API rate limit reached for sarkar.vikram@gmail.com',
                time: '12 minutes ago',
                color: 'text-orange-400'
              },
              {
                type: 'success',
                icon: Bell,
                message: 'Sent 8 notifications via SMS and email',
                time: '18 minutes ago',
                color: 'text-green-400'
              }
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30">
                  <Icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
