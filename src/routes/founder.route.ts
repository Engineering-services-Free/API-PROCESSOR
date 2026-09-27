import { Router, type RequestHandler } from "express";

import { FounderController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const founderController = new FounderController();

type FounderIdParams = {
  id: string;
};

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  founderController.createFounder(req, res, next),
);

// Public
router.get("/", (req, res, next) =>
  founderController.getFounders(req, res, next),
);

router.get("/:id", (req, res, next) =>
  founderController.getFounderById(req, res, next),
);

// Admin only
const updateFounderHandler: RequestHandler<FounderIdParams> = (
  req,
  res,
  next,
) => {
  founderController.updateFounder(req, res, next);
};

const deleteFounderHandler: RequestHandler<FounderIdParams> = (
  req,
  res,
  next,
) => {
  founderController.deleteFounder(req, res, next);
};

router.patch("/:id", authenticate, authorize("admin"), updateFounderHandler);

router.delete("/:id", authenticate, authorize("admin"), deleteFounderHandler);

export default router;
