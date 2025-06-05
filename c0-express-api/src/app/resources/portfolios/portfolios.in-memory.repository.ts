import { generateId } from "../../shared/utils/id.utils.ts";
import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import type { Portfolio } from "./portfolio.type.ts";
import type { PortfolioRepository } from "./portfolios.repository.interface.ts";
import type { Transaction } from "./transaction.type.ts";

export class PortfolioInMemoryRepository implements PortfolioRepository {
  private portfolios: Portfolio[] = [];
  private transactions: Transaction[] = [];

  async create(data: CreatePortfolioDto): Promise<Portfolio> {
    const portfolio: Portfolio = {
      id: generateId(),
      ...data,
      cash: data.initial_cash,
      assets: [],
      lastUpdated: new Date(),
    };
    this.portfolios.push(portfolio);
    return portfolio;
  }

  async findById(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.find((p) => p.id === id);
  }

  async findAll(): Promise<Portfolio[]> {
    return [...this.portfolios];
  }

  async update(
    id: string,
    data: Partial<Portfolio>
  ): Promise<Portfolio | undefined> {
    const index = this.portfolios.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.portfolios[index] = {
      ...this.portfolios[index],
      ...data,
      lastUpdated: new Date(),
    };
    return this.portfolios[index];
  }

  async addTransaction(
    portfolioId: string,
    transactionData: CreateTransactionDto
  ): Promise<Transaction> {
    const transaction: Transaction = {
      id: generateId(),
      portfolio_id: portfolioId,
      timestamp: new Date(),
      ...transactionData,
    };
    this.transactions.push(transaction);
    return transaction;
  }

  async findTransactionsByPortfolioId(
    portfolioId: string
  ): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.portfolio_id === portfolioId);
  }
}
