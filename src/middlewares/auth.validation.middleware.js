import { signUpSchema } from "../models/auth.model.js";

export function signUpSchemaValidation(req, res, next) {
  const { email, password, username, pictureUrl } = req.body;

  const { error } = signUpSchema.validate(
    { email, password, username, pictureUrl },
    { abortEarly: false }
  );

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  next();
}