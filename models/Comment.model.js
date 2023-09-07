const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post"
    }
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
