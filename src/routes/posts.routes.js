import { Router } from "express";
import { publicateLink } from "../controllers/posts.controllers.js";
import postModelValidation from "../middlewares/post.model.validation.middleware.js";
import tokenValidation from "../middlewares/token.validation.middleware.js";

const postsRouter = Router();

postsRouter.post("/post", postModelValidation, tokenValidation, publicateLink);

export default postsRouter;
