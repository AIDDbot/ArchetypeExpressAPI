import type { User } from "./user.type.ts";
import type { UsersRepository } from "./users.repository.interface.ts";

const users: User[] = [];

export const usersInMemoryRepository: UsersRepository = {
  findByEmail: async (email: string) => {
    return users.find((user) => user.email === email);
  },
  insert: async (user: User) => {
    users.push(user);
    return user;
  },
  findById: async (id: string) => {
    return users.find((user) => user.id === id);
  },
  findAll: async () => {
    return [...users];
  },
};
