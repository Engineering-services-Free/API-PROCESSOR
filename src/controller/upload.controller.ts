import type { NextFunction, Request, Response } from "express";
import multer from "multer";

import {
  ALLOWED_DOCUMENT_FOLDERS,
  ALLOWED_DOCUMENT_MIME_TYPES,
  ALLOWED_IMAGE_FOLDERS,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_DOCUMENT_SIZE,
  MAX_IMAGE_SIZE,
} from "../common/storage/storage.constants.js";

import type { StorageUploadResult } from "../common/storage/storage.types.js";

import { ApplicationError } from "../common/errors/application.error.js";

import { uploadStorageFile } from "../common/storage/storage.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
});

const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
  },
});

const sanitizeFileName = (fileName: string, fallback = "image"): string => {
  const extensionMatch = fileName.match(/\.[a-zA-Z0-9]+$/);

  const extension = extensionMatch?.[0]?.toLowerCase() ?? "";

  const baseName = fileName
    .replace(/\.[a-zA-Z0-9]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || fallback}${extension}`;
};

const generateUniqueFileName = (
  originalName: string,
  fallback = "image",
): string => {
  const safeFileName = sanitizeFileName(originalName, fallback);

  return `${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
};

export class UploadController {
  public readonly uploadImageMiddleware = upload.single("file");

  public readonly uploadDocumentMiddleware = documentUpload.single("file");

  public async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new ApplicationError(
          "Image file is required.",
          400,
          "BAD_REQUEST",
        );
      }

      const folder = req.body.folder;

      if (
        typeof folder !== "string" ||
        !ALLOWED_IMAGE_FOLDERS.includes(
          folder as (typeof ALLOWED_IMAGE_FOLDERS)[number],
        )
      ) {
        throw new ApplicationError(
          "Invalid image upload folder.",
          400,
          "BAD_REQUEST",
        );
      }

      if (
        !ALLOWED_IMAGE_MIME_TYPES.includes(
          req.file.mimetype as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
        )
      ) {
        throw new ApplicationError(
          "Only JPG, PNG, WEBP, and GIF images are allowed.",
          400,
          "BAD_REQUEST",
        );
      }

      if (req.file.size > MAX_IMAGE_SIZE) {
        throw new ApplicationError(
          "Image size must be less than 5 MB.",
          400,
          "BAD_REQUEST",
        );
      }

      const fileName = generateUniqueFileName(req.file.originalname);

      const result: StorageUploadResult = await uploadStorageFile(
        req.file.buffer,
        {
          folder,
          fileName,
          contentType: req.file.mimetype,
        },
      );

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async uploadDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new ApplicationError(
          "Document file is required.",
          400,
          "BAD_REQUEST",
        );
      }

      const folder = req.body.folder;

      if (
        typeof folder !== "string" ||
        !ALLOWED_DOCUMENT_FOLDERS.includes(
          folder as (typeof ALLOWED_DOCUMENT_FOLDERS)[number],
        )
      ) {
        throw new ApplicationError(
          "Invalid document upload folder.",
          400,
          "BAD_REQUEST",
        );
      }

      if (
        !ALLOWED_DOCUMENT_MIME_TYPES.includes(
          req.file.mimetype as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number],
        )
      ) {
        throw new ApplicationError(
          "Only PDF, DOC, DOCX, PPT, and PPTX files are allowed.",
          400,
          "BAD_REQUEST",
        );
      }

      if (req.file.size > MAX_DOCUMENT_SIZE) {
        throw new ApplicationError(
          "Document size must be less than 10 MB.",
          400,
          "BAD_REQUEST",
        );
      }

      const fileName = generateUniqueFileName(
        req.file.originalname,
        "document",
      );

      const result: StorageUploadResult = await uploadStorageFile(
        req.file.buffer,
        {
          folder,
          fileName,
          contentType: req.file.mimetype,
        },
      );

      res.status(201).json({
        success: true,
        message: "Document uploaded successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
