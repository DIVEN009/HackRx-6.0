import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  Download,
  Brain,
  Clock
} from 'lucide-react';
import axios from 'axios';

const QueryProcessor = () => {
  const [formData, setFormData] = useState({
    documents: '',
    questions: ['']
  });
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample questions for insurance policy
  const sampleQuestions = [
    "What is the grace period for premium payment under the National Parivar Mediclaim Plus Policy?",
    "What is the waiting period for pre-existing diseases (PED) to be covered?",
    "Does this policy cover maternity expenses, and what are the conditions?",
    "What is the waiting period for cataract surgery?",
    "Are the medical expenses for an organ donor covered under this policy?",
    "What is the No Claim Discount (NCD) offered in this policy?",
    "Is there a benefit for preventive health check-ups?",
    "How does the policy define a 'Hospital'?",
    "What is the extent of coverage for AYUSH treatments?",
    "Are there any sub-limits on room rent and ICU charges for Plan A?"
  ];

  const processQueriesMutation = useMutation(
    async (data) => {
      const response = await axios.post('/api/v1/hackrx/run', data, {
        headers: {
          'Authorization': 'Bearer 8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setResults(data);
        toast.success('Queries processed successfully!');
      },
      onError: (error) => {
        console.error('Error processing queries:', error);
        toast.error(error.response?.data?.message || 'Failed to process queries');
      }
    }
  );

  const handleInputChange = (field, value, index = null) => {
    if (index !== null) {
      const newQuestions = [...formData.questions];
      newQuestions[index] = value;
      setFormData({ ...formData, questions: newQuestions });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, '']
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const loadSampleData = () => {
    setFormData({
      documents: 'https://hackrx.blob.core.windows.net/assets/policy.pdf?sv=2023-01-03&st=2025-07-04T09%3A11%3A24Z&se=2027-07-05T09%3A11%3A00Z&sr=b&sp=r&sig=N4a9OU0w0QXO6AOIBiu4bpl7AXvEZogeT%2FjUHNO7HzQ%3D',
      questions: sampleQuestions
    });
    toast.success('Sample data loaded!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.documents.trim()) {
      toast.error('Please enter a document URL');
      return;
    }

    const validQuestions = formData.questions.filter(q => q.trim());
    if (validQuestions.length === 0) {
      toast.error('Please enter at least one question');
      return;
    }

    setIsProcessing(true);
    try {
      await processQueriesMutation.mutateAsync({
        documents: formData.documents.trim(),
        questions: validQuestions
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadResults = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hackrx-results.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Results downloaded!');
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
          Query Processor
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Process documents and answer questions using our advanced LLM-powered 
          intelligent query retrieval system.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Document & Questions</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document URL
              </label>
              <input
                type="url"
                value={formData.documents}
                onChange={(e) => handleInputChange('documents', e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="input-field"
                required
              />
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Questions
                </label>
                <button
                  type="button"
                  onClick={loadSampleData}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Load Sample
                </button>
              </div>
              
              {formData.questions.map((question, index) => (
                <div key={index} className="flex space-x-2 mb-3">
                  <textarea
                    value={question}
                    onChange={(e) => handleInputChange('questions', e.target.value, index)}
                    placeholder={`Question ${index + 1}`}
                    className="textarea-field flex-1"
                    rows="2"
                  />
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addQuestion}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Question
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Process Queries</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Results</h2>
            </div>
            {results && (
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadResults}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Download results"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {results ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Processed {results.queriesProcessed} queries successfully</span>
                <Clock className="w-4 h-4" />
                <span>{new Date(results.timestamp).toLocaleString()}</span>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.answers.map((answer, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Question {index + 1}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {formData.questions[index]}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-800">{answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Process a document to see results here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QueryProcessor; 