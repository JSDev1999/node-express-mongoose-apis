import HttpErrors from "http-errors";
import { HttpError } from "http-errors";
import JWT from "jsonwebtoken";
import { HttpStatus, Response } from "../helpers/Response.js";
import postModel from "../models/postModel.js";
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from "../validations/postValidations.js";

export const createPost = async (req, res, next) => {
  try {
    const { error, value } = await createPostSchema.validate(req.body);
    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      await postModel
        .create({ ...value, postedBy: req.user })
        .then((results) => {
          return res
            .status(HttpStatus.CREATED.code)
            .json(
              new Response(
                HttpStatus.CREATED.code,
                HttpStatus.CREATED.status,
                "operation  successful",
                results
              )
            );
        });
    }
  } catch (error) {
    return res
      .status(HttpStatus.MISSING_REQUEST.code)
      .json(
        new Response(
          HttpStatus.MISSING_REQUEST.code,
          HttpStatus.MISSING_REQUEST.status,
          error.message
        )
      );
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    await postModel
      .find({})
      .populate("postedBy", "_id firstName lastName profile_image")
      .then((results) => {
        res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "operation successfull",
              results
            )
          );
      });
  } catch (error) {
    return res
      .status(HttpStatus.MISSING_REQUEST.code)
      .json(
        new Response(
          HttpStatus.MISSING_REQUEST.code,
          HttpStatus.MISSING_REQUEST.status,
          error.message
        )
      );
  }
};

export const getSinglePost = async (req, res, next) => {
  try {
    await postModel
      .find(req.query)
      .populate("postedBy", "_id firstName lastName profile_image")
      .then((results) => {
        res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "operation successfull",
              results
            )
          );
      });
  } catch (error) {
    return res
      .status(HttpStatus.MISSING_REQUEST.code)
      .json(
        new Response(
          HttpStatus.MISSING_REQUEST.code,
          HttpStatus.MISSING_REQUEST.status,
          error.message
        )
      );
  }
};

export const updateSinglePost = async (req, res, next) => {
  try {
    const { error, value } = await updatePostSchema.validate(req.body);
    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      await postModel
        .findByIdAndUpdate(
          req.body._id,
          {
            $set: value,
          },
          { new: true }
        )
        .then((results) => {
          res
            .status(HttpStatus.OK.code)
            .json(
              new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                "operation successfull",
                results
              )
            );
        });
    }
  } catch (error) {
    return res
      .status(HttpStatus.MISSING_REQUEST.code)
      .json(
        new Response(
          HttpStatus.MISSING_REQUEST.code,
          HttpStatus.MISSING_REQUEST.status,
          error.message
        )
      );
    next();
  }
};

export const deleteSinglePost = async (req, res, next) => {
  try {
    const { error, value } = await deletePostSchema.validate(req.query);
    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      await postModel.findByIdAndDelete(value).then((results) => {
        res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "operation successfull",
              results
            )
          );
      });
    }
  } catch (error) {
    return res
      .status(HttpStatus.MISSING_REQUEST.code)
      .json(
        new Response(
          HttpStatus.MISSING_REQUEST.code,
          HttpStatus.MISSING_REQUEST.status,
          error.message
        )
      );
    next();
  }
};
