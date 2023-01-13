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
    ) AS comments,
    ARRAY_TO_JSON(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'userId', reposts."userId"
        )
      )
    ) AS "repostedBy"
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
    ) AS comments,
    ARRAY_TO_JSON(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'userId', reposts."userId"
        )
      )
    ) AS "repostedBy"
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

export function getAllFollowersPublications(id) {
  return connection.query(
    `
    SELECT
    u1.id AS "userId",
    u1.username,
    u1."pictureUrl",
      ARRAY_TO_JSON(
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
          'postId', p.id,
          'url', p.url,
          'description', p.description,
          'linkTitle', mt."linkTitle",
          'linkDescription', mt."linkDescription",
          'linkUrl', mt."linkUrl",
          'linkImage', mt."linkImg",
          'likesCount', COALESCE(likes1."likesCount", 0),
          'likedBy', likes2."likedBy"
          )
        )
      ) AS "followerPosts"
    FROM users u
    JOIN following_flow ff
      ON ff.follower = u.id
    JOIN posts p
      ON p."userId" = ff."userId"
    JOIN users u1
      ON u1.id = p."userId"
    JOIN metadata mt
      ON mt.id = p."metaId"
    LEFT JOIN (
      SELECT
      posts.id AS "postNum",
      COUNT(likes.id) AS "likesCount"
      FROM likes
      JOIN users
      ON users.id = likes."userId"
      JOIN posts
      ON posts.id = likes."postId"
      GROUP BY posts.id
    ) likes1
      ON likes1."postNum" = p.id
    LEFT JOIN (
      SELECT
        posts.id AS id,
        ARRAY_TO_JSON(
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', users.id,
              'username', users.username
              )
          )
        ) AS "likedBy"
      FROM likes
      JOIN posts
        ON posts.id = likes."postId"
      JOIN users
        ON users.id = likes."userId"
      GROUP BY posts.id
    ) likes2
      ON likes2.id = p.id
    WHERE u.id=$1
    GROUP BY u1.id;
    `,
    [id]
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

//pega todos os reposts do usuario
export async function getAllRepostsById(userId) {
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
    ) AS comments,
    ARRAY_TO_JSON(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'userId', reposts."userId"
        )
      )
    ) AS "repostedBy"
  FROM posts 
  JOIN users ON posts."userId"=users.id 
  JOIN metadata ON posts."metaId"=metadata.id 
  LEFT JOIN likes ON likes."postId"=posts.id
  LEFT JOIN users users1 ON users1.id = likes."userId"
  LEFT JOIN reposts ON reposts."postId"=posts.id
  LEFT JOIN comments ON comments."postId"=posts.id
  WHERE users.id IN (SELECT "userId" FROM reposts WHERE "userId"=$1)
  GROUP BY users.id, posts.id, metadata.id
  ORDER BY posts.id DESC
  LIMIT 20;`,
    [userId]
  );
}

//pega todos os reposts de quem o usuario segue
export async function getAllRepostsFromWhoFollows(userId) {
  return connection.query(
    `
    SELECT 
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
    ) AS comments,
    ARRAY_TO_JSON(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'userId', reposts."userId"
        )
      )
    ) AS "repostedBy"
  FROM posts 
  JOIN users ON posts."userId"=users.id 
  JOIN metadata ON posts."metaId"=metadata.id 
  LEFT JOIN likes ON likes."postId"=posts.id
  LEFT JOIN users users1 ON users1.id = likes."userId"
  LEFT JOIN reposts ON reposts."postId"=posts.id
  LEFT JOIN comments ON comments."postId"=posts.id
  WHERE posts.id IN (SELECT reposts."postId" FROM reposts JOIN following_flow ff ON ff."userId"=reposts."userId" WHERE ff.follower=$1)
  GROUP BY users.id, posts.id, metadata.id
  ORDER BY posts.id DESC
  LIMIT 20;`,
    [userId]
  );
}
//pega todos os posts que o usuario postou
//pega todos os posts de quem o usuario segue