import connection from "../database/db.js";
import urlMetadata from "url-metadata";
import filterHashtags from "../repositories/filter.hashtags.repository.js";
import postHashtag from "../repositories/post.hashtag.repository.js";

export async function publicateLink(req, res) {
  const { url, description } = req.body;
  const { userId } = res.locals.user;
  try {
    //insert post na posts table:
    await connection.query(
      `INSERT INTO posts ("userId",url,description) VALUES ($1,$2,$3);`,
      [userId, url, description]
    );
    //insert hashtag na hashtags table:
    //hashtags filtradas:
    const hashtags = filterHashtags(description);
    //para cada hashtag da array hashtags, é inserida uma row hashtag na tabela hashtags
    hashtags.forEach(async (h) => {
      await postHashtag(h);
    });

    res.status(201).send("Post criado com sucesso!");
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}

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
