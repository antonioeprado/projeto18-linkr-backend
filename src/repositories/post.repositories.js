import connection from "../database/db.js";

export function postHashtag(tag) {
  return connection.query(
    `INSERT INTO hashtags (tag) VALUES ($1);`,
    [tag]
  );
}

export function postPublication(userId, url, description){
  return connection.query(
    `INSERT INTO posts ("userId",url,description) VALUES ($1,$2,$3);`,
    [userId, url, description]
  );
}

export function getAllPublications(userId){
  return connection.query(
    `SELECT u.username AS "userName", p.description, p.url, p."createdAt" FROM users u JOIN posts p ON u.id=p."userId" WHERE p."userId"=$1;`,
    [userId]
  );
}