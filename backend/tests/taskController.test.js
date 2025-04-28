import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
} from "../controllers/taskController.js";
import * as taskQueries from "../database/taskQueries.js";

// Mock the database queries
vi.mock("../database/taskQueries.js", () => ({
  getTasksQuery: vi.fn(),
  getTaskByIdQuery: vi.fn(),
  createTaskQuery: vi.fn(),
  deleteTaskQuery: vi.fn(),
}));

describe("Task Controller", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  // Setup mock request, response, and next function before each test
  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe("getAllTasks", () => {
    it("should return all tasks with status 200", async () => {
      const mockTasks = [
        { id: "1", title: "Task 1" },
        { id: "2", title: "Task 2" },
      ];
      taskQueries.getTasksQuery.mockResolvedValue(mockTasks);

      await getAllTasks(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error when query fails", async () => {
      const error = new Error("Database error");
      taskQueries.getTasksQuery.mockRejectedValue(error);

      await getAllTasks(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe("getTaskById", () => {
    it("should return task by id with status 200", async () => {
      const mockTask = { id: "1", title: "Task 1" };
      mockReq.params.id = "1";
      taskQueries.getTaskByIdQuery.mockResolvedValue(mockTask);

      await getTaskById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 404 when task not found", async () => {
      mockReq.params.id = "999";
      taskQueries.getTaskByIdQuery.mockResolvedValue(null);

      await getTaskById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Task with ID 999 not found",
          statusCode: 404,
        })
      );
    });
  });

  describe("createTask", () => {
    it("should create task and return 201 status", async () => {
      const newTask = {
        title: "New Task",
        description: "Description",
        status: "PENDING",
        due_date: "2025-01-01",
      };
      mockReq.body = newTask;
      const createdTask = { id: "1", ...newTask };
      taskQueries.createTaskQuery.mockResolvedValue(createdTask);

      await createTask(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdTask);
    });

    it("should return 400 when required fields are missing", async () => {
      mockReq.body = { title: "New Task" }; // Missing description and status

      await createTask(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Missing required fields",
          statusCode: 400,
        })
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete task and return success message", async () => {
      mockReq.params.id = "1";
      const deletedTask = { id: "1", title: "Deleted Task" };
      taskQueries.deleteTaskQuery.mockResolvedValue(deletedTask);

      await deleteTask(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Task deleted successfully",
      });
    });

    it("should return 400 when id is missing", async () => {
      await deleteTask(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Task ID is required",
          statusCode: 400,
        })
      );
    });

    it("should handle deletion of non-existent task", async () => {
      mockReq.params.id = "999";
      taskQueries.deleteTaskQuery.mockResolvedValue(null);

      await deleteTask(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Task with ID 999 not found",
          statusCode: 404,
        })
      );
    });
  });
});
