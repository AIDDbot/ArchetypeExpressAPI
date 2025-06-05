// --- Types ---
import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import type { Portfolio } from "./portfolio.type.ts";
import type { PortfolioRepository } from "./portfolios.repository.interface.ts";
import type { Transaction } from "./transaction.type.ts";

const portfolios: Portfolio[] = [];
const transactions: Transaction[] = [];

export const portfoliosInMemoryRepository: PortfolioRepository = {
  create: async (id: string, data: CreatePortfolioDto): Promise<Portfolio> => {
    const portfolio: Portfolio = {
      id,
      ...data,
      cash: data.initial_cash,
      assets: [],
      lastUpdated: new Date(),
    };
    portfolios.push(portfolio);
    return portfolio;
  },

  findById: async (id: string): Promise<Portfolio | undefined> => {
    return portfolios.find((p) => p.id === id);
  },

  findAll: async (): Promise<Portfolio[]> => {
    return [...portfolios];
  },

  update: async (
    id: string,
    data: Partial<Portfolio>
  ): Promise<Portfolio | undefined> => {
    const index = portfolios.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    portfolios[index] = {
      ...portfolios[index],
      ...data,
      lastUpdated: new Date(),
    };
    return portfolios[index];
  },

  addTransaction: async (
    id: string,
    portfolioId: string,
    transactionData: CreateTransactionDto
  ): Promise<Transaction> => {
    const transaction: Transaction = {
      id,
      portfolio_id: portfolioId,
      timestamp: new Date(),
      ...transactionData,
    };
    transactions.push(transaction);
    return transaction;
  },

  findTransactionsByPortfolioId: async (
    portfolioId: string
  ): Promise<Transaction[]> => {
    return transactions.filter((t) => t.portfolio_id === portfolioId);
  },
};
