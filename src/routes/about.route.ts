import { Router } from "express";
import { AboutController } from "../controller/index.js";

const router = Router();
const aboutController = new AboutController();

router.post("/", (req, res, next) =>
  aboutController.createAbout(req, res, next),
);

router.get("/", (req, res, next) => aboutController.getAbout(req, res, next));

router.patch("/", (req, res, next) =>
  aboutController.updateAbout(req, res, next),
);

router.delete("/", (req, res, next) =>
  aboutController.deleteAbout(req, res, next),
);

export default router;
