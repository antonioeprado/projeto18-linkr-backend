import { Router } from "express";
import {
  getUserById,
  postSignIn,
  postSignUp,
} from "../controllers/auth.controllers.js";
import {
  ensureAuthentication,
  signInSchemaValidation,
  signUpSchemaValidation,
} from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.post("/sign-up", signUpSchemaValidation, postSignUp);
router.post("/sign-in", signInSchemaValidation, postSignIn);

router.get("/user/:id", ensureAuthentication, getUserById);

export default router;
