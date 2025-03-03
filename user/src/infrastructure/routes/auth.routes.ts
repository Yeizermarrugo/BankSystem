import { Router, RequestHandler } from "express";
import { login, signUp } from "../../application/auth/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register", signUp);

export { router };
