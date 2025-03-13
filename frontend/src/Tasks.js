import React from 'react';
import { Paper, Checkbox, Button } from '@material-ui/core';

const Tasks = ({ tasks, handleUpdate, handleDelete }) => {
  return (
    <div className="tasks-list">
      {tasks.map((task, index) => (
        <Paper key={index} className="task-item">
          <Checkbox
            checked={task.completed}
            onClick={() => handleUpdate(index)}
            color="primary"
          />
          <div
            className={task.completed ? "task-text completed" : "task-text"}
          >
            {task.task}
          </div>
          <Button
            onClick={() => handleDelete(index)}
            color="secondary"
            className="delete-task-btn"
          >
            Delete
          </Button>
        </Paper>
      ))}
    </div>
  );
};

export default Tasks;

