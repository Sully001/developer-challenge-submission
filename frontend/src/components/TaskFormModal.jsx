import { useRef } from "react";
import TaskForm from "./TaskForm";

const TaskFormModal = ({ updateTasks, formAction, propTask = null }) => {
  const dialogRef = useRef(null);

  const openDialog = (e) => {
    e.stopPropagation();
    dialogRef.current?.showModal();
  };

  const closeDialog = (e) => {
    e.stopPropagation();
    dialogRef.current?.close();
  };

  const handleDialogClick = (e) => {
    e.stopPropagation(); // Prevent propagation when clicking inside the modal
  };

  return (
    <>
      <div className="add-task-button-container mt">
        <button className="btn btn-blue" onClick={(e) => openDialog(e)}>
          {formAction === "create" ? "Create Task" : "Update"}
        </button>
      </div>

      <dialog
        className="add-task-dialog"
        ref={dialogRef}
        closedby="any"
        onClick={handleDialogClick}
      >
        <TaskForm
          updateTaskState={updateTasks}
          formAction={formAction}
          propTask={propTask}
          closeDialog={closeDialog}
        />
      </dialog>
    </>
  );
};

export default TaskFormModal;
