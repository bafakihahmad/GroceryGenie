// Create a new router
const express = require("express");
const router = express.Router();

// Landing page route handler
router.get("/", function (req, res, next) {
  res.render("home.ejs");
});
// About page route handler
router.get("/about", function (req, res, next) {
  res.render("about.ejs");
});

module.exports = router;
