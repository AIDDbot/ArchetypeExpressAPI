import type { Request, Response } from "express";
import { Router } from "express";
import { hashString } from "../../shared/crypto/hash.utils.ts";
import { idUtils } from "../../shared/crypto/id.utils.ts";
import { jwtUtils } from "../../shared/crypto/jwt.utils.ts";
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import type { IdResDTO } from "../../shared/request/id.res.dto.ts";
import { getUserIdFromRequest } from "../../shared/request/request.utils.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
import type { LoginDto } from "./login-dto.type.ts";
import type { RegisterDto } from "./register-dto.type.ts";
import type { RequestPasswordDto } from "./request-password.type.ts";
import type { UpdatePasswordDto } from "./update-password.type.ts";
import type { UserTokenDTO } from "./user-token.dto.ts";
import { usersInMemoryRepository } from "./users.in-memory.repository.ts";
import { usersService } from "./users.service.ts";
export const usersController = Router();

usersController.get("/me", getMeHandler);
usersController.post("/register", registerHandler);
usersController.post("/login", loginHandler);
usersController.post("/request-password", requestPasswordHandler);
usersController.post("/update-password", updatePasswordHandler);

async function getMeHandler(
  req: Request,
  res: Response<UserTokenDTO | ErrorResDTO>
) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      sendError(res, 401, "Unauthorized");
      return;
    }
    const userDTO = await usersService.getById(userId, {
      usersRepository: usersInMemoryRepository,
    });
    sendSuccess(res, 200, userDTO);
  } catch (error) {
    console.error(error);
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
    const userTokenDTO = await usersService.register(registerDto, {
      usersRepository: usersInMemoryRepository,
      hashString,
      id: idUtils,
      jwtUtils,
    });
    sendSuccess(res, 201, userTokenDTO);
  } catch (error) {
    console.error(error);
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
    const userTokenDTO = await usersService.login(loginDto, {
      usersRepository: usersInMemoryRepository,
      hashString,
      jwtUtils,
    });
    sendSuccess(res, 201, userTokenDTO);
  } catch (error) {
    console.error(error);
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
