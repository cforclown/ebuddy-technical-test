import { Request, Response, NextFunction } from "express";
import { AuthController } from "../controller/auth";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Simulate token validation
  if (!AuthController.validateRequestAuth(token)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return next();
};
