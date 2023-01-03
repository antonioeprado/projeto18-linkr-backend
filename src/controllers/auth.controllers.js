import { User } from "../repositories/auth.repository.js";

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
