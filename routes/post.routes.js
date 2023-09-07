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
    let allPosts = await Post.find().populate("author comments likes");
    res.json(allPosts);
  } catch (error) {
    res.json(error);
  }
});

/* POST route that creates a new post */
router.post("/feed", async (req, res) => {
    const { content, img, author } =
      req.body;
  
    try {
        const user = req.payload
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

/* DELETE Route to delete a post */
router.delete("/feed/:postId", async (req, res) => {
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
    const { content, author, post } =
      req.body;
  
    try {
        const user = req.payload
      let response = await Comment.create({
        content,
        author,
        post
      });

      await Post.findByIdAndUpdate(response.post, {
        $push: {comments: response._id}
      })
      
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
        $pull: {comments: deletedComment._id}
      })
      res.json({ message: "Comment was successfully deleted" });
    } catch (error) {
      res.json(error);
    }
  });


module.exports = router;
