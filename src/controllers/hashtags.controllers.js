import connection from "../database/db.js";
import jwt from "jsonwebtoken";

export async function hashtags(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const secretKey = process.env.JWT_SECRET;
  const { hashtags } = req.params;
  if(!token){
    return res.sendStatus(401);
  }

  try {
    const { userId, sessionId } = jwt.verify(token, secretKey);
    console.log(userId, sessionId);

    if(!userId){
        return res.sendStatus(401);
    }
    // const sessionExist = jwt.verify(token, secretKey);
    // if (!sessionExist) {
    //     return res.sendStatus(404);
    // }
    // const userLogado = await connection.query(`SELECT * FROM users WHERE id = $1`,
    //     [sessionExist.rows[0].userId]);

    // if (!userLogado) {
    //     return res.sendStatus(404);
    // }

    const hashtagClick = await connection.query(
      `SELECT  u.username, u."pictureUrl", p.url, p.description,
        COUNT(l.id) AS likes FROM hashtags h JOIN posts_hashtags ph 
        ON h.id = ph."tagId" JOIN posts p ON p.id = ph."postId" JOIN 
        users u ON u.id = p."userId" JOIN likes l ON p.id = l."userId"  
        WHERE tag = $1 GROUP BY u.username, u."pictureUrl", p.url, p.description;`,
      [hashtags]
    );

    res.send(hashtagClick.rows);
  } catch (err) {
    console.log(err);
  }
}

export async function trendings(req, res) {
    try {
        const trends = await connection.query(`SELECT tag FROM hashtags`);
        res.send(trends.rows);
    } catch (err) {
        console.log(err.message);
    }
}