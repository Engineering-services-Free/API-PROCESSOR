import { ApplicationError } from "../common/errors/application.error.js";
import { deleteStorageFile } from "../common/storage/storage.js";
import {
  documentSchema,
  updateDocumentSchema,
  documentQuerySchema,
} from "../common/validators/service.validator.js";
import { DocumentDao, documentDao } from "../daos/document.dao.js";

export class DocumentService {
  constructor(private readonly dao: DocumentDao = documentDao) {}

  public async createDocument(data: unknown) {
    const validatedData = documentSchema.parse(data);

    return this.dao.createDocument(validatedData);
  }

  public async getDocuments(query: unknown) {
    const validatedQuery = documentQuerySchema.parse(query);

    return this.dao.findDocuments({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      filter: {
        type: validatedQuery.type,
        visibility: validatedQuery.visibility,
      },
    });
  }

  public async getDocumentById(id: string) {
    const document = await this.dao.findDocumentById(id);

    if (!document) {
      throw new ApplicationError("Document not found", 404, "NOT_FOUND");
    }

    return document;
  }

  public async updateDocument(id: string, data: unknown) {
    const validatedData = updateDocumentSchema.parse(data);

    const existingDocument = await this.dao.findDocumentById(id);

    if (!existingDocument) {
      throw new ApplicationError("Document not found", 404, "NOT_FOUND");
    }

    const updatedDocument = await this.dao.updateDocumentById(
      id,
      validatedData,
    );

    /*
     * Delete the old Firebase file only
     * when a different file was provided.
     */
    if (
      validatedData.file?.storagePath &&
      existingDocument.file.storagePath &&
      validatedData.file.storagePath !== existingDocument.file.storagePath
    ) {
      await deleteStorageFile(existingDocument.file.storagePath);
    }

    return updatedDocument;
  }

  public async deleteDocument(id: string) {
    const existingDocument = await this.dao.findDocumentById(id);

    if (!existingDocument) {
      throw new ApplicationError("Document not found", 404, "NOT_FOUND");
    }

    const deletedDocument = await this.dao.deleteDocumentById(id);

    /*
     * Delete Firebase file after MongoDB
     * document deletion.
     */
    if (existingDocument.file.storagePath) {
      await deleteStorageFile(existingDocument.file.storagePath);
    }

    return deletedDocument;
  }
}

export const documentService = new DocumentService();
