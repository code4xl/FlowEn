const userService = require("../Services/Users.js");
const jwtProvider = require("../Config/jwtProvider.js");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { jwtDecode } = require('jwt-decode');

const register = asyncHandler(async (req, res) => {
    try{
        const {password, email, username, gOtp} = req.body;
        const [user] = await userService.createUser(email, password, username, gOtp);
        const token = jwtProvider.generateToken(user.id);
        return res.status(200).send({ token, message: "register success!" ,success:true, user});
    }catch(err){
        throw new Error(err.message);
    }
});

const login = asyncHandler(async (req, res) => {
    const {password, email} = req.body;
    try{
        const [user] = await userService.getUserByEmail(email);
        console.log(JSON.stringify(user));
        const passCheck = await bcrypt.compare(password, user.password)
        if(!passCheck){
            throw Error("Invalid Password.");
        }
        const token = jwtProvider.generateToken(user.loginId);
        return res.status(200).send({ token, message: "login success",success:true,user});
    } catch(err){
        throw new Error(err.message);
    }
});

const validateGmail = asyncHandler(async (req, res, next) => {
    const newData = req.body; // Assuming the new data to be updated is sent in the request body
    try {
        const { userId, otp } = newData; // Extracting updated fields from newData
        const valRes = await userService.validateGmail(userId, otp);
        if(valRes){
            return res.status(200).json({ success: true, message: "Email Validated." });
        }else{
            return res.status(400).json({ message: "Email Validation Falied." });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = { login, register, validateGmail };