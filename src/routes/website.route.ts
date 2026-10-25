import { Router } from "express";

import { websiteDashboardController } from "../controller/website-dashboard.controller.js";

const router = Router();

router.get("/services/slug/:slug", (req, res, next) =>
  websiteDashboardController.getServiceBySlug(req, res, next),
);

router.get("/projects/slug/:slug", (req, res, next) =>
  websiteDashboardController.getProjectBySlug(req, res, next),
);

router.get("/blogs/slug/:slug", (req, res, next) =>
  websiteDashboardController.getBlogBySlug(req, res, next),
);

router.get("/documents/:id", (req, res, next) =>
  websiteDashboardController.getPublicDocumentById(req, res, next),
);

export default router;
