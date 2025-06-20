const jwt = require('jsonwebtoken');
const authService = require('../services/auth');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Get token from Bearer token

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: 'Access Denied. No Token Provided.' 
        });
    }

    try {
        // Verify the token using the auth service (includes blacklist check)
        const verified = authService.verifyToken(token);
        req.user = verified; // Attach the verified user data to the request object
        req.token = token; // Store token in request for logout functionality
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.log('Token verification error:', err.message);
        res.status(403).json({ 
            success: false, 
            error: 'Invalid or expired token' 
        });
    }
};

module.exports = verifyToken;