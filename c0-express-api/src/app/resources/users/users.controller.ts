// --- Express ---
import type { Request, Response } from "express";
import { Router } from "express";
// --- Application ---
import { getById, login, register } from "./users.application.ts";
// --- Shared ---
import { getUserIdFrom } from "../../shared/request/request.utils.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
// --- Types ---
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import type { IdResDTO } from "../../shared/request/id.res.dto.ts";
import type { LoginDto } from "./login-dto.type.ts";
import type { RegisterDto } from "./register-dto.type.ts";
import type { RequestPasswordDto } from "./request-password.type.ts";
import type { UpdatePasswordDto } from "./update-password.type.ts";
import type { UserTokenDTO } from "./user-token.dto.ts";
import type { User } from "./user.type.ts";

export const usersController = Router();

usersController.get("/me", getMeHandler);
usersController.post("/register", registerHandler);
usersController.post("/login", loginHandler);
usersController.post("/request-password", requestPasswordHandler);
usersController.post("/update-password", updatePasswordHandler);

async function getMeHandler(
  req: Request,
  res: Response<Omit<User, "password"> | ErrorResDTO>
) {
  const userId = getUserIdFrom(req);
  if (!userId) {
    sendError(res, 401, "Unauthorized");
    return;
  }
  try {
    const user = await getById(userId);
    sendSuccess(res, 200, user);
  } catch (error) {
    sendError(res, 403, "Forbidden");
  }
}

async function registerHandler(
  req: Request,
  res: Response<UserTokenDTO | ErrorResDTO>
) {
  const registerDto = req.body as RegisterDto;
  if (!registerDto.email || !registerDto.password || !registerDto.name) {
    sendError(res, 400, "Invalid request");
    return;
  }
  try {
    const userTokenDTO = await register(registerDto);
    sendSuccess(res, 201, userTokenDTO);
  } catch (error) {
    sendError(res, 400, "Invalid request");
  }
}

async function loginHandler(
  req: Request,
  res: Response<UserTokenDTO | ErrorResDTO>
) {
  const loginDto = req.body as LoginDto;
  if (!loginDto.email || !loginDto.password) {
    sendError(res, 400, "Invalid request");
    return;
  }
  try {
    const userTokenDTO = await login(loginDto);
    sendSuccess(res, 201, userTokenDTO);
  } catch (error) {
    sendError(res, 401, "Invalid credentials");
  }
}

async function requestPasswordHandler(
  req: Request,
  res: Response<ErrorResDTO | IdResDTO>
) {
  const requestPasswordDto = req.body as RequestPasswordDto;
  if (!requestPasswordDto.email) {
    sendError(res, 400, "Invalid request");
    return;
  }
  const idResDTO: IdResDTO = {
    id: "1",
  };
  sendSuccess(res, 201, idResDTO);
}

async function updatePasswordHandler(
  req: Request,
  res: Response<ErrorResDTO | IdResDTO>
) {
  const updatePasswordDto = req.body as UpdatePasswordDto;
  if (
    !updatePasswordDto.email ||
    !updatePasswordDto.oldPassword ||
    !updatePasswordDto.newPassword
  ) {
    sendError(res, 400, "Invalid request");
    return;
  }
  const idResDTO: IdResDTO = {
    id: "1",
  };
  sendSuccess(res, 201, idResDTO);
}
