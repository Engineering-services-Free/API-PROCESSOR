import { model, type Model } from "mongoose";

import type { Contact } from "../typings/contact.typings";
import { contactSchema } from "../schema/contact.schema";

export const ContactModel: Model<Contact> = model<Contact>(
  "Contact",
  contactSchema,
);
