// --- Services ---
import { portfoliosService } from "./portfolios.service.ts";
// --- Repositories ---
import { portfoliosInMemoryRepository } from "./portfolios.in-memory.repository.ts";
// --- Shared ---
import { idUtils } from "../../shared/crypto/id.utils.ts";
// --- Types ---
import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import type { Portfolio } from "./portfolio.type.ts";
import type { Transaction } from "./transaction.type.ts";

export async function createPortfolio(
  createDto: CreatePortfolioDto
): Promise<Portfolio> {
  const deps = {
    portfolioRepository: portfoliosInMemoryRepository,
    idUtils: idUtils,
  };
  return portfoliosService.createPortfolio(createDto, deps);
}

export async function getPortfolioById(id: string): Promise<Portfolio> {
  const deps = {
    portfolioRepository: portfoliosInMemoryRepository,
    idUtils: idUtils,
  };
  return portfoliosService.getPortfolioById(id, deps);
}

export async function getAllPortfolios(): Promise<Portfolio[]> {
  const deps = {
    portfolioRepository: portfoliosInMemoryRepository,
    idUtils: idUtils,
  };
  return portfoliosService.getAllPortfolios(deps);
}

export async function executeTransaction(
  portfolioId: string,
  transactionDto: CreateTransactionDto
): Promise<Transaction> {
  const deps = {
    portfolioRepository: portfoliosInMemoryRepository,
    idUtils: idUtils,
  };
  return portfoliosService.executeTransaction(
    portfolioId,
    transactionDto,
    deps
  );
}

export async function getTransactionsForPortfolio(
  portfolioId: string
): Promise<Transaction[]> {
  const deps = {
    portfolioRepository: portfoliosInMemoryRepository,
    idUtils: idUtils,
  };
  return portfoliosService.getTransactionsForPortfolio(portfolioId, deps);
}
