import connection from "../database/db.js";
import urlMetadata from "url-metadata";

/* const posts = {
    userId,
    url,
    description,
    createdAt
} */

export async function publicateLink(req, res) {
  const { url, description } = req.body;

  try {
    urlMetadata(url)
      .then((answer) => {
        console.log(answer);
      })
      .catch((err) => {
        console.log(err);
      });
      res.status(201).send({
        userName
      })
  } catch (err) {}
}
