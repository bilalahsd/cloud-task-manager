const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO users
       (name, email, password, email_verified, otp_code, otp_expires_at)
       VALUES (?, ?, ?, FALSE, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        otp,
        otpExpiresAt
      ]
    );

    console.log(`OTP for ${email}: ${otp}`);

    res.status(201).json({
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    await pool.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
      [user.id]
    );

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const [users] = await pool.query(
      `SELECT id, otp_code, otp_expires_at, email_verified
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];

    if (user.email_verified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    if (!user.otp_code || !user.otp_expires_at) {
      return res.status(400).json({
        message: "No valid OTP found",
      });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (otp !== user.otp_code) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await pool.query(
      `UPDATE users
       SET email_verified = TRUE,
           otp_code = NULL,
           otp_expires_at = NULL
       WHERE id = ?`,
      [user.id]
    );

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const [users] = await pool.query(
      `SELECT id, email_verified
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (users[0].email_verified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await pool.query(
      `UPDATE users
       SET otp_code = ?, otp_expires_at = ?
       WHERE id = ?`,
      [
        otp,
        otpExpiresAt,
        users[0].id,
      ]
    );

    console.log(`Resent OTP for ${email}: ${otp}`);

    res.json({
      message: "A new OTP has been generated",
    });

  } catch (error) {
    console.error("Resend OTP error:", error);

    res.status(500).json({
      message: "Failed to resend OTP",
    });
  }
});

module.exports = router;