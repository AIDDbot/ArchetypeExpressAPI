import express from "express";
import { logsController } from "./resources/logs/logs.controller.ts";

export const bootstrap = () => {
  const app: express.Application = express();
  const port = "3000";
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.use("/logs", logsController);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
