import "dotenv/config";
import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import type { CorsOptions } from "cors";

const app = express();
app.set("trust proxy", 1);

const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost",
  "http://127.0.0.1",
];

const corsOriginsEnv = process.env.CORS_ORIGINS?.trim();
const allowAllOrigins = !corsOriginsEnv || corsOriginsEnv === "*";
const allowedOrigins = allowAllOrigins
  ? defaultOrigins
  : corsOriginsEnv
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowAllOrigins || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/users", userRoutes);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, "0.0.0.0", (error) => {
  console.log(`API server is running on port ${PORT}`);
});
