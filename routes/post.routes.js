const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");

/* Requiring models */
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

/* GET route to display all Posts */
router.get("/feed", async (req, res) => {
  try {
    let allPosts = await Post.find()
    .populate("author comments likes")
    .sort({createdAt : -1 })

    res.json(allPosts);
  } catch (error) {
    res.json(error);
  }
});

/* POST route that creates a new post */
router.post("/feed", async (req, res) => {
  const { content, img, author } = req.body;

  try {
    const user = req.payload;
    let response = await Post.create({
      content,
      img,
      author,
    });

    res.json(response);
  } catch (error) {
    res.json(error);
  }
});


/* GET Route that display info about a specific post */
router.get("/feed/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    let foundPost = await Post.findById(postId)
    .populate(
      "reviews artists founder samples");
    await foundPost.populate({
      path: "reviews",
      populate: {
        path: "user",
        model: "User",
      },
    }).sort({comments : -1});

    res.json(foundBand);
  } catch (error) {
    res.json(error);
  }
});



/* PUT Route to update info of a post (TO DECIDE IF THEY CAN EDIT POSTS OR NOT) */
router.put("/feed/:postId/edit", async (req, res) => {
  const { postId } = req.params;
  const { content, img } = req.body;
  try {
    let updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        content,
        img,
      },
      { new: true }
    );
    res.json(updatePost);
  } catch (error) {
    res.json(error);
  }
});

/* GET Route to display post details */
router.get("/feed/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const response = await Post.findById(postId).populate(
      "author comments likes"
    );
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

/* DELETE Route to delete a post */
router.delete("/feed/:postId/delete", async (req, res) => {
  const { postId } = req.params;
  try {
    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post was successfully deleted" });
  } catch (error) {
    res.json(error);
  }
});

/* COMMENTS ROUTES */

/* POST route that creates a new comment */
router.post("/feed/comments", async (req, res) => {
  const { content, author, post } = req.body;

  try {
    const user = req.payload;
    let response = await Comment.create({
      content,
      author,
      post,
    });

    await response.populate("post");

    await Post.findByIdAndUpdate(response.post, {
      $push: { comments: response._id },
    });

    await User.findByIdAndUpdate(response.post.author, {
      $push: { postNotifications: response._id },
    });

    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

/* DELETE Route to delete a post */
router.delete("/feed/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(deletedComment.post, {
      $pull: { comments: deletedComment._id },
    });
    res.json({ message: "Comment was successfully deleted" });
  } catch (error) {
    res.json(error);
  }
});

router.put("/notification/:postId/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const commentedPost = await Post.findById(postId);
    await User.findByIdAndUpdate(commentedPost.author, {
      $pull: { postNotifications: commentId },
    });

    res.json(commentedPost);
  } catch (error) {
    res.json(error);
  }
});

/* POST route to like or dislike posts */
router.post("/feed/:postId/like", isAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const{user} = req.payload;
  const currentUser = await User.findById(user._id)
  const chosenPost = await Post.findById(postId);
  const isLiked = chosenPost.likes.includes(user._id);


  try {
    if (!isLiked) {
        await Post.findByIdAndUpdate(chosenPost._id, {
          $push: {likes: currentUser._id}
        });
    } else {
        await Post.findByIdAndUpdate(chosenPost._id, {
          $pull: {likes: currentUser._id}
        });
    }

    await chosenPost.save();

    res.json(!isLiked);
} catch (error) {
    res.json(error);
}
})



module.exports = router;
