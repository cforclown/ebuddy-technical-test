import { Router } from "express";


const apiRouter = (usersRouter: Router) => {
  const router = Router();
  
  router.use("/users", usersRouter);

  return router;
}

export default apiRouter;
