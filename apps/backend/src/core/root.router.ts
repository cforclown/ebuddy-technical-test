import { Router } from "express";


const mainRouter = (apiRouter: Router) => {
  const router = Router();
  
  router.use("/api", apiRouter);

  return router;
}

export default mainRouter;
