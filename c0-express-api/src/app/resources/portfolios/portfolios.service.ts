// --- Types ---
import type { IdUtils } from "../../shared/crypto/id.utils.interface.ts";
import {
  BusinessLogicError,
  NotFoundError,
  ValidationError,
} from "../../shared/errors/base.error.ts";
import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import type { Portfolio } from "./portfolio.type.ts";
import type { PortfolioRepository } from "./portfolios.repository.interface.ts";
import type { Transaction } from "./transaction.type.ts";

type Dependencies = {
  portfolioRepository: PortfolioRepository;
  idUtils: IdUtils;
};

const updateAsset = (
  portfolio: Portfolio,
  transaction: CreateTransactionDto
): Portfolio => {
  const assetIndex = portfolio.assets.findIndex(
    (a) =>
      a.asset_type === transaction.asset_type && a.symbol === transaction.symbol
  );

  // Handle new asset creation for buy transactions
  if (assetIndex === -1) {
    if (transaction.type !== "buy") {
      throw new BusinessLogicError(
        "Selling is not allowed for not existing assets",
        {
          assetType: transaction.asset_type,
          symbol: transaction.symbol,
        }
      );
    }

    return {
      ...portfolio,
      assets: [
        ...portfolio.assets,
        {
          asset_type: transaction.asset_type,
          symbol: transaction.symbol,
          units: transaction.units,
          average_price: transaction.price_per_unit,
          lastUpdated: new Date(),
        },
      ],
    };
  }

  const asset = portfolio.assets[assetIndex];

  // Handle buy transaction for existing asset
  if (transaction.type === "buy") {
    const totalUnits = asset.units + transaction.units;
    const totalValue =
      asset.units * asset.average_price +
      transaction.units * transaction.price_per_unit;

    return {
      ...portfolio,
      assets: [
        ...portfolio.assets.slice(0, assetIndex),
        {
          ...asset,
          average_price: totalValue / totalUnits,
          units: totalUnits,
          lastUpdated: new Date(),
        },
        ...portfolio.assets.slice(assetIndex + 1),
      ],
    };
  }

  // Handle sell transaction
  const updatedAsset = {
    ...asset,
    units: asset.units - transaction.units,
    lastUpdated: new Date(),
  };

  // Remove asset if units become zero
  if (updatedAsset.units === 0) {
    return {
      ...portfolio,
      assets: [
        ...portfolio.assets.slice(0, assetIndex),
        ...portfolio.assets.slice(assetIndex + 1),
      ],
    };
  }

  // Update existing asset with new units
  return {
    ...portfolio,
    assets: [
      ...portfolio.assets.slice(0, assetIndex),
      updatedAsset,
      ...portfolio.assets.slice(assetIndex + 1),
    ],
  };
};

export const portfoliosService = {
  createPortfolio: async (
    createDto: CreatePortfolioDto,
    deps: Dependencies
  ): Promise<Portfolio> => {
    if (createDto.initial_cash < 0) {
      throw new ValidationError("Initial cash cannot be negative", {
        initialCash: createDto.initial_cash,
      });
    }
    const id = await deps.idUtils.generate();
    return deps.portfolioRepository.create(id, createDto);
  },

  getPortfolioById: async (
    id: string,
    deps: Dependencies
  ): Promise<Portfolio> => {
    const portfolio = await deps.portfolioRepository.findById(id);
    if (!portfolio) {
      throw new NotFoundError(`Portfolio not found with id ${id}`, {
        portfolioId: id,
      });
    }
    return portfolio;
  },

  getAllPortfolios: async (deps: Dependencies): Promise<Portfolio[]> => {
    return deps.portfolioRepository.findAll();
  },

  executeTransaction: async (
    portfolioId: string,
    transactionDto: CreateTransactionDto,
    deps: Dependencies
  ): Promise<Transaction> => {
    const portfolio = await deps.portfolioRepository.findById(portfolioId);
    if (!portfolio) {
      throw new NotFoundError(`Portfolio not found with id ${portfolioId}`, {
        portfolioId,
      });
    }

    const totalCost = transactionDto.units * transactionDto.price_per_unit;

    // Handle buy transaction
    if (transactionDto.type === "buy") {
      if (portfolio.cash < totalCost) {
        throw new BusinessLogicError("Insufficient funds for purchase", {
          required: totalCost,
          available: portfolio.cash,
          transaction: transactionDto,
        });
      }

      const updatedPortfolio = updateAsset(
        {
          ...portfolio,
          cash: portfolio.cash - totalCost,
        },
        transactionDto
      );
      await deps.portfolioRepository.update(portfolioId, updatedPortfolio);

      const id = await deps.idUtils.generate();
      return deps.portfolioRepository.addTransaction(
        id,
        portfolioId,
        transactionDto
      );
    }

    // Handle sell transaction
    const asset = portfolio.assets.find(
      (a) =>
        a.asset_type === transactionDto.asset_type &&
        a.symbol === transactionDto.symbol
    );

    if (!asset || asset.units < transactionDto.units) {
      throw new BusinessLogicError("Insufficient assets for sale", {
        assetType: transactionDto.asset_type,
        symbol: transactionDto.symbol,
        requested: transactionDto.units,
        available: asset?.units || 0,
      });
    }

    const updatedPortfolio = updateAsset(
      {
        ...portfolio,
        cash: portfolio.cash + totalCost,
      },
      transactionDto
    );
    await deps.portfolioRepository.update(portfolioId, updatedPortfolio);

    const id = await deps.idUtils.generate();
    return deps.portfolioRepository.addTransaction(
      id,
      portfolioId,
      transactionDto
    );
  },

  getTransactionsForPortfolio: async (
    portfolioId: string,
    deps: Dependencies
  ): Promise<Transaction[]> => {
    const portfolio = await deps.portfolioRepository.findById(portfolioId);
    if (!portfolio) {
      throw new NotFoundError(`Portfolio not found with id ${portfolioId}`, {
        portfolioId,
      });
    }
    return deps.portfolioRepository.findTransactionsByPortfolioId(portfolioId);
  },

  deleteAllPortfolios: async (deps: Dependencies): Promise<void> => {
    await deps.portfolioRepository.deleteAll();
  },
};
