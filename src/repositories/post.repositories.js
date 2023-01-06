import connection from "../database/db.js";

export function postHashtag(tag) {
  const newTag = tag.substring(1);
  return connection.query(`INSERT INTO hashtags (tag) VALUES ($1) RETURNING id;`, [newTag]);
}

export function postPublication(userId, metaId, url, description) {
  return connection.query(
    `INSERT INTO posts ("userId","metaId",url,description) VALUES ($1,$2,$3,$4) RETURNING id;`,
    [userId, metaId, url, description]
  );
}

export function getAllPublicationsById(userId) {
  return connection.query(
    `SELECT 
    users.username AS "userName",
    users."pictureUrl", 
    posts."likesCount",
    posts.description, 
    posts.url, 
    metadata."linkTitle",
    metadata."linkDescription", 
    metadata."linkUrl", 
    metadata."linkImg" AS "linkImage" 
  FROM posts 
  JOIN users ON posts."userId"=users.id 
  JOIN metadata ON posts."metaId"=metadata.id 
  WHERE users.id=$1 
  ORDER BY posts.id DESC
  LIMIT 20
  ;`,
    [userId]
  );
}

export function getAllPublications() {
  return connection.query(
    `SELECT 
      users.username AS "userName",
      users."pictureUrl", 
      posts."likesCount",
      posts.description, 
      posts.url, 
      metadata."linkTitle",
      metadata."linkDescription", 
      metadata."linkUrl", 
      metadata."linkImg" AS "linkImage" 
    FROM posts 
    JOIN users ON posts."userId"=users.id 
    JOIN metadata ON posts."metaId"=metadata.id 
    ORDER BY posts.id DESC
    LIMIT 20
    ;`
  );
}

export function checkMetadata(url) {
  return connection.query(`SELECT * FROM metadata WHERE "linkUrl"=$1`, [url]);
}

export function insertNewMetadata(title, description, url, image) {
  return connection.query(
    `INSERT INTO metadata ("linkTitle", "linkDescription", "linkUrl", "linkImg") VALUES ($1,$2,$3,$4) RETURNING id;`,
    [title, description, url, image]
  );
}