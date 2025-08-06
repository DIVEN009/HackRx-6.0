const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'), false);
    }
  }
});

/**
 * POST /api/v1/documents/upload
 * Upload a document for processing
 */
router.post('/upload', authenticateToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a document file'
      });
    }
    
    const { originalname, mimetype, size } = req.file;
    
    // For now, we'll return the file info
    // In a real implementation, you'd save to cloud storage and return the URL
    res.json({
      success: true,
      filename: originalname,
      mimetype,
      size,
      message: 'Document uploaded successfully. Use the document URL for processing.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      error: 'Failed to upload document',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/documents/list
 * List processed documents
 */
router.get('/list', authenticateToken, async (req, res) => {
  try {
    // In a real implementation, you'd fetch from database
    res.json({
      documents: [],
      message: 'No documents processed yet',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error listing documents:', error);
    res.status(500).json({
      error: 'Failed to list documents',
      message: error.message
    });
  }
});

/**
 * DELETE /api/v1/documents/:id
 * Delete a processed document
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, you'd delete from database and vector store
    res.json({
      success: true,
      message: `Document ${id} deleted successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      error: 'Failed to delete document',
      message: error.message
    });
  }
});

module.exports = router; 