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

module.exports = router;