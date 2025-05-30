import type { HashUtils } from "../../shared/crypto/hash-utils.interface.ts";
import type { IdGenerate } from "../../shared/crypto/id.interface.ts";
import type { JwtUtils } from "../../shared/crypto/jwt-utils.interface.ts";
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
      idGenerate: IdGenerate;
    }
  ): Promise<UserTokenDTO> => {
    const existingUser = await deps.usersRepository.findByEmail(
      registerDto.email
    );
    if (existingUser) {
      throw new Error(`User already exists with email ${registerDto.email}`);
    }
    const newUser: User = {
      id: await deps.idGenerate.generate(),
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
    const validUser = await deps.usersRepository.findByEmail(loginDto.email);
    if (!validUser) {
      throw new Error(`User not found with email ${loginDto.email}`);
    }
    if (validUser.password !== deps.hashUtils.hashString(loginDto.password)) {
      throw new Error("Invalid password");
    }
    const token = deps.jwtUtils.sign({ id: validUser.id });
    const { password, ...user } = validUser;
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
    const validUser = await deps.usersRepository.findById(userId);
    if (!validUser) {
      throw new Error(`User not found with id ${userId}`);
    }
    const { password, ...user } = validUser;
    return user;
  },
};
