import { Router } from "express";

import serviceRoute from "../routes/service.route";
import projectRoute from "../routes/project.route.js";
import clientRoute from "../routes/client.route.js";
import blogRoute from "../routes/blog.route.js";
import founderRoute from "../routes/founder.route.js";
import aboutRoute from "../routes/about.route.js";
import landingPageRoute from "../routes/landing-page.route.js";
import contactRoute from "../routes/contact.route.js";
import documentRoute from "../routes/document.route.js";

const router = Router();

const apiPath = "/api/v1";

// Services
router.use(`${apiPath}/services`, serviceRoute);

// Projects
router.use(`${apiPath}/projects`, projectRoute);

// Clients
router.use(`${apiPath}/clients`, clientRoute);

// Blogs
router.use(`${apiPath}/blogs`, blogRoute);

// Founder
router.use(`${apiPath}/founder`, founderRoute);

// About
router.use(`${apiPath}/about`, aboutRoute);

// Landing Page
router.use(`${apiPath}/landing-page`, landingPageRoute);

// Contact
router.use(`${apiPath}/contact`, contactRoute);

// Documents
router.use(`${apiPath}/documents`, documentRoute);

export default router;
