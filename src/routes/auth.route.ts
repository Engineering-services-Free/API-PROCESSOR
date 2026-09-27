import { Router } from "express";

import { authController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";

const router = Router();

router.post("/login", (req, res, next) => authController.login(req, res, next));

router.post("/change-password", authenticate, (req, res, next) =>
  authController.changePassword(req, res, next),
);

export default router;
