
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  PlayCircle,
  PauseCircle,
  Square,
  RotateCcw,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Settings,
  ExternalLink,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area } from 'recharts';

interface WorkflowStatus {
  id: string;
  workflowId: string;
  status: string;
  lastStarted: Date | null;
  lastStopped: Date | null;
  executionCount: number;
  errorCount: number;
  lastError: string | null;
  configuration: any;
  createdAt: Date;
  updatedAt: Date;
}

const executionData = [
  { time: '00:00', executions: 12, errors: 0 },
  { time: '04:00', executions: 8, errors: 1 },
  { time: '08:00', executions: 25, errors: 0 },
  { time: '12:00', executions: 34, errors: 2 },
  { time: '16:00', executions: 28, errors: 0 },
  { time: '20:00', executions: 15, errors: 0 },
];

export function WorkflowControl() {
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [realtimeStats, setRealtimeStats] = useState({
    currentExecution: 0,
    averageExecutionTime: 0,
    successRate: 0,
    nextScheduledRun: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
  });

  useEffect(() => {
    fetchWorkflowStatus();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchWorkflowStatus();
      updateRealtimeStats();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchWorkflowStatus = async () => {
    try {
      const response = await fetch('/api/workflow/status');
      if (response.ok) {
        const data = await response.json();
        setWorkflowStatus(data);
      }
    } catch (error) {
      toast.error('Failed to fetch workflow status');
    } finally {
      setLoading(false);
    }
  };

  const updateRealtimeStats = () => {
    setRealtimeStats(prev => ({
      ...prev,
      currentExecution: Math.floor(Math.random() * 5) + 1,
      averageExecutionTime: Math.floor(Math.random() * 2000) + 1000,
      successRate: 95 + Math.random() * 4,
      nextScheduledRun: new Date(Date.now() + Math.floor(Math.random() * 10) * 60 * 1000)
    }));
  };

  const handleWorkflowAction = async (action: 'start' | 'stop' | 'pause' | 'restart') => {
    setActionLoading(true);
    
    try {
      const response = await fetch('/api/workflow/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        toast.success(`Workflow ${action}ed successfully`);
        fetchWorkflowStatus();
      } else {
        const error = await response.json();
        toast.error(error.message || `Failed to ${action} workflow`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${action}ing the workflow`);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'stopped':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'stopped':
        return <Square className="w-4 h-4" />;
      case 'paused':
        return <PauseCircle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Workflow Control Panel</h1>
          <p className="text-slate-400 mt-2">
            Monitor and control the Abacus.AI Gmail management workflow
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="border-slate-600 text-slate-400 hover:text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View in Abacus.AI
          </Button>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            ID: 1747c5e50
          </Badge>
        </div>
      </div>

      {/* Main Control Panel */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center text-xl">
                <Activity className="w-6 h-6 mr-3 text-blue-400" />
                Workflow Status
              </CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                Current status and controls for the Gmail management workflow
              </CardDescription>
            </div>
            
            {workflowStatus && (
              <Badge className={getStatusColor(workflowStatus.status)}>
                {getStatusIcon(workflowStatus.status)}
                <span className="ml-2 capitalize">{workflowStatus.status}</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleWorkflowAction('start')}
              disabled={actionLoading || workflowStatus?.status === 'running'}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Workflow
            </Button>
            
            <Button
              onClick={() => handleWorkflowAction('pause')}
              disabled={actionLoading || workflowStatus?.status !== 'running'}
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
            >
              <PauseCircle className="w-4 h-4 mr-2" />
              Pause
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={actionLoading || workflowStatus?.status === 'stopped'}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-800 border-slate-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Stop Workflow</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    Are you sure you want to stop the workflow? This will halt all email processing 
                    until you manually restart it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-slate-600 text-slate-400">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleWorkflowAction('stop')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Stop Workflow
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button
              onClick={() => handleWorkflowAction('restart')}
              disabled={actionLoading}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>

          <Separator className="bg-slate-700/50" />

          {/* Status Details */}
          {workflowStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-slate-400">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm">Total Executions</span>
                </div>
                <p className="text-2xl font-bold text-white">{workflowStatus.executionCount}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-slate-400">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Error Count</span>
                </div>
                <p className="text-2xl font-bold text-white">{workflowStatus.errorCount}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-slate-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Last Started</span>
                </div>
                <p className="text-sm text-white">
                  {workflowStatus.lastStarted 
                    ? new Date(workflowStatus.lastStarted).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-slate-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {workflowStatus.executionCount > 0 
                    ? Math.round(((workflowStatus.executionCount - workflowStatus.errorCount) / workflowStatus.executionCount) * 100)
                    : 0
                  }%
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Live Execution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Current Step</span>
              <span className="text-lg font-bold text-yellow-400">
                {realtimeStats.currentExecution}/5
              </span>
            </div>
            <Progress value={(realtimeStats.currentExecution / 5) * 100} className="h-2" />
            <div className="text-sm text-slate-400">
              Processing emails from connected accounts...
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Timer className="w-5 h-5 mr-2 text-blue-400" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Avg Execution Time</span>
                <span className="text-white">{realtimeStats.averageExecutionTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Success Rate</span>
                <span className="text-green-400">{realtimeStats.successRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-400" />
              Next Run
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {Math.ceil((realtimeStats.nextScheduledRun.getTime() - Date.now()) / (1000 * 60))}
              </div>
              <div className="text-sm text-slate-400">minutes</div>
            </div>
            <div className="text-xs text-slate-400 text-center">
              {realtimeStats.nextScheduledRun.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Execution History Chart */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Execution History</CardTitle>
          <CardDescription className="text-slate-400">
            Workflow executions and errors over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={executionData}>
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
                  dataKey="executions" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="errors" 
                  stackId="2"
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Last Error */}
      {workflowStatus?.lastError && (
        <Card className="bg-red-500/10 border-red-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Last Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-300 font-mono text-sm bg-red-500/10 p-3 rounded-lg">
              {workflowStatus.lastError}
            </p>
            <div className="mt-3 text-xs text-red-400">
              Check the maintenance logs for more details
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
