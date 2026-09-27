import { Router, type RequestHandler } from "express";

import { ProjectController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const projectController = new ProjectController();

type ProjectIdParams = {
  id: string;
};

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  projectController.createProject(req, res, next),
);

// Public
router.get("/", (req, res, next) =>
  projectController.getProjects(req, res, next),
);

router.get("/slug/:slug", (req, res, next) =>
  projectController.getProjectBySlug(req, res, next),
);

router.get("/:id", (req, res, next) =>
  projectController.getProjectById(req, res, next),
);

// Admin only
const updateProjectHandler: RequestHandler<ProjectIdParams> = (
  req,
  res,
  next,
) => {
  projectController.updateProject(req, res, next);
};

const deleteProjectHandler: RequestHandler<ProjectIdParams> = (
  req,
  res,
  next,
) => {
  projectController.deleteProject(req, res, next);
};

router.patch("/:id", authenticate, authorize("admin"), updateProjectHandler);

router.delete("/:id", authenticate, authorize("admin"), deleteProjectHandler);

export default router;
