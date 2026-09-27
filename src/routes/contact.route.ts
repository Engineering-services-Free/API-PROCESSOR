import { Router } from "express";

import { ContactController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const contactController = new ContactController();

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  contactController.createContact(req, res, next),
);

// Public
router.get("/", (req, res, next) =>
  contactController.getContact(req, res, next),
);

// Admin only
router.patch("/", authenticate, authorize("admin"), (req, res, next) =>
  contactController.updateContact(req, res, next),
);

router.delete("/", authenticate, authorize("admin"), (req, res, next) =>
  contactController.deleteContact(req, res, next),
);

export default router;
