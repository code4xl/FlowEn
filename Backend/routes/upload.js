const express = require("express");
const { upload } = require("../middlewares/upload");
const { uploadFile } = require("../controllers/upload");
const authMiddleware = require("../middlewares/auth")

const router = express.Router();

// Route to handle file upload with folder selection
router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  uploadFile
);

module.exports = router;
