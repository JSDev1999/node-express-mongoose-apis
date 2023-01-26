import express from "express";
import cors from "cors";
import appRouter from "./routes/index.js";
import fileUpload from "express-fileupload";
const App = express();

// middlewares
App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

// routes here
App.use("/api/v1/", appRouter);
App.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 2024 * 1024 },
  })
);

App.get("/", (req, res) => {
  res.status(200).json({
    time: new Date().toLocaleTimeString(),
  });
});

export { App };
