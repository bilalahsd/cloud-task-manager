const express = require("express");

const router = express.Router();

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

// GET conversation with a specific user
router.get(
  "/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.user.id;

      // Admin can access any user's conversation.
      // Normal users can only access their own conversation with the admin.
      if (req.user.role === "admin") {
        const [messages] = await db.query(
          `SELECT
             m.id,
             m.sender_id,
             m.receiver_id,
             m.message,
             m.is_read,
             m.created_at,
             sender.name AS sender_name,
             receiver.name AS receiver_name
           FROM messages m
           JOIN users sender ON m.sender_id = sender.id
           JOIN users receiver ON m.receiver_id = receiver.id
           WHERE
             (m.sender_id = ? AND m.receiver_id = ?)
             OR
             (m.sender_id = ? AND m.receiver_id = ?)
           ORDER BY m.created_at ASC`,
          [currentUserId, userId, userId, currentUserId]
        );

        return res.json(messages);
      }

      // Normal user can only access their own conversation
      if (Number(userId) !== Number(currentUserId)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      const [admins] = await db.query(
        `SELECT id
         FROM users
         WHERE role = 'admin'
         ORDER BY id ASC
         LIMIT 1`
      );

      if (admins.length === 0) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }

      const adminId = admins[0].id;

      const [messages] = await db.query(
        `SELECT
           m.id,
           m.sender_id,
           m.receiver_id,
           m.message,
           m.is_read,
           m.created_at,
           sender.name AS sender_name,
           receiver.name AS receiver_name
         FROM messages m
         JOIN users sender ON m.sender_id = sender.id
         JOIN users receiver ON m.receiver_id = receiver.id
         WHERE
           (m.sender_id = ? AND m.receiver_id = ?)
           OR
           (m.sender_id = ? AND m.receiver_id = ?)
         ORDER BY m.created_at ASC`,
        [currentUserId, adminId, adminId, currentUserId]
      );

      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);

      res.status(500).json({
        message: "Failed to load messages",
      });
    }
  }
);

// POST send a message
router.post(
  "/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.user.id;
      const { message } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          message: "Message cannot be empty",
        });
      }

      let receiverId;

      if (req.user.role === "admin") {
        // Admin sends directly to selected user
        const [users] = await db.query(
          `SELECT id
           FROM users
           WHERE id = ? AND role = 'user'`,
          [userId]
        );

        if (users.length === 0) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        receiverId = users[0].id;
      } else {
        // Normal user can only message the first admin
        if (Number(userId) !== Number(currentUserId)) {
          return res.status(403).json({
            message: "Access denied",
          });
        }

        const [admins] = await db.query(
          `SELECT id
           FROM users
           WHERE role = 'admin'
           ORDER BY id ASC
           LIMIT 1`
        );

        if (admins.length === 0) {
          return res.status(404).json({
            message: "Admin not found",
          });
        }

        receiverId = admins[0].id;
      }

      const [result] = await db.query(
        `INSERT INTO messages
         (sender_id, receiver_id, message)
         VALUES (?, ?, ?)`,
        [currentUserId, receiverId, message.trim()]
      );

      res.status(201).json({
        message: "Message sent successfully",
        messageId: result.insertId,
      });
    } catch (error) {
      console.error("Send message error:", error);

      res.status(500).json({
        message: "Failed to send message",
      });
    }
  }
);

// Mark messages as read
router.put(
  "/:userId/read",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.user.id;

      if (req.user.role === "admin") {
        await db.query(
          `UPDATE messages
           SET is_read = 1
           WHERE sender_id = ?
             AND receiver_id = ?`,
          [userId, currentUserId]
        );
      } else {
        const [admins] = await db.query(
          `SELECT id
           FROM users
           WHERE role = 'admin'
           ORDER BY id ASC
           LIMIT 1`
        );

        if (admins.length === 0) {
          return res.status(404).json({
            message: "Admin not found",
          });
        }

        await db.query(
          `UPDATE messages
           SET is_read = 1
           WHERE sender_id = ?
             AND receiver_id = ?`,
          [admins[0].id, currentUserId]
        );
      }

      res.json({
        message: "Messages marked as read",
      });
    } catch (error) {
      console.error("Mark messages read error:", error);

      res.status(500).json({
        message: "Failed to mark messages as read",
      });
    }
  }
);

module.exports = router;