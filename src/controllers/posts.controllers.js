import filterHashtags from "../repositories/filter.hashtags.repository.js";
import {
  postHashtag,
  postPublication,
  getAllPublicationsById,
  getAllPublications,
  insertPostHashtag,
  checkHashtag,
} from "../repositories/post.repositories.js";
import connection from "../database/db.js";

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
        //verifica se a hashtag já existe
        const checkHashtagExists = await checkHashtag(h);
        //se já existe, insere na tabela posts_hashtags com o id da hashtag existente
        //se não existe, posta a nova hashtag na tabela hashtags e depois insere na tabela posts_hashtags com o id da nova hashtag
        if (checkHashtagExists.rows.length > 0) {
          await insertPostHashtag(
            returnPostId.rows[0].id,
            checkHashtagExists.rows[0].id
          );
        } else {
          const { rows } = await postHashtag(h);
          await insertPostHashtag(returnPostId.rows[0].id, rows[0].id);
        }
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
    res.send(rows);
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
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}

export async function editPost(req, res) {
  const { postId } = req.params;
  const { description } = req.body;

  try {
    await connection.query(
      `UPDATE posts SET description = $2 WHERE posts.id = $1`,
      [postId, description]
    );
    res.status(200).send("Post editado com sucesso.")
  } catch (error) {
    console.log(`Error trying to update post with postId: ${postId}`);
    console.log(`Server returned: ${error}`);
    res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const { postId } = req.params;
  console.log(postId);
  try {
    await connection.query(`DELETE FROM posts WHERE posts.id = $1`, [postId]);
  } catch (err) {
    console.log(err);
  }
}