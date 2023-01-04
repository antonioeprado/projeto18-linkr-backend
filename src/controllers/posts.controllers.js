import connection from "../database/db.js";
import urlMetadata from "url-metadata";
import dayjs from "dayjs";

/* const postsTable = {
    userId,
    url,
    description,
    createdAt
} */

export async function publicateLink(req, res) {
  const { url, description } = req.body;
  const userId = res.locals.userId;
  try {
    const now = `${dayjs().year()}/${
      dayjs().month().length + 1 < 2
        ? dayjs().month() + 1
        : "0" + (dayjs().month() + 1)
    }/${dayjs().date().length < 2 ? dayjs().date() : "0" + dayjs().date()}`;
    /*     await connection.query(`INSERT INTO posts ("userId", url, description, "createdAt") VALUES $1, $2, $3, $4;`, [userId, url, description, now]) */
    res.status(201).send("Post criado com sucesso!");
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}

/* urlMetadata(url)
.then((answer) => {
  return res.status(201).send({
    userName: "test",
    userDescription: description,
    linkInfo: {
      title: answer.title,
      description: answer.description,
      url: answer.url,
      image: answer.image,
    },
  });
})
.catch((err) => {
  console.log(err);
}); */

export async function findAllLinks(req, res) {
  const userId = res.locals.userId;
  try {
    const { rows } = connection.query(
      `SELECT 
        users.name AS "userName",
        posts.description, 
        posts.url, 
        posts."createdAt" 
      FROM 
        posts 
      JOIN 
        users 
      ON 
       users.id=posts."userId" 
      WHERE 
       posts."userId"=$1;`,
      [userId]
    );
    urlMetadata(rows[0].url)
      .then((answer) => {
        return res.status(201).send({
          userName: rows[0].userName,
          postDescription: rows[0].description,
          linkInfo: {
            title: answer.title,
            description: answer.description,
            url: answer.url,
            image: answer.image,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}
