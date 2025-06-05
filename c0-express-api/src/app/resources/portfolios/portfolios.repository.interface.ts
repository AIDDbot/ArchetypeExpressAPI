import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import type { Portfolio } from "./portfolio.type.ts";
import type { Transaction } from "./transaction.type.ts";

export interface PortfolioRepository {
  create(id: string, data: CreatePortfolioDto): Promise<Portfolio>;
  findById(id: string): Promise<Portfolio | undefined>;
  findAll(): Promise<Portfolio[]>;
  update(id: string, data: Partial<Portfolio>): Promise<Portfolio | undefined>;
  addTransaction(
    id: string,
    portfolioId: string,
    transactionData: CreateTransactionDto
  ): Promise<Transaction>;
  findTransactionsByPortfolioId(portfolioId: string): Promise<Transaction[]>;
}
