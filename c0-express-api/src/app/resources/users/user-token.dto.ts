import type { User } from "./user.type";

export type UserTokenDTO = {
  user: Omit<User, "password">;
  token: string;
};
