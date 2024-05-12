const jwt = require('jsonwebtoken');

const generateToken = (userId)=>{
    let token = jwt.sign({ userId: userId},process.env.SECRET_KEY ,{ expiresIn: "3d" });
    return token;
};


module.exports = {generateToken}
