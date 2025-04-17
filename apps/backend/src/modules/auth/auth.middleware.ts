/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { dro, Environment } from '../../utils';
import { HttpStatusCode } from '../../utils/exceptions';
import { AuthController } from './auth.controller';


export function authMiddleware (): any {
  return (req: Request & { user: any }, res: Response, next: NextFunction): any => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Simulate token validation
      if (!AuthController.validateRequestAuth(token)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    
      return next();
    } catch (err) {
      if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        console.error(err.message);
        return res.status(HttpStatusCode.Unauthorized).send(dro.error(err.message));
      }
      if (err instanceof Error) {
        console.error(err.message);
        return res.status(HttpStatusCode.InternalServerError).send(dro.error(err.message));
      }
    }
  };
}
