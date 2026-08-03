const express = require("express");

const {
  loginAdmin,
  getAdminProfile,
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Public admin route
router.post("/login", loginAdmin);

// Protected admin route
router.get("/profile", adminAuth, getAdminProfile);

module.exports = router;