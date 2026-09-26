import { model, type Model } from "mongoose";
import { Service } from "../typings";
import { serviceSchema } from "../schema";
 

export const ServiceModel: Model<Service> = model<Service>(
  "Service",
  serviceSchema,
);