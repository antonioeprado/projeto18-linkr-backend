import { Router } from "express";
import {
  publicateLink,
  findAllLinks,
} from "../controllers/posts.controllers.js";
import postModelValidation from "../middlewares/post.model.validation.middleware.js";
import tokenValidation from "../middlewares/token.validation.middleware.js";

const postsRouter = Router();

//falta o tokenvalidation
postsRouter.post("/post", postModelValidation, publicateLink);

postsRouter.get("/posts", tokenValidation, findAllLinks);

export default postsRouter;
