import type { Request, Response } from "express";
import { Router } from "express";
import { ErrorResDTO } from "../../shared/request/error.res.dto";
import { IdResDTO } from "../../shared/request/id.res.dto";
import { sendSuccess } from "../../shared/request/response.utils";
import type { LoginDto } from "./login-dto.type";
import type { RegisterDto } from "./register-dto.type";
import type { RequestPasswordDto } from "./request-password.type";
import type { UpdatePasswordDto } from "./update-password.type";
import type { UserTokenDTO } from "./user-token.dto.ts";
import { usersService } from "./users.service.ts";
export const usersController = Router();

usersController.post("/register", registerHandler);
usersController.post("/login", loginHandler);
usersController.post("/request-password", requestPasswordHandler);
usersController.post("/update-password", updatePasswordHandler);

async function registerHandler(
  req: Request,
  res: Response<UserTokenDTO | ErrorResDTO>
) {
  const registerDto = req.body as RegisterDto;
  const userTokenDTO = await usersService.register(registerDto);
  sendSuccess(res, 201, userTokenDTO);
}

async function loginHandler(
  req: Request,
  res: Response<UserTokenDTO | ErrorResDTO>
) {
  const loginDto = req.body as LoginDto;
  const userTokenDTO = await usersService.login(loginDto);
  sendSuccess(res, 201, userTokenDTO);
}

async function requestPasswordHandler(
  req: Request,
  res: Response<ErrorResDTO | IdResDTO>
) {
  const requestPasswordDto = req.body as RequestPasswordDto;
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
  const idResDTO: IdResDTO = {
    id: "1",
  };
  sendSuccess(res, 201, idResDTO);
}
