import { Router } from "express";
import { ContactController } from "../controller/index.js";

const router = Router();
const contactController = new ContactController();

router.post("/", (req, res, next) =>
  contactController.createContact(req, res, next),
);

router.get("/", (req, res, next) =>
  contactController.getContact(req, res, next),
);

router.patch("/", (req, res, next) =>
  contactController.updateContact(req, res, next),
);

router.delete("/", (req, res, next) =>
  contactController.deleteContact(req, res, next),
);

export default router;
