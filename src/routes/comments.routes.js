import { Router } from "express";
import { createComment } from "../controllers/comments.controllers.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";
import { commentSchemaValidation } from "../middlewares/comment.validation.middleware.js";

const router = Router();

router.post(
  "/comments",
  ensureAuthentication,
  commentSchemaValidation,
  createComment
);
// router.get("/comments/:id");

export default router;
