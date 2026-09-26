import { UpdateQuery } from "mongoose";
import {
  PaginatedResult,
  PaginationQuery,
} from "../common/pagination/pagination.types";
import { Client } from "../persistance/typings";
import { ClientModel } from "../persistance/model";
import {
  CreateClientInput,
  UpdateClientInput,
} from "../common/validators/service.validator";

export interface FindClientsFilter {
  industry?: string;
}

export interface FindClientsOptions extends PaginationQuery {
  filter?: FindClientsFilter;
}

export class ClientDao {
  public async createClient(data: CreateClientInput): Promise<Client> {
    return ClientModel.create(data);
  }

  public async findClients(
    options: FindClientsOptions,
  ): Promise<PaginatedResult<Client>> {
    const { page, limit, filter = {} } = options;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ClientModel.find(filter)
        .sort({
          name: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean<Client[]>()
        .exec(),

      ClientModel.countDocuments(filter).exec(),
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

  public async findClientById(id: string): Promise<Client | null> {
    return ClientModel.findById(id).lean<Client>().exec();
  }

  public async updateClientById(
    id: string,
    data: UpdateClientInput,
  ): Promise<Client | null> {
    return ClientModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean<Client>()
      .exec();
  }

  public async deleteClientById(id: string): Promise<Client | null> {
    return ClientModel.findByIdAndDelete(id).lean<Client>().exec();
  }
}

export const clientDao = new ClientDao();
