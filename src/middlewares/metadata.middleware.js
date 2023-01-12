import {
  checkMetadata,
  insertNewMetadata,
} from "../repositories/post.repositories.js";
import urlMetadata from "url-metadata";

export async function metadataMiddleware(req, res, next) {
  const { url } = req.body;
  try {
    const metadataFromUrl = await checkMetadata(url);
    if (metadataFromUrl.rows.length < 1) {
      await urlMetadata(url)
        .then(async (a) => {
          //se o titulo, a descriçao, a url ou a imagem vierem como null da API de metadados, salvar algo que nao seja nulo na tabela
          a.title === null ? a.title = "Not Found" : ""
          a.description === null ? a.description = "Not Found" : ""
          a.url === null ? a.url = "Not Found" : ""
          a.image === null ? a.image = "Not Found" : ""
          const { rows } = await insertNewMetadata(
            a.title,
            a.description,
            a.url,
            a.image
          );
          res.locals.metaId = rows[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.locals.metaId = metadataFromUrl.rows[0].id;
    }
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
  next();
}
