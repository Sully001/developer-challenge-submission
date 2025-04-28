import {
  getTasksQuery,
  createTaskQuery,
  deleteTaskQuery,
  updateTaskQuery,
  getTaskByIdQuery,
} from "../database/taskQueries.js";

export const getAllTasks = async (req, res, next) => {
  try {
    const data = await getTasksQuery();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("Task ID is required");
      error.statusCode = 400;
      throw error;
    }
    const data = await getTaskByIdQuery(req.params.id);

    if (!data) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, due_date } = req.body;
    console.log("Request body:", req.body);
    if (!title || !description || !status) {
      const error = new Error("Missing required fields");
      error.statusCode = 400;
      throw error;
    }

    const data = await createTaskQuery(title, description, status, due_date);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const error = new Error("Task ID is required");
      error.statusCode = 400;
      throw error;
    }

    const data = await deleteTaskQuery(req.params.id);

    if (!data) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;

    if (!id || !title || !description || !status) {
      const error = new Error("Missing required fields");
      error.statusCode = 400;
      throw error;
    }

    const data = await updateTaskQuery(
      id,
      title,
      description,
      status,
      due_date
    );
    if (!data) {
      const error = new Error(`Task with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
