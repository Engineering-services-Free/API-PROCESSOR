import {
  PaginatedResult,
  PaginationQuery,
} from "../common/pagination/pagination.types";
import { ServiceModel } from "../persistance/model";
import { Service } from "../persistance/typings";
import {
  CreateServiceInput,
  UpdateServiceInput,
} from "../common/validators/service.validator";
import {
  createOrderedRecord,
  deleteOrderedRecord,
  moveOrderedRecord,
  updateOrderedRecord,
} from "../common/ordering/order-sequence.service.js";

export interface FindServicesFilter {
  status?: "draft" | "published" | "archived";
  featured?: boolean;
}

export interface FindServicesOptions extends PaginationQuery {
  filter?: FindServicesFilter;
}

export class ServiceDao {
  public async createService(data: CreateServiceInput): Promise<Service> {
    return createOrderedRecord(
      "services",
      ServiceModel,
      data,
      undefined,
      undefined,
      { createdAt: -1 },
    );
  }

  public async findServices(
    options: FindServicesOptions,
  ): Promise<PaginatedResult<Service>> {
    const { page, limit, filter = {} } = options;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ServiceModel.find(filter)
        .sort({
          order: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      ServiceModel.countDocuments(filter).exec(),
    ]);

    const services: Service[] = items.map((item) => ({
      ...item,
      id: item._id.toString(),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      items: services,
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

  public async findServiceById(id: string): Promise<Service | null> {
    return ServiceModel.findById(id).lean<Service>().exec();
  }

  public async findServiceBySlug(slug: string): Promise<Service | null> {
    return ServiceModel.findOne({ slug }).lean<Service>().exec();
  }

  public async updateServiceById(
    id: string,
    data: UpdateServiceInput,
  ): Promise<Service | null> {
    return updateOrderedRecord(
      "services",
      ServiceModel,
      id,
      data,
      undefined,
      { createdAt: -1 },
    );
  }

  public async deleteServiceById(id: string): Promise<Service | null> {
    return deleteOrderedRecord(
      "services",
      ServiceModel,
      id,
      undefined,
      { createdAt: -1 },
    );
  }

  public async reorderServiceById(
    id: string,
    order: number,
  ): Promise<Service | null> {
    return moveOrderedRecord(
      "services",
      ServiceModel,
      id,
      order,
      undefined,
      { createdAt: -1 },
    );
  }
}

export const serviceDao = new ServiceDao();
