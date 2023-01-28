import express from "express";
import {
  getUserData,
  loginUser,
  registerUser,
  updateUserData,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/requireLogin.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/loginuser", loginUser);
userRouter.get("/profile/:id", verifyToken, getUserData);
userRouter.put("/profile/update/:id", verifyToken, updateUserData);

export default userRouter;
