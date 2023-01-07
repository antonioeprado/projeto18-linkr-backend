import { Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";
import { postLike } from "../controllers/likes.controllers.js";

const likesRouter = Router();

likesRouter.post("/like/:postId", ensureAuthentication, postLike);

export default likesRouter;
