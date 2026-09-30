import { ApplicationError } from "../common/errors/application.error";

import {
  contactSchema,
  updateContactSchema,
} from "../common/validators/service.validator";

import { ContactDao, contactDao } from "../daos/contact.dao";

export class ContactService {
  constructor(private readonly dao: ContactDao = contactDao) {}

  public async createContact(data: unknown) {
    // Zod validation
    const validatedData = contactSchema.parse(data);

    // Business rule
    const existingContact = await this.dao.findContact();

    if (existingContact) {
      throw new ApplicationError(
        "Contact information already exists",
        409,
        "DUPLICATE_RESOURCE",
      );
    }

    // DAO
    return this.dao.createContact(validatedData);
  }

  public async getContact() {
    const contact = await this.dao.findContact();

    return contact ?? null;
  }

  public async updateContact(data: unknown) {
    const validatedData = updateContactSchema.parse(data);

    const existingContact = await this.dao.findContact();

    if (!existingContact) {
      throw new ApplicationError(
        "Contact information not found",
        404,
        "NOT_FOUND",
      );
    }

    const updatedContact = await this.dao.updateContact(validatedData);

    if (!updatedContact) {
      throw new ApplicationError(
        "Failed to update contact information",
        500,
        "INTERNAL_SERVER_ERROR",
      );
    }

    return updatedContact;
  }

  public async deleteContact() {
    const existingContact = await this.dao.findContact();

    if (!existingContact) {
      throw new ApplicationError(
        "Contact information not found",
        404,
        "NOT_FOUND",
      );
    }

    return this.dao.deleteContact();
  }
}

export const contactService = new ContactService();
