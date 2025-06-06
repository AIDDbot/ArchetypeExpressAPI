**Implementation Plan for "Portfolios" Resource**
This plan follows the guidelines in `api.rule.md` and specifications in `portfolio.api.yaml`.

Working directory: `c0-express-api/src/app/resources/portfolios/`
All code and data will be written in English.

1. **Initial Resource Setup:**

   Create the following files in `src/app/resources/portfolios/`:

   - `portfolios.controller.ts`
   - `portfolios.application.ts`
   - `portfolios.service.ts`
   - `portfolios.repository.interface.ts`
   - `portfolios.in-memory.repository.ts`
   - `portfolio.type.ts`
   - `asset.type.ts`
   - `transaction.type.ts`
   - `create-portfolio.dto.ts`
   - `create-transaction.dto.ts`

2. **Type Definitions:**

   - **`asset.type.ts`**:

     ```typescript
     export type AssetType = "stock" | "crypto" | "bond";

     export type Asset = {
       asset_type: AssetType;
       symbol: string;
       units: number;
       average_price: number;
       lastUpdated: Date;
     };
     ```

   - **`transaction.type.ts`**:

     ```typescript
     import { AssetType } from "./asset.type";

     export type TransactionType = "buy" | "sell";

     export type Transaction = {
       id: string;
       portfolio_id: string;
       timestamp: Date;
       type: TransactionType;
       asset_type: AssetType;
       symbol: string;
       units: number;
       price_per_unit: number;
     };
     ```

   - **`portfolio.type.ts`**:

     ```typescript
     import { Asset } from "./asset.type";

     export type Portfolio = {
       id: string;
       user_id: string;
       name: string;
       initial_cash: number;
       cash: number;
       lastUpdated: Date;
       assets: Asset[];
     };
     ```

3. **DTOs:**

   - **`create-portfolio.dto.ts`**:

     ```typescript
     export type CreatePortfolioDto = {
       user_id: string;
       name: string;
       initial_cash: number;
     };
     ```

   - **`create-transaction.dto.ts`**:

     ```typescript
     import { AssetType } from "./asset.type";
     import { TransactionType } from "./transaction.type";

     export type CreateTransactionDto = {
       type: TransactionType;
       asset_type: AssetType;
       symbol: string;
       units: number;
       price_per_unit: number;
     };
     ```

4. **Repository Layer:**

   - **`portfolios.repository.interface.ts`**:

     ```typescript
     import type { Portfolio } from "./portfolio.type";
     import type { Transaction } from "./transaction.type";
     import type { CreatePortfolioDto } from "./create-portfolio.dto";
     import type { CreateTransactionDto } from "./create-transaction.dto";

     export interface PortfolioRepository {
       create(id: string, data: CreatePortfolioDto): Promise<Portfolio>;
       findById(id: string): Promise<Portfolio | undefined>;
       findAll(): Promise<Portfolio[]>;
       update(id: string, data: Portfolio): Promise<void>;
       addTransaction(
         id: string,
         portfolioId: string,
         data: CreateTransactionDto
       ): Promise<Transaction>;
       findTransactionsByPortfolioId(
         portfolioId: string
       ): Promise<Transaction[]>;
     }
     ```

   - **`portfolios.in-memory.repository.ts`**:
     - Implement in-memory storage using arrays
     - Implement all interface methods
     - Handle transactions and portfolio updates atomically

5. **Service Layer (`portfolios.service.ts`):**

   ```typescript
   type Dependencies = {
     portfolioRepository: PortfolioRepository;
     idUtils: IdUtils;
   };

   export const portfoliosService = {
     createPortfolio: async (createDto: CreatePortfolioDto, deps: Dependencies): Promise<Portfolio>,
     getPortfolioById: async (id: string, deps: Dependencies): Promise<Portfolio>,
     getAllPortfolios: async (deps: Dependencies): Promise<Portfolio[]>,
     executeTransaction: async (portfolioId: string, transactionDto: CreateTransactionDto, deps: Dependencies): Promise<Transaction>,
     getTransactionsForPortfolio: async (portfolioId: string, deps: Dependencies): Promise<Transaction[]>
   };
   ```

   Key business logic:

   - Validate initial_cash >= 0
   - Handle buy/sell transactions with proper cash and asset updates
   - Calculate average prices for assets
   - Remove assets when units reach zero
   - Update portfolio cash balance

6. **Application Layer (`portfolios.application.ts`):**

   ```typescript
   export async function createPortfolio(
     createDto: CreatePortfolioDto
   ): Promise<Portfolio>;
   export async function getPortfolioById(id: string): Promise<Portfolio>;
   export async function getAllPortfolios(): Promise<Portfolio[]>;
   export async function executeTransaction(
     portfolioId: string,
     transactionDto: CreateTransactionDto
   ): Promise<Transaction>;
   export async function getTransactionsForPortfolio(
     portfolioId: string
   ): Promise<Transaction[]>;
   ```

   Each function:

   - Constructs dependencies object
   - Calls corresponding service method
   - Handles error propagation

7. **Controller Layer (`portfolios.controller.ts`):**

   ```typescript
   export const portfoliosController = Router();

   portfoliosController.post("/", createPortfolioHandler);
   portfoliosController.get("/", getAllPortfoliosHandler);
   portfoliosController.get("/:id", getPortfolioByIdHandler);
   portfoliosController.post("/:id/transactions", createTransactionHandler);
   portfoliosController.get("/:id/transactions", getTransactionsHandler);
   ```

   Each handler:

   - Validates input
   - Calls application layer
   - Uses sendSuccess/sendError for responses
   - Handles errors with proper status codes

8. **Error Handling:**

   Use shared error types:

   - `ValidationError`: For input validation
   - `NotFoundError`: For missing resources
   - `BusinessLogicError`: For business rule violations

9. **Response Format:**

   Success responses:

   ```typescript
   sendSuccess(res, statusCode, data);
   ```

   Error responses:

   ```typescript
   sendError(res, error);
   ```

10. **Import Organization:**

    Follow the standard import order:

    ```typescript
    // --- Express ---
    import type { Request, Response } from "express";
    import { Router } from "express";

    // --- Application ---
    import { createPortfolio } from "./portfolios.application.ts";

    // --- Shared ---
    import { ValidationError } from "../../shared/errors/base.error.ts";
    import {
      sendError,
      sendSuccess,
    } from "../../shared/request/response.utils.ts";

    // --- Types ---
    import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
    ```

This plan reflects the actual implementation patterns and should be used as a reference for maintaining consistency in the codebase.
