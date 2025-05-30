import type { User } from "./user.type";

export type UserTokenDTO = {
  user: Pick<User, "id" | "name" | "email">;
  token: string;
};
