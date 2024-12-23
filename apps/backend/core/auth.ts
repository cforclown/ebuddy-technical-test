import { Router } from "express";
import Joi from "joi";
import { RequestHandler, validateBody } from "cexpress-utils/lib";
import { AuthController } from "../controller/auth";
import { UsersCollection } from "../repository/userCollection";


const authRouter = () => {
  const router = Router();

  const authController = new AuthController(new UsersCollection());
  
  router.post("/register", validateBody(Joi.object({
    id: Joi.string().required(),
    email: Joi.string().email().required()
  })), RequestHandler(authController.register));
  router.post("/verify", validateBody(Joi.object({
    token: Joi.string().required()
  })), RequestHandler(authController.verify));

  return router;
}

export default authRouter;
