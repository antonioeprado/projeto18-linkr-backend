import { Router } from "express";
import {
  followUserController,
  unFollowUserController,
} from "../controllers/follow.controllers.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";
import { isFollowing } from "../middlewares/follow.middlewares.js";

const router = Router();

router.post(
  "/follow/:id",
  ensureAuthentication,
  isFollowing,
  followUserController
);

router.delete(
  "/unfollow/:id",
  ensureAuthentication,
  isFollowing,
  unFollowUserController
);

export default router;
