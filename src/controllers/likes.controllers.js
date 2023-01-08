import connection from "../database/db.js";

export async function postLike(req, res) {
  //postId e userId
  const { userId } = res.locals.user;
  const { postId } = req.params;
  console.log("oi")
  try {
    await connection.query(
      `INSERT INTO likes ("postId","userId") VALUES ($1,$2);`,
      [postId, userId]
    );

    res.status(201).send("Post laikado com sucesso!");
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}

export async function deleteLike(req, res) {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  console.log(userId, postId)
  try {
    await connection.query(
      `DELETE FROM likes WHERE "postId"=$1 AND "userId"=$2`,
      [postId, userId]
    );
    res.status(200).send("Post deslaikado com sucesso.")
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}
