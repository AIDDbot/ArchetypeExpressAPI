// --- Express ---
import type { Request, Response } from "express";
import { Router } from "express";
// --- Application ---
import {
  createPortfolio,
  executeTransaction,
  getAllPortfolios,
  getPortfolioById,
  getTransactionsForPortfolio,
} from "./portfolios.application.ts";
// --- Shared ---
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
// --- Types ---
import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import type { Portfolio } from "./portfolio.type.ts";
import type { Transaction } from "./transaction.type.ts";

export const portfoliosController = Router();

portfoliosController.post("/", createPortfolioHandler);
portfoliosController.get("/", getAllPortfoliosHandler);
portfoliosController.get("/:id", getPortfolioByIdHandler);
portfoliosController.post("/:id/transactions", createTransactionHandler);
portfoliosController.get("/:id/transactions", getTransactionsHandler);

async function createPortfolioHandler(
  req: Request,
  res: Response<Portfolio | ErrorResDTO>
) {
  const createDto = req.body as CreatePortfolioDto;
  if (!createDto.name) {
    sendError(res, 400, "Invalid request");
    return;
  }
  try {
    const portfolio = await createPortfolio(createDto);
    sendSuccess(res, 201, portfolio);
  } catch (error) {
    sendError(res, 400, "Failed to create portfolio");
  }
}

async function getAllPortfoliosHandler(
  _req: Request,
  res: Response<Portfolio[] | ErrorResDTO>
) {
  try {
    const portfolios = await getAllPortfolios();
    sendSuccess(res, 200, portfolios);
  } catch (error) {
    sendError(res, 500, "Failed to fetch portfolios");
  }
}

async function getPortfolioByIdHandler(
  req: Request,
  res: Response<Portfolio | ErrorResDTO>
) {
  const { id } = req.params;
  if (!id) {
    sendError(res, 400, "Invalid portfolio ID");
    return;
  }
  try {
    const portfolio = await getPortfolioById(id);
    sendSuccess(res, 200, portfolio);
  } catch (error) {
    sendError(res, 404, "Portfolio not found");
  }
}

async function createTransactionHandler(
  req: Request,
  res: Response<Transaction | ErrorResDTO>
) {
  const { id } = req.params;
  const transactionDto = req.body as CreateTransactionDto;
  if (!id || !transactionDto) {
    sendError(res, 400, "Invalid request");
    return;
  }
  try {
    const transaction = await executeTransaction(id, transactionDto);
    sendSuccess(res, 201, transaction);
  } catch (error) {
    sendError(res, 400, "Failed to execute transaction");
  }
}

async function getTransactionsHandler(
  req: Request,
  res: Response<Transaction[] | ErrorResDTO>
) {
  const { id } = req.params;
  if (!id) {
    sendError(res, 400, "Invalid portfolio ID");
    return;
  }
  try {
    const transactions = await getTransactionsForPortfolio(id);
    sendSuccess(res, 200, transactions);
  } catch (error) {
    sendError(res, 404, "Portfolio not found");
  }
}
