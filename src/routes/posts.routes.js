import { Router } from "express";


const postsRouter = Router();

postsRouter.post("/post", publicateLink);

export default postsRouter;
