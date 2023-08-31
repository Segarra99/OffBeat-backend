const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/contacts", (req, res, next) => {
  res.json("Just a contacts page")
})

router.get("/about", (req, res, next) => {
  res.json("What's the project about")
})


module.exports = router;
