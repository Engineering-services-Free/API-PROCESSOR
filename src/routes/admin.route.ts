import { Router } from "express";

import { dashboardController } from "../controller/dashboard.controller.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();

router.get("/dashboard", authenticate, authorize("admin"), (req, res, next) =>
  dashboardController.getDashboard(req, res, next),
);

export default router;
