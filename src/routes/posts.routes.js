import { Router } from "express";
import { publicateLink } from "../controllers/posts.controllers.js";
import postModelValidation from "../middlewares/post.model.validation.middleware.js";

const postsRouter = Router();

postsRouter.post("/post", postModelValidation, publicateLink);

export default postsRouter;
