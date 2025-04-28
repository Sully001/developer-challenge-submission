import { useState, useEffect } from "react";
import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");

const TaskForm = ({ updateTaskState, formAction, propTask, closeDialog }) => {
  const [errors, setErrors] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "PENDING",
    due_date: today,
  });

  useEffect(() => {
    if (propTask) {
      setTask({
        title: propTask.title,
        description: propTask.description,
        status: propTask.status,
        due_date: format(new Date(propTask.due_date), "yyyy-MM-dd"),
      });
    }
  }, [propTask]);

  const createTaskRequestHandler = async () => {
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();

    if (response.ok) {
      setErrors([]);
      setTask({
        title: "",
        description: "",
        status: "PENDING",
        due_date: today,
      });
      updateTaskState((prevTasks) => [...prevTasks, data]);
      return true;
    } else {
      // Extract error messages from the error objects
      const errorMessages = data.error.details.map((error) => error.msg);
      setErrors(errorMessages);
      return false;
    }
  };

  const updateTaskRequestHandler = async () => {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${propTask.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    const data = await response.json();
    if (response.ok) {
      setErrors([]);
      setTask({
        title: "",
        description: "",
        status: "PENDING",
        due_date: today,
      });
      updateTaskState((prevTasks) =>
        prevTasks.map((t) => (t.id === propTask.id ? data : t))
      );
      return true;
    } else {
      const errorMessages = data.error.details.map((error) => error.msg);
      setErrors(errorMessages);
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let success = false;
    if (formAction === "create") {
      success = await createTaskRequestHandler();
    } else if (formAction === "update") {
      success = await updateTaskRequestHandler();
    }

    // Only close the dialog if the operation was successful
    if (success) {
      closeDialog(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="create-task-form">
      <label htmlFor="title">Title: </label>
      <input
        type="text"
        name="title"
        id="title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />

      <label htmlFor="description">Description: </label>
      <textarea
        name="description"
        id="description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        rows="4"
        cols="50"
      ></textarea>

      <label htmlFor="task_status">Task Status:</label>
      <select
        name="task_status"
        id="task_status"
        onChange={(e) => setTask({ ...task, status: e.target.value })}
        value={task.status}
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <label htmlFor="due_date">Due date:</label>
      <input
        type="date"
        name="due_date"
        id="due_date"
        value={task.due_date}
        onChange={(e) => setTask({ ...task, due_date: e.target.value })}
      />

      {/* Error message will display here if available */}
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, index) => (
            <p key={index} className="error-message">
              {error}
            </p>
          ))}
        </div>
      )}

      <div className="button-container">
        <button type="button" className="btn btn-red" onClick={closeDialog}>
          Close
        </button>
        <button type="submit" className="btn btn-blue">
          {formAction === "create" ? "Create Task" : "Update Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
