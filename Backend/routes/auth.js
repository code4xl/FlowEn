const express = require('express');
const { register, login, getAllRoles, validateUseEmail, resendUserOtp } = require('../controllers/account');

const router = express.Router();

//all before login
router.post('/register', register);
router.post('/login', login);
router.get('/roles', getAllRoles);
router.post('/validate', validateUseEmail);
router.post('/resendOtp', resendUserOtp);

module.exports = router;