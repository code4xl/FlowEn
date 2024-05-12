const express = require("express");
const router = express.Router();
const auth = require("../Controllers/authControllers.js");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/authenticateMail", auth.validateGmail);

module.exports = router;