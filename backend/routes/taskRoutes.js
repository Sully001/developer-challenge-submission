import express from "express";
import {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
} from "../controllers/taskController.js";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
} from "../middleware/validationMiddleware.js";
import { handleValidationErrors } from "../middleware/validationErrorHandler.js";

const taskRoutes = express.Router();

taskRoutes.get("/", getAllTasks);

taskRoutes.post("/", validateCreateTask, handleValidationErrors, createTask);

taskRoutes.get("/:id", validateTaskId, handleValidationErrors, getTaskById);

taskRoutes.delete("/:id", validateTaskId, handleValidationErrors, deleteTask);

taskRoutes.patch(
  "/:id",
  validateTaskId,
  validateUpdateTask,
  handleValidationErrors,
  updateTask
);

export default taskRoutes;
