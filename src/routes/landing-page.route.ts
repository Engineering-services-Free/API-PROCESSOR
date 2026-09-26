import { Router } from "express";
import { LandingPageController } from "../controller/index.js";

const router = Router();
const landingPageController = new LandingPageController();

router.post("/", (req, res, next) =>
  landingPageController.createLandingPage(req, res, next),
);

router.get("/", (req, res, next) =>
  landingPageController.getLandingPage(req, res, next),
);

router.patch("/", (req, res, next) =>
  landingPageController.updateLandingPage(req, res, next),
);

router.delete("/", (req, res, next) =>
  landingPageController.deleteLandingPage(req, res, next),
);

export default router;
