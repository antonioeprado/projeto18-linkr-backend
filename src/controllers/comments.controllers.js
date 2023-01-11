import { insertComment } from "../repositories/comments.repository.js";
import { findPostById } from "../repositories/post.repositories.js";

export async function createComment(req, res) {
  const { comment, postId } = req.body;
  const { userId } = res.locals.user;

  try {
    const verifyPostId = await findPostById(postId);

    if (verifyPostId.rowCount === 0) {
      return res.send("PostId não encontrado").status(404);
    }

    const newComment = await insertComment(postId, userId, comment);

    if (newComment.rowCount === 0) {
      res.send("Não foi possível postar o comentário").status(500);
    }

    console.log(newComment);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
