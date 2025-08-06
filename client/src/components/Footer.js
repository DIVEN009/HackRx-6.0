import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">HackRX 6.0</h3>
                <p className="text-sm text-gray-600">LLM-Powered Intelligent Query–Retrieval System</p>
              </div>
            </motion.div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Advanced document processing and query retrieval system designed for insurance, 
              legal, HR, and compliance domains. Built with cutting-edge AI technology 
              for accurate and explainable results.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/query" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Query Processor
                </a>
              </li>
              <li>
                <a href="/upload" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Document Upload
                </a>
              </li>
              <li>
                <a href="/api-docs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:sainidiven@gmail.com"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>sainidiven@gmail.com</span>
              </a>
              <a
                href="https://github.com/DIVEN009"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/diven-saini-5153252a3/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                <span className="font-semibold">Diven Saini</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 HackRX 6.0. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-600">Built with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">for the community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 