import { Router, type RequestHandler } from "express";

import { DocumentController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const documentController = new DocumentController();

type DocumentIdParams = {
  id: string;
};

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  documentController.createDocument(req, res, next),
);

// Public
router.get("/", (req, res, next) =>
  documentController.getDocuments(req, res, next),
);

router.get("/:id", (req, res, next) =>
  documentController.getDocumentById(req, res, next),
);

// Admin only
const updateDocumentHandler: RequestHandler<DocumentIdParams> = (
  req,
  res,
  next,
) => {
  documentController.updateDocument(req, res, next);
};

const deleteDocumentHandler: RequestHandler<DocumentIdParams> = (
  req,
  res,
  next,
) => {
  documentController.deleteDocument(req, res, next);
};

router.patch("/:id", authenticate, authorize("admin"), updateDocumentHandler);

router.delete("/:id", authenticate, authorize("admin"), deleteDocumentHandler);

export default router;
