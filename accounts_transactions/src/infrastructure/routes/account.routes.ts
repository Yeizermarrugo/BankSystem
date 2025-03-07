import { Router } from "express";
import * as accountController from "../../application/account/account.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, accountController.create);
router.get("/", verifyToken, accountController.getAll);
router.get("/:id", verifyToken, accountController.getById);
router.patch("/:id", verifyToken, accountController.edit);

router.delete("/:id", verifyToken, accountController.remove);

export { router };
