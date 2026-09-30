import { ApplicationError } from "../common/errors/application.error.js";
import { deleteStorageFile } from "../common/storage/storage.js";
import {
  clientSchema,
  updateClientSchema,
  clientQuerySchema,
} from "../common/validators/service.validator.js";
import { ClientDao, clientDao } from "../daos/client.dao.js";

export class ClientService {
  constructor(private readonly dao: ClientDao = clientDao) {}

  public async createClient(data: unknown) {
    const validatedData = clientSchema.parse(data);

    return this.dao.createClient(validatedData);
  }

  public async getClients(query: unknown) {
    const validatedQuery = clientQuerySchema.parse(query);

    const filter: { industry?: string } = {};

    if (validatedQuery.industry !== undefined) {
      filter.industry = validatedQuery.industry;
    }

    return this.dao.findClients({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      filter,
    });
  }

  public async getClientById(id: string) {
    const client = await this.dao.findClientById(id);

    if (!client) {
      throw new ApplicationError("Client not found", 404, "NOT_FOUND");
    }

    return client;
  }

  public async updateClient(id: string, data: unknown) {
    const validatedData = updateClientSchema.parse(data);

    const existingClient = await this.dao.findClientById(id);

    if (!existingClient) {
      throw new ApplicationError("Client not found", 404, "NOT_FOUND");
    }

    const oldStoragePath = existingClient.image?.storagePath;
    const newStoragePath = validatedData.image?.storagePath;

    const isNewImage =
      Boolean(oldStoragePath) &&
      Boolean(newStoragePath) &&
      oldStoragePath !== newStoragePath;

    // Update MongoDB first
    const updatedClient = await this.dao.updateClientById(id, validatedData);

    if (!updatedClient) {
      throw new ApplicationError(
        "Failed to update Client",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    // Delete old Firebase image only after DB update succeeds
    if (isNewImage && oldStoragePath) {
      try {
        await deleteStorageFile(oldStoragePath);
      } catch (error) {
        console.error(
          "Failed to delete previous Client image:",
          oldStoragePath,
          error,
        );
      }
    }

    return updatedClient;
  }

  public async deleteClient(id: string) {
    const existingClient = await this.dao.findClientById(id);

    if (!existingClient) {
      throw new ApplicationError("Client not found", 404, "NOT_FOUND");
    }

    const deletedClient = await this.dao.deleteClientById(id);

    if (!deletedClient) {
      throw new ApplicationError(
        "Failed to delete Client",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    if (existingClient.image?.storagePath) {
      try {
        await deleteStorageFile(existingClient.image.storagePath);
      } catch (error) {
        console.error(
          "Failed to delete Client image:",
          existingClient.image.storagePath,
          error,
        );
      }
    }

    return deletedClient;
  }
}

export const clientService = new ClientService();
