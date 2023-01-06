import { Router } from "express";
import {
  publicateLink,
  findAllLinksById,
  findAllLinks,
} from "../controllers/posts.controllers.js";
import postModelValidation from "../middlewares/post.model.validation.middleware.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";

const postsRouter = Router();

postsRouter.get("/all-posts", findAllLinks);

postsRouter.post(
  "/post",
  postModelValidation,
  ensureAuthentication,
  publicateLink
);

postsRouter.get("/user-posts", ensureAuthentication, findAllLinksById);


export default postsRouter;
