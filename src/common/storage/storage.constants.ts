export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_IMAGE_FOLDERS = [
  "services",
  "projects",
  "clients",
  "blogs",
  "founder",
  "about",
  "landing-page",
  "editor-images",
] as const;

export type AllowedImageFolder = (typeof ALLOWED_IMAGE_FOLDERS)[number];

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
] as const;

export const ALLOWED_DOCUMENT_FOLDERS = ["documents"] as const;

export type AllowedDocumentFolder = (typeof ALLOWED_DOCUMENT_FOLDERS)[number];
