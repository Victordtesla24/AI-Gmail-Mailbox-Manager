
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
  FileText,
  Mail,
  MessageSquare,
  Filter,
  Search,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
  Star,
  Archive,
  Reply
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, BarChart, Bar } from 'recharts';

interface EmailLog {
  id: string;
  messageId: string;
  subject: string | null;
  sender: string | null;
  recipient: string | null;
  classification: string | null;
  confidence: number | null;
  action: string | null;
  smartReply: string | null;
  replyGenerated: boolean;
  processed: boolean;
  processingTime: number | null;
  errorMessage: string | null;
  createdAt: Date;
  gmailAccount: {
    email: string;
    displayName: string | null;
  };
}

const processingTrendData = [
  { hour: '00', processed: 12, classified: 10, replied: 3 },
  { hour: '04', processed: 8, classified: 7, replied: 2 },
  { hour: '08', processed: 45, classified: 42, replied: 15 },
  { hour: '12', processed: 67, classified: 63, replied: 24 },
  { hour: '16', processed: 38, classified: 35, replied: 12 },
  { hour: '20', processed: 23, classified: 21, replied: 8 },
];

const classificationAccuracyData = [
  { category: 'Important', accuracy: 96.8 },
  { category: 'Promotional', accuracy: 94.2 },
  { category: 'Social', accuracy: 91.5 },
  { category: 'Spam', accuracy: 98.7 },
  { category: 'Other', accuracy: 87.3 },
];

export function EmailProcessingOverview() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [filters, setFilters] = useState({
    classification: 'all',
    account: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchEmailLogs();
  }, []);

  const fetchEmailLogs = async () => {
    try {
      const response = await fetch('/api/email-processing');
      if (response.ok) {
        const data = await response.json();
        setEmailLogs(data);
      }
    } catch (error) {
      toast.error('Failed to fetch email processing logs');
    } finally {
      setLoading(false);
    }
  };

  const getClassificationColor = (classification: string | null) => {
    switch (classification) {
      case 'important':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'promotional':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'social':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'spam':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getActionIcon = (action: string | null) => {
    switch (action) {
      case 'replied':
        return <Reply className="w-3 h-3" />;
      case 'archived':
        return <Archive className="w-3 h-3" />;
      case 'flagged':
        return <Star className="w-3 h-3" />;
      default:
        return <Mail className="w-3 h-3" />;
    }
  };

  const filteredEmails = emailLogs.filter(email => {
    if (filters.classification !== 'all' && email.classification !== filters.classification) return false;
    if (filters.account !== 'all' && email.gmailAccount.email !== filters.account) return false;
    if (filters.status !== 'all') {
      if (filters.status === 'processed' && !email.processed) return false;
      if (filters.status === 'pending' && email.processed) return false;
      if (filters.status === 'error' && !email.errorMessage) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        email.subject?.toLowerCase().includes(searchLower) ||
        email.sender?.toLowerCase().includes(searchLower) ||
        email.classification?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    totalProcessed: emailLogs.filter(e => e.processed).length,
    totalClassified: emailLogs.filter(e => e.classification).length,
    smartRepliesGenerated: emailLogs.filter(e => e.replyGenerated).length,
    averageProcessingTime: emailLogs
      .filter(e => e.processingTime)
      .reduce((sum, e) => sum + (e.processingTime || 0), 0) / emailLogs.filter(e => e.processingTime).length || 0,
    errorCount: emailLogs.filter(e => e.errorMessage).length,
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
          <h1 className="text-3xl font-bold text-white">Email Processing Overview</h1>
          <p className="text-slate-400 mt-2">
            Monitor processed emails, classifications, and smart replies
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={fetchEmailLogs}
            variant="outline" 
            size="sm"
            className="border-slate-600 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Processed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProcessed}</div>
            <p className="text-xs text-slate-400">
              Total emails processed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Classified</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalClassified}</div>
            <p className="text-xs text-slate-400">
              Successfully classified
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Smart Replies</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.smartRepliesGenerated}</div>
            <p className="text-xs text-slate-400">
              AI-generated replies
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg Time</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.round(stats.averageProcessingTime)}ms
            </div>
            <p className="text-xs text-slate-400">
              Processing time
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.errorCount}</div>
            <p className="text-xs text-slate-400">
              Processing errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Processing Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Email processing trends over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processingTrendData}>
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
                  <Area 
                    type="monotone" 
                    dataKey="replied" 
                    stackId="3"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Classification Accuracy</CardTitle>
            <CardDescription className="text-slate-400">
              Accuracy percentage by email category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classificationAccuracyData}>
                  <XAxis 
                    dataKey="category" 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                  />
                  <YAxis 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    domain={[80, 100]}
                  />
                  <Bar 
                    dataKey="accuracy" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Email Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search emails..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Classification</Label>
              <Select value={filters.classification} onValueChange={(value) => setFilters({...filters, classification: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue placeholder="All classifications" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All classifications</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Account</Label>
              <Select value={filters.account} onValueChange={(value) => setFilters({...filters, account: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue placeholder="All accounts" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All accounts</SelectItem>
                  <SelectItem value="melbvicduque@gmail.com">melbvicduque@gmail.com</SelectItem>
                  <SelectItem value="sarkar.vikram@gmail.com">sarkar.vikram@gmail.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => setFilters({ classification: 'all', account: 'all', status: 'all', search: '' })}
                variant="outline"
                className="w-full border-slate-600 text-slate-400 hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Logs Table */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Email Processing</CardTitle>
            <Badge variant="outline" className="border-slate-600 text-slate-400">
              {filteredEmails.length} emails
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Subject</TableHead>
                  <TableHead className="text-slate-300">From</TableHead>
                  <TableHead className="text-slate-300">Account</TableHead>
                  <TableHead className="text-slate-300">Classification</TableHead>
                  <TableHead className="text-slate-300">Action</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Time</TableHead>
                  <TableHead className="text-slate-300">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.slice(0, 50).map((email) => (
                  <TableRow key={email.id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white max-w-xs">
                      <div className="truncate">
                        {email.subject || 'No Subject'}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {email.sender || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {email.gmailAccount.email}
                    </TableCell>
                    <TableCell>
                      {email.classification ? (
                        <Badge className={getClassificationColor(email.classification)}>
                          {email.classification}
                          {email.confidence && (
                            <span className="ml-1">({Math.round(email.confidence * 100)}%)</span>
                          )}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {email.action ? (
                        <div className="flex items-center text-slate-300">
                          {getActionIcon(email.action)}
                          <span className="ml-1 capitalize">{email.action}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {email.errorMessage ? (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      ) : email.processed ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="text-sm">
                        {new Date(email.createdAt).toLocaleString()}
                      </div>
                      {email.processingTime && (
                        <div className="text-xs text-slate-400">
                          {email.processingTime}ms
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEmail(email)}
                            className="border-slate-600 text-slate-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white">Email Processing Details</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Complete information about this processed email
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-slate-300">Subject</Label>
                                <p className="text-white">{email.subject || 'No Subject'}</p>
                              </div>
                              <div>
                                <Label className="text-slate-300">From</Label>
                                <p className="text-white">{email.sender || 'Unknown'}</p>
                              </div>
                              <div>
                                <Label className="text-slate-300">Classification</Label>
                                <p className="text-white capitalize">
                                  {email.classification || 'None'}
                                  {email.confidence && ` (${Math.round(email.confidence * 100)}%)`}
                                </p>
                              </div>
                              <div>
                                <Label className="text-slate-300">Processing Time</Label>
                                <p className="text-white">{email.processingTime || 0}ms</p>
                              </div>
                            </div>
                            {email.smartReply && (
                              <div>
                                <Label className="text-slate-300">Smart Reply</Label>
                                <div className="mt-2 p-3 bg-slate-700/50 rounded-lg">
                                  <p className="text-white">{email.smartReply}</p>
                                </div>
                              </div>
                            )}
                            {email.errorMessage && (
                              <div>
                                <Label className="text-red-400">Error Message</Label>
                                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                  <p className="text-red-300 font-mono text-sm">{email.errorMessage}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredEmails.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No emails found</h3>
              <p className="text-slate-400">
                {filters.search || filters.classification !== 'all' || filters.account !== 'all' || filters.status !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'Email processing logs will appear here once emails are processed'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
