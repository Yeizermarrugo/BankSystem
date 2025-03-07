import { Router } from "express";

import { deactivateMyUser, editMyuser, getMyUserById } from "../../application/user/user.controller";
import passportJwt from "../middleware/auth.middleware";

const router = Router();

// router.get("/", [passportJwt, roleAdminMiddleware], getAll);

//? /api/v1/users/me
router.get("/me", passportJwt, getMyUserById);
router.patch("/me", passportJwt, editMyuser);
router.delete("/me", passportJwt, deactivateMyUser);

// router.get("/:id", [passportJwt, roleAdminMiddleware], getById);
// router.patch("/:id", [passportJwt, roleAdminMiddleware], edit);
// router.delete("/:id", [passportJwt, roleAdminMiddleware], remove);

export { router };
