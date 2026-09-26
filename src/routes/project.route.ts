import { Router } from "express";
import { ProjectController } from "../controller/index.js";

const router = Router();
const projectController = new ProjectController();

router.post("/", (req, res, next) =>
  projectController.createProject(req, res, next),
);

router.get("/", (req, res, next) =>
  projectController.getProjects(req, res, next),
);

router.get("/slug/:slug", (req, res, next) =>
  projectController.getProjectBySlug(req, res, next),
);

router.get("/:id", (req, res, next) =>
  projectController.getProjectById(req, res, next),
);

router.patch("/:id", (req, res, next) =>
  projectController.updateProject(req, res, next),
);

router.delete("/:id", (req, res, next) =>
  projectController.deleteProject(req, res, next),
);

export default router;
