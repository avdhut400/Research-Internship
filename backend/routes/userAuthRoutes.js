const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/userAuthController");

const userAuth = require("../middleware/userAuth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", userAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
    },
  });
});

module.exports = router;