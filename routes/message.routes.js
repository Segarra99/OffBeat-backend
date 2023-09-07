const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

/* Requiring models */
const Band = require("../models/Band.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const Sample = require("../models/Sample.model");
const Message = require("../models/Message.model");

// POST Route to create a message
router.post("/message/:userId/create", async(req,res)=>{
  try{
    const response = await Message.create({
      sender,
      receiver,
      content
    })
    await User.findByIdAndUpdate(response.receiver, {
      $push: {messages: response._id}
    })
    res.json(response);
  }
  catch(error){
    res.json(error);
  }
})

// PUT Route to remove message after clicking reply
/* router.put("/message/:messageId", async(req,res)=>{
  const {messageId} = req.params;
  try{
    const receivedMessage = await Message.findById(messageId);
    await User.findByIdAndUpdate(receivedMessage.receiver, {
      $pull: {messages: messageId}
    })
    res.json(receivedMessage);
  }
  catch(error){
    res.json(error);
  }
}); */

router.delete("/message/:messageId/delete", async(req,res)=>{
  const {messageId} = req.params;
  try{
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    await User.findByIdAndUpdate(deletedMessage.receiver, {
      $pull: {messages: messageId}
    })
    res.json(deletedMessage)
  }
  catch(error){
    res.json(error);
  }
})

module.exports = router;