# Guidelines for Creating REST API Endpoints

This document outlines the conventions and patterns to follow when creating new REST API endpoints, based on the existing `users` resource implementation.

## 1. Overall Architecture

The API follows a layered architecture to promote separation of concerns, testability, and maintainability:

- **Controller Layer**: Handles HTTP requests and responses.
- **Application Layer**: Orchestrates operations and manages dependencies for the Service Layer.
- **Service Layer**: Contains the core business logic.
- **Repository Layer**: Abstracts data persistence operations.

## 2. Directory Structure

For each new resource (e.g., `products`, `orders`), create a dedicated directory within `src/app/resources/`. The internal structure should mirror the `users` resource:

```text
src/app/resources/
└───[resource-name]/
├─── [resource-name].controller.ts
├─── [resource-name].application.ts
├─── [resource-name].service.ts
├─── [resource-name].service.test.ts
├─── [resource-name].repository.interface.ts
├─── [resource-name].in-memory.repository.ts // For testing/initial development
├─── [resource-name].[actual-db].repository.ts // e.g., products.postgres.repository.ts
├─── [resource-name].type.ts // Core entity type
├─── .dto.ts // Data Transfer Objects for requests/responses
└─── .type.ts // Other specific types for the resource
```

## 3. File Naming Conventions

- **Controller**: `[resource-name].controller.ts` (e.g., `products.controller.ts`)
- **Application**: `[resource-name].application.ts` (e.g., `products.application.ts`)
- **Service**: `[resource-name].service.ts` (e.g., `products.service.ts`)
- **Service Tests**: `[resource-name].service.test.ts` (e.g., `products.service.test.ts`)
- **Repository Interface**: `[resource-name].repository.interface.ts` (e.g., `products.repository.interface.ts`)
- **Repository Implementation**: `[resource-name].[type].repository.ts` (e.g., `products.in-memory.repository.ts`, `products.mongodb.repository.ts`)
- **Core Entity Type**: `[resource-name].type.ts` (e.g., `product.type.ts`)
- **Data Transfer Objects (DTOs)**: Descriptive names ending with `.dto.ts` or `.type.ts` if it's a simple type alias for a DTO structure (e.g., `create-product.dto.ts`, `product-response.dto.ts`, `login-dto.type.ts`).

## 4. Controller Layer (`*.controller.ts`)

- **Responsibility**:
  - Define API routes using Express Router (`Router()`).
  - Handle incoming HTTP requests (`req: Request`).
  - Perform basic request validation (e.g., presence of required fields in `req.body`).
  - Delegate business logic processing to the corresponding function in the Application Layer.
  - Send HTTP responses (`res: Response`) using shared utility functions.
- **Example Structure**:

  ```typescript
  // --- Express ---
  import type { Request, Response } from "express";
  import { Router } from "express";
  // --- Application ---
  import { createResource, getResourceById } from "./[resource-name].application.ts"; // Adjust imports
  // --- Shared ---
  import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
  // --- Types ---
  import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
  // Import DTOs for this resource

  export const [resourceName]Controller = Router();

  [resourceName]Controller.post("/", createResourceHandler);
  [resourceName]Controller.get("/:id", getResourceByIdHandler);

  async function createResourceHandler(req: Request, res: Response</* ExpectedSuccessDTO | ErrorResDTO*/>) {
    const createDto = req.body as /* CreateResourceDto */;
    // Basic validation
    if (!createDto.someField) {
      sendError(res, 400, "Invalid request: missing someField");
      return;
    }
    try {
      const result = await createResource(createDto);
      sendSuccess(res, 201, result);
    } catch (error: any) {
      // More specific error handling based on error type if needed
      sendError(res, 400, error.message || "Failed to create resource");
    }
  }

  // ... other handlers
  ```

- **Key Practices**:
  - Use `async/await` for handler functions.
  - Clearly type request and response objects, including DTOs.
  - Utilize `sendSuccess(res, statusCode, data)` and `sendError(res, statusCode, message)` for consistent responses.

## 5. Application Layer (`*.application.ts`)

- **Responsibility**:
  - Act as an intermediary between the Controller and Service layers.
  - Manage and inject dependencies (repositories, utility services) required by the Service Layer methods. This approach centralizes dependency configuration.
- **Example Structure**:

  ```typescript
  // --- Services ---
  import { [resourceName]Service } from "./[resource-name].service.ts";
  // --- Repositories ---
  import { [resourceName]InMemoryRepository } from "./[resource-name].in-memory.repository.ts"; // Or actual DB repository
  // --- Shared Utilities (if needed by service) ---
  import { hashUtils } from "../../shared/crypto/hash.utils.ts";
  // --- Types ---
  // Import DTOs and Types

  export async function createResource(createDto: /* CreateResourceDto */): Promise</* ResourceResponseDto */> {
    const deps = {
      [resourceName]Repository: [resourceName]InMemoryRepository, // Swap with actual repository
      // other utilities like hashUtils, idUtils, etc.
    };
    return await [resourceName]Service.create(createDto, deps);
  }

  export async function getResourceById(id: string): Promise</* ResourceResponseDto | undefined */> {
    const deps = {
      [resourceName]Repository: [resourceName]InMemoryRepository,
    };
    return await [resourceName]Service.getById(id, deps);
  }
  // ... other application functions mirroring service methods
  ```

- **Key Practices**:
  - Each exported function should prepare and pass all necessary dependencies to the corresponding service method.

## 6. Service Layer (`*.service.ts`)

- **Responsibility**:
  - Implement the core business logic for the resource.
  - Interact with the Repository Layer for data persistence.
  - Perform complex validations and business rule checks.
  - Utilize shared utilities (e.g., hashing, ID generation) passed as dependencies.
- **Example Structure**:

  ```typescript
  // --- Import types for dependencies and DTOs/entity ---
  import type { [ResourceName]Repository } from "./[resource-name].repository.interface.ts";
  import type { /* CreateResourceDto */ } from "./create-[resource-name].dto.ts";
  import type { /* Resource */ } from "./[resource-name].type.ts";
  // import type { IdUtils, HashUtils etc. } from relevant shared paths

  export const [resourceName]Service = {
    create: async (
      createDto: /* CreateResourceDto */,
      deps: {
        [resourceName]Repository: [ResourceName]Repository;
        // idUtils: IdUtils;
        // hashUtils: HashUtils;
      }
    ): Promise</* Resource */> => {
      // Example: Check for duplicates
      // const existing = await deps.[resourceName]Repository.findByName(createDto.name);
      // if (existing) {
      //   throw new Error(`Resource with name ${createDto.name} already exists.`);
      // }

      const newResource: /* Resource */ = {
        // id: await deps.idUtils.generate(),
        ...createDto,
        // createdAt: new Date(),
      };
      return await deps.[resourceName]Repository.insert(newResource);
    },

    getById: async (
      id: string,
      deps: {
        [resourceName]Repository: [ResourceName]Repository;
      }
    ): Promise</* Resource | undefined */> => {
      const resource = await deps.[resourceName]Repository.findById(id);
      if (!resource) {
        // Or return undefined and let controller handle 404
        throw new Error(`Resource with id ${id} not found.`);
      }
      return resource;
    },
    // ... other service methods (update, delete, list, etc.)
  };
  ```

- **Key Practices**:
  - Methods accept a `deps` object containing all external dependencies (repositories, utilities).
  - Throw errors for business logic failures (e.g., "not found", "already exists", "invalid operation"). These errors will be caught by the Controller.
  - Return data (entities or DTOs) upon successful operations.

## 7. Repository Layer

### 7.1. Repository Interface (`*.repository.interface.ts`)

- **Responsibility**: Define the contract for data access operations for the resource.
- **Example Structure**:

  ```typescript
  import type { /* Resource */ } from "./[resource-name].type.ts";

  export interface [ResourceName]Repository {
    findById(id: string): Promise</* Resource | undefined */>;
    // findByName(name: string): Promise</* Resource | undefined */>; // Example
    findAll(): Promise</* Resource[] */>;
    insert(resource: /* Resource */): Promise</* Resource */>;
    update(id: string, data: Partial</* Resource */>): Promise</* Resource | undefined */>;
    delete(id: string): Promise<boolean>; // Returns true if deleted, false otherwise
  }
  ```

- **Key Practices**:
  - All methods should return `Promise`s.
  - Define methods relevant to the resource's data access needs.

### 7.2. Repository Implementation (`*.in-memory.repository.ts`, `*.[db-type].repository.ts`)

- **Responsibility**: Provide concrete implementations of the repository interface for different data stores.
- **Example (In-Memory)**:

  ```typescript
  import type { /* Resource */ } from "./[resource-name].type.ts";
  import type { [ResourceName]Repository } from "./[resource-name].repository.interface.ts";

  const [resourceName]Store: /* Resource[] */ = [];

  export const [resourceName]InMemoryRepository: [ResourceName]Repository = {
    findById: async (id: string) => {
      return [resourceName]Store.find(item => item.id === id);
    },
    insert: async (resource: /* Resource */) => {
      [resourceName]Store.push(resource);
      return resource;
    },
    // ... other implemented methods
  };
  ```

- **Key Practices**:
  - Implement all methods defined in the interface.
  - The in-memory repository is useful for testing and rapid prototyping.
  - For actual database interactions, create a separate file (e.g., `[resource-name].postgres.repository.ts`).

## 8. Data Transfer Objects (DTOs) and Types

- **Entity Type (`[resource-name].type.ts`)**: Defines the core structure of the resource.
  ```typescript
  export type Resource = {
    id: string;
    name: string;
    // ... other fields
    createdAt: Date;
    updatedAt: Date;
  };
  ```
- **DTOs (`*.dto.ts` or `*.type.ts` for simple type aliases)**:

  - Define specific types for request payloads (e.g., `CreateResourceDto`, `UpdateResourceDto`) and response payloads (e.g., `ResourceResponseDto`).
  - This helps in maintaining clear contracts for API interactions.
  - Use TypeScript's utility types like `Omit<Type, Keys>` or `Pick<Type, Keys>` to create variations of types (e.g., omitting sensitive fields like passwords from responses).

  ```typescript
  // Example: create-[resource-name].dto.ts
  export type CreateResourceDto = Omit<
    Resource,
    "id" | "createdAt" | "updatedAt"
  >;

  // Example: [resource-name]-response.dto.ts
  export type ResourceResponseDto = Pick<Resource, "id" | "name" | "createdAt">;
  ```

## 9. Dependency Management

- Dependencies (repositories, shared utilities like `hashUtils`, `jwtUtils`, `idUtils`) are explicitly passed to service methods via the `deps` object, which is constructed in the Application Layer.
- This makes dependencies clear and facilitates mocking in tests.

## 10. Error Handling

- **Service Layer**: Throws JavaScript `Error` objects with descriptive messages for business logic violations or when data is not found.
- **Controller Layer**:
  - Catches errors thrown by the Application/Service layers in a `try...catch` block.
  - Uses the shared `sendError(res, statusCode, message)` utility to send standardized JSON error responses.
  - Consider defining a common `ErrorResDTO` (e.g., `{ error: { message: string, code?: string } }`) and use it with `sendError`.
- Refer to `src/app/shared/request/response.utils.ts` and `src/app/shared/request/error.res.dto.ts` for existing implementations.

## 11. Input Validation

- **Controller Layer**: Perform basic validation, such as checking for the presence of required fields in the request body or path parameters.
- **Service Layer**: Implement more complex business rule validations (e.g., checking if an email is already in use, validating data formats, ensuring consistency).

## 12. Testing (`*.service.test.ts`)

- **Focus**: Unit test the Service Layer.
- **Strategy**:
  - Mock all dependencies (repositories, utilities) passed to the service methods.
  - Use a test runner (e.g., `node:test` as seen in `users.service.test.ts`).
  - Use an assertion library (e.g., `assert`).
  - Create test suites (`describe`) and individual test cases (`it`) for each service method.
  - Cover various scenarios: successful operations, error conditions (e.g., item not found, invalid input leading to thrown error), edge cases.
- **Example Snippet (from `users.service.test.ts` illustrating mocking)**:

  ```typescript
  // In your test file
  const mockResourceRepository: [ResourceName]Repository = {
    findById: async (id: string) => { /* return mock data or undefined */ },
    // mock other methods...
  };

  const mockIdUtils: IdUtils = {
    generate: async () => "mock-id",
  };

  // In a test case
  it("should create a resource", async () => {
    const result = await [resourceName]Service.create(
      { /* createDto data */ },
      {
        [resourceName]Repository: mockResourceRepository,
        idUtils: mockIdUtils,
      }
    );
    assert.ok(result);
    assert.strictEqual(result.id, "mock-id");
  });
  ```

## 13. Shared Utilities

- Leverage and contribute to shared utility modules located in `src/app/shared/`.
- Examples:
  - `crypto/`: For hashing, JWT operations, ID generation.
  - `request/`: For standardized request/response handling.
- When creating new utilities that could be used by multiple resources, place them in the `shared` directory.

By following these guidelines, new API endpoints will maintain consistency with the existing codebase, ensuring they are robust, testable, and easy to understand.
