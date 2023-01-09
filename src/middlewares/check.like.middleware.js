import connection from "../database/db";

export default async function checkLike(req, res, next) {
  const { userId } = res.locals.user;
  const { postId } = req.params;

  try {
    const { rows } = await connection.query(
      `SELECT * FROM likes WHERE "postId"=$1 AND "userId"=$2;`,
      [postId, userId]
    );
    if(rows.length<1){}
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}
