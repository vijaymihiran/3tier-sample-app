import React, { Component } from "react";
import axios from "axios";
import { Paper, TextField, Checkbox, Button } from "@material-ui/core";
import "./App.css";

class App extends Component {
  state = {
    tasks: [],
    currentTask: "",
  };

  // Set Axios Base URL
  componentDidMount() {
    axios.defaults.baseURL = "/api";
    this.fetchTasks();
  }

  fetchTasks = () => {
    axios
      .get("/tasks")
      .then((response) => {
        this.setState({ tasks: response.data });
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  handleChange = (event) => {
    this.setState({ currentTask: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const newTask = {
      title: this.state.currentTask,
      description: "",
    };

    axios
      .post("/tasks", newTask)
      .then((response) => {
        this.setState((prevState) => ({
          tasks: [...prevState.tasks, response.data],
          currentTask: "",
        }));
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  handleUpdate = (taskId) => {
    const taskToUpdate = this.state.tasks.find((task) => task.id === taskId);

    if (!taskToUpdate) return;

    axios
      .put(`/tasks/${taskId}`, {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        completed: !taskToUpdate.completed,
      })
      .then((response) => {
        const updatedTasks = this.state.tasks.map((task) =>
          task.id === taskId ? response.data : task
        );
        this.setState({ tasks: updatedTasks });
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  handleDelete = (taskId) => {
    axios
      .delete(`/tasks/${taskId}`)
      .then(() => {
        this.setState({
          tasks: this.state.tasks.filter((task) => task.id !== taskId),
        });
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  render() {
    const { tasks, currentTask } = this.state;
    return (
      <div className="app">
        <header className="app-header">
          <h1>My To-Do List</h1>
        </header>
        <div className="main-content">
          <Paper elevation={3} className="todo-container">
            <form onSubmit={this.handleSubmit} className="task-form">
              <TextField
                variant="outlined"
                size="small"
                className="task-input"
                value={currentTask}
                required
                onChange={this.handleChange}
                placeholder="Add New TO-DO"
              />
              <Button className="add-task-btn" color="primary" variant="outlined" type="submit">
                Add Task
              </Button>
            </form>
            <div className="tasks-list">
              {tasks.map((task) => (
                <Paper key={task.id} className="task-item">
                  <Checkbox
                    checked={task.completed}
                    onClick={() => this.handleUpdate(task.id)}
                    color="primary"
                  />
                  <div className={task.completed ? "task-text completed" : "task-text"}>
                    {task.title}
                  </div>
                  <Button onClick={() => this.handleDelete(task.id)} color="secondary" className="delete-task-btn">
                    Delete
                  </Button>
                </Paper>
              ))}
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default App;

