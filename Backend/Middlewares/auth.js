const jwt = require('jsonwebtoken');
const authService = require('../services/auth');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Get token from request header
    //console.log(token); // Debugging the token in the console

    if (!token) return res.status(401).json({ error: 'Access Denied No Token Provided.' });

    try {
        // Verify the token using the secret key stored in environment variables
        const verified = authService.verifyToken(token);
        req.user = verified; // Attach the verified user data to the request object
        // console.log("clear");
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.log(err); // Log error for debugging
        res.status(403).json({ error: 'Invalid Token' }); // Invalid token
    }
};

module.exports = verifyToken;
