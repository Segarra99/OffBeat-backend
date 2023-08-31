const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Review = require("../models/Review.model");

/* GET route to render user profiles */
router.get("/profile/:userId", async (req, res) => {
  try {
    let { userId } = req.params;
    let user = null;

    if (req.session.currentUser) {
      user = await User.findById(req.session.currentUser._id);
    }
    let profileUser = await User.findById(userId);
    await profileUser.populate("bands bandReviews artistReviews");
    await profileUser.populate({
      path: "bandReviews",
      populate: {
        path: "band",
        model: "Band",
      },
    });
    await profileUser.populate({
      path: "artistReviews",
      populate: {
        path: "artist",
        model: "User",
      },
    });

    const response = {
      currentUser: user,
      profileUser: profileUser,
    };

    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

/* POST route to edit profile page */
router.post(
  "/profile/:userId/edit",
  fileUploader.single("profile-picture"),
  async (req, res) => {
    try {
      let { userId } = req.params;
      let { username, firstName, lastName, nationality, description, genres } =
        req.body;
      let currentUser = await User.findById(req.session.currentUser._id);
      let profileUser = await User.findById(userId);
      await User.findByIdAndUpdate(userId, {
        username,
        firstName,
        lastName,
        nationality,
        description,
        genres,
        img: req.file.path,
      });
      let permission = false;
      if (currentUser === profileUser) {
        permission = true;
      }
      res.json(permission);
    } catch (error) {
      res.json(error);
    }
  }
);

/* POST Route to delete use profile */
router.post("/profile/:userId/delete", async (req, res) => {
  try {
    let { userId } = req.params;
    let currentUser = await User.findById(req.session.currentUser._id);
    let profileUser = await User.findById(userId);
    let permission = false;
    if (currentUser === profileUser) {
      permission = true;
    }
    if (permission) {
      await User.findByIdAndDelete(userId);
      req.session.destroy((err) => {
        if (err) {
          res
            .status(500)
            .render("/profile/:userId", { errorMessage: err.message });
          return;
        }
      });
    }
    req.json(permission);
  } catch (error) {}
});

/* POST Route to leave a review on the artist */
router.post(
  "/profile/:userId/review",
  fileUploader.single("review-picture"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { content } = req.body;
      const artist = await User.findById(userId);
      const user = await User.findById(req.session.currentUser._id);
      const newReview = await Review.create({
        content,
        img: req.file.path,
        user,
        artist,
      });
      await User.findByIdAndUpdate(artist._id, {
        $push: { artistReviews: newReview },
      });
      await User.findByIdAndUpdate(user._id, {
        $push: { artistReviews: newReview },
      });
      res.json(newReview);
    } catch (error) {
      res.json(error);
    }
  }
);

/* POST route to delete reviews */
router.post("/review/:reviewId/delete", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const removedReview = await Review.findById(reviewId).populate("user");

    if (!removedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    const user = await User.findById(removedReview.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: {
        bandReviews: removedReview._id,
        artistReviews: removedReview._id,
      },
    });

    await Band.findByIdAndUpdate(removedReview.band._id, {
      $pull: {
        reviews: removedReview._id,
      },
    });

    await Review.findByIdAndDelete(removedReview._id);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

/* GET Route to get all the artists */
router.get("/artists", async (req, res) => {
  try {
    let allArtists = await User.find();
    res.json(allArtists);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
