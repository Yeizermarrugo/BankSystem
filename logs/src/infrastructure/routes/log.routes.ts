import { Router } from "express";
import * as logController from "../../application/log.controller";

const router = Router();

router.get("/", logController.getAll);
//? /v1/logs/:${service}/search
router.get("/:service/search", logController.getByService);

//? /v1/logs/:${action}/search
router.get("/:action/search", logController.getByAction);

//? /v1/logs/:${startDate}/:${endDate}/search
router.get("/:startDate/:endDate/search", logController.getByDateRange);

//? /v1/logs/recent
router.get("/recent", logController.getRecent);

//? /v1/logs/
router.post("/", logController.create);

export { router };
