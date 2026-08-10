const express = require("express");
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

// Create a new task
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;

    const [existingTasks] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const existingTask = existingTasks[0];

    const updatedTitle = title ?? existingTask.title;
    const updatedDescription = description ?? existingTask.description;
    const updatedStatus = status ?? existingTask.status;
    const updatedDueDate = due_date ?? existingTask.due_date;

    await pool.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, due_date = ?
       WHERE id = ? AND user_id = ?`,
      [
        updatedTitle,
        updatedDescription,
        updatedStatus,
        updatedDueDate,
        req.params.id,
        req.user.id
      ]
    );

    res.json({
      message: "Task updated successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

// Update a task
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;

    const [result] = await pool.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, due_date = ?
       WHERE id = ? AND user_id = ?`,
      [
        title,
        description || null,
        status,
        due_date || null,
        req.params.id,
        req.user.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

// Delete a task
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;