import Mongoose from "mongoose";
const ObjectId = Mongoose.Schema.Types.ObjectId;

const PostSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    tags: [String],
    file: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        ref: "users",
      },
    ],
    comments: [
      {
        text: String,
        postedBy: String,
        postById: String,
        profile: String,
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default Mongoose.model("Posts", PostSchema);
