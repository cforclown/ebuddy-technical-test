import { Router } from "express";
import { z } from "zod";
import { RequestHandler, validateBody } from "../../utils";
import { UsersController } from "./users.controller";
import { authMiddleware } from "../auth";

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional().nullable(),
});

export const usersRouter = (usersController: UsersController) => {
  const router = Router();

  router.use(authMiddleware());
  router.get("/", RequestHandler(usersController.fetchAllUsers));
  router.get("/fetch-user-data/:id", RequestHandler(usersController.fetchUserData));
  router.put("/update-user-data", validateBody(updateUserSchema), RequestHandler(usersController.updateUserData));

  return router;
}
