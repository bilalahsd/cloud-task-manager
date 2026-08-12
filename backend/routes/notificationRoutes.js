const express = require("express");

const router = express.Router();

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

// Get current user's notifications
router.get(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const [notifications] = await db.query(
        `SELECT
           id,
           type,
           title,
           message,
           related_task_id,
           is_read,
           created_at
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 50`,
        [req.user.id]
      );

      res.json(notifications);
    } catch (error) {
      console.error(
        "Get notifications error:",
        error
      );

      res.status(500).json({
        message: "Failed to load notifications",
      });
    }
  }
);

// Get unread notification count
router.get(
  "/unread-count",
  authenticateToken,
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT COUNT(*) AS unread_count
         FROM notifications
         WHERE user_id = ?
           AND is_read = 0`,
        [req.user.id]
      );

      res.json({
        unreadCount: Number(
          rows[0].unread_count
        ),
      });
    } catch (error) {
      console.error(
        "Unread notification count error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load notification count",
      });
    }
  }
);

// Mark one notification as read
router.put(
  "/:id/read",
  authenticateToken,
  async (req, res) => {
    try {
      const [result] = await db.query(
        `UPDATE notifications
         SET is_read = 1
         WHERE id = ?
           AND user_id = ?`,
        [
          req.params.id,
          req.user.id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message:
          "Notification marked as read",
      });
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to mark notification as read",
      });
    }
  }
);

// Mark all notifications as read
router.put(
  "/read-all",
  authenticateToken,
  async (req, res) => {
    try {
      await db.query(
        `UPDATE notifications
         SET is_read = 1
         WHERE user_id = ?
           AND is_read = 0`,
        [req.user.id]
      );

      res.json({
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to mark notifications as read",
      });
    }
  }
);

module.exports = router;