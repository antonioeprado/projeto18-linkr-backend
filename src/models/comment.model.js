import joi from "joi";

const commentModel = joi.object({
  comment: joi.string(),
  postId: joi.number(),
});

export default commentModel;
