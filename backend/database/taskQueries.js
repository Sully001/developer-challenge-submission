import pool from "./db.js";
import { v4 as uuidv4 } from "uuid";

export const getTasksQuery = async () => {
  try {
    const result = await pool.query("SELECT * FROM tasks;");
    return result.rows;
  } catch (error) {
    //Error logged in the server console
    console.error("Database error in getTasksQuery:", error.message);
    //Error sent to the frontend
    throw new Error("Failed to fetch task");
  }
};

export const createTaskQuery = async (
  title,
  description,
  status,
  due_date = null
) => {
  try {
    const id = uuidv4();

    const result = await pool.query(
      "INSERT INTO tasks (id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [id, title, description, status, due_date]
    );

    if (!result.rows[0]) {
      throw new Error("Failed to create task");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Database error in createTaskQuery", error.message);
    throw new Error("Failed to create task");
  }
};

export const getTaskByIdQuery = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.error(
      `Database error in getTaskByIdQuery for ID: ${id}`,
      error.message
    );
    throw new Error("Failed to fetch task");
  }
};

export const updateTaskQuery = async (
  id,
  title,
  description,
  status,
  due_date
) => {
  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4 WHERE id = $5 RETURNING *",
      [title, description, status, due_date, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(
      `Database error in updateTaskQuery for ID: ${id}`,
      error.message
    );
    throw new Error("Failed to update task");
  }
};

export const deleteTaskQuery = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(
      `Database error in deleteTaskQuery for ID: ${id}`,
      error.message
    );
    throw new Error("Failed to delete task");
  }
};
