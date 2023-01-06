import {
	searchBoxSchema,
	signInSchema,
	signUpSchema,
} from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import { validateBySchema } from "../repositories/models.repository.js";

export function signUpSchemaValidation(req, res, next) {
	const { email, password, username, pictureUrl } = req.body;

	const { error } = signUpSchema.validate(
		{ email, password, username, pictureUrl },
		{ abortEarly: false }
	);

	if (error) {
		const errors = error.details.map((detail) => detail.message);
		return res.status(422).send(errors);
	}

	next();
}

export function signInSchemaValidation(req, res, next) {
	const { email, password } = req.body;

	const { error } = signInSchema.validate(
		{ email, password },
		{ abortEarly: false }
	);

	if (error) {
		const errors = error.details.map((detail) => detail.message);
		return res.status(422).send(errors);
	}

	next();
}
export async function ensureAuthentication(req, res, next) {
	const authorization = req.headers.authorization;
	const token = authorization?.replace("Bearer ", "");

	if (!token) {
		return res.sendStatus(401);
	}

	try {
		const { userId, userPicture } = jwt.verify(token, process.env.JWT_SECRET);

		res.locals.user = { userId, userPicture };

		next();
	} catch (err) {
		console.log(err);
		res.status(401).send("Não autorizado, token inválido.");
	}
}

export function validadeSearchQuery(req, res, next) {
	const username = req.query;
	if (validateBySchema(username, searchBoxSchema, res)) {
		next();
	}
}
