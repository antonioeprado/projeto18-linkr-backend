import postModel from "../models/post.model.js";

export default function postModelValidation(req, res, next) {
  if (!req.body) {
    return res
      .status(422)
      .send("Nenhum conteúdo foi enviado para ser publicado.");
  }
  const { error } = postModel.validate(req.body);
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    console.log(errors);
    return res.status(422).send(errors);
  }
  next();
}
