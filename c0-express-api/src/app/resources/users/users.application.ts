// --- Services ---
import { usersService } from "./users.service.ts";
// --- Repositories ---
import { usersInMemoryRepository } from "./users.in-memory.repository.ts";
// --- Shared ---
import { hashUtils } from "../../shared/crypto/hash.utils.ts";
import { idUtils } from "../../shared/crypto/id.utils.ts";
import { jwtUtils } from "../../shared/crypto/jwt.utils.ts";
// --- Types ---
import type { LoginDto } from "./login-dto.type.ts";
import type { RegisterDto } from "./register-dto.type.ts";
import type { UserTokenDTO } from "./user-token.dto.ts";
import type { User } from "./user.type.ts";

export async function register(
  registerDto: RegisterDto
): Promise<UserTokenDTO> {
  const deps = {
    usersRepository: usersInMemoryRepository,
    hashUtils: hashUtils,
    jwtUtils: jwtUtils,
    idUtils: idUtils,
  };
  const userTokenDTO = await usersService.register(registerDto, deps);
  return userTokenDTO;
}

export async function login(loginDto: LoginDto): Promise<UserTokenDTO> {
  const deps = {
    usersRepository: usersInMemoryRepository,
    hashUtils: hashUtils,
    jwtUtils: jwtUtils,
  };
  const userTokenDTO = await usersService.login(loginDto, deps);
  return userTokenDTO;
}

export async function getById(id: string): Promise<Omit<User, "password">> {
  const deps = {
    usersRepository: usersInMemoryRepository,
  };
  const user = await usersService.getById(id, deps);
  return user;
}
