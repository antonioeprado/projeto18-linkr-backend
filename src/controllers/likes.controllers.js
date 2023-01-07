import connection from "../database/db.js";

export async function postLike(req,res){
    //postId e userId
    const { userId } = res.locals.user;
    try{
        await connection.query(`INSERT INTO likes ("postId","userId") VALUES ($1,$2);`,[])
    }catch (err) {
    res.status(500).send(err.message);
    console.log(err.message);
  }
}