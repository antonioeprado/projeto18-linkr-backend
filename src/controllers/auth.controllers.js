import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import connection from "../database/db.js";
import {
  getUserByEmail,
  getUserByUsername,
  insertNewUser,
  User,
} from "../repositories/auth.repository.js";

export async function postSignUp(req, res) {
  const { email, password, username, pictureUrl } = req.body;

  const passwordHashed = bcrypt.hashSync(password, 10);

  try {
    const existingEmail = getUserByEmail(email);

    if (existingEmail.rowCount > 0) {
      return res
        .status(409)
        .send("Esse e-mail já está cadastrado no nosso sistema!");
    }

    const existingUsername = await getUserByUsername(username);

    if (existingUsername.rowCount > 0) {
      return res
        .status(409)
        .send("Esse nome de usuário já está cadastrado no nosso sistema!");
    }

    const newUser = await insertNewUser(
      email,
      passwordHashed,
      username,
      pictureUrl
    );

    if (newUser.rowCount === 0) {
      res.sendStatus(502);
    }

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
}

export async function getUserById(req, res) {
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

export async function postSignIn(req, res) {
  const { email, password } = req.body;

  try {
    const getUser = await connection.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const findAllUsersEmails = await connection.query(`
    SELECT users.email FROM users
    `);

    const compareUserEmail = findAllUsersEmails.rows.find(
      (item) => item.email === email
    );

    if (!compareUserEmail) {
      return res.status(401).send("E-mail não cadastrado!");
    }

    if (!bcrypt.compareSync(password, getUser.rows[0].password)) {
      return res.status(401).send("Senha incorreta");
    }

    await connection.query(
      `INSERT INTO sessions ("userId") VALUES ($1) RETURNING id`,
      [getUser.rows[0].id]
    );

    const getSessionId = await connection.query(
      `
    SELECT * FROM sessions WHERE "userId" = $1`,
      [getUser.rows[0].id]
    );

    const payload = {
      userId: getUser.rows[0].id,
      userPicture: getUser.rows[0].pictureUrl,
      sessionId: getSessionId.rows[0].id,
    };

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret);

    res.status(200).send(token);
  } catch (err) {
    console.log(err);
  }
}

export async function findUserByName(req, res) {
  const { username } = req.query;
  try {
    const query = await User.findByName(username);
    if (!query.rowCount) return res.sendStatus(404);
    res.status(200).send(query.rows);
  } catch (error) {
    console.log(`Error trying to find user with username: ${username}`);
    console.log(`Server returned: ${error}`);
    res.sendStatus(500);
  }
}
