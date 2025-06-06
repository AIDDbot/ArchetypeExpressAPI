# Guidelines for Creating REST API Endpoints

This document outlines the conventions and patterns to follow when creating new REST API endpoints, based on the existing implementation.

## 1. Overall Architecture

The API follows a layered architecture to promote separation of concerns, testability, and maintainability:

- **Controller Layer**: Handles HTTP requests and responses
- **Application Layer**: Orchestrates operations and manages dependencies
- **Service Layer**: Contains the core business logic
- **Repository Layer**: Abstracts data persistence operations

## 2. Directory Structure

For each new resource (e.g., `products`, `orders`), create a dedicated directory within `src/app/resources/`. The structure should be:

```text
src/app/resources/
└───[resource-name]/
    ├─── [resource-name].controller.ts
    ├─── [resource-name].application.ts
    ├─── [resource-name].service.ts
    ├─── [resource-name].repository.interface.ts
    ├─── [resource-name].in-memory.repository.ts
    ├─── [resource-name].type.ts
    └─── *.dto.ts files
```

## 3. File Naming Conventions

- Use kebab-case for DTO files (e.g., `create-portfolio.dto.ts`)
- Use camelCase for all other files (e.g., `portfolios.controller.ts`)
- Repository implementations: `[resource-name].in-memory.repository.ts`

## 4. Controller Layer (`*.controller.ts`)

```typescript
// --- Express ---
import type { Request, Response } from "express";
import { Router } from "express";
// --- Application ---
import { createResource } from "./[resource-name].application.ts";
// --- Shared ---
import { ValidationError } from "../../shared/errors/base.error.ts";
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
// --- Types ---
import type { CreateResourceDto } from "./create-resource.dto.ts";

export const [resourceName]Controller = Router();

[resourceName]Controller.post("/", createResourceHandler);

async function createResourceHandler(
  req: Request,
  res: Response<Resource | ErrorResDTO>
) {
  const createDto = req.body as CreateResourceDto;
  if (!createDto.requiredField) {
    sendError(
      res,
      new ValidationError("Required field is missing", {
        received: createDto,
      })
    );
    return;
  }
  try {
    const result = await createResource(createDto);
    sendSuccess(res, 201, result);
  } catch (error) {
    sendError(res, error);
  }
}
```

## 5. Application Layer (`*.application.ts`)

```typescript
// --- Services ---
import { [resourceName]Service } from "./[resource-name].service.ts";
// --- Repositories ---
import { [resourceName]InMemoryRepository } from "./[resource-name].in-memory.repository.ts";
// --- Shared ---
import { idUtils } from "../../shared/crypto/id.utils.ts";
// --- Types ---
import type { CreateResourceDto } from "./create-resource.dto.ts";

export async function createResource(
  createDto: CreateResourceDto
): Promise<Resource> {
  const deps = {
    [resourceName]Repository: [resourceName]InMemoryRepository,
    idUtils: idUtils,
  };
  return [resourceName]Service.createResource(createDto, deps);
}
```

## 6. Service Layer (`*.service.ts`)

```typescript
// --- Types ---
import type { [ResourceName]Repository } from "./[resource-name].repository.interface.ts";
import type { IdUtils } from "../../shared/crypto/id.utils.interface.ts";
import type { CreateResourceDto } from "./create-resource.dto.ts";
import type { Resource } from "./resource.type.ts";

type Dependencies = {
  [resourceName]Repository: [ResourceName]Repository;
  idUtils: IdUtils;
};

export const [resourceName]Service = {
  createResource: async (
    createDto: CreateResourceDto,
    deps: Dependencies
  ): Promise<Resource> => {
    // Validation
    if (createDto.someField < 0) {
      throw new ValidationError("Field cannot be negative", {
        field: createDto.someField,
      });
    }

    const id = await deps.idUtils.generate();
    return deps.[resourceName]Repository.create(id, createDto);
  },
};
```

## 7. Repository Layer

### 7.1. Repository Interface (`*.repository.interface.ts`)

```typescript
import type { Resource } from "./resource.type.ts";

export interface [ResourceName]Repository {
  create(id: string, data: CreateResourceDto): Promise<Resource>;
  findById(id: string): Promise<Resource | undefined>;
  findAll(): Promise<Resource[]>;
  update(id: string, data: Resource): Promise<void>;
}
```

### 7.2. In-Memory Repository (`*.in-memory.repository.ts`)

```typescript
import type { Resource } from "./resource.type.ts";
import type { [ResourceName]Repository } from "./[resource-name].repository.interface.ts";
import type { CreateResourceDto } from "./create-resource.dto.ts";

const [resourceName]Store: Resource[] = [];

export const [resourceName]InMemoryRepository: [ResourceName]Repository = {
  create: async (id: string, data: CreateResourceDto): Promise<Resource> => {
    const resource: Resource = {
      id,
      ...data,
      createdAt: new Date(),
    };
    [resourceName]Store.push(resource);
    return resource;
  },
  // ... other methods
};
```

## 8. Types and DTOs

### 8.1. Core Entity Type (`*.type.ts`)

```typescript
export type Resource = {
  id: string;
  name: string;
  createdAt: Date;
};
```

### 8.2. DTOs (`*.dto.ts`)

```typescript
export type CreateResourceDto = {
  name: string;
  // other fields without id and timestamps
};
```

## 9. Error Handling

Use the shared error types from `src/app/shared/errors/base.error.ts`:

```typescript
import {
  ValidationError,
  NotFoundError,
  BusinessLogicError,
} from "../../shared/errors/base.error.ts";

// In service layer
if (!resource) {
  throw new NotFoundError(`Resource not found with id ${id}`, {
    resourceId: id,
  });
}

// In controller layer
try {
  const result = await createResource(createDto);
  sendSuccess(res, 201, result);
} catch (error) {
  sendError(res, error);
}
```

## 10. Response Handling

Use the shared response utilities:

```typescript
import { sendSuccess, sendError } from "../../shared/request/response.utils.ts";

// Success response
sendSuccess(res, 201, data);

// Error response
sendError(res, error);
```

## 11. Import Organization

Organize imports in the following order:

```typescript
// --- Express ---
import type { Request, Response } from "express";
import { Router } from "express";

// --- Application ---
import { createResource } from "./[resource-name].application.ts";

// --- Shared ---
import { ValidationError } from "../../shared/errors/base.error.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";

// --- Types ---
import type { CreateResourceDto } from "./create-resource.dto.ts";
```

## 12. Key Practices

1. **Type Safety**:

   - Use TypeScript's type system extensively
   - Define explicit types for all DTOs and entities
   - Use type imports with `import type`

2. **Error Handling**:

   - Use custom error classes for different error types
   - Include context in error objects
   - Handle errors consistently in controllers

3. **Dependency Management**:

   - Pass dependencies explicitly through the application layer
   - Use dependency injection pattern
   - Keep services pure and testable

4. **Code Organization**:

   - Follow the layered architecture strictly
   - Keep files focused and single-responsibility
   - Use consistent naming conventions

5. **Validation**:

   - Validate input at the controller level
   - Implement business rule validation in the service layer
   - Use custom error types for validation failures

6. **Testing**:

   - Write unit tests for service layer
   - Mock dependencies in tests
   - Test both success and error cases

7. **Documentation**:
   - Document complex business logic
   - Include examples in API documentation
   - Keep documentation up to date with code changes
