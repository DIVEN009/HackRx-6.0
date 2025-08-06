import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import QueryProcessor from './pages/QueryProcessor';
import DocumentUpload from './pages/DocumentUpload';
import ApiDocs from './pages/ApiDocs';
import HealthCheck from './pages/HealthCheck';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/query" element={<QueryProcessor />} />
            <Route path="/upload" element={<DocumentUpload />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/health" element={<HealthCheck />} />
          </Routes>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default App; 