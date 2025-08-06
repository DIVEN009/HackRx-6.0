import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Copy, 
  Play, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Brain,
  Activity,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/hackrx/run',
      title: 'Process Documents and Queries',
      description: 'Main endpoint for processing documents and answering questions',
      auth: 'Bearer Token Required',
      body: {
        documents: 'string (URL)',
        questions: 'array of strings'
      },
      response: {
        answers: 'array of strings',
        documentUrl: 'string',
        queriesProcessed: 'number',
        timestamp: 'string'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/hackrx/query',
      title: 'Single Query Processing',
      description: 'Process a single query against a document',
      auth: 'Bearer Token Required',
      body: {
        query: 'string',
        documentUrl: 'string',
        documentType: 'string (optional)'
      },
      response: {
        query: 'string',
        answer: 'string',
        explanation: 'string',
        relevantSections: 'array',
        documentUrl: 'string',
        timestamp: 'string'
      }
    },
    {
      method: 'POST',
      path: '/api/v1/hackrx/process-document',
      title: 'Document Processing',
      description: 'Process and store a document for later queries',
      auth: 'Bearer Token Required',
      body: {
        documentUrl: 'string',
        documentType: 'string (optional)',
        namespace: 'string (optional)'
      },
      response: {
        success: 'boolean',
        chunks: 'number',
        embeddings: 'number',
        stored: 'number',
        documentUrl: 'string',
        documentType: 'string',
        namespace: 'string',
        timestamp: 'string'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/hackrx/search',
      title: 'Search Documents',
      description: 'Search for relevant content in processed documents',
      auth: 'Bearer Token Required',
      params: {
        query: 'string',
        namespace: 'string (optional)',
        topK: 'number (optional)'
      },
      response: {
        query: 'string',
        results: 'array',
        count: 'number',
        namespace: 'string',
        timestamp: 'string'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/health',
      title: 'Health Check',
      description: 'Check system health and status',
      auth: 'None',
      response: {
        status: 'string',
        timestamp: 'string',
        service: 'string'
      }
    }
  ];

  const sampleRequest = {
    documents: "https://hackrx.blob.core.windows.net/assets/policy.pdf?sv=2023-01-03&st=2025-07-04T09%3A11%3A24Z&se=2027-07-05T09%3A11%3A00Z&sr=b&sp=r&sig=N4a9OU0w0QXO6AOIBiu4bpl7AXvEZogeT%2FjUHNO7HzQ%3D",
    questions: [
      "What is the grace period for premium payment under the National Parivar Mediclaim Plus Policy?",
      "What is the waiting period for pre-existing diseases (PED) to be covered?",
      "Does this policy cover maternity expenses, and what are the conditions?"
    ]
  };

  const sampleResponse = {
    answers: [
      "A grace period of thirty days is provided for premium payment after the due date to renew or continue the policy without losing continuity benefits.",
      "There is a waiting period of thirty-six (36) months of continuous coverage from the first policy inception for pre-existing diseases and their direct complications to be covered.",
      "Yes, the policy covers maternity expenses, including childbirth and lawful medical termination of pregnancy. To be eligible, the female insured person must have been continuously covered for at least 24 months. The benefit is limited to two deliveries or terminations during the policy period."
    ],
    documentUrl: "https://hackrx.blob.core.windows.net/assets/policy.pdf?sv=2023-01-03&st=2025-07-04T09%3A11%3A24Z&se=2027-07-05T09%3A11%3A00Z&sr=b&sp=r&sig=N4a9OU0w0QXO6AOIBiu4bpl7AXvEZogeT%2FjUHNO7HzQ%3D",
    queriesProcessed: 3,
    timestamp: "2024-01-15T10:30:00.000Z"
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Code },
    { id: 'endpoints', name: 'Endpoints', icon: FileText },
    { id: 'examples', name: 'Examples', icon: Play },
    { id: 'auth', name: 'Authentication', icon: Shield }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          API Documentation
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive documentation for the HackRX 6.0 LLM-Powered Query Retrieval System API. 
          Learn how to integrate with our intelligent document processing and query system.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <Brain className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">LLM Processing</h3>
                  <p className="text-blue-800 text-sm">
                    Advanced language model processing for intelligent query understanding and response generation.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <FileText className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Document Support</h3>
                  <p className="text-green-800 text-sm">
                    Process PDFs, DOCX, and text files with advanced text extraction and analysis.
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <Activity className="w-8 h-8 text-purple-600 mb-4" />
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Real-time Processing</h3>
                  <p className="text-purple-800 text-sm">
                    Fast and efficient processing with real-time response generation and status updates.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Base URL</h3>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                    http://localhost:8000/api/v1
                  </code>
                  <button
                    onClick={() => copyToClipboard('http://localhost:8000/api/v1')}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Endpoints Tab */}
          {activeTab === 'endpoints' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {endpoints.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                      {endpoint.path}
                    </code>
                    {endpoint.auth !== 'None' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Auth Required
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {endpoint.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{endpoint.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {endpoint.body && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Request Body</h4>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          {Object.entries(endpoint.body).map(([key, type]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-mono">{key}:</span>
                              <span className="text-gray-600">{type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {endpoint.params && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Query Parameters</h4>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          {Object.entries(endpoint.params).map(([key, type]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-mono">{key}:</span>
                              <span className="text-gray-600">{type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Response</h4>
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      {Object.entries(endpoint.response).map(([key, type]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-mono">{key}:</span>
                          <span className="text-gray-600">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Example */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Example</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 text-sm">POST /api/v1/hackrx/run</span>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(sampleRequest, null, 2))}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{JSON.stringify(sampleRequest, null, 2)}</code>
                    </pre>
                  </div>
                </div>

                {/* Response Example */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Example</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 text-sm">200 OK</span>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(sampleResponse, null, 2))}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{JSON.stringify(sampleResponse, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* cURL Example */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">cURL Example</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 text-sm">Terminal Command</span>
                    <button
                      onClick={() => copyToClipboard(`curl -X POST http://localhost:8000/api/v1/hackrx/run \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer 8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d" \\
  -d '${JSON.stringify(sampleRequest)}'`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="text-gray-300 text-sm overflow-x-auto">
                    <code>{`curl -X POST http://localhost:8000/api/v1/hackrx/run \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer 8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d" \\
  -d '${JSON.stringify(sampleRequest)}'`}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* Authentication Tab */}
          {activeTab === 'auth' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Authentication</h3>
                </div>
                <p className="text-blue-800 mb-4">
                  All API endpoints require Bearer token authentication. Include the token in the Authorization header.
                </p>
                <div className="bg-blue-100 rounded-lg p-4">
                  <code className="text-blue-900 text-sm">
                    Authorization: Bearer 8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d
                  </code>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Codes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">401</span>
                      <span className="text-sm">Unauthorized - Invalid or missing token</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">403</span>
                      <span className="text-sm">Forbidden - Token not authorized</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">400</span>
                      <span className="text-sm">Bad Request - Invalid input data</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">500</span>
                      <span className="text-sm">Internal Server Error</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limiting</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">100 requests per 15 minutes</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Per IP address</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Automatic retry handling</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ApiDocs; 