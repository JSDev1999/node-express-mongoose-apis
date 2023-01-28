import Joi from "joi";

export const registerUserSchema = Joi.object({
  fullName: Joi.string().trim().min(4).required(),
  userName: Joi.string().trim().min(4).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().min(6).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().min(6).required(),
});

export const updateUserSchema = Joi.object({
  fullName: Joi.string().trim().min(4).required(),
  userName: Joi.string().trim().min(4).required(),
  about: Joi.string().trim().min(4),
  profile_image: Joi.string().trim().min(4),
});
