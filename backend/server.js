const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Middleware
app.use(express.json());

// GET all tasks
app.get(['/api/tasks', '/tasks'], (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ADD a new task
app.post(['/api/tasks', '/tasks'], (req, res) => {
  const { title, description } = req.body;
  const query = 'INSERT INTO tasks (title, description, completed) VALUES (?, ?, false)';
  
  db.query(query, [title, description], (err, results) => {
    if (err) {
      console.error("Error adding task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    res.status(201).json({ id: results.insertId, title, description, completed: false });
  });
});

// UPDATE a task
app.put(['/api/tasks/:id', '/tasks/:id'], (req, res) => {
  const { title, description, completed } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';

  db.query(query, [title, description, completed, req.params.id], (err, results) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Fetch the updated task and return it
    db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id], (err, updatedTask) => {
      if (err) return res.status(500).json({ error: "Error retrieving updated task" });

      res.status(200).json(updatedTask[0]); // Return updated task
    });
  });
});

// DELETE a task
app.delete(['/api/tasks/:id', '/tasks/:id'], (req, res) => {
  const query = 'DELETE FROM tasks WHERE id = ?';

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: 'Task deleted' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

