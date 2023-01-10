import connection from "../database/db.js";

export async function followUser(req, res) {
  const { id } = req.params;
  const { userId } = res.locals.user;
  try {
    await connection.query(
      `INSERT INTO following_flow ("userId", follower) VALUES ($1, $2)`,
      [userId, id]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(`Error trying to follow user ${id}`);
    console.log(`Server returned: ${error}`);
    res.sendStatus(500);
  }
}
