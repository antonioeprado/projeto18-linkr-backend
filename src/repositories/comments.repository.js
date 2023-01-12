import connection from "../database/db.js";

export async function insertComment(postId, authorId, comment) {
  return await connection.query(
    `
    INSERT INTO comments ("postId", "authorId", comment) VALUES ($1, $2, $3)
    `,
    [postId, authorId, comment]
  );
}

export async function getCommentsByPostId(postId) {
  return await connection.query(`SELECT * FROM comments WHERE "postId" = $1`, [
    postId,
  ]);
}
