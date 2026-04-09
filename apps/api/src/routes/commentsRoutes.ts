import { Router } from "express";
import {
  createCommentOnTask,
  getTaskTimelineHandler,
} from "../controllers/commentsController.js";

const router: Router = Router();

router.post("/", createCommentOnTask);
router.get("/task/:taskId/timeline", getTaskTimelineHandler);

export default router;
