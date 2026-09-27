import { Router, type RequestHandler } from "express";

import { BlogController } from "../controller/index.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import { authorize } from "../common/middleware/authorization.middleware.js";

const router = Router();
const blogController = new BlogController();

type BlogIdParams = {
  id: string;
};

// Admin only
router.post("/", authenticate, authorize("admin"), (req, res, next) =>
  blogController.createBlog(req, res, next),
);

// Public
router.get("/", (req, res, next) => blogController.getBlogs(req, res, next));

router.get("/slug/:slug", (req, res, next) =>
  blogController.getBlogBySlug(req, res, next),
);

router.get("/:id", (req, res, next) =>
  blogController.getBlogById(req, res, next),
);

// Admin only
const updateBlogHandler: RequestHandler<BlogIdParams> = (req, res, next) => {
  blogController.updateBlog(req, res, next);
};

const deleteBlogHandler: RequestHandler<BlogIdParams> = (req, res, next) => {
  blogController.deleteBlog(req, res, next);
};

router.patch("/:id", authenticate, authorize("admin"), updateBlogHandler);

router.delete("/:id", authenticate, authorize("admin"), deleteBlogHandler);

export default router;
