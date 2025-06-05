import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import type { Portfolio } from "./portfolio.type.ts";
import { PortfolioInMemoryRepository } from "./portfolios.in-memory.repository.ts";
import { PortfolioService } from "./portfolios.service.ts";
import type { Transaction } from "./transaction.type.ts";

const portfolioRepository = new PortfolioInMemoryRepository();
const portfolioService = new PortfolioService();

export async function createPortfolio(
  createDto: CreatePortfolioDto
): Promise<Portfolio> {
  return portfolioService.createPortfolio(createDto, { portfolioRepository });
}

export async function getPortfolioById(id: string): Promise<Portfolio> {
  return portfolioService.getPortfolioById(id, { portfolioRepository });
}

export async function getAllPortfolios(): Promise<Portfolio[]> {
  return portfolioService.getAllPortfolios({ portfolioRepository });
}

export async function executeTransaction(
  portfolioId: string,
  transactionDto: CreateTransactionDto
): Promise<Transaction> {
  return portfolioService.executeTransaction(portfolioId, transactionDto, {
    portfolioRepository,
  });
}

export async function getTransactionsForPortfolio(
  portfolioId: string
): Promise<Transaction[]> {
  return portfolioService.getTransactionsForPortfolio(portfolioId, {
    portfolioRepository,
  });
}
