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
  - Always use `import type` for TypeScript types and interfaces.
  - Include file extensions (`.ts`) in import statements.
  - Use single quotes for string literals in imports.

## 5. Application Layer (`*.application.ts`)

- **Responsibility**:
  - Act as an intermediary between the Controller and Service layers.
  - Manage and inject dependencies (repositories, utility services) required by the Service Layer methods.
  - Centralize dependency configuration and ensure all required utilities are available to the service layer.
- **Example Structure**:

  ```typescript
  // --- Services ---
  import { [resourceName]Service } from "./[resource-name].service.ts";
  // --- Repositories ---
  import { [resourceName]InMemoryRepository } from "./[resource-name].in-memory.repository.ts";
  // --- Shared ---
  import { idUtils } from "../../shared/crypto/id.utils.ts";
  import { hashUtils } from "../../shared/crypto/hash.utils.ts";
  // --- Types ---
  import type { CreateResourceDto } from "./create-resource.dto.ts";

  export async function createResource(createDto: CreateResourceDto): Promise<Resource> {
    const deps = {
      [resourceName]Repository: [resourceName]InMemoryRepository,
      idUtils: idUtils,
      // other utilities as needed
    };
    return [resourceName]Service.create(createDto, deps);
  }

  export async function getResourceById(id: string): Promise<Resource> {
    const deps = {
      [resourceName]Repository: [resourceName]InMemoryRepository,
      idUtils: idUtils,
    };
    return [resourceName]Service.getById(id, deps);
  }
  ```

- **Key Practices**:
  - Each exported function should prepare and pass all necessary dependencies to the corresponding service method.
  - Always include `idUtils` in dependencies if the service needs to generate IDs.
  - Keep the application layer thin - it should only handle dependency injection and delegation.
  - Consider using a dependency injection container for larger applications.

## 6. Service Layer (`*.service.ts`)

- **Responsibility**:
  - Implement the core business logic for the resource.
  - Handle ID generation using the provided `idUtils` dependency.
  - Interact with the Repository Layer for data persistence.
  - Perform complex validations and business rule checks.
  - Utilize shared utilities (e.g., hashing, ID generation) passed as dependencies.
- **Example Structure**:

  ```typescript
  // --- Types ---
  import type { [ResourceName]Repository } from "./[resource-name].repository.interface.ts";
  import type { IdUtils } from "../../shared/crypto/id.utils.interface.ts";
  import type { CreateResourceDto } from "./create-resource.dto.ts";
  import type { Resource } from "./resource.type.ts";

  type Dependencies = {
    [resourceName]Repository: [ResourceName]Repository;
    idUtils: IdUtils;
    // other utilities as needed
  };

  export const [resourceName]Service = {
    create: async (
      createDto: CreateResourceDto,
      deps: Dependencies
    ): Promise<Resource> => {
      // Generate ID using the provided idUtils
      const id = await deps.idUtils.generate();

      const newResource: Resource = {
        id,
        ...createDto,
        createdAt: new Date(),
      };
      return deps.[resourceName]Repository.insert(newResource);
    },

    getById: async (
      id: string,
      deps: Dependencies
    ): Promise<Resource> => {
      const resource = await deps.[resourceName]Repository.findById(id);
      if (!resource) {
        throw new Error(`Resource with id ${id} not found`);
      }
      return resource;
    },
  };
  ```

- **Key Practices**:
  - Always include `idUtils` in the Dependencies type if the service needs to generate IDs.
  - Generate IDs using `deps.idUtils.generate()` before creating new resources.
  - Methods accept a `deps` object containing all external dependencies (repositories, utilities).
  - Throw errors for business logic failures (e.g., "not found", "already exists", "invalid operation").
  - Return data (entities or DTOs) upon successful operations.
  - Keep methods focused and single-responsibility.
  - Use descriptive error messages that can be safely exposed to clients.

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
  - Consider adding pagination support for list operations.
  - Include methods for bulk operations if needed.

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
  - Consider implementing connection pooling for database repositories.
  - Add transaction support for operations that require atomicity.

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

- **Key Practices**:
  - Use TypeScript's utility types for type transformations.
  - Consider using branded types for domain-specific types (e.g., `type UserId = string & { readonly brand: unique symbol }`).
  - Add validation decorators or type guards for runtime type checking.
  - Document complex type relationships.

## 9. Dependency Management

- Dependencies (repositories, shared utilities like `hashUtils`, `jwtUtils`, `idUtils`) are explicitly passed to service methods via the `deps` object, which is constructed in the Application Layer.
- This makes dependencies clear and facilitates mocking in tests.
- Consider implementing a dependency injection container for larger applications.
- Use interface segregation principle when defining dependencies.

## 10. Error Handling

- **Service Layer**: Throws JavaScript `Error` objects with descriptive messages for business logic violations or when data is not found.
- **Controller Layer**:
  - Catches errors thrown by the Application/Service layers in a `try...catch` block.
  - Uses the shared `sendError(res, statusCode, message)` utility to send standardized JSON error responses.
  - Consider defining a common `ErrorResDTO` (e.g., `{ error: { message: string, code?: string } }`) and use it with `sendError`.
- Refer to `src/app/shared/request/response.utils.ts` and `src/app/shared/request/error.res.dto.ts` for existing implementations.
- **Key Practices**:
  - Create custom error classes for different types of errors.
  - Include error codes for client-side error handling.
  - Log errors with appropriate severity levels.
  - Consider implementing error boundaries for different layers.

## 11. Input Validation

- **Controller Layer**: Perform basic validation, such as checking for the presence of required fields in the request body or path parameters.
- **Service Layer**: Implement more complex business rule validations (e.g., checking if an email is already in use, validating data formats, ensuring consistency).
- **Key Practices**:
  - Use a validation library (e.g., Zod, Joi) for complex validations.
  - Implement custom validators for domain-specific rules.
  - Consider using TypeScript's type system for compile-time validation.
  - Add validation middleware for common checks.

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

- **Key Practices**:
  - Follow the Arrange-Act-Assert pattern.
  - Use meaningful test descriptions.
  - Test both success and failure cases.
  - Consider using test factories for complex objects.
  - Implement integration tests for critical paths.

## 13. Shared Utilities

- Leverage and contribute to shared utility modules located in `src/app/shared/`.
- Examples:
  - `crypto/`: For hashing, JWT operations, ID generation.
  - `request/`: For standardized request/response handling.
- When creating new utilities that could be used by multiple resources, place them in the `shared` directory.
- **Key Practices**:
  - Keep utilities pure and stateless when possible.
  - Document utility functions with JSDoc comments.
  - Add unit tests for utilities.
  - Consider creating a utility index file for easier imports.

## 14. Performance Considerations

- Implement caching strategies where appropriate.
- Use pagination for large data sets.
- Consider implementing rate limiting.
- Optimize database queries.
- Use appropriate indexes.
- Consider implementing request batching for multiple operations.

## 15. Security Best Practices

- Implement proper authentication and authorization.
- Use HTTPS for all endpoints.
- Sanitize and validate all input.
- Implement rate limiting to prevent abuse.
- Use secure headers (e.g., CORS, CSP).
- Consider implementing API key rotation.
- Log security-related events.

## 16. Monitoring and Logging

- Implement structured logging.
- Add performance metrics.
- Monitor error rates.
- Track API usage.
- Consider implementing health check endpoints.
- Use appropriate log levels.

## 17. Documentation

- Document API endpoints using OpenAPI/Swagger.
- Include examples in documentation.
- Document error responses.
- Keep documentation up to date.
- Consider using TypeDoc for code documentation.

By following these guidelines, new API endpoints will maintain consistency with the existing codebase, ensuring they are robust, testable, and easy to understand.
