import { Router } from "express";
import { BlogController } from "../controller/index.js";

const router = Router();
const blogController = new BlogController();

router.post("/", (req, res, next) => blogController.createBlog(req, res, next));

router.get("/", (req, res, next) => blogController.getBlogs(req, res, next));

router.get("/slug/:slug", (req, res, next) =>
  blogController.getBlogBySlug(req, res, next),
);

router.get("/:id", (req, res, next) =>
  blogController.getBlogById(req, res, next),
);

router.patch("/:id", (req, res, next) =>
  blogController.updateBlog(req, res, next),
);

router.delete("/:id", (req, res, next) =>
  blogController.deleteBlog(req, res, next),
);

export default router;
