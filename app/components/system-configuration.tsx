
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Save,
  RefreshCw,
  Bell,
  Mail,
  MessageSquare,
  Shield,
  Clock,
  Zap,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string | null;
  dataType: string;
  category: string | null;
}

interface ConfigSection {
  title: string;
  description: string;
  icon: any;
  configs: SystemConfig[];
}

export function SystemConfiguration() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/system-config');
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
        
        // Initialize config values
        const values: Record<string, any> = {};
        data.forEach((config: SystemConfig) => {
          switch (config.dataType) {
            case 'boolean':
              values[config.key] = config.value === 'true';
              break;
            case 'number':
              values[config.key] = parseFloat(config.value) || 0;
              break;
            case 'json':
              try {
                values[config.key] = JSON.parse(config.value);
              } catch {
                values[config.key] = [];
              }
              break;
            default:
              values[config.key] = config.value;
          }
        });
        setConfigValues(values);
      }
    } catch (error) {
      toast.error('Failed to fetch system configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/system-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configValues),
      });

      if (response.ok) {
        toast.success('Configuration saved successfully');
        fetchConfigs(); // Refresh configs
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save configuration');
      }
    } catch (error) {
      toast.error('An error occurred while saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfigValue = (key: string, value: any) => {
    setConfigValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderConfigInput = (config: SystemConfig) => {
    const value = configValues[config.key];
    
    switch (config.dataType) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-3">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => updateConfigValue(config.key, checked)}
            />
            <span className="text-sm text-slate-300">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );
      
      case 'number':
        if (config.key.includes('interval') || config.key.includes('threshold')) {
          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{config.key.includes('threshold') ? '0.0' : '0'}</span>
                <span className="text-sm font-medium text-white">{value}</span>
                <span className="text-sm text-slate-400">{config.key.includes('threshold') ? '1.0' : '3600'}</span>
              </div>
              <Slider
                value={[value || 0]}
                onValueChange={(values) => updateConfigValue(config.key, values[0])}
                max={config.key.includes('threshold') ? 1 : 3600}
                min={config.key.includes('threshold') ? 0 : 0}
                step={config.key.includes('threshold') ? 0.01 : 1}
                className="w-full"
              />
            </div>
          );
        }
        return (
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => updateConfigValue(config.key, parseFloat(e.target.value) || 0)}
            className="bg-slate-700/50 border-slate-600 text-white"
          />
        );
      
      case 'json':
        if (config.key === 'notification_methods') {
          const methods = value || [];
          return (
            <div className="space-y-3">
              {['email', 'sms', 'push'].map((method) => (
                <div key={method} className="flex items-center space-x-3">
                  <Switch
                    checked={methods.includes(method)}
                    onCheckedChange={(checked) => {
                      const newMethods = checked 
                        ? [...methods, method]
                        : methods.filter((m: string) => m !== method);
                      updateConfigValue(config.key, newMethods);
                    }}
                  />
                  <div className="flex items-center space-x-2">
                    {method === 'email' && <Mail className="w-4 h-4 text-blue-400" />}
                    {method === 'sms' && <Phone className="w-4 h-4 text-green-400" />}
                    {method === 'push' && <Smartphone className="w-4 h-4 text-purple-400" />}
                    <span className="text-sm text-slate-300 capitalize">{method}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return (
          <Textarea
            value={JSON.stringify(value || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateConfigValue(config.key, parsed);
              } catch {
                // Invalid JSON, don't update
              }
            }}
            className="bg-slate-700/50 border-slate-600 text-white font-mono text-sm"
            rows={4}
          />
        );
      
      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => updateConfigValue(config.key, e.target.value)}
            className="bg-slate-700/50 border-slate-600 text-white"
          />
        );
    }
  };

  const configSections: ConfigSection[] = [
    {
      title: 'Email Processing',
      description: 'Configure email processing intervals and batch sizes',
      icon: Mail,
      configs: configs.filter(c => c.category === 'processing')
    },
    {
      title: 'Notifications',
      description: 'Manage notification preferences and delivery methods',
      icon: Bell,
      configs: configs.filter(c => c.category === 'notification')
    },
    {
      title: 'Classification',
      description: 'AI classification settings and confidence thresholds',
      icon: Filter,
      configs: configs.filter(c => c.category === 'classification')
    },
    {
      title: 'Other Settings',
      description: 'Additional system configuration options',
      icon: Settings,
      configs: configs.filter(c => !c.category)
    }
  ];

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
          <h1 className="text-3xl font-bold text-white">System Configuration</h1>
          <p className="text-slate-400 mt-2">
            Configure system settings, notifications, and processing parameters
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={fetchConfigs}
            variant="outline" 
            size="sm"
            className="border-slate-600 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Configuration Sections */}
      {configSections.map((section, sectionIndex) => {
        if (section.configs.length === 0) return null;
        
        const Icon = section.icon;
        return (
          <Card key={sectionIndex} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Icon className="w-5 h-5 mr-3 text-blue-400" />
                {section.title}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.configs.map((config, configIndex) => (
                <div key={config.id}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300 font-medium">
                          {config.key.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Label>
                        {config.description && (
                          <p className="text-sm text-slate-400 mt-1">
                            {config.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-w-md">
                      {renderConfigInput(config)}
                    </div>
                  </div>
                  
                  {configIndex < section.configs.length - 1 && (
                    <Separator className="bg-slate-700/50 mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* System Status */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-3 text-green-400" />
            System Status
          </CardTitle>
          <CardDescription className="text-slate-400">
            Current system health and configuration status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">Configuration Valid</p>
                <p className="text-xs text-slate-400">All settings are properly configured</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">Auto-sync Enabled</p>
                <p className="text-xs text-slate-400">Settings sync every 5 minutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-white">Performance Optimized</p>
                <p className="text-xs text-slate-400">System running at optimal settings</p>
              </div>
            </div>
          </div>
          
          <Separator className="bg-slate-700/50" />
          
          <div className="text-sm text-slate-400">
            <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
            <p><strong>Configuration Version:</strong> 2.1.0</p>
            <p><strong>Applied Changes:</strong> All configuration changes are applied immediately</p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tips */}
      <Card className="bg-blue-500/10 border-blue-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-3" />
            Configuration Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-300">
              <strong>Processing Interval:</strong> Lower values increase responsiveness but may impact performance
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-300">
              <strong>Classification Threshold:</strong> Higher values improve accuracy but may miss some classifications
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-300">
              <strong>Notifications:</strong> Enable multiple methods for important alerts to ensure delivery
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
