import express from "express";
import {
  createPost,
  deleteSinglePost,
  getAllPosts,
  getSinglePost,
  updateSinglePost,
} from "../controllers/postController.js";
import { verifyToken } from "../middlewares/requireLogin.js";

const postRouter = express.Router();

postRouter.post("/create", verifyToken, createPost);
postRouter.get("/getall", verifyToken, getAllPosts);
postRouter.get("/get/post", getSinglePost);
postRouter.put("/update/post", verifyToken, updateSinglePost);
postRouter.delete("/delete", verifyToken, deleteSinglePost);

export default postRouter;
