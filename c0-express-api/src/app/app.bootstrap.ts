import cors from "cors";
import express from "express";
import { bindRoutes } from "./app.routes.ts";
import { logMiddleware } from "./middleware/log.middleware.ts";

export const bootstrapApp = () => {
  const app: express.Application = express();
  const port = "3000";
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logMiddleware);
  bindRoutes(app);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
