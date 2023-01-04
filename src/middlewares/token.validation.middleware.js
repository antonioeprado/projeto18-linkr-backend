import { func } from "joi";
import connection from "../database/db.js";

export default async function tokenValidation(req,res,next){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Nenhum token foi enviado.");
      }
      next();
}

//esperar o sign-in ser feito