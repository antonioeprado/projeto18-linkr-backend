import connection from "../database/db.js";

export default async function checkPostExistence(req, res, next) {
  const { postId } = req.params;
  const { rows } = await connection.query(`SELECT * FROM posts WHERE id=$1`, [
    postId,
  ]);
  if (rows.length < 1) {
    return res.status(400).send("Esse post não existe.");
  }
  next();
}
