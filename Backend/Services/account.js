const { supabase } = require("../config/config");
const bcrypt = require("bcrypt");
const emailTemplate = require("./mail/mail/templates/EmailVerificationTemplate.js");
const mailSender = require("./mail/mailSender.js");
const authService = require("./auth.js");
const crypto = require("crypto");
const { DateTime } = require("luxon");

const registerUser = async (userData) => {
  const { name, mobile, email_id, password } = userData;

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const otp = generateRandomOTP();
  const usersTable = "fe_users"

  // Insert user into the database
  // console.log(supabase);
  const { data, error } = await supabase
    .from(usersTable)
    .insert([
      {
        name,
        mobile: mobile,
        email: email_id,
        password: hashedPassword,
        otp,
      },
    ])
    .select("u_id, name, mobile, email, role_id, otp")
    .single();
  console.log(data);
  if (error) {
    throw error;
  } else {
    await sendVerificationEmail(email_id, otp); //Haresh uncomment this afterwards.
  }
  return data;
};

const loginUser = async (email_id, password) => {
  // Fetch the user by email
  const { data, error } = await supabase
    .from(usersTable)
    .select("u_id, name, email, password, mobile, e_verified, is_active, verified, role_id, isNew, user_roles(name)")
    .eq("email", email_id);

  if (error) throw error;
  if (!data.length) throw new Error("User Not found, Please Register First.");

  let user = data[0];

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Incorrect Password");
  if (!user.e_verified) throw new Error("Email is not verified.");
  if (!user.is_active) throw new Error("Account is Blocked or deleted.");
  // console.log(user);
  try{
    const token = authService.generateToken(user);
    user = { u_id:user.u_id, name:user.name, email:user.email, role_id:user.role_id, role:user.user_roles.name, isNew: user.isNew, token };

  }catch(error){
    console.log("Creating token Error:::",error)
  }
  // console.log(user);
  return user;
};

const getUserById = async (user_id) => {
  const { data, error } = await supabase
    .from(usersTable)
    .select("*")
    .eq("user_id", user_id);

  if (error) throw error;
  if (!data.length) throw new Error("User not found");
  return data[0];
};

const getAllUsers = async () => {
  const { data, error } = await supabase
    .from(usersTable)
    .select("*, roles(role_name)");

  if (error) throw error;
  return data;
};

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

const validateGmail = async (userId, otp) => {
  try {
    // Fetch the user by userId and OTP, ensuring the OTP is valid within the 5-minute window
    const fiveMinutesAgo = DateTime.utc()
      .minus({ minutes: 10 })
      .toFormat("yyyy-MM-dd HH:mm:ss");

    // console.log(fiveMinutesAgo);
    const { data: user, error: fetchError } = await supabase
      .from(usersTable)
      .select("*")
      .eq("u_id", userId)
      .eq("otp", otp)
      .gte("otp_created_at", fiveMinutesAgo);
    // console.log(user);

    if (fetchError) throw fetchError;
    if (user == null || user.length === 0) {
      throw new Error("Invalid OTP or OTP expired");
    } else {
      // Update the user's `is_verified` status to true
      const { error: updateError } = await supabase
        .from(usersTable)
        .update({ e_verified: true })
        .eq("u_id", userId);

      if (updateError) throw updateError;

      return true;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const resendOTP = async (userId) => {
  try {
    // Generate a new OTP
    const otp = generateRandomOTP();

    // Update the OTP and its created time in the database
    const { error: updateError } = await supabase
      .from(usersTable)
      .update({ otp, otp_created_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    // Fetch the user's email to resend the OTP
    const { data: user, error: fetchError } = await supabase
      .from(usersTable)
      .select("email_id")
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;

    // Resend the verification email with the new OTP
    await sendVerificationEmail(user.email_id, otp);

    return { message: "OTP resent successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

// const forgotPasswords = async (email) => {
//   try {
//     // Fetch the user by email
//     const { data: user, error: fetchError } = await supabase
//       .from(usersTable)
//       .select("user_id, email_id")
//       .eq("email_id", email)
//       .single();

//     if (fetchError) throw fetchError;
//     if (!user) throw new Error("No user found with this email");

//     // Generate a password reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes expiry

//     // Update the reset token and expiry in the database
//     const { error: updateError } = await supabase
//       .from(usersTable)
//       .update({ reset_token: resetToken, reset_token_expiry: tokenExpiry })
//       .eq("user_id", user.user_id);

//     if (updateError) throw updateError;

//     // Construct the reset password link
//     const resetLink = `https://your-frontend-url.com/reset-password?token=${resetToken}`;

//     // Send the reset link to the user's email
//     await sendPasswordResetEmail(user.email_id, resetLink);

//     return { message: "Password reset link sent successfully" };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// async function sendPasswordResetEmail(email, resetLink) {
//   try {
//     const mailResponse = await mailSender(
//       email,
//       "Reset Your Password",
//       `<p>Click the link below to reset your password:</p>
//       <a href="${resetLink}">${resetLink}</a>
//       <p>This link will expire in 30 minutes.</p>`
//     );
//     // console.log(
//     //   "Password reset email sent successfully:",
//     //   mailResponse.response
//     // );
//   } catch (error) {
//     console.error("Error sending password reset email:", error);
//     throw error;
//   }
// }

// const resetPassword = async (token, newPassword) => {
//   try {
//     // Validate the token and check expiry
//     const { data: user, error: fetchError } = await supabase
//       .from(usersTable)
//       .select("user_id")
//       .eq("reset_token", token)
//       .gte("reset_token_expiry", new Date().toISOString())
//       .single();

//     if (fetchError) throw fetchError;
//     if (!user) throw new Error("Invalid or expired token");

//     // Hash the new password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update the user's password and clear the token
//     const { error: updateError } = await supabase
//       .from(usersTable)
//       .update({
//         password: hashedPassword,
//         reset_token: null,
//         reset_token_expiry: null,
//       })
//       .eq("user_id", user.user_id);

//     if (updateError) throw updateError;

//     return { message: "Password reset successfully" };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  validateGmail,
  resendOTP,
  // forgotPasswords,
  // resetPassword,
};
