import { Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";
import { postLike, deleteLike } from "../controllers/likes.controllers.js";
import checkPostExistence from "../middlewares/check.post.existence.middleware.js";

const likesRouter = Router();

likesRouter.use(checkPostExistence)
likesRouter.post("/like/:postId", ensureAuthentication, postLike);
likesRouter.delete("/unlike/:postId", ensureAuthentication, deleteLike)

export default likesRouter;
