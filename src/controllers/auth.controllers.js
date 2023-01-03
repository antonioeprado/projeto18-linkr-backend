import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import connection from "../database/db.js";

export async function postSignUp(req, res) {
  const { email, password, username, pictureUrl } = req.body;

  const passwordHashed = bcrypt.hashSync(password, 10);

  try {
    const existingEmail = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingEmail.rowCount > 0) {
      return res
        .status(409)
        .send("Esse e-mail já está cadastrado no nosso sistema!");
    }

    const existingUsername = await connection.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );

    if (existingUsername.rowCount > 0) {
      return res
        .status(409)
        .send("Esse nome de usuário já está cadastrado no nosso sistema!");
    }

    const newUser = await connection.query(
      `INSERT INTO users (email, password, username, "pictureUrl") VALUES ($1, $2, $3, $4)`,
      [email, passwordHashed, username, pictureUrl]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
}
