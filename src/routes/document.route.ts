import { Router } from "express";
import { DocumentController } from "../controller/index.js";

const router = Router();
const documentController = new DocumentController();

router.post("/", (req, res, next) =>
  documentController.createDocument(req, res, next),
);

router.get("/", (req, res, next) =>
  documentController.getDocuments(req, res, next),
);

router.get("/:id", (req, res, next) =>
  documentController.getDocumentById(req, res, next),
);

router.patch("/:id", (req, res, next) =>
  documentController.updateDocument(req, res, next),
);

router.delete("/:id", (req, res, next) =>
  documentController.deleteDocument(req, res, next),
);

export default router;
