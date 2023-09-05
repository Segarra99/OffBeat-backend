const { Schema, model } = require("mongoose");

const bandSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "That band already exists"],
  },
  img: {
    type: String,
  },
  description: {
    type: String,
  },
  genres: {
    type: [String],
  },
  samples: {
    type: [String],
  },
  rank: {
    type: Number,
  },
  missing: {
    type: [String],
  },
  label: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  founder: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  artists: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Band = model("Band", bandSchema);

module.exports = Band;
