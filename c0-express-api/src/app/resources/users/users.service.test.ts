// unit test for sut: usersService
import assert from "assert";
import { describe, it } from "node:test";
import type { LoginDto } from "./login-dto.type.ts";
import type { RegisterDto } from "./register-dto.type.ts";
import type { UsersRepository } from "./users.repository.interface.ts";
import { usersService } from "./users.service.ts";

describe("usersService", () => {
  const hashStringMock = () => "test";
  const hashStringInvalidMock = () => "invalid";
  const idUtilsMock = {
    generate: () => Promise.resolve("test"),
  };
  const jwtUtilsMock = {
    sign: () => "test",
    verify: () => ({ id: "test" }),
  };
  const invalidJwtUtilsMock = {
    sign: () => "test",
    verify: () => undefined,
  };
  let stubUsersRepository: UsersRepository;
  it("should be defined", () => {
    assert.ok(usersService);
  });
  const userFake = {
    id: "test",
    email: "test@test.com",
    password: "test",
    name: "test",
  };
  describe("When a valid non existing user is registered", () => {
    it("should register a user", async () => {
      const registerDto: RegisterDto = {
        email: "test@test.com",
        password: "test",
        name: "test",
      };
      stubUsersRepository = {
        findByEmail: () => Promise.resolve(undefined),
        insert: () => Promise.resolve(userFake),
        findById: () => Promise.resolve(undefined),
        findAll: () => Promise.resolve([]),
      };

      const userTokenDTO = await usersService.register(registerDto, {
        usersRepository: stubUsersRepository,
        hashString: hashStringMock,
        id: idUtilsMock,
        jwtUtils: jwtUtilsMock,
      });
      assert.ok(userTokenDTO);
    });
  });
  describe("When a valid existing user is registered", () => {
    it("should login a user", async () => {
      const loginDto: LoginDto = {
        email: "test@test.com",
        password: "test",
      };
      stubUsersRepository = {
        findByEmail: (email: string) => Promise.resolve(userFake),
        insert: () => Promise.resolve(userFake),
        findById: () => Promise.resolve(undefined),
        findAll: () => Promise.resolve([]),
      };
      const userTokenDTO = await usersService.login(loginDto, {
        usersRepository: stubUsersRepository,
        hashString: hashStringMock,
        jwtUtils: jwtUtilsMock,
      });
      assert.ok(userTokenDTO);
    });
  });
  describe("When an invalid existing user is login", () => {
    it("throw an error", async () => {
      const loginDto: LoginDto = {
        email: "test@test.com",
        password: "invalid",
      };
      stubUsersRepository = {
        findByEmail: () => Promise.resolve(userFake),
        insert: () => Promise.resolve(userFake),
        findById: () => Promise.resolve(undefined),
        findAll: () => Promise.resolve([]),
      };
      assert.rejects(
        async () =>
          await usersService.login(loginDto, {
            usersRepository: stubUsersRepository,
            hashString: hashStringInvalidMock,
            jwtUtils: jwtUtilsMock,
          })
      );
    });
  });
});
