import { Router } from "express";
import { getAllUsersHandler } from "../controllers/usersController.js";

const router: Router = Router();

router.get("/", getAllUsersHandler);

export default router;
