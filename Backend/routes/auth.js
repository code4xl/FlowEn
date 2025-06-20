const express = require('express');
const { register, login, getAllRoles, validateUseEmail, resendUserOtp, logout } = require('../controllers/account');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

//all before login
router.post('/register', register);
router.post('/login', login);
router.get('/roles', getAllRoles);
router.post('/validate', validateUseEmail);
router.post('/resendOtp', resendUserOtp);
router.post('/logout', authMiddleware, logout);

module.exports = router;