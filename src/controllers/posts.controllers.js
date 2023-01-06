import urlMetadata from "url-metadata";
import connection from "../database/db.js";
import filterHashtags from "../repositories/filter.hashtags.repository.js";
import {
  postHashtag,
  postPublication,
  getAllPublicationsById,
} from "../repositories/post.repositories.js";

//publica um post
export async function publicateLink(req, res) {
  const { url, description } = req.body;
  const { userId } = res.locals.user;
  try {
    //insere os dados na tabela metadata
    let metaId;
    const metadataFromUrl = await connection.query(
      `SELECT * FROM metadata WHERE "linkUrl"=$1`,
      [url]
    );
    if (metadataFromUrl.rows.length < 1) {
      urlMetadata(url)
        .then(async (a) => {
          await connection.query(
            `INSERT INTO metadata ("linkTitle", "linkDescription", "linkUrl", "linkImg") VALUES ($1,$2,$3,$4);`,
            [a.title, a.description, a.url, a.image]
          );
          const findLastMetadata = await connection.query(
            "SELECT id FROM metadata ORDER BY id DESC LIMIT 1;"
          );

          metaId = findLastMetadata.rows[0].id;
          await postPublication(userId, metaId, url, description);
          console.log(metaId);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const { rows } = await connection.query(
        `SELECT * FROM metadata WHERE "linkUrl"=$1;`,
        [url]
      );
      metaId = rows[0].id;
      await postPublication(userId, metaId, url, description);
    }
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

//pega todos os posts, do mais recente ao mais antigo, num limite de 20 posts
export async function findAllLinks(req, res) {
  try {
    const { rows } = await connection.query(
      `SELECT 
      users.username AS "userName",
      users."pictureUrl", 
      COUNT(likes."postId") AS likes, 
      posts.description, 
      posts.url, 
      metadata."linkTitle",
      metadata."linkDescription", 
      metadata."linkUrl", 
      metadata."linkImg" AS "linkImage" 
    FROM posts 
    JOIN likes ON likes."postId"=posts.id 
    JOIN users ON posts."userId"=users.id 
    JOIN metadata ON posts."metaId"=metadata.id 
    GROUP BY posts.id, users.id, metadata.id
    ORDER BY posts.id DESC
    LIMIT 20
    ;`
    );
    const finalArr = rows.map((e) => {
      return {
        userName: e.username,
        userImage: e.pictureUrl,
        likesCount: e.likes,
        postDescription: e.description,
        linkInfo: {
          linkTitle: e.linkTitle,
          linkDescription: e.linkDescription,
          linkUrl: e.linkUrl,
          linkImage: e.linkImage,
        },
      };
    });
    res.send(finalArr);
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}
//pega todos os posts (links) do user loggado (que enviou o token)
export async function findAllLinksById(req, res) {
  const { userId } = res.locals.user;
  try {
    const { rows } = await getAllPublicationsById(userId);
    const finalArr = rows.map((e) => {
      return {
        userName: e.username,
        userImage: e.pictureUrl,
        likesCount: e.likes,
        postDescription: e.description,
        linkInfo: {
          linkTitle: e.linkTitle,
          linkDescription: e.linkDescription,
          linkUrl: e.linkUrl,
          linkImage: e.linkImage,
        },
      };
    });
    res.send(finalArr);
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}
