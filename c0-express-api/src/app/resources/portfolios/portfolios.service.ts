import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import type { Portfolio } from "./portfolio.type.ts";
import type { PortfolioRepository } from "./portfolios.repository.interface.ts";
import type { Transaction } from "./transaction.type.ts";

type Dependencies = {
  portfolioRepository: PortfolioRepository;
};

export class PortfolioService {
  async createPortfolio(
    createDto: CreatePortfolioDto,
    deps: Dependencies
  ): Promise<Portfolio> {
    if (createDto.initial_cash < 0) {
      throw new Error("Initial cash cannot be negative");
    }
    return deps.portfolioRepository.create(createDto);
  }

  async getPortfolioById(id: string, deps: Dependencies): Promise<Portfolio> {
    const portfolio = await deps.portfolioRepository.findById(id);
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }
    return portfolio;
  }

  async getAllPortfolios(deps: Dependencies): Promise<Portfolio[]> {
    return deps.portfolioRepository.findAll();
  }

  async executeTransaction(
    portfolioId: string,
    transactionDto: CreateTransactionDto,
    deps: Dependencies
  ): Promise<Transaction> {
    const portfolio = await this.getPortfolioById(portfolioId, deps);
    const totalCost = transactionDto.units * transactionDto.price_per_unit;

    if (transactionDto.type === "buy") {
      if (portfolio.cash < totalCost) {
        throw new Error("Insufficient funds");
      }
      portfolio.cash -= totalCost;
      this.updateAsset(portfolio, transactionDto);
    } else {
      const asset = portfolio.assets.find(
        (a) =>
          a.asset_type === transactionDto.asset_type &&
          a.symbol === transactionDto.symbol
      );
      if (!asset || asset.units < transactionDto.units) {
        throw new Error("Insufficient assets");
      }
      portfolio.cash += totalCost;
      this.updateAsset(portfolio, transactionDto);
    }

    await deps.portfolioRepository.update(portfolioId, portfolio);
    return deps.portfolioRepository.addTransaction(portfolioId, transactionDto);
  }

  private updateAsset(
    portfolio: Portfolio,
    transaction: CreateTransactionDto
  ): void {
    const assetIndex = portfolio.assets.findIndex(
      (a) =>
        a.asset_type === transaction.asset_type &&
        a.symbol === transaction.symbol
    );

    if (assetIndex === -1) {
      if (transaction.type === "buy") {
        portfolio.assets.push({
          asset_type: transaction.asset_type,
          symbol: transaction.symbol,
          units: transaction.units,
          average_price: transaction.price_per_unit,
          lastUpdated: new Date(),
        });
      }
      return;
    }

    const asset = portfolio.assets[assetIndex];
    if (transaction.type === "buy") {
      const totalUnits = asset.units + transaction.units;
      const totalValue =
        asset.units * asset.average_price +
        transaction.units * transaction.price_per_unit;
      asset.average_price = totalValue / totalUnits;
      asset.units = totalUnits;
    } else {
      asset.units -= transaction.units;
      if (asset.units === 0) {
        portfolio.assets.splice(assetIndex, 1);
      }
    }
    asset.lastUpdated = new Date();
  }

  async getTransactionsForPortfolio(
    portfolioId: string,
    deps: Dependencies
  ): Promise<Transaction[]> {
    await this.getPortfolioById(portfolioId, deps);
    return deps.portfolioRepository.findTransactionsByPortfolioId(portfolioId);
  }
}
