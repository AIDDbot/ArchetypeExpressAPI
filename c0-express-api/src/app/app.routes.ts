import type express from "express";
import { logsController } from "./resources/logs/logs.controller.ts";
import { usersController } from "./resources/users/users.controller.ts";

export function bindRoutes(app: express.Application) {
	app.get("/", (req, res) => {
		res.send("Hello from C0 Express API!");
	});
	app.use("/logs", logsController);
	app.use("/users", usersController);
}
