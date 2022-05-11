import express from "express";
import postRouter from "./postRouter.js";
import userRouter from "./userRouter.js";

const appRouter = express.Router();

// user route
appRouter.use("/user", userRouter);
appRouter.use("/posts", postRouter);

export default appRouter;
