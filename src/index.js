import http from "http";
import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import appRouter from "./routes/index.js";

// let initalize the app
const app = Express();
const server = http.createServer(app);
dotenv.config();
let port = process.env.PORT ?? 5055;

// middlewares
app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

// routes here

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info("DB connected");
    server.listen(port, (res, err) => {
      console.log("api running on port", `http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("connection failed", err);
  });

app.use("/api/v1/", appRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    time: new Date().toLocaleTimeString(),
  });
});
