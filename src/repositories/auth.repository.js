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
				u."pictureUrl",
				ARRAY_TO_JSON(
					ARRAY_AGG(
						JSON_BUILD_OBJECT(
							'id', p.id,
							'url', p.url,
							'description', p.description,
							'linkTitle', mt."linkTitle",
							'linkDescription', mt."linkDescription",
							'linkUrl', mt."linkUrl",
							'linkImg', mt."linkImg"
						)
					)
				) AS posts
			FROM users u
			JOIN posts p
				ON p."userId" = u.id
			JOIN metadata mt
				ON mt.id = p."metaId"
			WHERE u.id = $1
			GROUP BY u.id;
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

export async function getUserByEmail(email) {
  const existingEmail = await connection.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  console.log("email:", existingEmail.rows[0]);
  return existingEmail;
}

export async function getUserByUsername(username) {
  return await connection.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
}

export async function insertNewUser(
  email,
  passwordHashed,
  username,
  pictureUrl
) {
  return await connection.query(
    `INSERT INTO users (email, password, username, "pictureUrl") VALUES ($1, $2, $3, $4)`,
    [email, passwordHashed, username, pictureUrl]
  );
}

export async function getAllUsersEmails() {
  return await connection.query(`
	  SELECT users.email FROM users
	  `);
}

export async function createSessionByUserId(getUser) {
  await connection.query(
    `INSERT INTO sessions ("userId") VALUES ($1) RETURNING id`,
    [getUser.rows[0].id]
  );
}

export async function getSessionsByUserId(getUser) {
  return await connection.query(
    `
	  SELECT * FROM sessions WHERE "userId" = $1`,
    [getUser.rows[0].id]
  );
}
