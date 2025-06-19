const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for signing the token
const secret = process.env.JWT_SECRET || 'MasterMindAlternateSecret';

// Function to generate a token
exports.generateToken = (user) => {
  // console.log("From generate token::::",user.user_roles.name  );
  const payload = { id: user.u_id, email: user.email, role: user.user_roles.name, name:user.name, role_id:user.role_id };
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

// Function to verify token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid Token');
  }
};
