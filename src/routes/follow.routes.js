import { Router } from "express";
import { followUser, unFollowUser } from "../controllers/follow.controllers.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";
import { isFollowing } from "../middlewares/follow.middlewares.js";

const router = Router();

router.post("/follow/:id", ensureAuthentication, isFollowing, followUser);

router.delete("/unfollow/:id", ensureAuthentication, isFollowing, unFollowUser);

export default router;
