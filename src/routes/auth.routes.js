import { Router } from "express";
import { postSignUp } from "../controllers/auth.controllers.js";
import { signUpSchemaValidation } from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.post("/signup", signUpSchemaValidation, postSignUp);

export default router;
