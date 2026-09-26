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

    if (!contact) {
      throw new ApplicationError(
        "Contact information not found",
        404,
        "NOT_FOUND",
      );
    }

    return contact;
  }

  public async updateContact(data: unknown) {
    // Zod validation
    const validatedData = updateContactSchema.parse(data);

    const existingContact = await this.dao.findContact();

    if (!existingContact) {
      throw new ApplicationError(
        "Contact information not found",
        404,
        "NOT_FOUND",
      );
    }

    return this.dao.updateContact(validatedData);
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
