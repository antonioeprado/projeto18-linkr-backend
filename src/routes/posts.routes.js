import { Router } from "express";
import {
  publicateLink,
  findAllLinksById,
  findAllLinks,
  editPost,
  deletePost,
} from "../controllers/posts.controllers.js";
import postModelValidation from "../middlewares/post.model.validation.middleware.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";
import { metadataMiddleware } from "../middlewares/metadata.middleware.js";
import checkPostExistence from "../middlewares/check.post.existence.middleware.js";

const postsRouter = Router();

postsRouter.get("/all-posts", ensureAuthentication, findAllLinks);

postsRouter.get("/user-posts", ensureAuthentication, findAllLinksById);

postsRouter.post(
  "/post",
  postModelValidation,
  ensureAuthentication,
  metadataMiddleware,
  publicateLink
);

postsRouter.patch(
  "/posts/:id",
  ensureAuthentication,
  checkPostExistence,
  editPost
);

postsRouter.delete(
  "/posts/:postId",
  ensureAuthentication,
  checkPostExistence,
  deletePost
);

export default postsRouter;
