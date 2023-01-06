import connection from "../database/db.js";
import jwt from "jsonwebtoken";
import urlMetadata from "url-metadata";

export async function hashtags(req, res) {
    // const token = req.headers.authorization?.replace("Bearer ", "");
    // const secretKey = process.env.JWT_SECRET;
    const { hashtags } = req.params;
    // if (!token) {
    //     return res.sendStatus(401);
    // }

    try {
        // const sessionExist = jwt.verify(token, secretKey);
        // if (!sessionExist) {
        //     return res.sendStatus(404);
        // }

        // const userLogado = await connection.query(`SELECT * FROM users WHERE id = $1`,
        //     [sessionExist.userId]);

        // if (!userLogado) {
        //     return res.sendStatus(404);
        // }

        const hashtagClick = await connection.query(
            `SELECT 
            h.tag,
            p.url,
            p.description,
            u.username,
            u."pictureUrl",
            mt."linkUrl",
            mt."linkTitle",
            mt."linkDescription",
            mt."linkImg",
            COUNT(l.id) AS likes
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
        GROUP BY h.tag ORDER BY tag_count DESC LIMIT 10`);
        for(let i = 0; i < trends.rows.length; i++){
            delete trends.rows[i].tag_count;
        }
        res.send(trends.rows);
    } catch (err) {
        console.log(err.message);
    }
}