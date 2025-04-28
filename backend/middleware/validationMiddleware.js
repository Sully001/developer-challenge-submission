import { body, param } from "express-validator";

export const validateCreateTask = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage(
      "Status must be one of 'PENDING', 'IN_PROGRESS', or 'COMPLETED'"
    ),
  body("due_date")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
];

export const validateUpdateTask = [
  param("id").notEmpty().withMessage("Task ID is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage(
      "Status must be one of 'PENDING', 'IN_PROGRESS', or 'COMPLETED'"
    ),
  body("due_date")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
];

export const validateTaskId = [
  param("id").notEmpty().withMessage("Task ID is required"),
];
