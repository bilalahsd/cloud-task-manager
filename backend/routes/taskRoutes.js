const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

// GET all tasks for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [tasks] = await db.query(
      `SELECT id, user_id, title, description, status, priority, due_date, created_at
       FROM tasks
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create a new task
router.post("/", authenticateToken, async (req, res) => {
  try {
const {
  title,
  description,
  status,
  priority,
  due_date,
} = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Task title is required" });
    }

    const [result] = await db.query(
      `INSERT INTO tasks
       (user_id, title, description, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description || null,
        status || "pending",
        priority || "medium",
        due_date
          ? due_date.split("T")[0]
          : null,
      ]
    );
    await db.query(
  `INSERT INTO task_history
   (task_id, user_id, action, details)
   VALUES (?, ?, ?, ?)`,
  [
    result.insertId,
    req.user.id,
    "created",
    "Task created",
  ]
);

    res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update a task
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      due_date,
    } = req.body;

    // Get the existing task before updating it
    const [existingTasks] = await db.query(
      `SELECT title, description, status, due_date
       FROM tasks
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const existingTask = existingTasks[0];

    const newDueDate = due_date
      ? due_date.split("T")[0]
      : null;

    // Update the task
    const [result] = await db.query(
      `UPDATE tasks
       SET title = ?,
           description = ?,
           status = ?,
           due_date = ?
       WHERE id = ? AND user_id = ?`,
      [
        title,
        description || null,
        status || "pending",
        newDueDate,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Record changes in task history
    if (existingTask.title !== title) {
      await db.query(
        `INSERT INTO task_history
         (task_id, user_id, action, details)
         VALUES (?, ?, ?, ?)`,
        [
          req.params.id,
          req.user.id,
          "updated",
          `Title changed from "${existingTask.title}" to "${title}"`,
        ]
      );
    }

    if ((existingTask.description || null) !== (description || null)) {
      await db.query(
        `INSERT INTO task_history
         (task_id, user_id, action, details)
         VALUES (?, ?, ?, ?)`,
        [
          req.params.id,
          req.user.id,
          "updated",
          "Description changed",
        ]
      );
    }

    if (existingTask.status !== (status || "pending")) {
      await db.query(
        `INSERT INTO task_history
         (task_id, user_id, action, details)
         VALUES (?, ?, ?, ?)`,
        [
          req.params.id,
          req.user.id,
          "status_changed",
          `Status changed from "${existingTask.status}" to "${status || "pending"}"`,
        ]
      );
    }

    if (
      (existingTask.due_date || null) !==
      (newDueDate || null)
    ) {
      await db.query(
        `INSERT INTO task_history
         (task_id, user_id, action, details)
         VALUES (?, ?, ?, ?)`,
        [
          req.params.id,
          req.user.id,
          "updated",
          `Due date changed from "${existingTask.due_date || "none"}" to "${newDueDate || "none"}"`,
        ]
      );
    }

    res.json({
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// DELETE a task
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    // Check that the task exists and belongs to the logged-in user
    const [tasks] = await db.query(
      `SELECT id, user_id, title
       FROM tasks
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const task = tasks[0];

    // Record deletion before removing the task
    await db.query(
      `INSERT INTO task_history
       (task_id, user_id, action, details)
       VALUES (?, ?, ?, ?)`,
      [
        task.id,
        req.user.id,
        "deleted",
        `Task deleted: "${task.title}"`,
      ]
    );

    // Delete the task
    await db.query(
      `DELETE FROM tasks
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;