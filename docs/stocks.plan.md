**Implementation Plan for "Stocks" Resource**
This plan follows the guidelines in `api.rule.md` and specifications in `portfolio.api.yaml`.

Working directory: `c0-express-api/src/app/resources/stocks/`
All code and data will be written in English.

1. **Initial Resource Setup:**

   Create the following files in `src/app/resources/stocks/`:

   - `stocks.controller.ts`
   - `stocks.application.ts`
   - `stocks.service.ts`
   - `stocks.repository.interface.ts`
   - `stocks.in-memory.repository.ts`
   - `stock.type.ts`
   - `stock-price.type.ts`
   - `stock-search.dto.ts`

2. **Type Definitions:**

   - **`stock.type.ts`**:

     ```typescript
     export type StockIndustry =
       | "Technology"
       | "Automotive"
       | "Retail"
       | "Telecom"
       | "Entertainment"
       | "Food"
       | "Biotechnology";

     export type Stock = {
       id: string;
       name: string;
       industry: StockIndustry;
       symbol: string;
     };
     ```

   - **`stock-price.type.ts`**:

     ```typescript
     export type StockPrice = {
       symbol: string;
       price: number;
       date: number;
     };
     ```

   - **`stock-search.dto.ts`**:

     ```typescript
     export type StockSearchDto = {
       name?: string;
       industry?: StockIndustry;
       symbol?: string;
     };
     ```

3. **Repository Layer:**

   - **`stocks.repository.interface.ts`**:

     ```typescript
     import type { Stock } from "./stock.type";
     import type { StockPrice } from "./stock-price.type";
     import type { StockSearchDto } from "./stock-search.dto";

     export interface StockRepository {
       findAll(): Promise<Stock[]>;
       findBySymbol(symbol: string): Promise<Stock | undefined>;
       search(criteria: StockSearchDto): Promise<Stock[]>;
       getCurrentPrice(symbol: string): Promise<StockPrice>;
     }
     ```

   - **`stocks.in-memory.repository.ts`**:
     - Load initial data from `stocks.json`
     - Implement in-memory storage using arrays
     - Implement all interface methods
     - Generate random prices between 11 and 999 for current prices

4. **Service Layer (`stocks.service.ts`):**

   ```typescript
   type Dependencies = {
     stockRepository: StockRepository;
   };

   export const stocksService = {
     getAllStocks: async (deps: Dependencies): Promise<Stock[]>,
     getStockBySymbol: async (symbol: string, deps: Dependencies): Promise<Stock>,
     searchStocks: async (criteria: StockSearchDto, deps: Dependencies): Promise<Stock[]>,
     getCurrentPrice: async (symbol: string, deps: Dependencies): Promise<StockPrice>
   };
   ```

   Key business logic:

   - Validate symbol format
   - Handle case-insensitive search
   - Implement partial matching for name and symbol

5. **Application Layer (`stocks.application.ts`):**

   ```typescript
   export async function getAllStocks(): Promise<Stock[]>;
   export async function getStockBySymbol(symbol: string): Promise<Stock>;
   export async function searchStocks(
     criteria: StockSearchDto
   ): Promise<Stock[]>;
   export async function getCurrentPrice(symbol: string): Promise<StockPrice>;
   ```

   Each function:

   - Constructs dependencies object
   - Calls corresponding service method
   - Handles error propagation

6. **Controller Layer (`stocks.controller.ts`):**

   ```typescript
   export const stocksController = Router();

   stocksController.get("/", getAllStocksHandler);
   stocksController.get("/search", searchStocksHandler);
   stocksController.get("/:symbol", getStockBySymbolHandler);
   stocksController.get("/:symbol/price", getCurrentPriceHandler);
   ```

   Each handler:

   - Validates input
   - Calls application layer
   - Uses sendSuccess/sendError for responses
   - Handles errors with proper status codes

7. **Error Handling:**

   Use shared error types:

   - `ValidationError`: For invalid search criteria
   - `NotFoundError`: For non-existent stocks
   - `InvalidSymbolError`: For malformed stock symbols

8. **Response Format:**

   Success responses:

   ```typescript
   sendSuccess(res, statusCode, data);
   ```

   Error responses:

   ```typescript
   sendError(res, error);
   ```

9. **Import Organization:**

   Follow the standard import order:

   ```typescript
   // --- Express ---
   import type { Request, Response } from "express";
   import { Router } from "express";

   // --- Application ---
   import { getAllStocks } from "./stocks.application.ts";

   // --- Shared ---
   import { ValidationError } from "../../shared/errors/base.error.ts";
   import {
     sendError,
     sendSuccess,
   } from "../../shared/request/response.utils.ts";

   // --- Types ---
   import type { StockSearchDto } from "./stock-search.dto.ts";
   ```

10. **API Endpoints:**

    - `GET /stocks` - Get all stocks
    - `GET /stocks/search?name=Apple&industry=Technology&symbol=AAPL` - Search stocks
    - `GET /stocks/:symbol` - Get stock by symbol
    - `GET /stocks/:symbol/price` - Get current price for a stock

This plan reflects the actual implementation patterns and should be used as a reference for maintaining consistency in the codebase.
