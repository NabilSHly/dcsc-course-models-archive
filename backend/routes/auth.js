const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();

// Login
router.post(
  "/login",
  [body("password").notEmpty().withMessage("Password is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { password } = req.body;

      // Fetch the (only) admin user. If you later add more users, switch to a proper identity field.
      const user = await prisma.user.findFirst({
        select: { id: true, password: true }, // least-privilege read
      }); // returns null if none exists
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Please run database seed.",
        });
      }

      // Compare plaintext password to stored bcrypt hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }

      // Safety: make sure envs exist
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: "Server misconfiguration: JWT_SECRET is not set",
        });
      }

      // Issue JWT (add short expiry via env, e.g. "1d")
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      });

      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user.id },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error during login" });
    }
  }
);

// Change password
router.post(
  "/change-password",
  authMiddleware,
  [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
    body("key").notEmpty().withMessage("Authorization key is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { oldPassword, newPassword, key } = req.body;

      // Verify authorization key
      if (key !== process.env.PASSWORD_CHANGE_KEY) {
        return res.status(403).json({
          success: false,
          message: "Invalid authorization key",
        });
      }

      // Get user from database
     const user = await prisma.user.findUnique({
   where: { id: req.user.id },             // use the authenticated subject
   select: { id: true, password: true }
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during password change",
      });
    }
  }
);

// Verify token
router.get("/verify", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user,
  });
});

module.exports = router;
