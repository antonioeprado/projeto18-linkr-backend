import { Router } from "express";
import {
	publicateLink,
	findAllLinks,
} from "../controllers/posts.controllers.js";
import postModelValidation from "../middlewares/post.model.validation.middleware.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";

const postsRouter = Router();

postsRouter.post(
	"/post",
	postModelValidation,
	ensureAuthentication,
	publicateLink
);

postsRouter.get("/posts", ensureAuthentication, findAllLinks);

export default postsRouter;
