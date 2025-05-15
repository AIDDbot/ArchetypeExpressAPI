import { Router } from "express";
import type { LoginDto } from "./login-dto.type";
import type { RegisterDto } from "./register-dto.type";
import type { RequestPasswordDto } from "./request-password.type";
import type { UpdatePasswordDto } from "./update-password.type";

export const usersController = Router();

usersController.post("/register", (req, res) => {
  const registerDto = req.body as RegisterDto;
  console.log("registerDto", registerDto);
  res.status(201).json(registerDto);
});
usersController.post("/login", (req, res) => {
  const loginDto = req.body as LoginDto;
  console.log("loginDto", loginDto);
  res.status(201).json(loginDto);
});
usersController.post("/request-password", (req, res) => {
  const requestPasswordDto = req.body as RequestPasswordDto;
  console.log("requestPasswordDto", requestPasswordDto);
  res.status(201).json(requestPasswordDto);
});
usersController.post("/update-password", (req, res) => {
  const updatePasswordDto = req.body as UpdatePasswordDto;
  console.log("updatePasswordDto", updatePasswordDto);
  res.status(201).json(updatePasswordDto);
});
