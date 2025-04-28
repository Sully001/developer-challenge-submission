import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";
import TaskFormModal from "./TaskFormModal";

const AllCards = ({ tasks, isLoading, updateTasks }) => {
  const navigate = useNavigate();

  const deleteTask = async (id) => {
    const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      updateTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  };

  if (isLoading) {
    return <h1>Loading....</h1>;
  }

  if (tasks.length === 0) {
    return (
      <div className="no-tasks-container">
        <h1>No tasks available</h1>
        <p>Click create to make a new task</p>
      </div>
    );
  }

  return (
    <div className="all-cards">
      {tasks.map((task) => (
        <div
          className="single-card"
          key={task.id}
          onClick={() => navigate(`/tasks/${task.id}`)}
        >
          <h3 className="task-title">{task.title}</h3>
          <p className="task-description">{task.description}</p>
          <div className="status-date-container">
            <p className={`task-status ${task.status.toLowerCase()}`}>
              {task.status}
            </p>
            <p className="task-date">
              {format(parseISO(task.due_date), "dd MMMM yyyy")}
            </p>
          </div>
          <hr />

          <div className="button-container">
            <button
              className="btn btn-red"
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
            >
              Delete
            </button>

            <TaskFormModal
              updateTasks={updateTasks}
              formAction="update"
              propTask={task}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllCards;
