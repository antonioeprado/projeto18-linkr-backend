import { Router } from "express";
import { followUser } from "../controllers/follow.controllers.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.post("/follow/:id", ensureAuthentication, followUser);

router.post("/unfollow/:id");

export default router;
