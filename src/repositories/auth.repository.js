import { connection } from "../database/db.js";

export const User = {
	findById: function (id) {
		return connection.query(
			`SELECT u.name, p.url, p.description FROM users u JOIN posts p ON u.id = p."userId" WHERE id=$1`,
			[id]
		);
	},
};
