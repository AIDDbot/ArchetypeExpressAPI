import type { User } from "./user.type";

export type UserTokenDTO = {
  user: User;
  token: string;
};
