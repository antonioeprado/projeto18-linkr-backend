import connection from "../database/db.js";

export default function postHashtag(tag) {
  return connection.query(
    `INSERT INTO hashtags (tag) VALUES ($1);`,
    [tag]
  );
}
