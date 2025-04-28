import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.js";

// Variable to store the ID of the created task
let createdTaskId;

describe("Task API Endpoints", () => {
  it("should create a new task", async () => {
    const response = await request(app).post("/api/tasks").send({
      title: "Task 1",
      description: "This is a test task",
      status: "PENDING",
      due_date: "2025-05-01",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Task 1");
    expect(response.body.description).toBe("This is a test task");
    expect(response.body.status).toBe("PENDING");

    // Save the created task ID for later tests
    createdTaskId = response.body.id;
  });

  it("should fetch all tasks", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should fetch a task by ID", async () => {
    const response = await request(app).get(`/api/tasks/${createdTaskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", createdTaskId);
    expect(response.body.title).toBe("Task 1");
  });

  it("should update a task", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${createdTaskId}`)
      .send({
        title: "Updated Task",
        description: "Updated description",
        status: "COMPLETED",
        due_date: "2025-06-01",
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Task");
    expect(response.body.status).toBe("COMPLETED");
  });

  it("should delete a task", async () => {
    const response = await request(app).delete(`/api/tasks/${createdTaskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Task deleted successfully"
    );
  });

  it("should return validation error for missing fields", async () => {
    const response = await request(app).post("/api/tasks").send({
      title: "",
      description: "This is a test task",
      status: "PENDING",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty("message", "Validation failed");
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: "Title is required" }),
        expect.objectContaining({ msg: "Due date is required" }),
      ])
    );
  });

  it("should return validation error for invalid status", async () => {
    const response = await request(app).post("/api/tasks").send({
      title: "Task 2",
      description: "This is a test task",
      status: "INVALID_STATUS",
      due_date: "2025-05-01",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty("message", "Validation failed");
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Status must be one of 'PENDING', 'IN_PROGRESS', or 'COMPLETED'",
        }),
      ])
    );
  });
});
