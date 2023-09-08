const { Schema, model } = require("mongoose");

const bandSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "That band already exists"],
  },
  img: {
    type: String,
    default: "https://www.cfbands.com/uploads/1/3/6/9/13694168/2610451_orig.jpg",
  },
  description: {
    type: String,
  },
  genres: {
    type: [String],
  },
  samples: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sample",
    },
  ],
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
