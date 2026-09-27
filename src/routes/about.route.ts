import { Router } from "express";

import { AboutController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const aboutController = new AboutController();

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  aboutController.createAbout(req, res, next),
);

// Public
router.get("/", (req, res, next) => aboutController.getAbout(req, res, next));

// Admin only
router.patch("/", authenticate, authorize("admin"), (req, res, next) =>
  aboutController.updateAbout(req, res, next),
);

router.delete("/", authenticate, authorize("admin"), (req, res, next) =>
  aboutController.deleteAbout(req, res, next),
);

export default router;
