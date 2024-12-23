import { Router } from "express";
import { RequestHandler, validateBody, validateParams } from "cexpress-utils/lib";
import joi from 'joi';
import { UsersController } from "../controller/users";
import { UsersCollection } from "../repository/userCollection";
import { User } from "../entities/user";
import { authMiddleware } from "../middleware/authMiddleware";

export const updateUserSchema = joi.object<User>({
  id: joi.string().required(),
  name: joi.string().required(),
  email: joi.string().email().required(),
  age: joi.number(),
});

export const idSchema = joi.object({
  id: joi.string().required().messages({
    'any.required': 'id not found'
  })
});

const usersRouter = () => {
  const router = Router();
  
  const usersCollection = new UsersCollection();
  const usersController = new UsersController(usersCollection);

  router.get("/fetch-user-data/:id", validateParams(idSchema), RequestHandler(usersController.fetchUserData));
  router.put("/update-user-data", validateBody(updateUserSchema), RequestHandler(usersController.updateUserData));

  return router;
}

export default usersRouter;
