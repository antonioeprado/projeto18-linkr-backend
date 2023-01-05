export default function postHashtag(hashtag, now) {
  return connection.query(
    `INSERT INTO hashtags (tag, "createdAt") VALUES $1,$2;`,
    [tag, now]
  );
}
