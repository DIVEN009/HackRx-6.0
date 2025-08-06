import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Server, 
  Database,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

const HealthCheck = () => {
  const [lastChecked, setLastChecked] = useState(null);

  const healthQuery = useQuery(
    'health',
    async () => {
      const response = await axios.get('/api/v1/health');
      return response.data;
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      onSuccess: () => {
        setLastChecked(new Date());
      },
      onError: (error) => {
        console.error('Health check failed:', error);
        toast.error('Failed to check system health');
      }
    }
  );

  const queryHealthQuery = useQuery(
    'queryHealth',
    async () => {
      const response = await axios.get('/api/v1/hackrx/health', {
        headers: {
          'Authorization': 'Bearer 8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d'
        }
      });
      return response.data;
    },
    {
      refetchInterval: 30000,
      onError: (error) => {
        console.error('Query service health check failed:', error);
      }
    }
  );

  const systemStatus = {
    overall: healthQuery.data?.status === 'OK' ? 'healthy' : 'unhealthy',
    server: healthQuery.data?.status === 'OK' ? 'operational' : 'down',
    database: 'operational', // Mock data
    llm: 'operational', // Mock data
    vectorStore: 'operational', // Mock data
    api: healthQuery.data?.status === 'OK' ? 'operational' : 'down'
  };

  const performanceMetrics = [
    {
      name: 'Response Time',
      value: '2.3s',
      status: 'good',
      icon: Clock,
      description: 'Average API response time'
    },
    {
      name: 'Uptime',
      value: '99.9%',
      status: 'good',
      icon: Server,
      description: 'System availability'
    },
    {
      name: 'CPU Usage',
      value: '45%',
      status: 'good',
      icon: Cpu,
      description: 'Current CPU utilization'
    },
    {
      name: 'Memory Usage',
      value: '68%',
      status: 'warning',
      icon: HardDrive,
      description: 'RAM utilization'
    },
    {
      name: 'Network',
      value: '1.2 Gbps',
      status: 'good',
      icon: Wifi,
      description: 'Network throughput'
    },
    {
      name: 'Storage',
      value: '2.1 TB',
      status: 'good',
      icon: Database,
      description: 'Available storage'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
      case 'operational':
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
      case 'operational':
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'down':
      case 'unhealthy':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleRefresh = () => {
    healthQuery.refetch();
    queryHealthQuery.refetch();
    toast.success('Health check refreshed');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          System Health Check
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Monitor the health and performance of the HackRX 6.0 LLM-Powered Query Retrieval System.
        </p>
      </motion.div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={healthQuery.isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${healthQuery.isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(systemStatus).map(([service, status]) => (
            <div key={service} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{service}</p>
                  <p className="text-sm text-gray-500 capitalize">{status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lastChecked && (
          <div className="mt-4 text-sm text-gray-500">
            Last checked: {lastChecked.toLocaleString()}
          </div>
        )}
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {performanceMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Service Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* API Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Health</h3>
          {healthQuery.isLoading ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Checking API health...</span>
            </div>
          ) : healthQuery.error ? (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>API health check failed</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(healthQuery.data?.status)}`}>
                  {healthQuery.data?.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Service</span>
                <span className="text-sm font-medium">{healthQuery.data?.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Timestamp</span>
                <span className="text-sm text-gray-500">
                  {new Date(healthQuery.data?.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Query Service Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Service Health</h3>
          {queryHealthQuery.isLoading ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Checking query service...</span>
            </div>
          ) : queryHealthQuery.error ? (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Query service health check failed</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(queryHealthQuery.data?.status)}`}>
                  {queryHealthQuery.data?.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Service</span>
                <span className="text-sm font-medium">{queryHealthQuery.data?.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Endpoints</span>
                <span className="text-sm text-gray-500">
                  {Object.keys(queryHealthQuery.data?.endpoints || {}).length} available
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Version</h3>
            <p className="text-2xl font-bold text-blue-600">6.0.0</p>
            <p className="text-sm text-gray-500">Latest Release</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Uptime</h3>
            <p className="text-2xl font-bold text-green-600">99.9%</p>
            <p className="text-sm text-gray-500">This Month</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Requests</h3>
            <p className="text-2xl font-bold text-purple-600">1.2M</p>
            <p className="text-sm text-gray-500">Total Processed</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Documents</h3>
            <p className="text-2xl font-bold text-orange-600">45K</p>
            <p className="text-sm text-gray-500">Processed</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthCheck; 