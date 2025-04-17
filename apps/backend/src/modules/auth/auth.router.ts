import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller';
import { RequestHandler, validateBody } from '../../utils';
import { registerSchema, verifySchema } from './auth.dto';

export const AUTH_API_BASE_PATH = '/auth';

export function authRouter(authController: AuthController) {
  const router: Router = Router();
  
    router.post("/register", validateBody(registerSchema), RequestHandler(authController.register));
    router.post("/verify", validateBody(verifySchema), RequestHandler(authController.verify));

  return router;
}
