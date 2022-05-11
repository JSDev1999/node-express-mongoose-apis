import Mongoose from "mongoose";
const ObjectId = Mongoose.Schema.Types.ObjectId;

const PostSchema = new Mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: String,
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
