import { UpdateQuery } from "mongoose";
import { Contact } from "../persistance/typings";
import { ContactModel } from "../persistance/model";
import { CreateContactInput, UpdateContactInput } from "../common/validators/service.validator";

export class ContactDao {
  public async createContact(
  data: CreateContactInput,
): Promise<Contact> {
  return ContactModel.create(data);
}

  public async findContact(): Promise<Contact | null> {
    return ContactModel.findOne().lean<Contact>().exec();
  }

  public async updateContact(
  data: UpdateContactInput,
): Promise<Contact | null> {
  return ContactModel.findOneAndUpdate(
    {},
    data,
    {
      new: true,
      runValidators: true,
    },
  )
    .lean<Contact>()
    .exec();
}

  public async deleteContact(): Promise<Contact | null> {
    return ContactModel.findOneAndDelete({}).lean<Contact>().exec();
  }
}

export const contactDao = new ContactDao();
