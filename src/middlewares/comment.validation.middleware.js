import commentModel from "../models/comment.model.js";

export function commentSchemaValidation(req, res, next) {
  const { comment } = req.body;

  const { error } = commentModel.validate({ comment }, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  next();
}
