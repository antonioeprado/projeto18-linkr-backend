import { Router } from "express";
import { hashtags, trendings } from "../controllers/hashtags.controllers.js";

const router = Router();

router.get("/hashtag/:hashtags", hashtags);

router.get("/trends", trendings);

export default router;