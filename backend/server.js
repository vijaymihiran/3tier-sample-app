const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(express.json());

// GET all tasks
app.get(['/api/tasks', '/tasks'], async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ADD a new task
app.post(['/api/tasks', '/tasks'], async (req, res) => {
  const { title, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, completed) VALUES (?, ?, false)',
      [title, description]
    );
    res.status(201).json({ id: result.insertId, title, description, completed: false });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE a task
app.put(['/api/tasks/:id', '/tasks/:id'], async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
      [title, description, completed, req.params.id]
    );
    const [updatedTask] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.status(200).json(updatedTask[0]);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE a task
app.delete(['/api/tasks/:id', '/tasks/:id'], async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
