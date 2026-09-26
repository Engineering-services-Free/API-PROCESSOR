import { UpdateQuery } from "mongoose";
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
}

export interface FindDocumentsOptions extends PaginationQuery {
  filter?: FindDocumentsFilter;
}

export class DocumentDao {
  public async createDocument(data: CreateDocumentInput): Promise<Document> {
    return DocumentModel.create(data);
  }

  public async findDocuments(
    options: FindDocumentsOptions,
  ): Promise<PaginatedResult<Document>> {
    const { page, limit, filter = {} } = options;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      DocumentModel.find(filter)
        .sort({
          order: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean<Document[]>()
        .exec(),

      DocumentModel.countDocuments(filter).exec(),
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
    return DocumentModel.findByIdAndUpdate(id, data, {
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
