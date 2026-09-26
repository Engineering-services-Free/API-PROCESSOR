export type DocumentType =
  | "brochure"
  | "certificate"
  | "company-profile"
  | "presentation"
  | "other";

export type DocumentVisibility =
  | "public"
  | "internal";

export interface DocumentFile {
  url: string;
  storagePath: string;
}

export interface Document {
  title: string;

  type: DocumentType;

  description?: string;

  file: DocumentFile;

  visibility: DocumentVisibility;

  order: number;

  createdAt: Date;

  updatedAt: Date;
}