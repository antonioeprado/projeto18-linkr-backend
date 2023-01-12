import { User } from "../repositories/auth.repository.js";

export async function followUserController(req, res) {
  const { id } = req.params;
  const { userId } = res.locals.user;
  try {
    await User.followUser(userId, id);
    res.sendStatus(201);
  } catch (error) {
    console.log(`Error trying to follow user ${id}`);
    console.log(`Server returned: ${error}`);
    res.sendStatus(500);
  }
}

export async function unFollowUserController(req, res) {
  const { id } = req.params;
  const { userId } = res.locals.user;
  try {
    await User.unfollowUser(userId, id);
    res.sendStatus(200);
  } catch (error) {
    console.log(`Error trying to unfollow user ${id}`);
    console.log(`Server returned: ${error}`);
    res.sendStatus(500);
  }
}
