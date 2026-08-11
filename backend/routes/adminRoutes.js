const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    res.json({
      message: "Welcome to the admin dashboard",
      admin: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);

module.exports = router;