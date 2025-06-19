const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { getUserInfo, getAllUsers, getAllUserByRoles } = require('../controllers/account');

const router = express.Router();

//all after login
router.get('/:user_id', authMiddleware, getUserInfo);
router.get('/', authMiddleware, getAllUsers);
router.get('/user-by-roles/:role_id', authMiddleware, getAllUserByRoles);

module.exports = router;
