import { Router } from "express";
import {
  findUserByName,
  userById,
  postSignIn,
  postSignUp,
} from "../controllers/auth.controllers.js";
import {
	ensureAuthenticated,
	signInSchemaValidation,
	signUpSchemaValidation,
	validadeSearchQuery,

} from "../middlewares/auth.validation.middleware.js";

const router = Router();

router.post("/sign-up", signUpSchemaValidation, postSignUp);
router.post("/sign-in", signInSchemaValidation, postSignIn);

router.post("/user", ensureAuthenticated, validadeSearchQuery, findUserByName);
router.get("/user/:id", ensureAuthenticated, getUserById);

export default router;
