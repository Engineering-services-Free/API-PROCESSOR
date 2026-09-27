import { Router, type RequestHandler } from "express";

import { ClientController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const clientController = new ClientController();

type ClientIdParams = {
  id: string;
};

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  clientController.createClient(req, res, next),
);

// Public
router.get("/", (req, res, next) =>
  clientController.getClients(req, res, next),
);

router.get("/:id", (req, res, next) =>
  clientController.getClientById(req, res, next),
);

// Admin only
const updateClientHandler: RequestHandler<ClientIdParams> = (
  req,
  res,
  next,
) => {
  clientController.updateClient(req, res, next);
};

const deleteClientHandler: RequestHandler<ClientIdParams> = (
  req,
  res,
  next,
) => {
  clientController.deleteClient(req, res, next);
};

router.patch("/:id", authenticate, authorize("admin"), updateClientHandler);

router.delete("/:id", authenticate, authorize("admin"), deleteClientHandler);

export default router;
