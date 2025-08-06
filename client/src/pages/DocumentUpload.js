import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Download,
  Copy
} from 'lucide-react';
import axios from 'axios';

const DocumentUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});

  const uploadMutation = useMutation(
    async (file) => {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await axios.post('/api/v1/documents/upload', formData, {
        headers: {
          'Authorization': 'Bearer 8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d',
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    {
      onSuccess: (data, file) => {
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: { status: 'success', data }
        }));
        toast.success(`${file.name} uploaded successfully!`);
      },
      onError: (error, file) => {
        setUploadStatus(prev => ({
          ...prev,
          [file.name]: { status: 'error', error: error.message }
        }));
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  );

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      setUploadedFiles(prev => [...prev, file]);
      uploadMutation.mutate(file);
    });
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'docx':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'txt':
        return <File className="w-6 h-6 text-gray-500" />;
      default:
        return <File className="w-6 h-6 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          Document Upload
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload PDF, DOCX, or TXT documents for processing and analysis. 
          Our system will extract text and prepare it for query processing.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600">
                Drop the files here...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag & drop files here
                </p>
                <p className="text-gray-600 mb-4">
                  or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOCX, TXT (max 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Files
              </h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => {
                  const status = uploadStatus[file.name];
                  return (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {status?.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {status?.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        {!status && (
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        )}
                        <button
                          onClick={() => removeFile(file.name)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Upload Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Upload Status</h2>
          </div>

          {Object.keys(uploadStatus).length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Upload files to see their status here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(uploadStatus).map(([fileName, status]) => (
                <div key={fileName} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{fileName}</h4>
                    {status.status === 'success' && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Success
                      </span>
                    )}
                    {status.status === 'error' && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Error
                      </span>
                    )}
                  </div>
                  
                  {status.status === 'success' && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        File uploaded successfully
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(status.data, null, 2))}
                          className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Response</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {status.status === 'error' && (
                    <p className="text-sm text-red-600">
                      {status.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Upload Instructions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Supported Formats</h4>
            <ul className="space-y-1">
              <li>• PDF documents</li>
              <li>• DOCX files</li>
              <li>• Plain text files</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">File Size Limits</h4>
            <ul className="space-y-1">
              <li>• Maximum 50MB per file</li>
              <li>• Multiple files supported</li>
              <li>• Automatic format detection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Processing</h4>
            <ul className="space-y-1">
              <li>• Text extraction</li>
              <li>• Content analysis</li>
              <li>• Ready for queries</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentUpload; 