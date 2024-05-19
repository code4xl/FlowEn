
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const userService = require('../Services/Users.js');


const authMiddleware = asyncHandler(async(req, res, next) => {
    // Get token from headers
    let token;
        // Check if token is provided
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                // console.log(decoded);
                const [user] = await userService.findUserById(decoded?.userId);
                // console.log(user);
                req.user = user;
                next();
            }
        }catch (err){
            // Token is invalid
            console.log("Invalid token");
            throw new Error('Invalid token.');
        }
    }else{
        console.log("Access denied.");
        throw new Error('Access denied. No token provided.');
 
    }       

});

module.exports = {authMiddleware};
