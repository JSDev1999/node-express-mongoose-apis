import Joi from "joi";

export const createPostSchema = Joi.object({
  desc: Joi.string().trim(),
  photo: Joi.string().trim().min(10).required(),
});

export const updatePostSchema = Joi.object({
  _id: Joi.string().trim().required(),
  desc: Joi.string().trim(),
  photo: Joi.string().trim().min(10).required(),
});

export const deletePostSchema = Joi.object({
  _id: Joi.string().trim().required(),
});
