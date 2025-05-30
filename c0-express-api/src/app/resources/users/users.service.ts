import type { Id } from "../../shared/crypto/id.interface.ts";
import { jwtUtils } from "../../shared/crypto/jwt.utils.ts";
import type { LoginDto } from "./login-dto.type.ts";
import type { RegisterDto } from "./register-dto.type.ts";
import type { UserTokenDTO } from "./user-token.dto.ts";
import type { User } from "./user.type.ts";
import type { UsersRepository } from "./users.repository.interface.ts";

export const usersService = {
  register: async (
    registerDto: RegisterDto,
    usersRepository: UsersRepository,
    id: Id,
    hashString: (str: string) => string
  ): Promise<UserTokenDTO> => {
    const existingUser = await usersRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new Error(`User already exists with email ${registerDto.email}`);
    }
    const user: User = {
      id: await id.generate(),
      name: registerDto.name,
      email: registerDto.email,
      password: hashString(registerDto.password),
    };
    await usersRepository.insert(user);
    const token = jwtUtils.sign({ id: user.id });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },
  login: async (
    loginDto: LoginDto,
    usersRepository: UsersRepository,
    hashString: (str: string) => string
  ): Promise<UserTokenDTO> => {
    const user = await usersRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new Error(`User not found with email ${loginDto.email}`);
    }
    if (user.password !== hashString(loginDto.password)) {
      throw new Error("Invalid password");
    }
    const token = jwtUtils.sign({ id: user.id });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },
  getById: async (
    userId: string,
    usersRepository: UsersRepository
  ): Promise<Pick<User, "id" | "name" | "email">> => {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new Error(`User not found with id ${userId}`);
    }
    // remove password from user
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
