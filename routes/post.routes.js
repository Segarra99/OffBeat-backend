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

/* GET route to display a single post page */
router.get("/feed/:postId", async (req, res) => {
    const { postId } = req.params;
  
    try {
      let foundPost = await Post.findById(postId).populate(
        "author comments likes"
      );
      await foundPost.populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      });
      res.json(foundPost);
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
  
  router.post("/upload", fileUploader.single("img"), (req, res, next) => {
    if (!req.file) {
      res.json({ fileUrl: "" });
      return;
    }
    res.json({ fileUrl: req.file.path });
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

router.post("/upload", fileUploader.single("img"), (req, res, next) => {
  if (!req.file) {
    res.json({ fileUrl: "" });
    return;
  }
  res.json({ fileUrl: req.file.path });
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
/* GET route to display all Comments */
router.get("/feed/comments", async (req, res) => {

    try {
        let allComments = await Comment.find().populate("author post")
        
        res.json(allComments);
    }
    catch(error){
        res.json(error)
    }
});

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
      
      res.json(response);
    } catch (error) {
      res.json(error);
    }
  });

/* DELETE Route to delete a post */
router.delete("/feed/:commentId", async (req, res) => {
    const { commentId } = req.params;
    try {
      await Comment.findByIdAndDelete(commentId);
      res.json({ message: "Comment was successfully deleted" });
    } catch (error) {
      res.json(error);
    }
  });


module.exports = router;
