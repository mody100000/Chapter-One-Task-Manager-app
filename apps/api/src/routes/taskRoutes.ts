import { Router } from "express";
import {
  getAllTasks,
  createNewTask,
  getTaskByIdHandler,
  archiveTaskHandler,
  assignTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../controllers/tasksController.js";
import { limiter } from "../utils/limiter.js";

const router: Router = Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskByIdHandler);
router.patch("/:id", updateTaskHandler);
router.patch("/:id/archive/toggle", limiter, archiveTaskHandler);
router.patch("/:id/assign", assignTaskHandler);
router.post("/", createNewTask);
router.delete("/:id", deleteTaskHandler);

export default router;
