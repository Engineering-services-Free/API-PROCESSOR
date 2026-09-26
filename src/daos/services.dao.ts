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

export interface FindServicesFilter {
  status?: "draft" | "published" | "archived";
  featured?: boolean;
}

export interface FindServicesOptions extends PaginationQuery {
  filter?: FindServicesFilter;
}

export class ServiceDao {
  public async createService(data: CreateServiceInput): Promise<Service> {
    return ServiceModel.create(data);
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
        .lean<Service[]>()
        .exec(),

      ServiceModel.countDocuments(filter).exec(),
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
    return ServiceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean<Service>()
      .exec();
  }

  public async deleteServiceById(id: string): Promise<Service | null> {
    return ServiceModel.findByIdAndDelete(id).lean<Service>().exec();
  }
}

export const serviceDao = new ServiceDao();
