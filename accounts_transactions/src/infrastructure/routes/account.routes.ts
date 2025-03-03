import { Router } from "express";
import * as accountController from "../../application/account/account.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, accountController.create);

router.post("/register");

export { router };
