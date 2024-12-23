import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import usersRouter from "../routes/userRoutes";


const apiRouter = () => {
  const router = Router();
  
  router.use(authMiddleware);
  router.use("/users", usersRouter());

  return router;
}

export default apiRouter;