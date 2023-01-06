import connection from "../database/db.js";

export function postHashtag(tag) {
  return connection.query(`INSERT INTO hashtags (tag) VALUES ($1);`, [tag]);
}

export function postPublication(userId, metaId, url, description) {
  return connection.query(
    `INSERT INTO posts ("userId","metaId",url,description) VALUES ($1,$2,$3,$4);`,
    [userId, metaId, url, description]
  );
}

export function getAllPublicationsById(userId) {
  return connection.query(
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
  WHERE users.id=$1 
  GROUP BY posts.id, users.id, metadata.id
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
}
