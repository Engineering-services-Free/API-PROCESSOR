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

  /*
   * Best-effort Firebase cleanup.
   *
   * MongoDB has already been updated when this runs.
   * If Firebase deletion fails, log the error but don't
   * turn a successful database update into a 500 response.
   */
  private async cleanupStorage(path: string): Promise<void> {
    try {
      await deleteStorageFile(path);
    } catch (error) {
      console.error(
        "Failed to delete document file from Firebase Storage:",
        path,
        error,
      );
    }
  }

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
        clientId: validatedQuery.clientId,
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

    /*
     * Keep the old Firebase path before updating MongoDB.
     */
    const oldStoragePath = existingDocument.file.storagePath;

    const newStoragePath = validatedData.file?.storagePath;

    const isNewFile =
      Boolean(newStoragePath) &&
      Boolean(oldStoragePath) &&
      newStoragePath !== oldStoragePath;

    /*
     * Update MongoDB first.
     */
    const updatedDocument = await this.dao.updateDocumentById(
      id,
      validatedData,
    );

    if (!updatedDocument) {
      throw new ApplicationError(
        "Failed to update document",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    /*
     * Delete the old Firebase file only after
     * MongoDB has been successfully updated.
     *
     * Cleanup is best-effort, so a Firebase deletion
     * failure does not make the update fail.
     */
    if (isNewFile && oldStoragePath) {
      await this.cleanupStorage(oldStoragePath);
    }

    return updatedDocument;
  }

  public async deleteDocument(id: string) {
    const existingDocument = await this.dao.findDocumentById(id);

    if (!existingDocument) {
      throw new ApplicationError("Document not found", 404, "NOT_FOUND");
    }

    /*
     * Delete MongoDB document first.
     */
    const deletedDocument = await this.dao.deleteDocumentById(id);

    /*
     * Only clean up Firebase after MongoDB deletion.
     */
    if (existingDocument.file.storagePath) {
      await this.cleanupStorage(existingDocument.file.storagePath);
    }

    return deletedDocument;
  }
}

export const documentService = new DocumentService();
