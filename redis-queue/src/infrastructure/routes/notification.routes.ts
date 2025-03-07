import { Router } from "express";
import { sendMessage } from "../../application/notification/notification.controller";

const router = Router();

router.post("/", sendMessage);

export { router };
