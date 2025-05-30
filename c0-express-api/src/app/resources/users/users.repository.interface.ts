import type { User } from "./user.type.ts";

export interface UsersRepository {
  findByEmail(email: string): Promise<User | undefined>;
  insert(user: User): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
}
