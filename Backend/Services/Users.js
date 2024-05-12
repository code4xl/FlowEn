const jwt = require("jsonwebtoken");
const db = require("../Config/db.js");
const bcrypt = require("bcrypt");
const {getUserIdFromToken} = require("../Config/jwtProvider.js");
const emailTemplate = require("./Mail/Templates/EmailVerificationTemplate.js");
const mailSender = require("./Mail/mailSender.js");


const createUser = async (email, password, username, ) => {
    try{
        const checkUserQry = "SELECT * FROM login WHERE useremail = ?;";
        const [UserExist] = await db.query(checkUserQry, [email]);
        if(UserExist.length > 0){
            throw new Error("User Already Exists.");
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const otp = generateRandomOTP();
        const insertQuery = "INSERT INTO login(useremail, password, username, otp) VALUES (?,?,?,?)";
        const [result] = await db.query(insertQuery, [email, hashedPassword, username, otp]);
        if(result.entries === 0){
            throw new Error("Something went wrong while registering user");
        }
        await sendVerificationEmail(email, otp);
        const [user] = await db.query('SELECT LAST_INSERT_ID() as id ;');
        return user;
    } catch(err){
        throw new Error(err.message);
    }
}

function generateRandomOTP() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		//console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		//console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

const validateGmail = async(userId, otp) => {
    try{
        const sql = "SELECT * FROM login WHERE loginId = ? AND otp = ? AND otpCreatedOn >= DATE_SUB(NOW(), INTERVAL 5 MINUTE);";
        const [user] = await db.query(sql, [userId, otp]);
        if(user.length > 0){
            const validateQry = "UPDATE login SET isVerified = 1 WHERE loginId = ?;";
            const valRes = await db.query(validateQry, [userId]);
            return true;
            // if(valRes.affectedRows > 0){
            //     return true;
            // }else{
            //     return false;
            // }
        }
    }catch(err){
        throw new Error(err.message); 
    }

};

const findUserById = async(userId) => {
    try{
        const sql = "select * from login where loginId = ?;";
        const [user] = await db.query(sql, [userId]);
            if(!user){  
                throw new Error("User Not Found ");
            }else{   
                return user;
            }
    }catch(err){
        throw new Error(err.message); 
    }

};
const getUserByEmail = async (email) => {
    try {
        const sql = "SELECT * FROM login WHERE useremail = '"+email+"';";
        const [result] = await db.query(sql);
    
        if(result.length == 0) {
            throw new Error("User not found");
        }
        return result; 
        
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { createUser, validateGmail, findUserById, getUserByEmail };