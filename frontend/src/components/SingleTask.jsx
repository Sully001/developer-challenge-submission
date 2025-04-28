import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";

function SingleTask() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error.message);
        }
        // Otherwise set the task state
        setTask(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTaskById();
  }, [id]);

  if (error) {
    return (
      <>
        <h2 className="error-message">{error}</h2>
        <button onClick={() => navigate("/")}>Back to All Tasks</button>
      </>
    );
  }

  if (task === null) {
    // Render a loading message or placeholder while the task is being fetched
    return <h2 className="loading-message">Loading task details...</h2>;
  }

  return (
    <div className="single-task-container">
      <h2 className="task-title">Task Title: {task.title}</h2>
      <p className="task-description">Description: {task.description}</p>
      <p className={`task-status single-task ${task.status.toLowerCase()}`}>
        {task.status}
      </p>
      <p className="task-due-date">
        Task Due Date: {format(parseISO(task.due_date), "dd MMMM yyyy")}
      </p>

      <button className="btn btn-blue" onClick={() => navigate("/")}>
        Back to All Tasks
      </button>
    </div>
  );
}

export default SingleTask;
