import joi from "joi";

const postModel = joi.object({
    url: joi.string().uri().required(),
    description: joi.string()
})

export default postModel