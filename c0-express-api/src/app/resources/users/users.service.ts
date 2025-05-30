import { jwtUtils } from "../../shared/crypto/jwt.utils.ts";
import type { LoginDto } from "./login-dto.type.ts";
import type { RegisterDto } from "./register-dto.type.ts";
import type { UserTokenDTO } from "./user-token.dto.ts";

export const usersService = {
  register: async (registerDto: RegisterDto): Promise<UserTokenDTO> => {
    // ToDo: Save user with a repository
    const user = {
      id: "1",
      name: registerDto.name,
      email: registerDto.email,
    };
    const token = jwtUtils.sign({ id: user.id });
    return {
      user,
      token,
    };
  },
  login: async (loginDto: LoginDto): Promise<UserTokenDTO> => {
    // ToDo: Check user with a repository
    const user = {
      id: "1",
      name: "John Doe",
      email: loginDto.email,
    };
    const token = jwtUtils.sign({ id: user.id });
    return {
      user,
      token,
    };
  },
};
