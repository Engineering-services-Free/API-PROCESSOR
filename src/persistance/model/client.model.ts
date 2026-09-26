import { model, type Model } from "mongoose";

import type { Client } from "../typings/client.typings";
import { clientSchema } from "../schema/client.schema";

export const ClientModel: Model<Client> = model<Client>("Client", clientSchema);
