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

    return this.dao.findClients({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      filter: {
        industry: validatedQuery.industry,
      },
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

    const updatedClient = await this.dao.updateClientById(id, validatedData);

    /*
     * Delete the old Firebase image only
     * when a different image was provided.
     */
    if (
      validatedData.image?.storagePath &&
      existingClient.image.storagePath &&
      validatedData.image.storagePath !== existingClient.image.storagePath
    ) {
      await deleteStorageFile(existingClient.image.storagePath);
    }

    return updatedClient;
  }

  public async deleteClient(id: string) {
    const existingClient = await this.dao.findClientById(id);

    if (!existingClient) {
      throw new ApplicationError("Client not found", 404, "NOT_FOUND");
    }

    const deletedClient = await this.dao.deleteClientById(id);

    /*
     * Delete Firebase image after the
     * MongoDB document has been deleted.
     */
    if (existingClient.image.storagePath) {
      await deleteStorageFile(existingClient.image.storagePath);
    }

    return deletedClient;
  }
}

export const clientService = new ClientService();
