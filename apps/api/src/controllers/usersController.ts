import type { Request, Response } from "express";
import { getAllUsers } from "../services/usersService.js";
import { parseZodError } from "../utils/parseZodError.js";

export const getAllUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(parseZodError(error));
  }
};
