const { Schema, model } = require("mongoose");

const sampleSchema = new Schema(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    band: {
      type: Schema.Types.ObjectId,
      ref: "Band",
    },
    audio: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Sample = model("Sample", sampleSchema);
module.exports = Sample;
