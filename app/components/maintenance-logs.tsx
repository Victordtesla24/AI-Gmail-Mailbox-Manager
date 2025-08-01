
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  Play,
  Settings,
  Activity,
  Shield,
  Database,
  Server,
  HardDrive,
  Cpu,
  Monitor,
  Network,
  Calendar,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface ErrorLog {
  id: string;
  component: string;
  errorType: string;
  errorMessage: string;
  stackTrace: string | null;
  severity: string;
  resolved: boolean;
  resolvedAt: Date | null;
  resolvedBy: string | null;
  metadata: any;
  createdAt: Date;
}

interface MaintenanceTask {
  id: string;
  name: string;
  description: string | null;
  taskType: string;
  status: string;
  scheduledAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  duration: number | null;
  result: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const systemHealthMetrics = {
  cpu: 23,
  memory: 67,
  disk: 45,
  network: 89,
  uptime: 99.7,
  lastRestart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
};

export function MaintenanceLogs() {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);
  const [filters, setFilters] = useState({
    severity: 'all',
    component: 'all',
    resolved: 'all',
    search: ''
  });

  useEffect(() => {
    fetchErrorLogs();
    fetchMaintenanceTasks();
  }, []);

  const fetchErrorLogs = async () => {
    try {
      const response = await fetch('/api/maintenance/error-logs');
      if (response.ok) {
        const data = await response.json();
        setErrorLogs(data);
      }
    } catch (error) {
      toast.error('Failed to fetch error logs');
    }
  };

  const fetchMaintenanceTasks = async () => {
    try {
      const response = await fetch('/api/maintenance/tasks');
      if (response.ok) {
        const data = await response.json();
        setMaintenanceTasks(data);
      }
    } catch (error) {
      toast.error('Failed to fetch maintenance tasks');
    } finally {
      setLoading(false);
    }
  };

  const runMaintenanceTask = async (taskType: string) => {
    try {
      const response = await fetch('/api/maintenance/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskType }),
      });

      if (response.ok) {
        toast.success(`${taskType} task started successfully`);
        fetchMaintenanceTasks();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to start maintenance task');
      }
    } catch (error) {
      toast.error('An error occurred while starting the maintenance task');
    }
  };

  const resolveError = async (errorId: string) => {
    try {
      const response = await fetch(`/api/maintenance/error-logs/${errorId}/resolve`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Error marked as resolved');
        fetchErrorLogs();
      } else {
        toast.error('Failed to resolve error');
      }
    } catch (error) {
      toast.error('An error occurred while resolving the error');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'running':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-red-400';
    if (value >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredLogs = errorLogs.filter(log => {
    if (filters.severity !== 'all' && log.severity !== filters.severity) return false;
    if (filters.component !== 'all' && log.component !== filters.component) return false;
    if (filters.resolved === 'true' && !log.resolved) return false;
    if (filters.resolved === 'false' && log.resolved) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        log.errorMessage.toLowerCase().includes(searchLower) ||
        log.component.toLowerCase().includes(searchLower) ||
        log.errorType.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

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
          <h1 className="text-3xl font-bold text-white">Maintenance & Logs</h1>
          <p className="text-slate-400 mt-2">
            System health monitoring, error logs, and maintenance tasks
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => {
              fetchErrorLogs();
              fetchMaintenanceTasks();
            }}
            variant="outline" 
            size="sm"
            className="border-slate-600 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* System Health */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-3 text-green-400" />
            System Health
          </CardTitle>
          <CardDescription className="text-slate-400">
            Real-time system performance and resource utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
              <Cpu className="w-8 h-8 text-blue-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">CPU Usage</span>
                  <span className={`text-lg font-bold ${getHealthColor(systemHealthMetrics.cpu)}`}>
                    {systemHealthMetrics.cpu}%
                  </span>
                </div>
                <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${systemHealthMetrics.cpu >= 80 ? 'bg-red-500' : systemHealthMetrics.cpu >= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemHealthMetrics.cpu}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
              <Monitor className="w-8 h-8 text-purple-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Memory</span>
                  <span className={`text-lg font-bold ${getHealthColor(systemHealthMetrics.memory)}`}>
                    {systemHealthMetrics.memory}%
                  </span>
                </div>
                <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${systemHealthMetrics.memory >= 80 ? 'bg-red-500' : systemHealthMetrics.memory >= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemHealthMetrics.memory}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
              <HardDrive className="w-8 h-8 text-green-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Disk Usage</span>
                  <span className={`text-lg font-bold ${getHealthColor(systemHealthMetrics.disk)}`}>
                    {systemHealthMetrics.disk}%
                  </span>
                </div>
                <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${systemHealthMetrics.disk >= 80 ? 'bg-red-500' : systemHealthMetrics.disk >= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${systemHealthMetrics.disk}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg">
              <Activity className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Uptime</span>
                  <span className="text-lg font-bold text-green-400">
                    {systemHealthMetrics.uptime}%
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Last restart: {systemHealthMetrics.lastRestart.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wrench className="w-5 h-5 mr-3 text-blue-400" />
            Quick Maintenance Actions
          </CardTitle>
          <CardDescription className="text-slate-400">
            Run common maintenance tasks and system operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => runMaintenanceTask('cleanup')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center border-slate-600 text-slate-300 hover:text-white hover:border-blue-500"
            >
              <Database className="w-6 h-6 mb-2" />
              <span>Database Cleanup</span>
            </Button>
            
            <Button
              onClick={() => runMaintenanceTask('sync')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center border-slate-600 text-slate-300 hover:text-white hover:border-green-500"
            >
              <RefreshCw className="w-6 h-6 mb-2" />
              <span>Force Sync</span>
            </Button>
            
            <Button
              onClick={() => runMaintenanceTask('backup')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center border-slate-600 text-slate-300 hover:text-white hover:border-purple-500"
            >
              <Server className="w-6 h-6 mb-2" />
              <span>Backup Data</span>
            </Button>
            
            <Button
              onClick={() => runMaintenanceTask('health_check')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center border-slate-600 text-slate-300 hover:text-white hover:border-yellow-500"
            >
              <Shield className="w-6 h-6 mb-2" />
              <span>Health Check</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Tasks */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-3 text-purple-400" />
            Recent Maintenance Tasks
          </CardTitle>
          <CardDescription className="text-slate-400">
            Scheduled and completed maintenance operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Task</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Duration</TableHead>
                  <TableHead className="text-slate-300">Scheduled</TableHead>
                  <TableHead className="text-slate-300">Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceTasks.slice(0, 10).map((task) => (
                  <TableRow key={task.id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white font-medium">{task.name}</TableCell>
                    <TableCell className="text-slate-300 capitalize">{task.taskType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {task.status === 'running' && <Play className="w-3 h-3 mr-1" />}
                        {task.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {task.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        <span className="capitalize">{task.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {task.duration ? `${Math.round(task.duration / 1000)}s` : '-'}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(task.scheduledAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs Filter */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Error Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search errors..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Severity</Label>
              <Select value={filters.severity} onValueChange={(value) => setFilters({...filters, severity: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Component</Label>
              <Select value={filters.component} onValueChange={(value) => setFilters({...filters, component: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue placeholder="All components" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All components</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="gmail_api">Gmail API</SelectItem>
                  <SelectItem value="classification">Classification</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Status</Label>
              <Select value={filters.resolved} onValueChange={(value) => setFilters({...filters, resolved: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="false">Unresolved</SelectItem>
                  <SelectItem value="true">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => setFilters({ severity: 'all', component: 'all', resolved: 'all', search: '' })}
                variant="outline"
                className="w-full border-slate-600 text-slate-400 hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs Table */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3 text-red-400" />
              Error Logs
            </CardTitle>
            <Badge variant="outline" className="border-slate-600 text-slate-400">
              {filteredLogs.length} errors
            </Badge>
          </div>
          <CardDescription className="text-slate-400">
            System errors and exceptions with resolution status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Severity</TableHead>
                  <TableHead className="text-slate-300">Component</TableHead>
                  <TableHead className="text-slate-300">Error Type</TableHead>
                  <TableHead className="text-slate-300">Message</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Occurred</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 20).map((log) => (
                  <TableRow key={log.id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell>
                      <Badge className={getSeverityColor(log.severity)}>
                        <span className="capitalize">{log.severity}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300 capitalize">{log.component}</TableCell>
                    <TableCell className="text-slate-300">{log.errorType}</TableCell>
                    <TableCell className="text-white max-w-xs">
                      <div className="truncate">{log.errorMessage}</div>
                    </TableCell>
                    <TableCell>
                      {log.resolved ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Open
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLog(log)}
                              className="border-slate-600 text-slate-400 hover:text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-white">Error Details</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Complete error information and stack trace
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-slate-300">Component</Label>
                                  <p className="text-white">{log.component}</p>
                                </div>
                                <div>
                                  <Label className="text-slate-300">Error Type</Label>
                                  <p className="text-white">{log.errorType}</p>
                                </div>
                                <div>
                                  <Label className="text-slate-300">Severity</Label>
                                  <Badge className={getSeverityColor(log.severity)}>
                                    {log.severity}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-slate-300">Occurred</Label>
                                  <p className="text-white">{new Date(log.createdAt).toLocaleString()}</p>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-slate-300">Error Message</Label>
                                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                  <p className="text-red-300 font-mono text-sm">{log.errorMessage}</p>
                                </div>
                              </div>
                              
                              {log.stackTrace && (
                                <div>
                                  <Label className="text-slate-300">Stack Trace</Label>
                                  <div className="mt-2 p-3 bg-slate-700/50 rounded-lg overflow-x-auto">
                                    <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap">
                                      {log.stackTrace}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              
                              {log.metadata && (
                                <div>
                                  <Label className="text-slate-300">Additional Information</Label>
                                  <div className="mt-2 p-3 bg-slate-700/50 rounded-lg">
                                    <pre className="text-slate-300 font-mono text-xs">
                                      {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {!log.resolved && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-800 border-slate-700">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Resolve Error</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Mark this error as resolved? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-slate-600 text-slate-400">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => resolveError(log.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Resolve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No errors found</h3>
              <p className="text-slate-400">
                {filters.search || filters.severity !== 'all' || filters.component !== 'all' || filters.resolved !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'System is running smoothly with no errors to display'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
