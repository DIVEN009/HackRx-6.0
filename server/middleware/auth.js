const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using Bearer token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided'
    });
  }
  
  try {
    // For this implementation, we'll use a simple token validation
    // In production, you'd want to validate against a database or JWT
    const expectedToken = '8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d';
    
    if (token === expectedToken) {
      req.user = { id: 'hackrx-user', role: 'participant' };
      next();
    } else {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }
  } catch (error) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Invalid token'
    });
  }
};

/**
 * Optional authentication middleware
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    try {
      const expectedToken = '8d8e65d23dd42580097ecc2a2d23d7dcda7f9354b6c1e04e8d790335a3d6361d';
      
      if (token === expectedToken) {
        req.user = { id: 'hackrx-user', role: 'participant' };
      }
    } catch (error) {
      // Token is invalid, but we'll continue without authentication
    }
  }
  
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
}; 