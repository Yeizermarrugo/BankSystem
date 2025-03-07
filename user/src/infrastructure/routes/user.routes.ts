import { Router } from "express";

import { deactivateMyUser, editMyuser, getById, getMyUserById } from "../../application/user/user.controller";
import passportJwt from "../middleware/auth.middleware";

const router = Router();

// router.get("/", [passportJwt, roleAdminMiddleware], getAll);

//? /api/v1/users/me
router.get("/me", passportJwt, getMyUserById);
router.get("/:id", passportJwt, getById);
router.patch("/me", passportJwt, editMyuser);
router.delete("/me", passportJwt, deactivateMyUser);

// router.get("/:id", [passportJwt, roleAdminMiddleware], getById);
// router.patch("/:id", [passportJwt, roleAdminMiddleware], edit);
// router.delete("/:id", [passportJwt, roleAdminMiddleware], remove);

export { router };
