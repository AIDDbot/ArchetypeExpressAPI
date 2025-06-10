import type express from "express";
import { cryptosController } from "./resources/cryptos/cryptos.controller.ts";
import { logsController } from "./resources/logs/logs.controller.ts";
import { portfoliosController } from "./resources/portfolios/portfolios.controller.ts";
import { stocksController } from "./resources/stocks/stocks.controller.ts";
import { usersController } from "./resources/users/users.controller.ts";
import { NotFoundError } from "./shared/errors/base.error.ts";
import { sendError } from "./shared/request/response.utils.ts";

export function bindRoutes(app: express.Application) {
  app.get("/", (req, res) => {
    res.send("Hello from Express API Archetype!");
  });
  app.use("/logs", logsController);
  app.use("/users", usersController);
  app.use("/portfolios", portfoliosController);
  app.use("/stocks", stocksController);
  app.use("/cryptos", cryptosController);
  app.all(/(.*)/, (req, res) => {
    sendError(res, new NotFoundError("Route not found"));
  });
}
