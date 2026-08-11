const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

// GET all tasks for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [tasks] = await db.query(
      `SELECT id, user_id, title, description, status, due_date, created_at
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
      due_date,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Task title is required" });
    }

    const [result] = await db.query(
      `INSERT INTO tasks
       (user_id, title, description, status, due_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description || null,
        status || "pending",
        due_date
          ? due_date.split("T")[0]
          : null,
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
        due_date
        ? due_date.split("T")[0]
        : null,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task not found" });
    }

    res.json({
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a task
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query(
      `DELETE FROM tasks
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task not found" });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;