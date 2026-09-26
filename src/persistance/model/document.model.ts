import { model, type Model } from "mongoose";

import type { Document } from "../typings/document.typings";
import { documentSchema } from "../schema/documents.schema";

export const DocumentModel: Model<Document> = model<Document>(
  "Document",
  documentSchema,
);
