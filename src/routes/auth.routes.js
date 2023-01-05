import { Router } from "express";
import {
  getUserById,
  findUserByName,
  userById,
  postSignIn,
  postSignUp,
} from "../controllers/auth.controllers.js";
import {
	validadeSearchQuery,
  ensureAuthentication,
  signInSchemaValidation,
  signUpSchemaValidation,
} from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.post("/sign-up", signUpSchemaValidation, postSignUp);
router.post("/sign-in", signInSchemaValidation, postSignIn);


router.post("/user", ensureAuthenticated, validadeSearchQuery, findUserByName);
router.get("/user/:id", ensureAuthenticated, getUserById);

export default router;
