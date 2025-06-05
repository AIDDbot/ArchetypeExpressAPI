// --- Types ---
import type { HashUtils } from "../../shared/crypto/hash.utils.interface.ts";
import type { IdUtils } from "../../shared/crypto/id.utils.interface.ts";
import type { JwtUtils } from "../../shared/crypto/jwt.utils.interface.ts";
import {
  AuthenticationError,
  BusinessLogicError,
  NotFoundError,
} from "../../shared/errors/base.error.ts";
import type { LoginDto } from "./login-dto.type.ts";
import type { RegisterDto } from "./register-dto.type.ts";
import type { UserTokenDTO } from "./user-token.dto.ts";
import type { User } from "./user.type.ts";
import type { UsersRepository } from "./users.repository.interface.ts";

export const usersService = {
  register: async (
    registerDto: RegisterDto,
    deps: {
      usersRepository: UsersRepository;
      hashUtils: HashUtils;
      jwtUtils: JwtUtils;
      idUtils: IdUtils;
    }
  ): Promise<UserTokenDTO> => {
    const existingUser = await deps.usersRepository.findByEmail(
      registerDto.email
    );
    if (existingUser) {
      throw new BusinessLogicError(
        `User already exists with email ${registerDto.email}`,
        {
          email: registerDto.email,
          userId: existingUser.id,
        }
      );
    }
    const newUser: User = {
      id: await deps.idUtils.generate(),
      name: registerDto.name,
      email: registerDto.email,
      password: deps.hashUtils.hashString(registerDto.password),
    };
    await deps.usersRepository.insert(newUser);
    const token = deps.jwtUtils.sign({ id: newUser.id });
    const { password, ...user } = newUser;
    return {
      user,
      token,
    };
  },
  login: async (
    loginDto: LoginDto,
    deps: {
      usersRepository: UsersRepository;
      hashUtils: HashUtils;
      jwtUtils: JwtUtils;
    }
  ): Promise<UserTokenDTO> => {
    const existingUser = await deps.usersRepository.findByEmail(loginDto.email);
    if (!existingUser) {
      throw new NotFoundError(`User not found with email ${loginDto.email}`, {
        email: loginDto.email,
      });
    }
    if (
      existingUser.password !== deps.hashUtils.hashString(loginDto.password)
    ) {
      throw new AuthenticationError("Invalid password", {
        email: loginDto.email,
        userId: existingUser.id,
      });
    }
    const token = deps.jwtUtils.sign({ id: existingUser.id });
    const { password, ...user } = existingUser;
    return {
      user,
      token,
    };
  },
  getById: async (
    userId: string,
    deps: {
      usersRepository: UsersRepository;
    }
  ): Promise<Omit<User, "password">> => {
    const existingUser = await deps.usersRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError(`User not found with id ${userId}`, {
        userId,
      });
    }
    const { password, ...user } = existingUser;
    return user;
  },
};
