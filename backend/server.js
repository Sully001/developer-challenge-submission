import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

// Enable CORS
app.use(cors());

// Middleware to parse JSON request body
app.use(express.json());

//Defining taskRoutes
app.use("/api/tasks", taskRoutes);

// Middleware for handling errors
app.use(errorHandler);

//Starting server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
