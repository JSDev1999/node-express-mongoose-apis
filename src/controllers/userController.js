import Bcrypt from "bcrypt";
import HttpErrors from "http-errors";
import JWT from "jsonwebtoken";
import { HttpStatus, Response } from "../helpers/Response.js";
import userModel from "../models/userModel.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../validations/userValidations.js";

// user register
const registerUser = async (req, res) => {
  try {
    const { error, value } = await registerUserSchema.validate(req.body);

    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      const isUserExists = await userModel.findOne({ email: value.email });

      if (isUserExists) {
        return res
          .status(HttpStatus.ALREADY_EXISTS.code)
          .json(
            new Response(
              HttpStatus.ALREADY_EXISTS.code,
              HttpStatus.ALREADY_EXISTS.status,
              "User Already Exists"
            )
          );
      } else {
        value.password = await Bcrypt.hash(value.password, 10);

        await userModel.create(value).then((results) => {
          const { password, ...otherData } = results._doc;
          res
            .status(HttpStatus.CREATED.code)
            .json(
              new Response(
                HttpStatus.CREATED.code,
                HttpStatus.CREATED.status,
                "user created",
                otherData
              )
            );
        });
      }
    }
  } catch (error) {
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(HttpStatus.OK.code, HttpStatus.OK.status, error.message)
      );
  }
};

// user login
const loginUser = async (req, res) => {
  try {
    const body = req.body;
    const { error, value } = await loginUserSchema.validate(req.body);
    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      const reqEmail = req.body.email;
      const checkUser = await userModel.findOne({ email: reqEmail });
      if (checkUser) {
        const validPassword = await Bcrypt.compare(
          body.password,
          checkUser.password
        );
        if (validPassword) {
          const { password, ...others } = checkUser._doc;
          const token = JWT.sign({ _id: others._id }, process.env.JWT_SECRET);
          const data = { ...others, token };

          return res
            .status(HttpStatus.OK.code)
            .json(
              new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                "login successful",
                data
              )
            );
        } else {
          return res
            .status(HttpStatus.BAD_REQUEST.code)
            .json(
              new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.status,
                "Invalid Credentials"
              )
            );
        }
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST.code)
          .json(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.status,
              "Invalid Credentials"
            )
          );
      }
    }
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

// get user data
const getUserData = async (req, res, next) => {
  try {
    const userId = req.params.id;
    //console.log("yyy", req.params.id);
    await userModel
      .findOne({ _id: userId })
      .then((resp) => {
        const { password, ...others } = resp._doc;
        return res.status(HttpStatus.OK.code).json(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.status,

            "user found",
            others
          )
        );
      })
      .catch((error) => {
        return res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
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

const updateUserData = async (req, res, next) => {
  try {
    const { error, value } = await updateUserSchema.validate(req.body);
    if (error) {
      throw HttpErrors.Conflict(error.details[0].message);
    } else {
      const userId = req.params.id;
      //console.log("yyy", req.params.id);
      await userModel
        .findByIdAndUpdate(
          userId,
          {
            $set: value,
          },
          { new: true }
        )
        .then((resp) => {
          const { password, ...others } = resp._doc;
          return res
            .status(HttpStatus.OK.code)
            .json(
              new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                "Details Updated",
                others
              )
            );
        })
        .catch((error) => {
          return res
            .status(HttpStatus.OK.code)
            .json(
              new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                error.message
              )
            );
        });
    }
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

const getAllUsers = async (req, res, next) => {
  try {
    await userModel
      .find()
      .select("-password")
      .then((resp) => {
        return res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
              "operation successfull",
              resp
            )
          );
      })
      .catch((error) => {
        return res
          .status(HttpStatus.OK.code)
          .json(
            new Response(
              HttpStatus.OK.code,
              HttpStatus.OK.status,
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
export { registerUser, loginUser, getUserData, updateUserData, getAllUsers };
