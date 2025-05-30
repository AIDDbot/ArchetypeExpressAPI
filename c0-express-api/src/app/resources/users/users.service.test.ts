// unit test for sut: usersService
import assert from "assert";
import { beforeEach, describe, it } from "node:test";
import type { HashUtils } from "../../shared/crypto/hash-utils.interface.ts";
import type { IdGenerate } from "../../shared/crypto/id.interface.ts";
import type { JwtUtils } from "../../shared/crypto/jwt-utils.interface.ts";
import type { LoginDto } from "./login-dto.type.ts";
import type { RegisterDto } from "./register-dto.type.ts";
import type { UsersRepository } from "./users.repository.interface.ts";
import { usersService } from "./users.service.ts";

describe("usersService", () => {
  const hashUtilsMock: HashUtils = {
    hashString: () => "test",
  };
  const hashUtilsInvalidMock: HashUtils = {
    hashString: () => "invalid",
  };
  const idGenerateMock: IdGenerate = {
    generate: () => Promise.resolve("test"),
  };
  const jwtUtilsMock: JwtUtils = {
    sign: () => "test",
    verify: () => ({ id: "test" }),
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
  describe("Given a non existing user", () => {
    beforeEach(() => {
      stubUsersRepository = {
        findByEmail: () => Promise.resolve(undefined),
        insert: () => Promise.resolve(userFake),
        findById: () => Promise.resolve(undefined),
        findAll: () => Promise.resolve([]),
      };
    });
    it("when register, should return a user token", async () => {
      const registerDto: RegisterDto = {
        email: "test@test.com",
        password: "test",
        name: "test",
      };
      const userTokenDTO = await usersService.register(registerDto, {
        usersRepository: stubUsersRepository,
        hashUtils: hashUtilsMock,
        idGenerate: idGenerateMock,
        jwtUtils: jwtUtilsMock,
      });
      assert.ok(userTokenDTO);
    });
    it("when login, should throw an error", async () => {
      const loginDto: LoginDto = {
        email: "test@test.com",
        password: "test",
      };
      assert.rejects(
        async () =>
          await usersService.login(loginDto, {
            usersRepository: stubUsersRepository,
            hashUtils: hashUtilsMock,
            jwtUtils: jwtUtilsMock,
          })
      );
    });
  });
  describe("Given an existing user", () => {
    beforeEach(() => {
      stubUsersRepository = {
        findByEmail: () => Promise.resolve(userFake),
        insert: () => Promise.resolve(userFake),
        findById: () => Promise.resolve(userFake),
        findAll: () => Promise.resolve([]),
      };
    });
    it("when login, should return a user token", async () => {
      const loginDto: LoginDto = {
        email: "test@test.com",
        password: "test",
      };
      const userTokenDTO = await usersService.login(loginDto, {
        usersRepository: stubUsersRepository,
        hashUtils: hashUtilsMock,
        jwtUtils: jwtUtilsMock,
      });
      assert.ok(userTokenDTO);
    });
    it("when register, should throw an error ", async () => {
      const registerDto: RegisterDto = {
        email: "test@test.com",
        password: "test",
        name: "test",
      };
      assert.rejects(
        async () =>
          await usersService.register(registerDto, {
            usersRepository: stubUsersRepository,
            hashUtils: hashUtilsMock,
            jwtUtils: jwtUtilsMock,
            idGenerate: idGenerateMock,
          })
      );
    });
  });
  describe("Given a invalid login", () => {
    it("when login, should throw an error", async () => {
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
            hashUtils: hashUtilsInvalidMock,
            jwtUtils: jwtUtilsMock,
          })
      );
    });
  });
});
