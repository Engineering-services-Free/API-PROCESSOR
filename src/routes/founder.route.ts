import { Router } from "express";
import { FounderController } from "../controller/index.js";

const router = Router();
const founderController = new FounderController();

router.post("/", (req, res, next) =>
  founderController.createFounder(req, res, next),
);

router.get("/", (req, res, next) =>
  founderController.getFounders(req, res, next),
);

router.get("/:id", (req, res, next) =>
  founderController.getFounderById(req, res, next),
);

router.patch("/:id", (req, res, next) =>
  founderController.updateFounder(req, res, next),
);

router.delete("/:id", (req, res, next) =>
  founderController.deleteFounder(req, res, next),
);

export default router;
