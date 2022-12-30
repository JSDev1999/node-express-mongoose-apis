import express from "express";
import cors from "cors";
import appRouter from "./routes/index.js";
const App = express();

// middlewares
App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

// routes here
App.use("/api/v1/", appRouter);

App.get("/", (req, res) => {
  res.status(200).json({
    time: new Date().toLocaleTimeString(),
  });
});

export { App };
