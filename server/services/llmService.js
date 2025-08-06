const OpenAI = require('openai');
const { Pinecone } = require('pinecone-client');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class LLMService {
  constructor() {
    this.openai = null;
    this.pinecone = null;
    this.index = null;
  }

  /**
   * Initialize OpenAI and Pinecone clients
   */
  initialize() {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OPENAI_API_KEY is not configured. Please update the .env file with your OpenAI API key.');
    }
    
    if (!process.env.PINECONE_API_KEY || process.env.PINECONE_API_KEY === 'your_pinecone_api_key_here') {
      throw new Error('PINECONE_API_KEY is not configured. Please update the .env file with your Pinecone API key.');
    }

    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
    
    if (!this.pinecone) {
      this.pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT
      });
      
      this.index = this.pinecone.Index(process.env.PINECONE_INDEX_NAME || 'hackrx-documents');
    }
  }

  /**
   * Extract text from different document types
   */
  async extractTextFromDocument(documentUrl, documentType = 'pdf') {
    try {
      const response = await axios.get(documentUrl, {
        responseType: 'arraybuffer'
      });
      
      const buffer = Buffer.from(response.data);
      
      switch (documentType.toLowerCase()) {
        case 'pdf':
          const pdfData = await pdfParse(buffer);
          return pdfData.text;
        case 'docx':
          const docxResult = await mammoth.extractRawText({ buffer });
          return docxResult.value;
        case 'txt':
          return buffer.toString('utf-8');
        default:
          throw new Error(`Unsupported document type: ${documentType}`);
      }
    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw new Error(`Failed to extract text from document: ${error.message}`);
    }
  }

  /**
   * Split text into chunks for embedding
   */
  splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      let chunk = text.slice(start, end);
      
      // Try to break at sentence boundaries
      if (end < text.length) {
        const lastPeriod = chunk.lastIndexOf('.');
        const lastNewline = chunk.lastIndexOf('\n');
        const breakPoint = Math.max(lastPeriod, lastNewline);
        
        if (breakPoint > start + chunkSize * 0.7) {
          chunk = chunk.slice(0, breakPoint + 1);
          start = start + breakPoint + 1;
        } else {
          start = end - overlap;
        }
      } else {
        start = end;
      }
      
      if (chunk.trim().length > 50) { // Only add chunks with meaningful content
        chunks.push(chunk.trim());
      }
    }
    
    return chunks;
  }

  /**
   * Generate embeddings for text chunks
   */
  async generateEmbeddings(textChunks) {
    try {
      this.initialize();
      const embeddings = [];
      
      for (let i = 0; i < textChunks.length; i += 10) { // Process in batches of 10
        const batch = textChunks.slice(i, i + 10);
        const response = await this.openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: batch
        });
        
        embeddings.push(...response.data.map(item => item.embedding));
      }
      
      return embeddings;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  }

  /**
   * Store embeddings in Pinecone
   */
  async storeEmbeddings(embeddings, metadata, namespace) {
    try {
      this.initialize();
      const vectors = embeddings.map((embedding, index) => ({
        id: `${namespace}_${Date.now()}_${index}`,
        values: embedding,
        metadata: {
          ...metadata,
          chunkIndex: index,
          text: metadata.textChunks[index],
          timestamp: new Date().toISOString()
        }
      }));
      
      await this.index.upsert({
        vectors,
        namespace
      });
      
      return vectors.length;
    } catch (error) {
      console.error('Error storing embeddings:', error);
      throw new Error(`Failed to store embeddings: ${error.message}`);
    }
  }

  /**
   * Process and store document
   */
  async processDocument(documentUrl, documentType = 'pdf', namespace = 'default') {
    try {
      console.log(`Processing document: ${documentUrl}`);
      
      // Extract text
      const text = await this.extractTextFromDocument(documentUrl, documentType);
      console.log(`Extracted ${text.length} characters`);
      
      // Split into chunks
      const chunks = this.splitTextIntoChunks(text);
      console.log(`Created ${chunks.length} chunks`);
      
      // Generate embeddings
      const embeddings = await this.generateEmbeddings(chunks);
      console.log(`Generated ${embeddings.length} embeddings`);
      
      // Store in Pinecone
      const metadata = {
        documentUrl,
        documentType,
        totalChunks: chunks.length,
        textChunks: chunks
      };
      
      const storedCount = await this.storeEmbeddings(embeddings, metadata, namespace);
      console.log(`Stored ${storedCount} vectors in Pinecone`);
      
      return {
        success: true,
        chunks: chunks.length,
        embeddings: embeddings.length,
        stored: storedCount
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  /**
   * Search for relevant chunks using semantic similarity
   */
  async searchChunks(query, namespace = 'default', topK = 5) {
    try {
      this.initialize();
      // Generate embedding for the query
      const queryEmbedding = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: query
      });
      
      // Search in Pinecone
      const searchResponse = await this.index.query({
        vector: queryEmbedding.data[0].embedding,
        namespace,
        topK,
        includeMetadata: true
      });
      
      return searchResponse.matches.map(match => ({
        score: match.score,
        text: match.metadata.text,
        chunkIndex: match.metadata.chunkIndex,
        documentUrl: match.metadata.documentUrl
      }));
    } catch (error) {
      console.error('Error searching chunks:', error);
      throw new Error(`Failed to search chunks: ${error.message}`);
    }
  }

  /**
   * Generate answer using LLM with retrieved context
   */
  async generateAnswer(query, relevantChunks) {
    try {
      this.initialize();
      const context = relevantChunks.map(chunk => chunk.text).join('\n\n');
      
      const prompt = `You are an intelligent query retrieval system specialized in insurance, legal, HR, and compliance domains.

Context from relevant document sections:
${context}

User Query: ${query}

Please provide a comprehensive answer based on the context above. If the information is not available in the context, clearly state that. Be specific and include relevant details, conditions, and limitations mentioned in the documents.

Answer:`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional document analysis assistant. Provide accurate, detailed answers based on the provided context. Always cite specific sections when possible.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });
      
      return {
        answer: response.choices[0].message.content,
        context: relevantChunks,
        explanation: `Based on ${relevantChunks.length} relevant document sections with similarity scores ranging from ${Math.min(...relevantChunks.map(c => c.score))} to ${Math.max(...relevantChunks.map(c => c.score))}`
      };
    } catch (error) {
      console.error('Error generating answer:', error);
      throw new Error(`Failed to generate answer: ${error.message}`);
    }
  }

  /**
   * Process query and return structured response
   */
  async processQuery(query, documentUrl, documentType = 'pdf') {
    try {
      console.log(`Processing query: ${query}`);
      
      // First, ensure document is processed and stored
      const namespace = `doc_${Date.now()}`;
      await this.processDocument(documentUrl, documentType, namespace);
      
      // Search for relevant chunks
      const relevantChunks = await this.searchChunks(query, namespace);
      console.log(`Found ${relevantChunks.length} relevant chunks`);
      
      // Generate answer
      const result = await this.generateAnswer(query, relevantChunks);
      
      return {
        query,
        answer: result.answer,
        explanation: result.explanation,
        relevantSections: relevantChunks,
        documentUrl,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  }

  /**
   * Process multiple queries for a document
   */
  async processMultipleQueries(queries, documentUrl, documentType = 'pdf') {
    try {
      const results = [];
      
      // Process document once
      const namespace = `doc_${Date.now()}`;
      await this.processDocument(documentUrl, documentType, namespace);
      
      // Process each query
      for (const query of queries) {
        try {
          const result = await this.processQuery(query, documentUrl, documentType);
          results.push(result.answer);
        } catch (error) {
          console.error(`Error processing query "${query}":`, error);
          results.push(`Error processing query: ${error.message}`);
        }
      }
      
      return {
        answers: results,
        documentUrl,
        queriesProcessed: queries.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error processing multiple queries:', error);
      throw error;
    }
  }
}

module.exports = new LLMService(); 