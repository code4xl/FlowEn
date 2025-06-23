const authService = require('../services/auth.js');

const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const exists = await authService.checkUserExists(email);
    res.status(200).json({ exists_flag: exists });
  } catch (error) {
    console.error('Error in checkUser controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, occupation } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }

    const result = await authService.registerUser({
      name,
      email,
      password,
      occupation
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. OTP sent to email.',
      u_id: result.u_id
    });
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    await authService.sendOtpToEmail(email);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully.'
    });
  } catch (error) {
    console.error('Error in sendOtp controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    await authService.resendOtpToEmail(email);
    res.status(200).json({
      success: true,
      message: 'OTP resent successfully.'
    });
  } catch (error) {
    console.error('Error in resendOtp controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and OTP are required' 
      });
    }

    const verified = await authService.verifyUserOtp(email, otp);
    
    if (verified) {
      res.status(200).json({
        verified: true,
        message: 'OTP verified. You may now log in.'
      });
    } else {
      res.status(400).json({
        verified: false,
        message: 'Invalid or expired OTP.'
      });
    }
  } catch (error) {
    console.error('Error in verifyOtp controller:', error);
    res.status(400).json({ 
      verified: false, 
      message: error.message 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const result = await authService.loginUser(email, password);
    
    // If login successful, set HTTP-only cookie
    if (result.login_flag && result.token) {
      res.cookie('authToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      
      // Remove token from response (since it's now in cookie)
      delete result.token;
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(401).json({ 
      exists_flag: false,
      login_flag: false,
      message: error.message 
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    await authService.sendPasswordResetOtp(email);
    res.status(200).json({
      success: true,
      message: 'OTP sent to registered email.'
    });
  } catch (error) {
    console.error('Error in forgotPassword controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password } = req.body;
    
    if (!email || !otp || !new_password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, OTP, and new password are required' 
      });
    }

    await authService.resetUserPassword(email, otp, new_password);
    res.status(200).json({
      success: true,
      message: 'Password reset successfully.'
    });
  } catch (error) {
    console.error('Error in resetPassword controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const logout = async (req, res) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error in logout controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Logout failed' 
    });
  }
};

module.exports = { 
  checkUser,
  register, 
  login, 
  logout,
  sendOtp,
  resendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword
};