export default function postHashtag(hashtag) {
  return connection.query(
    `INSERT INTO hashtags (tag, "createdAt") VALUES ($1);`,
    [tag]
  );
}
