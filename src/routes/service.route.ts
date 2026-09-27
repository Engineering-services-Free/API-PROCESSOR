import { Router, type RequestHandler } from "express";

import { ServiceController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const serviceController = new ServiceController();

type ServiceIdParams = {
  id: string;
};

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  serviceController.createService(req, res, next),
);

// Public
router.get("/", (req, res, next) =>
  serviceController.getServices(req, res, next),
);

router.get("/slug/:slug", (req, res, next) =>
  serviceController.getServiceBySlug(req, res, next),
);

router.get("/:id", (req, res, next) =>
  serviceController.getServiceById(req, res, next),
);

// Admin only
const updateServiceHandler: RequestHandler<ServiceIdParams> = (
  req,
  res,
  next,
) => {
  serviceController.updateService(req, res, next);
};

const deleteServiceHandler: RequestHandler<ServiceIdParams> = (
  req,
  res,
  next,
) => {
  serviceController.deleteService(req, res, next);
};

router.patch("/:id", authenticate, authorize("admin"), updateServiceHandler);

router.delete("/:id", authenticate, authorize("admin"), deleteServiceHandler);

export default router;
