import connection from "../database/db.js";

export function postHashtag(tag) {
  const newTag = tag.substring(1);
  return connection.query(
    `INSERT INTO hashtags (tag) VALUES ($1) RETURNING id;`,
    [newTag]
  );
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
    users.id AS "userId",
    users.username AS "userName",
    users."pictureUrl" AS "userImage", 
    COUNT(likes.id) AS "likesCount",
    COUNT(comments.id) AS "commentsCount",
	  COUNT(reposts."userId") AS "repostsCount",
    posts.id AS "postId",
    posts.description AS "postDescription", 
    posts.url, 
    metadata."linkTitle",
    metadata."linkDescription", 
    metadata."linkUrl", 
    metadata."linkImg" AS "linkImage",
    ARRAY_TO_JSON(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
        'userId', users1.id,
        'username', users1.username
      )
      )
    ) AS "likedBy",
    ARRAY_TO_JSON(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'commentAuthorId', comments."authorId",
          'comment', comments.comment
        )
      )
    ) AS comments
  FROM posts 
  JOIN users ON posts."userId"=users.id 
  JOIN metadata ON posts."metaId"=metadata.id 
  LEFT JOIN likes ON likes."postId"=posts.id
  LEFT JOIN users users1 ON users1.id = likes."userId"
  LEFT JOIN reposts ON reposts."postId"=posts.id
  LEFT JOIN comments ON comments."postId"=posts.id
  WHERE users.id=$1
  GROUP BY users.id, posts.id, metadata.id
  ORDER BY posts.id DESC
  LIMIT 20;`,
    [userId]
  );
}

export function getAllPublications() {
  return connection.query(
    `SELECT 
    users.id AS "userId",
    users.username AS "userName",
    users."pictureUrl" AS "userImage", 
    COUNT(likes.id) AS "likesCount",
    COUNT(comments.id) AS "commentsCount",
	  COUNT(reposts."userId") AS "repostsCount",
    posts.id AS "postId",
    posts.description AS "postDescription", 
    posts.url, 
    metadata."linkTitle",
    metadata."linkDescription", 
    metadata."linkUrl", 
    metadata."linkImg" AS "linkImage",
    ARRAY_TO_JSON(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
        'userId', users1.id,
        'username', users1.username
      )
      )
    ) AS "likedBy",
    ARRAY_TO_JSON(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'commentAuthorId', comments."authorId",
          'comment', comments.comment
        )
      )
    ) AS comments
  FROM posts 
  JOIN users ON posts."userId"=users.id 
  JOIN metadata ON posts."metaId"=metadata.id 
  LEFT JOIN likes ON likes."postId"=posts.id
  LEFT JOIN users users1 ON users1.id = likes."userId"
  LEFT JOIN reposts ON reposts."postId"=posts.id
  LEFT JOIN comments ON comments."postId"=posts.id
  GROUP BY users.id, posts.id, metadata.id
  ORDER BY posts.id DESC
  LIMIT 20;`
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

export function insertPostHashtag(postId, tagId) {
  return connection.query(
    `INSERT INTO posts_hashtags ("postId", "tagId") VALUES ($1, $2)`,
    [postId, tagId]
  );
}

export function checkHashtag(hashtag) {
  return connection.query(`SELECT * FROM hashtags WHERE tag=$1`, [hashtag]);
}

export async function findPostById(postId) {
  return await connection.query(
    `
          SELECT * FROM posts WHERE id = $1
          `,
    [postId]
  );
}
