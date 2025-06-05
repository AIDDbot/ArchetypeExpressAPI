import type express from "express";
import { logsController } from "./resources/logs/logs.controller.ts";
import { portfoliosController } from "./resources/portfolios/portfolios.controller.ts";
import { usersController } from "./resources/users/users.controller.ts";

export function bindRoutes(app: express.Application) {
  app.get("/", (req, res) => {
    res.send("Hello from Express API Archetype!");
  });
  app.use("/logs", logsController);
  app.use("/users", usersController);
  app.use("/portfolios", portfoliosController);
}
