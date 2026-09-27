import { Router } from "express";

import { LandingPageController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const landingPageController = new LandingPageController();

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  landingPageController.createLandingPage(req, res, next),
);

// Public
router.get("/", (req, res, next) =>
  landingPageController.getLandingPage(req, res, next),
);

// Admin only
router.patch("/", authenticate, authorize("admin"), (req, res, next) =>
  landingPageController.updateLandingPage(req, res, next),
);

router.delete("/", authenticate, authorize("admin"), (req, res, next) =>
  landingPageController.deleteLandingPage(req, res, next),
);

export default router;
