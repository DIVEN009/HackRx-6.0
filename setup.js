#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 HackRX 6.0 Setup Script');
console.log('=============================\n');

// Check if Node.js is installed
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js v16 or higher.');
  process.exit(1);
}

// Create necessary directories
const dirs = ['server', 'client'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  // Install root dependencies
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Install server dependencies
  console.log('Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });
  
  // Install client dependencies
  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Create environment file if it doesn't exist
const envPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Server Configuration
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

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync(envPath, envContent);
  console.log('📝 Created .env file in server directory');
  console.log('⚠️  Please update the .env file with your API keys');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update the .env file in the server directory with your API keys');
console.log('2. Start MongoDB if not already running');
console.log('3. Run "npm run dev:full" to start the application');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n📚 For more information, see the README.md file'); 