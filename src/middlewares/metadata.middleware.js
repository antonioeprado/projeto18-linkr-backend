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
