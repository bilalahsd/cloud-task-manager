const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");
const db = require("../config/db");

const router = express.Router();

router.get(
  "/dashboard",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const [userCount] = await db.query(
        "SELECT COUNT(*) AS total_users FROM users WHERE role = 'user'"
      );

      const [taskCount] = await db.query(
        "SELECT COUNT(*) AS total_tasks FROM tasks"
      );

      const [pendingCount] = await db.query(
        "SELECT COUNT(*) AS pending_tasks FROM tasks WHERE status = 'pending'"
      );

      const [inProgressCount] = await db.query(
        "SELECT COUNT(*) AS in_progress_tasks FROM tasks WHERE status = 'in_progress'"
      );

      const [completedCount] = await db.query(
        "SELECT COUNT(*) AS completed_tasks FROM tasks WHERE status = 'completed'"
      );

      res.json({
        statistics: {
          totalUsers: userCount[0].total_users,
          totalTasks: taskCount[0].total_tasks,
          pendingTasks: pendingCount[0].pending_tasks,
          inProgressTasks: inProgressCount[0].in_progress_tasks,
          completedTasks: completedCount[0].completed_tasks,
        },
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);

      res.status(500).json({
        message: "Failed to load admin dashboard",
      });
    }
  }
);

router.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const [users] = await db.query(
  `SELECT
     u.id,
     u.name,
     u.email,
     u.role,
     u.created_at,
     u.last_login,
     COUNT(t.id) AS total_tasks,
     SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) AS pending_tasks,
     SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
     SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks
   FROM users u
   LEFT JOIN tasks t ON u.id = t.user_id
   GROUP BY u.id, u.name, u.email, u.role, u.created_at, u.last_login
   ORDER BY u.created_at DESC`
);

      res.json(users);
    } catch (error) {
      console.error("Admin users error:", error);

      res.status(500).json({
        message: "Failed to load users",
      });
    }
  }
);

router.get(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const userId = req.params.id;

      const [users] = await db.query(
        `SELECT id, name, email, role, created_at
         FROM users
         WHERE id = ?`,
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const [tasks] = await db.query(
        `SELECT
           id,
           title,
           description,
           status,
           priority,
           due_date,
           created_at
         FROM tasks
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
      );

      res.json({
        user: users[0],
        tasks,
      });
    } catch (error) {
      console.error("Admin user details error:", error);

      res.status(500).json({
        message: "Failed to load user details",
      });
    }
  }
);

router.get(
  "/users/:id/history",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const userId = req.params.id;

      const [history] = await db.query(
        `SELECT
           th.id,
           th.task_id,
           th.user_id,
           th.action,
           th.details,
           th.created_at,
           t.title AS task_title
         FROM task_history th
         LEFT JOIN tasks t ON th.task_id = t.id
         WHERE th.user_id = ?
         ORDER BY th.created_at DESC`,
        [userId]
      );

      res.json(history);
    } catch (error) {
      console.error("Admin task history error:", error);

      res.status(500).json({
        message: "Failed to load task history",
      });
    }
  }
);

router.put(
  "/tasks/:id/priority",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { priority } = req.body;

      if (!["low", "medium", "high"].includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority",
        });
      }

      const [result] = await db.query(
        `UPDATE tasks
         SET priority = ?
         WHERE id = ?`,
        [priority, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      res.json({
        message: "Task priority updated successfully",
      });
    } catch (error) {
      console.error("Admin priority error:", error);

      res.status(500).json({
        message: "Failed to update task priority",
      });
    }
  }
);

module.exports = router;