import connection from "../database/db.js";

export default async function repostCheck(req, res, next) {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  try {
    const { rows } = await connection.query(
      `SELECT * FROM reposts WHERE "userId"=$1 AND "postId"=$2;`,
      [userId, postId]
    );
    if (rows.length > 0) {
      return res
        .status(409)
        .send("Esse post já foi repostado por esse usuário.");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
  next();
}
