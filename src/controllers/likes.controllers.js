import connection from "../database/db.js";

export async function postLike(req, res) {
  //postId e userId
  const { userId } = res.locals.user;
  const { postId } = req.params;
  try {
    //verificar se o post existe
    const { rows } = await connection.query(`SELECT * FROM posts WHERE id=$1`, [
      postId,
    ]);
    if (rows.length > 0) {
      await connection.query(
        `INSERT INTO likes ("postId","userId") VALUES ($1,$2);`,
        [postId, userId]
      );
    } else {
      return res.status(400).send("Esse post não existe.");
    }

    res.status(201).send("Post laikado com sucesso!");
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}
