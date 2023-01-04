import { Router } from "express";
import { hashtags } from "../controllers/hashtags.controllers.js";

const router = Router();

router.get("/hashtags/:hashtags", hashtags);

export default router;