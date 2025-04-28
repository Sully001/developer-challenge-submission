import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getTasksQuery,
  createTaskQuery,
  getTaskByIdQuery,
  updateTaskQuery,
  deleteTaskQuery,
} from "../database/taskQueries.js";
import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";

// Mock the database pool and UUID
vi.mock("../database/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

describe("Task Queries", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("getTasksQuery", () => {
    it("should return all tasks", async () => {
      const mockTasks = [
        { id: "1", title: "Task 1", description: "Desc 1", status: "PENDING" },
        {
          id: "2",
          title: "Task 2",
          description: "Desc 2",
          status: "COMPLETED",
        },
      ];

      pool.query.mockResolvedValue({ rows: mockTasks });

      const result = await getTasksQuery();

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM tasks;");
      expect(result).toEqual(mockTasks);
    });

    it("should throw error when database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(getTasksQuery()).rejects.toThrow("Failed to fetch task");
    });
  });

  describe("createTaskQuery", () => {
    it("should create and return a new task", async () => {
      const mockId = "123e4567-e89b-12d3-a456-426614174000";
      const mockTask = {
        id: mockId,
        title: "New Task",
        description: "New Description",
        status: "PENDING",
        due_date: "2025-01-01",
      };

      uuidv4.mockReturnValue(mockId);
      pool.query.mockResolvedValue({ rows: [mockTask] });

      const result = await createTaskQuery(
        mockTask.title,
        mockTask.description,
        mockTask.status,
        mockTask.due_date
      );

      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO tasks (id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [
          mockId,
          mockTask.title,
          mockTask.description,
          mockTask.status,
          mockTask.due_date,
        ]
      );
      expect(result).toEqual(mockTask);
    });

    it("should throw error when task creation fails", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(createTaskQuery("Title", "Desc", "PENDING")).rejects.toThrow(
        "Failed to create task"
      );
    });
  });

  describe("getTaskByIdQuery", () => {
    it("should return a task by id", async () => {
      const mockTask = {
        id: "1",
        title: "Task 1",
        description: "Desc 1",
        status: "PENDING",
      };

      pool.query.mockResolvedValue({ rows: [mockTask] });

      const result = await getTaskByIdQuery("1");

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM tasks WHERE id = $1",
        ["1"]
      );
      expect(result).toEqual(mockTask);
    });

    it("should return undefined when task not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await getTaskByIdQuery("999");

      expect(result).toBeUndefined();
    });
  });

  describe("updateTaskQuery", () => {
    it("should update and return the task", async () => {
      const mockTask = {
        id: "1",
        title: "Updated Task",
        description: "Updated Description",
        status: "COMPLETED",
        due_date: "2025-01-01",
      };

      pool.query.mockResolvedValue({ rows: [mockTask] });

      const result = await updateTaskQuery(
        mockTask.id,
        mockTask.title,
        mockTask.description,
        mockTask.status,
        mockTask.due_date
      );

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4 WHERE id = $5 RETURNING *",
        [
          mockTask.title,
          mockTask.description,
          mockTask.status,
          mockTask.due_date,
          mockTask.id,
        ]
      );
      expect(result).toEqual(mockTask);
    });

    it("should throw error when update fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(
        updateTaskQuery("1", "Title", "Desc", "PENDING", "2025-01-01")
      ).rejects.toThrow("Failed to update task");
    });
  });

  describe("deleteTaskQuery", () => {
    it("should delete and return the task", async () => {
      const mockTask = {
        id: "1",
        title: "Task 1",
        description: "Desc 1",
        status: "PENDING",
      };

      pool.query.mockResolvedValue({ rows: [mockTask] });

      const result = await deleteTaskQuery("1");

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM tasks WHERE id = $1 RETURNING *",
        ["1"]
      );
      expect(result).toEqual(mockTask);
    });

    it("should throw error when delete fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(deleteTaskQuery("1")).rejects.toThrow(
        "Failed to delete task"
      );
    });
  });
});
