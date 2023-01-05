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
				u.username,
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
			WHERE u.id=$1
			GROUP BY u.id
			`,
			[id]
		);
	},
	findByName: function (name) {
		return connection.query(
			`SELECT u.id, u.username, u."pictureUrl" FROM users u WHERE username LIKE $1 || '%'`,
			[name]
		);
	},
};
