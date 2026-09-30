import { Types } from "mongoose";

import {
  PaginatedResult,
  PaginationQuery,
} from "../common/pagination/pagination.types";
import { DocumentModel } from "../persistance/model";
import { Document } from "../persistance/typings";
import {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "../common/validators/service.validator";

export interface FindDocumentsFilter {
  type?:
    | "brochure"
    | "certificate"
    | "company-profile"
    | "presentation"
    | "other";

  visibility?: "public" | "internal";

  clientId?: string;
}

export interface FindDocumentsOptions extends PaginationQuery {
  filter?: FindDocumentsFilter;
}

export class DocumentDao {
  public async createDocument(data: CreateDocumentInput): Promise<Document> {
    const { clientId, ...documentData } = data;

    return DocumentModel.create({
      ...documentData,
      ...(clientId ? { clientId: new Types.ObjectId(clientId) } : {}),
    });
  }

 public async findDocuments(
  options: FindDocumentsOptions,
): Promise<PaginatedResult<Document>> {
  const { page, limit, filter = {} } = options;

  const skip = (page - 1) * limit;

  const mongoFilter: Record<string, unknown> = {};

  if (filter.type) {
    mongoFilter.type = filter.type;
  }

  if (filter.visibility) {
    mongoFilter.visibility = filter.visibility;
  }

  if (filter.clientId) {
    mongoFilter.clientId = new Types.ObjectId(filter.clientId);
  }

  const [items, total] = await Promise.all([
    DocumentModel.find(mongoFilter)
      .sort({
        order: 1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean<Document[]>()
      .exec(),

    DocumentModel.countDocuments(mongoFilter).exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

  public async findDocumentById(id: string): Promise<Document | null> {
    return DocumentModel.findById(id).lean<Document>().exec();
  }

  public async updateDocumentById(
    id: string,
    data: UpdateDocumentInput,
  ): Promise<Document | null> {
    const { clientId, ...documentData } = data;
    const update = {
      ...documentData,
      ...(clientId === undefined
        ? {}
        : {
            clientId: clientId === null ? null : new Types.ObjectId(clientId),
          }),
    };

    return DocumentModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .lean<Document>()
      .exec();
  }

  public async deleteDocumentById(id: string): Promise<Document | null> {
    return DocumentModel.findByIdAndDelete(id).lean<Document>().exec();
  }
}

export const documentDao = new DocumentDao();
