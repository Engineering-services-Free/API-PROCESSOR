import { Router } from "express";
import { ServiceController } from "../controller/index";

const router = Router();
const serviceController = new ServiceController();

router.post("/", (req, res, next) =>
  serviceController.createService(req, res, next),
);

router.get("/", (req, res, next) =>
  serviceController.getServices(req, res, next),
);

router.get("/slug/:slug", (req, res, next) =>
  serviceController.getServiceBySlug(req, res, next),
);

router.get("/:id", (req, res, next) =>
  serviceController.getServiceById(req, res, next),
);

router.patch("/:id", (req, res, next) =>
  serviceController.updateService(req, res, next),
);

router.delete("/:id", (req, res, next) =>
  serviceController.deleteService(req, res, next),
);

export default router;
