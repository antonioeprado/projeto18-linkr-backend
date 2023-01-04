import { Router } from "express";
import { postSignIn, postSignUp } from "../controllers/auth.controllers.js";
import {
  ensureAuthenticated,
  signInSchemaValidation,
  signUpSchemaValidation,
  teste,
} from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.post("/sign-up", signUpSchemaValidation, postSignUp);
router.post("/sign-in", signInSchemaValidation, postSignIn);

export default router;
