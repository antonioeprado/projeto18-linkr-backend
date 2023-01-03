import joi from "joi";

export const signUpSchema = joi.object({
  email: joi
    .string()
    .pattern(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)
    .required(),
  password: joi.string().max(40).required(),
  username: joi
    .string()
    .pattern(/^[a-zA-Z0-9-\s]{3,20}$/)
    .required(),
  pictureUrl: joi.string().uri().required(),
});
