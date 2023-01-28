import HttpErrors from "http-errors";
import { HttpStatus, Response } from "../helpers/Response.js";
import postModel from "../models/postModel.js";
import cloudinary from "cloudinary";
import * as Formidable from "formidable";
import {
  addCommentSchema,
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  likePostSchema,
  updatePostSchema,
} from "../validations/postValidations.js";

cloudinary.v2.config({
  cloud_name: "dwubleiau",
  api_key: "388565738463438",
  api_secret: "7prPCZ2UfNxrIsY5gSjeezmw820",
});

export const uploadImage = async (req, res, next) => {
  console.log("file here", req.files);

  try {
    const file = await req.files.image;
    await cloudinary.v2.uploader
      .upload(file.tempFilePath)
      .then(async (result) => {
        console.log("photo", result);

        return res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "Image Uploaded",
              result?.url
            )
          );
      })
      .catch((error) => {
        return res
          .status(HttpStatus.BAD_REQUEST.code)
          .json(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              error.message
            )
          );
      });
  } catch (error) {
    return res
      .status(HttpStatus.BAD_REQUEST.code)
      .json(
        new Response(
          HttpStatus.BAD_REQUEST.code,
          HttpStatus.BAD_REQUEST.status,
          error.message
        )
      );
  }
};

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
    if (req.query) {
      await postModel
        .find({ postById: req.query })
        .sort({ updatedAt: -1 })
        .populate("postedBy", "_id fullName userName profile_image")
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
    } else {
      await postModel
        .find({})
        .sort({ updatedAt: -1 })
        .populate("postedBy", "_id firstName lastName profile_image")
        .pretty()
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
  }
};

export const getSinglePost = async (req, res, next) => {
  try {
    console.log(req.query);
    await postModel
      .findById({ _id: req.query?.postId })
      .populate("postedBy", "_id fullName userName profile_image")
      .populate("likes", "_id fullName userName profile_image")
      .populate("comments.postedBy", "_id fullName userName profile_image")
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

// like the post
export const likePost = async (req, res, next) => {
  try {
    const { error, value } = await likePostSchema.validate(req.query);
    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      await postModel
        .findByIdAndUpdate(
          value,
          { $push: { likes: req.user._id } },
          { new: true }
        )
        .then((results) => {
          res
            .status(HttpStatus.OK.code)
            .json(
              new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                "Operation success full"
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

// unlike post
export const unLikePost = async (req, res, next) => {
  try {
    const { error, value } = await likePostSchema.validate(req.query);
    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      await postModel
        .findByIdAndUpdate(
          value,
          { $pull: { likes: req.user._id } },
          { new: true }
        )
        .then((results) => {
          res
            .status(HttpStatus.OK.code)
            .json(
              new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                "Operation successfull"
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

export const addComment = async (req, res, next) => {
  try {
    const { error, value } = await addCommentSchema.validate(req.body);

    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      const comment = {
        text: value?.text,
        postId: value?.postId,
        postedBy: req.user?._id,
      };
      await postModel
        .findByIdAndUpdate(
          value?.postId,
          {
            $push: { comments: comment },
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
                "Operation successfull",
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

export const getMyPosts = async (req, res, next) => {
  try {
    const { error, value } = await getPostSchema.validate(req.user?._id);
    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      await postModel
        .find({ postById: value })
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
