import connection from "../database/db.js";

export function createRepost(req, res) {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  try {
    //o usuário só pode fazer repost do mesmo post 1 só vez, para evitar spam
    connection.query(
      `INSERT INTO reposts ("postId", "userId") VALUES ($1,$2);`,
      [postId, userId]
    );
    res.status(201).send("Publicação repostada com sucesso.");
  } catch (err) {
    res
      .status(500)
      .send(
        `Error trying to repost publication ${postId} from user ${userId}. Consult the logs for details.`
      );
    console.log(`Server returned: ${err.message}`);
  }
}
