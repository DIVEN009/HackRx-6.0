const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * POST /api/v1/auth/validate
 * Validate the provided token
 */
router.post('/validate', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        error: 'No token provided',
        message: 'Token is required'
      });
    }
    
    const expectedToken = '8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d';
    
    if (token === expectedToken) {
      res.json({
        valid: true,
        user: {
          id: 'hackrx-user',
          role: 'participant',
          team: 'HackRX-6.0'
        },
        message: 'Token validated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(401).json({
        valid: false,
        error: 'Invalid token',
        message: 'The provided token is not valid'
      });
    }
    
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({
      error: 'Failed to validate token',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/auth/status
 * Get authentication status
 */
router.get('/status', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.json({
        authenticated: false,
        message: 'No token provided'
      });
    }
    
    const expectedToken = '8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d';
    
    if (token === expectedToken) {
      res.json({
        authenticated: true,
        user: {
          id: 'hackrx-user',
          role: 'participant',
          team: 'HackRX-6.0'
        },
        message: 'Successfully authenticated',
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        authenticated: false,
        message: 'Invalid token'
      });
    }
    
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({
      error: 'Failed to check authentication status',
      message: error.message
    });
  }
});

module.exports = router; 