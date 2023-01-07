import urlMetadata from "url-metadata";
import connection from "../database/db.js";
import filterHashtags from "../repositories/filter.hashtags.repository.js";
import {
  postHashtag,
  postPublication,
  getAllPublicationsById,
  getAllPublications,
} from "../repositories/post.repositories.js";

//publica um post
export async function publicateLink(req, res) {
  const { url, description } = req.body;
  const { userId } = res.locals.user;
  const metaId = res.locals.metaId;

  try {
    //se não houver descrição, já é postado como nula
    //se houver descrição, as hashtags serão filtradas e postadas na tabela hashtags
    if (!description) {
      await postPublication(userId, metaId, url, description);
      return res.status(201).send("Post criado com sucesso!");
    }
    if (description) {
      //posta a publi e retorna o id da publi
      const returnPostId = await postPublication(
        userId,
        metaId,
        url,
        description
      );
      //filtra as hashtags da descriçao
      const hashtags = filterHashtags(description);
      //insere as hashtags na tabela hashtags
      hashtags.forEach(async (h) => {
        const { rows } = await postHashtag(h);
        await connection.query(
          `INSERT INTO posts_hashtags ("postId", "tagId") VALUES ($1, $2)`,
          [returnPostId.rows[0].id, rows[0].id]
        );
      });
    }

    res.status(201).send("Post criado com sucesso!");
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}

//pega todos os posts, do mais recente ao mais antigo, num limite de 20 posts
export async function findAllLinks(req, res) {
  try {
    const { rows } = await getAllPublications();
    const finalArr = rows.map((e) => {
      return {
        userName: e.userName,
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
        userName: e.userName,
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
