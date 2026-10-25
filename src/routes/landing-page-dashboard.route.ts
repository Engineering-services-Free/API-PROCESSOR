import { Router } from "express";

import { landingPageDashboardController } from "../controller/landing-page-dashboard.controller.js";

const router = Router();

router.get("/", (req, res, next) =>
  landingPageDashboardController.getLandingPageDashboard(req, res, next),
);

export default router;
