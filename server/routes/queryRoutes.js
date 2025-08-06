const express = require('express');
const router = express.Router();
const llmService = require('../services/llmService');
const { authenticateToken } = require('../middleware/auth');

/**
 * POST /api/v1/hackrx/run
 * Process documents and answer questions
 */
router.post('/run', authenticateToken, async (req, res) => {
  try {
    const { documents, questions } = req.body;
    
    // Validate input
    if (!documents || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'documents and questions array are required'
      });
    }
    
    console.log(`Processing ${questions.length} questions for document: ${documents}`);
    
    // Process the document and questions
    const result = await llmService.processMultipleQueries(questions, documents);
    
    // Return structured response
    res.json({
      answers: result.answers,
      documentUrl: result.documentUrl,
      queriesProcessed: result.queriesProcessed,
      timestamp: result.timestamp
    });
    
  } catch (error) {
    console.error('Error in /run endpoint:', error);
    res.status(500).json({
      error: 'Failed to process queries',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/hackrx/query
 * Process a single query
 */
router.post('/query', authenticateToken, async (req, res) => {
  try {
    const { query, documentUrl, documentType = 'pdf' } = req.body;
    
    // Validate input
    if (!query || !documentUrl) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'query and documentUrl are required'
      });
    }
    
    console.log(`Processing single query: ${query}`);
    
    // Process the query
    const result = await llmService.processQuery(query, documentUrl, documentType);
    
    // Return structured response
    res.json({
      query: result.query,
      answer: result.answer,
      explanation: result.explanation,
      relevantSections: result.relevantSections,
      documentUrl: result.documentUrl,
      timestamp: result.timestamp
    });
    
  } catch (error) {
    console.error('Error in /query endpoint:', error);
    res.status(500).json({
      error: 'Failed to process query',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/hackrx/process-document
 * Process and store a document for later queries
 */
router.post('/process-document', authenticateToken, async (req, res) => {
  try {
    const { documentUrl, documentType = 'pdf', namespace } = req.body;
    
    // Validate input
    if (!documentUrl) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'documentUrl is required'
      });
    }
    
    console.log(`Processing document: ${documentUrl}`);
    
    // Process the document
    const result = await llmService.processDocument(documentUrl, documentType, namespace);
    
    // Return structured response
    res.json({
      success: result.success,
      chunks: result.chunks,
      embeddings: result.embeddings,
      stored: result.stored,
      documentUrl,
      documentType,
      namespace,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in /process-document endpoint:', error);
    res.status(500).json({
      error: 'Failed to process document',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/hackrx/search
 * Search for relevant content in processed documents
 */
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query, namespace = 'default', topK = 5 } = req.query;
    
    // Validate input
    if (!query) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'query parameter is required'
      });
    }
    
    console.log(`Searching for: ${query}`);
    
    // Search for relevant chunks
    const results = await llmService.searchChunks(query, namespace, parseInt(topK));
    
    // Return structured response
    res.json({
      query,
      results,
      count: results.length,
      namespace,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in /search endpoint:', error);
    res.status(500).json({
      error: 'Failed to search documents',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/hackrx/health
 * Health check for the query service
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'HackRX Query Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      '/run': 'POST - Process documents and answer questions',
      '/query': 'POST - Process a single query',
      '/process-document': 'POST - Process and store a document',
      '/search': 'GET - Search for relevant content'
    }
  });
});

module.exports = router; 