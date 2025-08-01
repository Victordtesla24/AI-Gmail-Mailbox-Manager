
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Key,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  service: string;
  keyName: string;
  encryptedKey: string;
  isActive: boolean;
  lastUsed: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const serviceOptions = [
  { value: 'openai', label: 'OpenAI', description: 'For smart email classification and replies' },
  { value: 'twilio', label: 'Twilio', description: 'For SMS notifications' },
  { value: 'push_notification', label: 'Push Notifications', description: 'For browser push notifications' },
  { value: 'gmail_api', label: 'Gmail API', description: 'For Gmail account access' },
  { value: 'sendgrid', label: 'SendGrid', description: 'For email notifications' },
  { value: 'slack', label: 'Slack', description: 'For Slack notifications' },
];

export function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    service: '',
    keyName: '',
    apiKey: '',
    description: ''
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (error) {
      toast.error('Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service || !formData.keyName || !formData.apiKey) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const url = editingKey ? `/api/api-keys/${editingKey.id}` : '/api/api-keys';
      const method = editingKey ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingKey ? 'API key updated successfully' : 'API key added successfully');
        setShowAddDialog(false);
        setEditingKey(null);
        setFormData({ service: '', keyName: '', apiKey: '', description: '' });
        fetchApiKeys();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save API key');
      }
    } catch (error) {
      toast.error('An error occurred while saving the API key');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('API key deleted successfully');
        fetchApiKeys();
      } else {
        toast.error('Failed to delete API key');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the API key');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '****';
    return key.substring(0, 4) + '****' + key.substring(key.length - 4);
  };

  const getServiceInfo = (service: string) => {
    return serviceOptions.find(option => option.value === service) || {
      label: service,
      description: 'Custom service'
    };
  };

  const openEditDialog = (key: ApiKey) => {
    setEditingKey(key);
    setFormData({
      service: key.service,
      keyName: key.keyName,
      apiKey: '', // Don't populate the actual key for security
      description: ''
    });
    setShowAddDialog(true);
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
          <h1 className="text-3xl font-bold text-white">API Key Management</h1>
          <p className="text-slate-400 mt-2">Securely manage API keys for all integrated services</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingKey ? 'Edit API Key' : 'Add New API Key'}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingKey 
                  ? 'Update the API key configuration'
                  : 'Add a new API key for service integration'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-slate-300">Service *</Label>
                <Select 
                  value={formData.service} 
                  onValueChange={(value) => setFormData({...formData, service: value})}
                  disabled={!!editingKey}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {serviceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-slate-400">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyName" className="text-slate-300">Key Name *</Label>
                <Input
                  id="keyName"
                  value={formData.keyName}
                  onChange={(e) => setFormData({...formData, keyName: e.target.value})}
                  placeholder="e.g., Production API Key"
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-slate-300">
                  API Key * {editingKey && <span className="text-xs text-slate-400">(leave empty to keep current)</span>}
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  placeholder="Enter your API key"
                  className="bg-slate-700/50 border-slate-600 text-white"
                  required={!editingKey}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Optional description or notes"
                  className="bg-slate-700/50 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {editingKey ? 'Update Key' : 'Add Key'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingKey(null);
                    setFormData({ service: '', keyName: '', apiKey: '', description: '' });
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys Grid */}
      {apiKeys.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No API Keys Found</h3>
            <p className="text-slate-400 text-center mb-6">
              Get started by adding your first API key for service integration
            </p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {apiKeys.map((apiKey) => {
            const serviceInfo = getServiceInfo(apiKey.service);
            const isVisible = visibleKeys.has(apiKey.id);
            
            return (
              <Card key={apiKey.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                        <Key className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{serviceInfo.label}</CardTitle>
                        <CardDescription className="text-slate-400">
                          {apiKey.keyName}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={apiKey.isActive ? "default" : "secondary"}
                      className={apiKey.isActive 
                        ? "bg-green-500/20 text-green-400 border-green-500/50" 
                        : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                      }
                    >
                      {apiKey.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">API Key</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={isVisible ? apiKey.encryptedKey : maskApiKey(apiKey.encryptedKey)}
                        readOnly
                        className="bg-slate-700/50 border-slate-600 text-white font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="border-slate-600 text-slate-400 hover:text-white"
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey.encryptedKey);
                          toast.success('API key copied to clipboard');
                        }}
                        className="border-slate-600 text-slate-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Created:</span>
                      <p className="text-white">{new Date(apiKey.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Used:</span>
                      <p className="text-white">
                        {apiKey.lastUsed 
                          ? new Date(apiKey.lastUsed).toLocaleDateString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(apiKey)}
                      className="flex-1 border-slate-600 text-slate-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
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
                          <AlertDialogTitle className="text-white">Delete API Key</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete the API key for {serviceInfo.label}? 
                            This action cannot be undone and may affect system functionality.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-600 text-slate-400">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(apiKey.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Security Notice */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">
              All API keys are encrypted using AES-256 encryption before storage
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">
              Access to API keys is logged and audited for security monitoring
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300">
              Keys are only decrypted when needed for API calls and never stored in plaintext
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
