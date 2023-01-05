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