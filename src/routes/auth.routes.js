import { Router } from "express";
import { postSignUp, userByName } from "../controllers/auth.controllers.js";
import { signUpSchemaValidation } from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.post("/signup", signUpSchemaValidation, postSignUp);

router.post("/user", userByName);

export default router;
