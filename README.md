# HackRX 6.0 - LLM-Powered Intelligent Query–Retrieval System

A comprehensive MERN stack application designed for processing large documents and making contextual decisions in insurance, legal, HR, and compliance domains.

## 🚀 Features

### Core Capabilities
- **Document Processing**: Support for PDF, DOCX, and email documents
- **Intelligent Query Processing**: Natural language understanding and response generation
- **Semantic Search**: Advanced embeddings and vector similarity search
- **Explainable AI**: Clear decision rationale and clause traceability
- **Real-time Processing**: Fast response times with optimized token usage

### Technical Stack
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **AI/ML**: OpenAI GPT-4, Pinecone Vector Database
- **Document Processing**: PDF-parse, Mammoth.js
- **Authentication**: JWT-based Bearer token system

## 📋 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React)       │◄──►│   (Express)     │◄──►│   (OpenAI)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Database      │    │   Vector Store  │
                       │   (MongoDB)     │    │   (Pinecone)    │
                       └─────────────────┘    └─────────────────┘
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- OpenAI API Key
- Pinecone API Key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HackRX-6.0
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Environment Configuration
Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hackrx

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=hackrx-documents

# Authentication
JWT_SECRET=your_jwt_secret_here
TEAM_TOKEN=8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d

# Client Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Start the Application
```bash
# Start both server and client (from root directory)
npm run dev:full

# Or start individually:
# Server only
npm run server

# Client only
npm run client
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer 8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d
```

### Main Endpoints

#### POST `/api/v1/hackrx/run`
Process documents and answer questions.

**Request Body:**
```json
{
  "documents": "https://example.com/document.pdf",
  "questions": [
    "What is the grace period for premium payment?",
    "Does this policy cover maternity expenses?"
  ]
}
```

**Response:**
```json
{
  "answers": [
    "A grace period of thirty days is provided...",
    "Yes, the policy covers maternity expenses..."
  ],
  "documentUrl": "https://example.com/document.pdf",
  "queriesProcessed": 2,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### POST `/api/v1/hackrx/query`
Process a single query.

**Request Body:**
```json
{
  "query": "What is the waiting period for pre-existing diseases?",
  "documentUrl": "https://example.com/document.pdf",
  "documentType": "pdf"
}
```

#### GET `/api/v1/health`
Check system health status.

## 🎯 Usage Examples

### Sample Insurance Policy Query
```bash
curl -X POST http://localhost:8000/api/v1/hackrx/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d" \
  -d '{
    "documents": "https://hackrx.blob.core.windows.net/assets/policy.pdf?sv=2023-01-03&st=2025-07-04T09%3A11%3A24Z&se=2027-07-05T09%3A11%3A00Z&sr=b&sp=r&sig=N4a9OU0w0QXO6AOIBiu4bpl7AXvEZogeT%2FjUHNO7HzQ%3D",
    "questions": [
      "What is the grace period for premium payment under the National Parivar Mediclaim Plus Policy?",
      "What is the waiting period for pre-existing diseases (PED) to be covered?",
      "Does this policy cover maternity expenses, and what are the conditions?"
    ]
  }'
```

## 🔧 System Components

### 1. Document Processing Pipeline
- **Text Extraction**: PDF, DOCX, and TXT file processing
- **Chunking**: Intelligent text segmentation with overlap
- **Embedding Generation**: OpenAI text-embedding-ada-002
- **Vector Storage**: Pinecone for semantic search

### 2. Query Processing Engine
- **Query Understanding**: Natural language processing
- **Semantic Search**: Vector similarity matching
- **Context Retrieval**: Relevant document sections
- **Answer Generation**: GPT-4 with context

### 3. Frontend Interface
- **Dashboard**: System overview and statistics
- **Query Processor**: Interactive document and question input
- **Document Upload**: Drag-and-drop file handling
- **API Documentation**: Comprehensive endpoint guide
- **Health Monitoring**: Real-time system status

## 📊 Evaluation Parameters

### Accuracy
- Precision of query understanding and clause matching
- Context-aware response generation
- Explainable decision reasoning

### Token Efficiency
- Optimized LLM token usage
- Cost-effective processing
- Batch processing capabilities

### Latency
- Fast response times (< 3 seconds)
- Real-time processing
- Efficient caching strategies

### Reusability
- Modular code architecture
- Extensible design patterns
- Comprehensive documentation

### Explainability
- Clear decision rationale
- Clause traceability
- Confidence scoring

## 🏗️ Project Structure

```
HackRX-6.0/
├── server/
│   ├── index.js                 # Main server file
│   ├── services/
│   │   └── llmService.js        # Core LLM processing logic
│   ├── routes/
│   │   ├── queryRoutes.js       # Main API endpoints
│   │   ├── documentRoutes.js    # Document management
│   │   └── authRoutes.js        # Authentication
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── App.js               # Main app component
│   │   └── index.js             # Entry point
│   ├── public/
│   └── package.json
├── package.json
└── README.md
```

## 🚀 Deployment

### Development
```bash
npm run dev:full
```

### Production
```bash
# Build client
cd client && npm run build

# Start server
cd ../server && npm start
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error responses
- **CORS Configuration**: Secure cross-origin requests
- **Helmet.js**: Security headers

## 📈 Performance Optimization

- **Vector Caching**: Efficient embedding storage
- **Batch Processing**: Multiple queries in single request
- **Async Processing**: Non-blocking operations
- **Memory Management**: Optimized chunk processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: team@hackrx.com
- GitHub Issues: [Repository Issues]
- Documentation: [API Documentation]

---

**Built with ❤️ for the HackRX 6.0 Challenge**