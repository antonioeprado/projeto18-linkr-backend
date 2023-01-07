import {Router} from "express";

const likesRouter = Router();

likesRouter.post("/like", postLike)

export default likesRouter;