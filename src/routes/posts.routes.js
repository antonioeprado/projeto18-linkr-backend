import { Router } from "express";
import {
  publicateLink,
  findAllLinks,
} from "../controllers/posts.controllers.js";
import postModelValidation from "../middlewares/post.model.validation.middleware.js";
import { ensureAuthenticated } from "../middlewares/auth.validation.middleware.js";

const postsRouter = Router();

postsRouter.post(
  "/post",
  postModelValidation,
  ensureAuthenticated,
  publicateLink
);

postsRouter.get("/posts", ensureAuthenticated, findAllLinks);

export default postsRouter;
