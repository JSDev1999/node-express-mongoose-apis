import Joi from "joi";

export const createPostSchema = Joi.object({
  title: Joi.string().trim(),
  message: Joi.string().trim(),
  tags: Joi.string().trim(),
  file: Joi.string().trim().min(10).required(),
});

export const updatePostSchema = Joi.object({
  _id: Joi.string().trim().required(),
  desc: Joi.string().trim(),
  photo: Joi.string().trim().min(10).required(),
});

export const deletePostSchema = Joi.object({
  _id: Joi.string().trim().required(),
});

export const getPostSchema = Joi.object({
  _id: Joi.string().trim().required(),
});

export const likePostSchema = Joi.object({
  _id: Joi.string().trim().required(),
});

export const addCommentSchema = Joi.object({
  postId: Joi.string().trim().required(),
  text: Joi.string().trim().required(),
});
