import express from "express";
import { bindRoutes } from "./app.routes.ts";

export const bootstrapApp = () => {
  const app: express.Application = express();
  const port = "3000";
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  bindRoutes(app);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
