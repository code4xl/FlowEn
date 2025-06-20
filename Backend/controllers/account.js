const accountService = require('../services/account');

const register = async (req, res) => {
    try {
      const data = await accountService.registerUser(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  const logout = async (req, res) => {
    try {
      const token = req.token; // Token stored in middleware
      
      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'No token provided' 
        });
      }

      // Blacklist the token
      authService.blacklistToken(token);
      
      res.status(200).json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
    } catch (error) {
      console.log("Error in logout controller", error);
      res.status(500).json({ 
        success: false, 
        message: 'Logout failed' 
      });
    }
};
  
  const login = async (req, res) => {
    try {
      const { email_id, password } = req.body;
      const data = await accountService.loginUser(email_id, password);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.log("Error in login controller", error);
      res.status(401).json({ success: false, message: error.message });
    }
  };

const getUserInfo = async (req, res) => {
  try {
    const data = await accountService.getUserById(req.params.user_id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const data = await accountService.getAllUsers();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const data = await accountService.getRoles();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUserByRoles = async (req, res) => {
  const {role_id} = req.params;
  try {
    const data = await accountService.getAllUsersByRole(role_id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const validateUseEmail = async (req, res) => {
  try {
    // const {user_id} = req.user;
    const {otp, userId} = req.body;
    // console.log(otp, userId);
    const data = await accountService.validateGmail(userId, otp);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const resendUserOtp = async (req, res) => {
  try {
    const {user_id} = req.user;
    const data = await accountService.resendOTP(user_id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const forgetPassword = async (req, res) => {
//   try {
//     const {email_id} = req.user;
//     const data = await accountService.forgotPasswords(email_id);
//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


module.exports = { register, login, logout, getUserInfo, getAllUsers, getAllRoles, validateUseEmail, resendUserOtp, getAllUserByRoles };
