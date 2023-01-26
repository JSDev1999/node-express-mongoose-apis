import express from "express";
import {
  addComment,
  createPost,
  deleteSinglePost,
  getAllPosts,
  getMyPosts,
  getSinglePost,
  likePost,
  unLikePost,
  updateSinglePost,
  uploadImage,
} from "../controllers/postController.js";
import { verifyToken } from "../middlewares/requireLogin.js";

const postRouter = express.Router();

postRouter.post("/create", verifyToken, createPost);
postRouter.post("/imageupload", uploadImage);
postRouter.get("/getall", verifyToken, getAllPosts);
postRouter.get("/get/post", getSinglePost);
postRouter.put("/update/post", verifyToken, updateSinglePost);
postRouter.delete("/delete", verifyToken, deleteSinglePost);

// get my posts
postRouter.get("/getmyposts", verifyToken, getMyPosts);

// like post
postRouter.put("/likepost", verifyToken, likePost);
// unlike post
postRouter.put("/unlikepost", verifyToken, unLikePost);

// add comment
postRouter.post("/addcomment", verifyToken, addComment);
export default postRouter;
