import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../repositories/auth.repository.js";

export async function postSignUp(req, res) {
	const { email, password, username, pictureUrl } = req.body;

	const passwordHashed = bcrypt.hashSync(password, 10);

	try {
		const existingEmail = await User.findByEmail(email);

		if (existingEmail.rowCount > 0) {
			return res
				.status(409)
				.send("Esse e-mail já está cadastrado no nosso sistema!");
		}

		await User.createUser({
			email,
			password: passwordHashed,
			username,
			pictureUrl,
		});
		res.sendStatus(201);
	} catch (err) {
		console.log(err);
	}
}

export async function userById(req, res) {
	const { id } = req.params;
	try {
		const query = await User.findById(id);
		const user = query.rows;
		res.status(200).send(user);
	} catch (error) {
		console.log(`Error trying to find user with id: ${id}`);
		console.log(`Server returned: ${error}`);
		res.sendStatus(500);
	}
}

export async function userByName(req, res) {
	const { username } = req.body;
	try {
		const query = await User.findByUsername(username);
		if (!query.rowCount) return res.sendStatus(404);
		res.status(200).send(query.rows);
	} catch (error) {
		console.log(`Error trying to find user with id: ${id}`);
		console.log(`Server returned: ${error}`);
		res.sendStatus(500);
	}
}
