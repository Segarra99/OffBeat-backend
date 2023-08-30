const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  content: {
    type: String,
    required: [true, "Review can't be empty"],
  },
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  band: {
    type: Schema.Types.ObjectId,
    ref: "Band",
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = model("Review", reviewSchema);

module.exports = Review;
