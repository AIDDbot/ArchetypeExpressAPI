// --- Express ---
import type { Request, Response } from "express";
import { Router } from "express";
// --- Application ---
import { getById, login, register } from "./users.application.ts";
// --- Shared ---
import {
  AuthenticationError,
  ValidationError,
} from "../../shared/errors/base.error.ts";
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
    sendError(res, new AuthenticationError("Authentication required"));
    return;
  }
  try {
    const user = await getById(userId);
    sendSuccess(res, 200, user);
  } catch (error) {
    sendError(res, error);
  }
}

async function registerHandler(
  req: Request,
  res: Response<UserTokenDTO | ErrorResDTO>
) {
  const registerDto: RegisterDto | undefined = req.body as RegisterDto;
  if (!registerDto) {
    sendError(res, new ValidationError("Request body is required"));
    return;
  }
  const validationErrors: string[] = [];
  if (!registerDto?.email) validationErrors.push("email is required");
  if (!registerDto?.password) validationErrors.push("password is required");
  if (!registerDto?.name) validationErrors.push("name is required");
  if (validationErrors.length > 0) {
    sendError(
      res,
      new ValidationError("Invalid registration data", {
        errors: validationErrors,
        received: {
          hasEmail: !!registerDto.email,
          hasPassword: !!registerDto.password,
          hasName: !!registerDto.name,
        },
      })
    );
    return;
  }

  try {
    const userTokenDTO = await register(registerDto);
    sendSuccess(res, 201, userTokenDTO);
  } catch (error) {
    sendError(res, error);
  }
}

async function loginHandler(
  req: Request,
  res: Response<UserTokenDTO | ErrorResDTO>
) {
  const loginDto: LoginDto | undefined = req.body as LoginDto;
  if (!loginDto) {
    sendError(res, new ValidationError("Request body is required"));
    return;
  }
  const validationErrors: string[] = [];
  if (!loginDto?.email) validationErrors.push("email is required");
  if (!loginDto?.password) validationErrors.push("password is required");
  if (validationErrors.length > 0) {
    sendError(
      res,
      new ValidationError("Invalid login data", {
        errors: validationErrors,
        received: {
          hasEmail: !!loginDto.email,
          hasPassword: !!loginDto.password,
        },
      })
    );
    return;
  }

  try {
    const userTokenDTO = await login(loginDto);
    sendSuccess(res, 201, userTokenDTO);
  } catch (error) {
    sendError(res, error);
  }
}

async function requestPasswordHandler(
  req: Request,
  res: Response<ErrorResDTO | IdResDTO>
) {
  if (!req.body) {
    sendError(res, new ValidationError("Request body is required"));
    return;
  }

  const requestPasswordDto = req.body as RequestPasswordDto;
  if (!requestPasswordDto.email) {
    sendError(
      res,
      new ValidationError("Email is required", {
        received: {
          hasEmail: !!requestPasswordDto.email,
        },
      })
    );
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
  if (!req.body) {
    sendError(res, new ValidationError("Request body is required"));
    return;
  }

  const updatePasswordDto = req.body as UpdatePasswordDto;
  const validationErrors: string[] = [];

  if (!updatePasswordDto.email) validationErrors.push("email is required");
  if (!updatePasswordDto.oldPassword)
    validationErrors.push("old password is required");
  if (!updatePasswordDto.newPassword)
    validationErrors.push("new password is required");

  if (validationErrors.length > 0) {
    sendError(
      res,
      new ValidationError("Invalid password update data", {
        errors: validationErrors,
        received: {
          hasEmail: !!updatePasswordDto.email,
          hasOldPassword: !!updatePasswordDto.oldPassword,
          hasNewPassword: !!updatePasswordDto.newPassword,
        },
      })
    );
    return;
  }

  const idResDTO: IdResDTO = {
    id: "1",
  };
  sendSuccess(res, 201, idResDTO);
}
