
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Mail,
  CheckCircle2,
  AlertTriangle, 
  Clock,
  RefreshCw,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  Activity,
  Calendar,
  BarChart3,
  Shield,
  Zap,
  Users,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';

interface GmailAccount {
  id: string;
  email: string;
  displayName: string | null;
  isConnected: boolean;
  authToken: string | null;
  refreshToken: string | null;
  tokenExpiry: Date | null;
  lastSyncAt: Date | null;
  syncStatus: string;
  errorMessage: string | null;
  totalEmails: number;
  processedEmails: number;
  createdAt: Date;
  updatedAt: Date;
}

const emailTrendData = [
  { date: '2024-01-01', processed: 45, total: 50 },
  { date: '2024-01-02', processed: 67, total: 72 },
  { date: '2024-01-03', processed: 89, total: 95 },
  { date: '2024-01-04', processed: 123, total: 130 },
  { date: '2024-01-05', processed: 98, total: 104 },
  { date: '2024-01-06', processed: 156, total: 165 },
  { date: '2024-01-07', processed: 134, total: 142 },
];

const classificationData = [
  { name: 'Important', value: 45, color: '#3B82F6' },
  { name: 'Promotional', value: 32, color: '#8B5CF6' },
  { name: 'Social', value: 28, color: '#10B981' },
  { name: 'Spam', value: 15, color: '#EF4444' },
];

export function GmailAccountManagement() {
  const [accounts, setAccounts] = useState<GmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchGmailAccounts();
  }, []);

  const fetchGmailAccounts = async () => {
    try {
      const response = await fetch('/api/gmail-accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      toast.error('Failed to fetch Gmail accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (accountId: string) => {
    setSyncingAccounts(prev => new Set(prev).add(accountId));
    
    try {
      const response = await fetch(`/api/gmail-accounts/${accountId}/sync`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Account sync started successfully');
        fetchGmailAccounts();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to sync account');
      }
    } catch (error) {
      toast.error('An error occurred while syncing the account');
    } finally {
      setSyncingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(accountId);
        return newSet;
      });
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const response = await fetch(`/api/gmail-accounts/${accountId}/disconnect`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Account disconnected successfully');
        fetchGmailAccounts();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to disconnect account');
      }
    } catch (error) {
      toast.error('An error occurred while disconnecting the account');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const calculateProcessingRate = (account: GmailAccount) => {
    if (account.totalEmails === 0) return 0;
    return Math.round((account.processedEmails / account.totalEmails) * 100);
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
          <h1 className="text-3xl font-bold text-white">Gmail Account Management</h1>
          <p className="text-slate-400 mt-2">
            Monitor and manage connected Gmail accounts
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={fetchGmailAccounts}
            variant="outline" 
            size="sm"
            className="border-slate-600 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Connect Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Connected Accounts</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{accounts.length}</div>
            <p className="text-xs text-slate-400">
              {accounts.filter(a => a.isConnected).length} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {accounts.reduce((sum, acc) => sum + acc.totalEmails, 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">
              Across all accounts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Processed</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {accounts.reduce((sum, acc) => sum + acc.processedEmails, 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Processing Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {accounts.length > 0 
                ? Math.round(
                    accounts.reduce((sum, acc) => sum + calculateProcessingRate(acc), 0) / accounts.length
                  )
                : 0
              }%
            </div>
            <p className="text-xs text-slate-400">
              Average across accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{account.email}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {account.displayName || 'Gmail Account'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(account.syncStatus)}>
                  {getStatusIcon(account.syncStatus)}
                  <span className="ml-1 capitalize">{account.syncStatus}</span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Processing Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Email Processing</span>
                  <span className="text-white">
                    {account.processedEmails.toLocaleString()} / {account.totalEmails.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={calculateProcessingRate(account)} 
                  className="h-2"
                />
                <div className="text-xs text-slate-400">
                  {calculateProcessingRate(account)}% processed
                </div>
              </div>

              <Separator className="bg-slate-700/50" />

              {/* Account Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Last Sync:</span>
                  <p className="text-white">
                    {account.lastSyncAt 
                      ? new Date(account.lastSyncAt).toLocaleString()
                      : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Connection:</span>
                  <p className={account.isConnected ? "text-green-400" : "text-red-400"}>
                    {account.isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {account.errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="font-medium">Error:</span>
                  </div>
                  <p className="text-red-300 text-xs mt-1 font-mono">
                    {account.errorMessage}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleSync(account.id)}
                  disabled={syncingAccounts.has(account.id)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {syncingAccounts.has(account.id) ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-400 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Disconnect Account</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Are you sure you want to disconnect {account.email}? 
                        This will stop all email processing for this account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-slate-600 text-slate-400">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDisconnect(account.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Email Processing Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Processing activity over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emailTrendData}>
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
                    dataKey="total" 
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
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Email Classification</CardTitle>
            <CardDescription className="text-slate-400">
              Distribution of processed emails by category
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
    </div>
  );
}
