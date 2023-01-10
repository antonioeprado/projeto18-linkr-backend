import { Router } from "express";
import { hashtags, trendings } from "../controllers/hashtags.controllers.js";
import { ensureAuthentication } from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.get("/hashtag/:hashtags", ensureAuthentication, hashtags);

router.get("/trends", trendings);

export default router;