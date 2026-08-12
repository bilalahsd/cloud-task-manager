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

// GET all tasks for admin task management
router.get(
  "/tasks",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const [tasks] = await db.query(
        `SELECT
           t.id,
           t.user_id,
           t.title,
           t.description,
           t.status,
           t.priority,
           t.due_date,
           t.created_at,
           u.name AS user_name,
           u.email AS user_email
         FROM tasks t
         JOIN users u ON t.user_id = u.id
         ORDER BY t.created_at DESC`
      );

      res.json(tasks);
    } catch (error) {
      console.error("Admin tasks error:", error);

      res.status(500).json({
        message: "Failed to load admin tasks",
      });
    }
  }
);

// CREATE a task as administrator
router.post(
  "/tasks",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const {
        title,
        description,
        status,
        priority,
        due_date,
        user_id,
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          message: "Task title is required",
        });
      }

      if (!user_id) {
        return res.status(400).json({
          message: "A user must be selected",
        });
      }

      if (
        !["pending", "in_progress", "completed"].includes(
          status || "pending"
        )
      ) {
        return res.status(400).json({
          message: "Invalid task status",
        });
      }

      if (
        !["low", "medium", "high"].includes(
          priority || "medium"
        )
      ) {
        return res.status(400).json({
          message: "Invalid task priority",
        });
      }

      const [users] = await db.query(
        `SELECT id, name
         FROM users
         WHERE id = ? AND role = 'user'`,
        [user_id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const cleanDueDate = due_date
        ? due_date.split("T")[0]
        : null;

      const [result] = await db.query(
        `INSERT INTO tasks
         (user_id, title, description, status, priority, due_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          title.trim(),
          description?.trim() || null,
          status || "pending",
          priority || "medium",
          cleanDueDate,
        ]
      );

      await db.query(
  `INSERT INTO notifications
   (user_id, type, title, message, related_task_id)
   VALUES (?, ?, ?, ?, ?)`,
  [
    user_id,
    "task_assigned",
    "New task assigned",
    `A new task "${title.trim()}" has been assigned to you.`,
    result.insertId,
  ]
);

      await db.query(
        `INSERT INTO task_history
         (task_id, user_id, action, details)
         VALUES (?, ?, ?, ?)`,
        [
          result.insertId,
          user_id,
          "ADMIN_TASK_CREATED",
          `Task created and assigned by administrator to ${users[0].name}`,
        ]
      );

      res.status(201).json({
        message: "Task created and assigned successfully",
        taskId: result.insertId,
      });
    } catch (error) {
      console.error("Admin task create error:", error);

      res.status(500).json({
        message: "Failed to create task",
      });
    }
  }
);

// Reassign an existing task to another user
router.put(
  "/tasks/:id/assign",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const taskId = req.params.id;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          message: "A user must be selected",
        });
      }

      const [tasks] = await db.query(
        `SELECT
           id,
           user_id,
           title
         FROM tasks
         WHERE id = ?`,
        [taskId]
      );

      if (tasks.length === 0) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      const task = tasks[0];

      if (Number(task.user_id) === Number(user_id)) {
        return res.status(400).json({
          message: "Task is already assigned to this user",
        });
      }

      const [oldUsers] = await db.query(
        `SELECT id, name
         FROM users
         WHERE id = ?`,
        [task.user_id]
      );

      const [newUsers] = await db.query(
        `SELECT id, name
         FROM users
         WHERE id = ? AND role = 'user'`,
        [user_id]
      );

      if (newUsers.length === 0) {
        return res.status(404).json({
          message: "New user not found",
        });
      }

      const oldUserName =
        oldUsers.length > 0
          ? oldUsers[0].name
          : `User #${task.user_id}`;

      const newUserName = newUsers[0].name;

      await db.query(
        `UPDATE tasks
         SET user_id = ?
         WHERE id = ?`,
        [user_id, taskId]
      );

      await db.query(
  `INSERT INTO notifications
   (user_id, type, title, message, related_task_id)
   VALUES (?, ?, ?, ?, ?)`,
  [
    user_id,
    "task_reassigned",
    "Task assigned to you",
    `The task "${task.title}" has been assigned to you by the administrator.`,
    taskId,
  ]
);

await db.query(
  `INSERT INTO notifications
   (user_id, type, title, message, related_task_id)
   VALUES (?, ?, ?, ?, ?)`,
  [
    task.user_id,
    "task_reassigned",
    "Task reassigned",
    `The task "${task.title}" has been reassigned to ${newUserName}.`,
    taskId,
  ]
);

      // Keep the reassignment visible in both users' histories.
      await db.query(
        `INSERT INTO task_history
         (task_id, user_id, action, details)
         VALUES (?, ?, ?, ?)`,
        [
          taskId,
          task.user_id,
          "TASK_REASSIGNED",
          `Task reassigned by administrator from ${oldUserName} to ${newUserName}`,
        ]
      );

      await db.query(
        `INSERT INTO task_history
         (task_id, user_id, action, details)
         VALUES (?, ?, ?, ?)`,
        [
          taskId,
          user_id,
          "TASK_REASSIGNED",
          `Task assigned to ${newUserName} by administrator from ${oldUserName}`,
        ]
      );

      res.json({
        message: "Task reassigned successfully",
      });
    } catch (error) {
      console.error("Admin task reassignment error:", error);

      res.status(500).json({
        message: "Failed to reassign task",
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
      const taskId = req.params.id;

      if (
        !["low", "medium", "high"].includes(priority)
      ) {
        return res.status(400).json({
          message: "Invalid priority",
        });
      }

      const [tasks] = await db.query(
        `SELECT
           id,
           user_id,
           title,
           priority
         FROM tasks
         WHERE id = ?`,
        [taskId]
      );

      if (tasks.length === 0) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      const task = tasks[0];

      if (task.priority === priority) {
        return res.json({
          message:
            "Task priority is already set to this value",
        });
      }

      await db.query(
        `UPDATE tasks
         SET priority = ?
         WHERE id = ?`,
        [priority, taskId]
      );

      await db.query(
        `INSERT INTO notifications
         (user_id, type, title, message, related_task_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          task.user_id,
          "task_priority",
          "Task priority updated",
          `The priority of "${task.title}" was changed to ${priority.toUpperCase()}.`,
          task.id,
        ]
      );

      res.json({
        message:
          "Task priority updated successfully",
      });
    } catch (error) {
      console.error(
        "Admin priority error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update task priority",
      });
    }
  }
);

router.delete(
  "/tasks/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const taskId = req.params.id;

      // Get task details before deleting it
      const [tasks] = await db.query(
        `SELECT id, user_id, title, description, status, priority, due_date
         FROM tasks
         WHERE id = ?`,
        [taskId]
      );

      if (tasks.length === 0) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      const task = tasks[0];

// Record the admin deletion in task history

      // Delete the task
      await db.query(
        `DELETE FROM tasks
         WHERE id = ?`,
        [taskId]
      );

      res.json({
        message: "Task deleted successfully by admin",
      });
    } catch (error) {
      console.error("Admin task delete error:", error);

      res.status(500).json({
        message: "Failed to delete task",
      });
    }
  }
);

module.exports = router;