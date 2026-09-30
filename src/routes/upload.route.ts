import { Router } from "express";

import { UploadController } from "../controller/index.js";

import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();

const uploadController = new UploadController();

router.post(
  "/image",
  authenticate,
  authorize("admin"),
  uploadController.uploadImageMiddleware,
  (req, res, next) => uploadController.uploadImage(req, res, next),
);

router.post(
  "/document",
  authenticate,
  authorize("admin"),
  uploadController.uploadDocumentMiddleware,
  (req, res, next) => uploadController.uploadDocument(req, res, next),
);

export default router;
