const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'MasterMindAlternateSecret';

const verifyToken = (req, res, next) => {
    // Get token from HTTP-only cookie instead of Authorization header
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Access Denied. No authentication token provided.' 
        });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, secret);
        req.user = verified; // Attach the verified user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.log('Token verification error:', err.message);
        
        // Clear invalid cookie
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.status(403).json({ 
            success: false,
            error: 'Invalid or expired token. Please login again.' 
        });
    }
};

module.exports = verifyToken;