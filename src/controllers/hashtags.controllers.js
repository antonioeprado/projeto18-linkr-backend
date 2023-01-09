import connection from "../database/db.js";

export async function hashtags(req, res) {
    const { hashtags } = req.params;
    const { userId } = res.locals.user;

    if (!userId) {
        res.sendStatus(401);
    }
    
    try {

        const hashtagClick = await connection.query(
            `SELECT 
            h.tag,
            u.id AS "userId",
                    p.url,
                    p.description,
                    u.username,
                    u."pictureUrl",
                    mt."linkUrl",
                    mt."linkTitle",
                    mt."linkDescription",
                    mt."linkImg",
                    COUNT(l.id) AS likes,
                    ARRAY_TO_JSON(
              ARRAY_AGG(
                JSON_BUILD_OBJECT(
                'userId', users1.id,
                'username', users1.username
              )
              )
            ) AS "likedBy"
                FROM hashtags h
                JOIN posts_hashtags ph
                    ON h.id = ph."tagId"
                JOIN posts p
                    ON p.id = ph."postId"
                JOIN users u
                    ON u.id = p."userId"
                LEFT JOIN likes l
                    ON l."postId" = p.id
                JOIN metadata mt
                    ON mt.id = p."metaId"
                LEFT JOIN users users1
                    ON users1.id = l."userId"
                WHERE h.tag = $1
                GROUP BY u.id, p.id, h.id, mt.id;
           `,
            [hashtags]
        );
        res.send(hashtagClick.rows);
    } catch (err) {
        console.log(err);
    }
}

export async function trendings(req, res) {
    try {
        const trends = await connection.query(`
        SELECT COUNT("tagId") AS tag_count, tag
        FROM posts_hashtags ph
        JOIN hashtags h
        ON h.id = ph."tagId"
        GROUP BY h.tag ORDER BY tag_count DESC LIMIT 9`);
        for (let i = 0; i < trends.rows.length; i++) {
            delete trends.rows[i].tag_count;
        }
        res.send(trends.rows);
    } catch (err) {
        console.log(err.message);
    }
}