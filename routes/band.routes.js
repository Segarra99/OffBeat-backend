const router = require("express").Router();
const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");

/* Requiring models */
const Band = require("../models/Band.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model");

/* POST Route that creates a new band */
router.post("/bands", async (req, res) => {
  const { name, description, genres, missing, artists, founder, img } =
    req.body;

  try {
    let response = await Band.create({
      name,
      img,
      description,
      genres,
      missing,
      artists,
      founder,
    });
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

router.post("/upload", fileUploader.single("img"), (req, res, next) => {
  if (!req.file) {
    res.json({ fileUrl: "" });
    return;
  }
  res.json({ fileUrl: req.file.path });
});

/* GET Route that lists all the bands */
router.get("/bands", async (req, res) => {
  try {
    let allBands = await Band.find().populate("artists");
    res.json(allBands);
  } catch (error) {
    res.json(error);
  }
});

/* GET Route that display info about a specific band */
router.get("/bands/:bandId", async (req, res) => {
  const { bandId } = req.params;

  try {
    let foundBand = await Band.findById(bandId).populate(
      "reviews artists founder"
    );
    await foundBand.populate({
      path: "reviews",
      populate: {
        path: "user",
        model: "User",
      },
    });
    res.json(foundBand);
  } catch (error) {
    res.json(error);
  }
});

/* PUT Route to update info of a Band */
router.put("/bands/:bandId", async (req, res) => {
  const { bandId } = req.params;
  const { name, description, genres, missing, artists, img } = req.body;
  try {
    let updateBand = await Band.findByIdAndUpdate(
      bandId,
      {
        name,
        img,
        description,
        genres,
        missing,
        artists,
      },
      { new: true }
    );
    res.json(updateBand);
  } catch (error) {
    res.json(error);
  }
});

/* DELETE Route to delete a band */
router.delete("/bands/:bandId", async (req, res) => {
  const { bandId } = req.params;
  try {
    await Band.findByIdAndDelete(bandId);
    res.json({ message: "Band deleted" });
  } catch (error) {
    res.json(error);
  }
});

/* REVIEWS ROUTES */

/* POST Route for creating a review */
router.post("/bands/:bandId/review", isAuthenticated, async (req, res) => {
  const { bandId } = req.params;
  const { content, rating, img } = req.body;
  const user = req.payload;
  try {
    const newReview = await Review.create({
      content,
      img,
      rating,
    });

    await Band.findByIdAndUpdate(bandId, {
      $push: { reviews: newReview._id },
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { bandReviews: newReview._id },
    });

    await Review.findByIdAndUpdate(newReview._id, {
      $push: { user: user._id },
    });

    await Review.findByIdAndUpdate(newReview._id, {
      $push: { band: bandId },
    });
    res.json(newReview);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
