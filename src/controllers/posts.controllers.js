import urlMetadata from "url-metadata";
import connection from "../database/db.js";
import filterHashtags from "../repositories/filter.hashtags.repository.js";
import {
  postHashtag,
  postPublication,
  getAllPublicationsById,
  getAllPublications,
  checkMetadata,
  insertNewMetadata,
} from "../repositories/post.repositories.js";

//publica um post
export async function publicateLink(req, res) {
  const { url, description } = req.body;
  const { userId } = res.locals.user;
  try {
    //variavel q vai receber o metaId
    let metaId;
    let postId;
    let tagId;
    //checa se a url inserida já existe na tabela metadados
    const metadataFromUrl = await checkMetadata(url);
    //se não, insere novos metadados e, através do insert, retorna o id da row inserida, que é então atribuída à variável metaId, e a publicação é postada

    //se sim, atribui à variável metaId o id dos metadados e posta a publicação
    if (metadataFromUrl.rows.length < 1) {
      urlMetadata(url)
        .then(async (a) => {
          const { rows } = await insertNewMetadata(
            a.title,
            a.description,
            a.url,
            a.image
          );
          metaId = rows[0].id;
          const newPostId = await postPublication(userId, metaId, url, description);
          postId = newPostId.rows[0].id;
          console.log(postId);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      metaId = metadataFromUrl.rows[0].id;
      const newPostId = await postPublication(userId, metaId, url, description);
      postId = newPostId.rows[0].id;
      console.log(newPostId);
    }

    //se não houver descrição, já é postado como nula
    //se houver descrição, as hashtags serão filtradas e postadas na tabela hashtags
    if (!description) {
      return res.status(201).send("Post criado com sucesso!");
    } else {
      const hashtags = filterHashtags(description);

      hashtags.forEach(async (h) => {
        let { rows } = await postHashtag(h);
        tagId = rows[0].id;
        await connection.query(`INSERT INTO posts_hashtags ("postId", "tagId") VALUES ($1, $2)`, [postId, tagId]);
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
