import connection from "../database/db.js";
import urlMetadata from "url-metadata";
import filterHashtags from "../repositories/filter.hashtags.repository.js";
import {
  postHashtag,
  postPublication,
} from "../repositories/post.repositories.js";

export async function publicateLink(req, res) {
  const { url, description } = req.body;
  const { userId } = res.locals.user;
  try {
    //insert post na posts table:
    await postPublication(userId, url, description);
    
    //insert hashtag na hashtags table:
    //array de hashtags filtradas da descrição do post:
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

//pega todos os posts (links) do user loggado (que enviou o token)
export async function findAllLinks(req, res) {
  const { userId } = res.locals.user;
  try {
    const { rows } = await connection.query(
      `SELECT u.username AS "userName", p.description, p.url, p."createdAt" FROM users u JOIN posts p ON u.id=p."userId" WHERE p."userId"=$1;`,
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
