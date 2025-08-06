import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  FileText, 
  Upload, 
  Code, 
  Activity, 
  Zap, 
  Shield, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Documents Processed',
      value: '1,234',
      change: '+12%',
      icon: FileText,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'Queries Answered',
      value: '5,678',
      change: '+23%',
      icon: Brain,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'Accuracy Rate',
      value: '94.2%',
      change: '+2.1%',
      icon: CheckCircle,
      color: 'bg-purple-500',
      trend: 'up'
    },
    {
      title: 'Response Time',
      value: '2.3s',
      change: '-0.5s',
      icon: Clock,
      color: 'bg-orange-500',
      trend: 'down'
    }
  ];

  const features = [
    {
      title: 'Document Processing',
      description: 'Process PDFs, DOCX, and email documents with advanced text extraction',
      icon: FileText,
      href: '/upload',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Query Processing',
      description: 'Natural language query understanding and intelligent response generation',
      icon: Brain,
      href: '/query',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'API Integration',
      description: 'RESTful API endpoints for seamless integration with your applications',
      icon: Code,
      href: '/api-docs',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'System Health',
      description: 'Monitor system performance and service status in real-time',
      icon: Activity,
      href: '/health',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const recentActivities = [
    {
      action: 'Document processed',
      document: 'policy.pdf',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      action: 'Query answered',
      query: 'What is the grace period for premium payment?',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      action: 'System health check',
      details: 'All services operational',
      time: '10 minutes ago',
      status: 'success'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to HackRX 6.0
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Advanced LLM-Powered Intelligent Query–Retrieval System for insurance, 
          legal, HR, and compliance domains.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className={`w-4 h-4 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={`text-sm font-medium ml-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                activity.status === 'success' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {activity.status === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                {activity.document && (
                  <p className="text-sm text-gray-600">{activity.document}</p>
                )}
                {activity.query && (
                  <p className="text-sm text-gray-600 truncate">{activity.query}</p>
                )}
                {activity.details && (
                  <p className="text-sm text-gray-600">{activity.details}</p>
                )}
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-primary rounded-lg p-8 text-white"
      >
        <div className="text-center">
          <Zap className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-lg mb-6 opacity-90">
            Upload your first document and start processing queries with our advanced AI system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Upload Document
            </Link>
            <Link
              to="/query"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Process Query
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 