import { Router } from "express";
import {
  publicateLink,
  findAllLinksById,
  findAllLinks,
} from "../controllers/posts.controllers.js";
import postModelValidation from "../middlewares/post.model.validation.middleware.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";
import connection from "../database/db.js";

const postsRouter = Router();

postsRouter.get("/all-posts", findAllLinks);

postsRouter.post(
  "/post",
  postModelValidation,
  ensureAuthentication,
  publicateLink
);

postsRouter.get("/user-posts", ensureAuthentication, findAllLinksById);

postsRouter.get("/test", async(req,res)=>{
  await connection.query(`SELECT * FROM metadata;`)
})

export default postsRouter;
