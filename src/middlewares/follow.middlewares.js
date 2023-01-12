import connection from "../database/db.js";

export async function isFollowing(req, res, next) {
  const { id } = req.params;
  const { userId } = res.locals.user;
  const verb = req.method;
  try {
    const isFollowed = await connection.query(
      `SELECT * FROM following_flow WHERE "userId" = $1 AND follower = $2`,
      [id, userId]
    );
    if (verb === "POST" && isFollowed.rowCount)
      return res.status(409).send("You're already following this user.");
    if (verb === "DELETE" && !isFollowed.rowCount)
      return res.status(409).send("You're not following this user.");
    next();
  } catch (error) {
    console.log(
      `Error trying to ${verb === "POST" ? "follow" : "unfollow"} user ${id}`
    );
    console.log(`Server returned: ${error}`);
    res.sendStatus(500);
  }
}
