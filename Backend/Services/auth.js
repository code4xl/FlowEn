const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for signing the token
const secret = process.env.JWT_SECRET || 'MasterMindAlternateSecret';

// In-memory store for blacklisted tokens (in production, use Redis)
const blacklistedTokens = new Set();

// Function to generate a token
exports.generateToken = (user) => {
  const payload = { 
    id: user.u_id, 
    email: user.email, 
    role: user.user_roles.name, 
    name: user.name, 
    role_id: user.role_id 
  };
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

// Function to verify token
exports.verifyToken = (token) => {
  try {
    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
      throw new Error('Token has been invalidated');
    }
    
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid Token');
  }
};

// Function to blacklist token (logout)
exports.blacklistToken = (token) => {
  blacklistedTokens.add(token);
  
  // Optional: Set timeout to remove token from blacklist after expiry
  // This helps prevent memory leaks in long-running applications
  setTimeout(() => {
    blacklistedTokens.delete(token);
  }, 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
};

// Function to check if token is blacklisted
exports.isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};