import type { Request, Response } from "express";
import { Router } from "express";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
import type { CreatePortfolioDto } from "./create-portfolio.dto.ts";
import type { CreateTransactionDto } from "./create-transaction.dto.ts";
import * as portfoliosApplication from "./portfolios.application.ts";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const createDto: CreatePortfolioDto = req.body;
    const portfolio = await portfoliosApplication.createPortfolio(createDto);
    sendSuccess(res, 201, portfolio);
  } catch (error) {
    sendError(res, error);
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const portfolios = await portfoliosApplication.getAllPortfolios();
    sendSuccess(res, 200, portfolios);
  } catch (error) {
    sendError(res, error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const portfolio = await portfoliosApplication.getPortfolioById(
      req.params.id
    );
    sendSuccess(res, 200, portfolio);
  } catch (error) {
    sendError(res, error);
  }
});

router.post("/:id/transactions", async (req: Request, res: Response) => {
  try {
    const transactionDto: CreateTransactionDto = req.body;
    const transaction = await portfoliosApplication.executeTransaction(
      req.params.id,
      transactionDto
    );
    sendSuccess(res, 201, transaction);
  } catch (error) {
    sendError(res, error);
  }
});

router.get("/:id/transactions", async (req: Request, res: Response) => {
  try {
    const transactions =
      await portfoliosApplication.getTransactionsForPortfolio(req.params.id);
    sendSuccess(res, 200, transactions);
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
