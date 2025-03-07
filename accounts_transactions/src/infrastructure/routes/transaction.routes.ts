import { Router } from "express";
import * as transactionController from "../../application/transaction/transaction.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", verifyToken, transactionController.getByAccount);
router.post("/:id", verifyToken, transactionController.createTransaction);

export { router };
