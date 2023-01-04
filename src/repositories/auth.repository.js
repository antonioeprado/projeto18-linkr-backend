import connection from "../database/db.js";

export const User = {
	findById: function (id) {
		// A FUNÇÃO JSON_BUILD_OBJECT monta um objeto da seguinte forma:
		// 'nomedachave', nomedocampo
		// A FUNÇÃO ARRAY_AGG transforma esses objetos em uma array em SQL
		// que retorna uma array com os valores dos campos.
		// A FUNÇÃO ARRAY_TO_JSON pega essa array e transforma em uma array
		// de objetos.
		return connection.query(
			`
			SELECT
				u.name,
				ARRAY_TO_JSON(
					ARRAY_AGG(
						JSON_BUILD_OBJECT(
							'id', p.id,
							'url', p.url,
							'description', p.description
						)
					)
				) AS posts
			FROM users u
			JOIN posts p
				ON u.id = p."userId"
			WHERE id=$1
			GROUP BY u.id
			`,
			[id]
		);
	},
	findByEmail: function (email) {
		return connection.query(`SELECT * FROM users WHERE email = $1`, [email]);
	},
	findByUsername: function (username) {
		return connection.query(`SELECT * FROM users WHERE username = $1`, [
			username,
		]);
	},
	createUser: function (obj) {
		return connection.query(
			`INSERT INTO users (email, password, username, "pictureUrl") VALUES ($1, $2, $3, $4)`,
			[obj.email, obj.password, obj.username, obj.pictureUrl]
		);
	},
};
