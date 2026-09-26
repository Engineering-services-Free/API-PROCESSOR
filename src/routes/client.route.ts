import { Router } from "express";
import { ClientController } from "../controller/index.js";

const router = Router();
const clientController = new ClientController();

router.post("/", (req, res, next) =>
  clientController.createClient(req, res, next),
);

router.get("/", (req, res, next) =>
  clientController.getClients(req, res, next),
);

router.get("/:id", (req, res, next) =>
  clientController.getClientById(req, res, next),
);

router.patch("/:id", (req, res, next) =>
  clientController.updateClient(req, res, next),
);

router.delete("/:id", (req, res, next) =>
  clientController.deleteClient(req, res, next),
);

export default router;
